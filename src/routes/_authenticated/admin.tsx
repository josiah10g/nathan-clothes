import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Upload,
  Plus,
  Trash2,
  Settings,
  ShoppingBag,
  UserCheck,
  CreditCard,
  MessageSquare,
  Clock,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatPrice } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Management — Nathan's Clothes" },
      { name: "description", content: "Store management: verify bank transfers, products, and store settings." },
      { property: "og:title", content: "Admin Management — Nathan's Clothes" },
      { property: "og:description", content: "Store management panel for Nathan's Clothes." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const qc = useQueryClient();

  // Orders Query
  const ordersQuery = useQuery({
    queryKey: ["admin", "orders"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Products Query
  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Store Settings Query
  const settingsQuery = useQuery({
    queryKey: ["admin", "settings"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Order Filtering State
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "approved" | "declined">("all");

  // Admin Note Editing State: { orderId, note }
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  // Product Draft State
  const [draftProduct, setDraftProduct] = useState({
    name: "",
    slug: "",
    brand: "Nathan Clothes",
    category: "hoodies",
    description: "",
    specifications: "",
    price: "129.00",
    in_stock: true,
    image_url: "",
    sort_order: "0",
  });
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [uploadingProductImage, setUploadingProductImage] = useState(false);

  // Appoint Admin State
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [appointingAdmin, setAppointingAdmin] = useState(false);

  // Settings Draft State
  const [settingsDraft, setSettingsDraft] = useState<any>(null);

  // 1. Order Actions Mutations
  const updateOrderStatus = useMutation({
    mutationFn: async ({
      id,
      payment_status,
      status,
      admin_note,
    }: {
      id: string;
      payment_status: string;
      status: string;
      admin_note?: string;
    }) => {
      const payload: any = {
        payment_status,
        status,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (admin_note !== undefined) {
        payload.admin_note = admin_note;
      }

      const { error } = await supabase.from("orders").update(payload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Order status updated");
      void qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (err: any) => {
      toast.error("Failed to update order: " + err.message);
    },
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      if (!confirm("Are you sure you want to permanently delete this order?")) return;
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Order deleted");
      void qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (err: any) => {
      toast.error("Failed to delete order: " + err.message);
    },
  });

  // Signed URL generator for private receipt proof
  const viewReceiptProof = async (receiptPath: string | null) => {
    if (!receiptPath) {
      toast.error("No receipt uploaded for this order.");
      return;
    }

    try {
      // Create signed URL valid for 10 minutes
      const cleanPath = receiptPath.startsWith("receipts/") ? receiptPath : `receipts/${receiptPath}`;
      const { data, error } = await supabase.storage
        .from("payment-receipts")
        .createSignedUrl(cleanPath, 600);

      if (error || !data?.signedUrl) {
        // Fallback: try raw path directly
        const { data: rawData, error: rawError } = await supabase.storage
          .from("payment-receipts")
          .createSignedUrl(receiptPath, 600);

        if (rawError || !rawData?.signedUrl) {
          toast.error("Could not generate receipt URL: " + (rawError?.message || error?.message));
          return;
        }
        window.open(rawData.signedUrl, "_blank");
        return;
      }

      window.open(data.signedUrl, "_blank");
    } catch (err: any) {
      toast.error("Receipt preview error: " + err.message);
    }
  };

  // 2. Product Management Mutations
  const handleProductImageUpload = async (file: File) => {
    setUploadingProductImage(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `prod_${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      setDraftProduct((p) => ({ ...p, image_url: publicUrlData.publicUrl }));
      toast.success("Product image uploaded successfully");
    } catch (err: any) {
      toast.error("Image upload failed: " + err.message);
    } finally {
      setUploadingProductImage(false);
    }
  };

  const createProduct = useMutation({
    mutationFn: async () => {
      if (!draftProduct.name.trim()) throw new Error("Product name is required");
      const slug = draftProduct.slug.trim() || draftProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const priceNumeric = parseFloat(draftProduct.price) || 0;
      const priceCents = Math.round(priceNumeric * 100);

      const { error } = await supabase.from("products").insert({
        name: draftProduct.name.trim(),
        slug,
        brand: draftProduct.brand.trim() || "Nathan Clothes",
        category: draftProduct.category,
        description: draftProduct.description.trim(),
        specifications: draftProduct.specifications.trim(),
        price: priceNumeric,
        price_cents: priceCents,
        image_url: draftProduct.image_url.trim() || "/images/shadow-web-hoodie.jpg",
        in_stock: draftProduct.in_stock,
        sort_order: parseInt(draftProduct.sort_order, 10) || 0,
        active: true,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product created successfully");
      setDraftProduct({
        name: "",
        slug: "",
        brand: "Nathan Clothes",
        category: "hoodies",
        description: "",
        specifications: "",
        price: "129.00",
        in_stock: true,
        image_url: "",
        sort_order: "0",
      });
      void qc.invalidateQueries({ queryKey: ["admin", "products"] });
      void qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      toast.error("Failed to create product: " + err.message);
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      if (!confirm("Are you sure you want to delete this product?")) return;
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product deleted");
      void qc.invalidateQueries({ queryKey: ["admin", "products"] });
      void qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      toast.error("Failed to delete product: " + err.message);
    },
  });

  const toggleStock = useMutation({
    mutationFn: async ({ id, in_stock }: { id: string; in_stock: boolean }) => {
      const { error } = await supabase.from("products").update({ in_stock }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Stock status updated");
      void qc.invalidateQueries({ queryKey: ["admin", "products"] });
      void qc.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // 3. Store Settings Mutations
  const updateSettings = useMutation({
    mutationFn: async (updated: any) => {
      const { error } = await supabase
        .from("store_settings")
        .update({
          bank_name: updated.bank_name,
          account_name: updated.account_name,
          account_number: updated.account_number,
          payment_instructions: updated.payment_instructions,
          contact_phone: updated.contact_phone,
          whatsapp_number: updated.whatsapp_number,
          contact_email: updated.contact_email,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updated.id || "00000000-0000-0000-0000-000000000001");

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Store settings updated");
      void qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      void qc.invalidateQueries({ queryKey: ["store-settings"] });
    },
    onError: (err: any) => {
      toast.error("Failed to update settings: " + err.message);
    },
  });

  // 4. Grant Admin by Email
  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) {
      toast.error("Enter user email");
      return;
    }

    setAppointingAdmin(true);
    try {
      const { data, error } = await supabase.rpc("grant_admin_by_email", {
        _email: newAdminEmail.trim(),
      });

      if (error) throw error;
      toast.success(`Admin access granted to ${newAdminEmail}`);
      setNewAdminEmail("");
    } catch (err: any) {
      toast.error("Failed to grant admin: " + err.message);
    } finally {
      setAppointingAdmin(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-32 text-center text-sm text-muted-foreground">
        Loading admin console…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <h1 className="text-3xl font-bold uppercase">Restricted Access</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You do not have administrator permissions for Nathan&apos;s Clothes.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/admin-setup">
            <Button variant="outline" className="text-xs uppercase tracking-[0.2em]">
              Claim Owner Role
            </Button>
          </Link>
          <Link to="/">
            <Button className="text-xs uppercase tracking-[0.2em]">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const rawOrders = ordersQuery.data || [];
  const filteredOrders = rawOrders.filter((ord: any) => {
    if (orderFilter === "all") return true;
    return (ord.payment_status || ord.status) === orderFilter;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Store Management</p>
          <h1 className="mt-1 text-4xl sm:text-5xl font-bold uppercase tracking-tight">Admin Console</h1>
        </div>
        <Link to="/account">
          <Button variant="outline" className="text-xs uppercase tracking-[0.2em]">
            Public View
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="orders" className="mt-10">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="orders" className="text-xs uppercase tracking-[0.2em] flex items-center gap-1.5">
            <CreditCard className="size-3.5" /> Orders ({rawOrders.length})
          </TabsTrigger>
          <TabsTrigger value="products" className="text-xs uppercase tracking-[0.2em] flex items-center gap-1.5">
            <ShoppingBag className="size-3.5" /> Products ({(productsQuery.data || []).length})
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Settings className="size-3.5" /> Settings
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Orders Management */}
        <TabsContent value="orders" className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {(["all", "pending", "approved", "declined"] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={orderFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOrderFilter(filter)}
                  className="text-xs uppercase tracking-[0.2em]"
                >
                  {filter}
                </Button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">Showing {filteredOrders.length} orders</p>
          </div>

          {ordersQuery.isLoading && <p className="text-sm text-muted-foreground">Loading store orders…</p>}

          {!ordersQuery.isLoading && filteredOrders.length === 0 && (
            <div className="border border-border bg-surface p-12 text-center text-sm text-muted-foreground">
              No orders found matching filter &quot;{orderFilter}&quot;.
            </div>
          )}

          <div className="space-y-6">
            {filteredOrders.map((ord: any) => {
              const paymentStatus = ord.payment_status || ord.status;
              const isPending = paymentStatus === "pending";
              const isApproved = paymentStatus === "approved";
              const isDeclined = paymentStatus === "declined";

              return (
                <article key={ord.id} className="border border-border bg-surface p-6 sm:p-8 space-y-6">
                  {/* Top bar: Reference, Status, and Total */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xl font-bold tracking-wider text-foreground">
                          {ord.reference || `ORD-${ord.id.slice(0, 8)}`}
                        </span>
                        {isApproved && (
                          <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 uppercase">
                            Approved & Paid
                          </Badge>
                        )}
                        {isDeclined && (
                          <Badge className="bg-destructive/20 text-destructive border border-destructive/30 uppercase">
                            Declined
                          </Badge>
                        )}
                        {isPending && (
                          <Badge className="bg-amber-600/20 text-amber-400 border border-amber-500/30 uppercase">
                            Pending Verification
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mt-1">
                        Placed on {formatDate(ord.created_at)} · Customer:{" "}
                        <strong className="text-foreground">{ord.customer_name || ord.full_name}</strong>
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="text-xl font-bold text-foreground">
                        ${Number(ord.total || ord.total_cents / 100).toFixed(2)}
                      </p>
                      {ord.receipt_path ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewReceiptProof(ord.receipt_path)}
                          className="gap-1.5 text-xs uppercase tracking-[0.15em]"
                        >
                          <Eye className="size-3.5" /> View Receipt Proof
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No receipt attached</span>
                      )}
                    </div>
                  </div>

                  {/* Customer details & delivery address */}
                  <div className="grid gap-4 sm:grid-cols-3 text-xs">
                    <div>
                      <p className="uppercase tracking-[0.2em] text-muted-foreground font-semibold">Contact Info</p>
                      <p className="mt-1 font-medium text-foreground">{ord.customer_name || ord.full_name}</p>
                      <p className="text-muted-foreground font-mono">{ord.phone}</p>
                      <p className="text-muted-foreground">{ord.email}</p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="uppercase tracking-[0.2em] text-muted-foreground font-semibold">Delivery Address</p>
                      <p className="mt-1 text-muted-foreground">{ord.address}</p>
                      {ord.notes && (
                        <p className="mt-2 text-xs italic text-muted-foreground">
                          <strong>Note from customer:</strong> {ord.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items list */}
                  {Array.isArray(ord.items) && ord.items.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Order Items</p>
                      <ul className="divide-y divide-border/60">
                        {ord.items.map((it: any, idx: number) => (
                          <li key={idx} className="py-2.5 flex justify-between text-xs text-muted-foreground">
                            <span>
                              <strong className="text-foreground">{it.name}</strong> (Size {it.size}) × {it.quantity}
                            </span>
                            <span className="text-foreground font-medium">
                              ${(Number(it.price || it.priceCents / 100) * it.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Admin Note Section */}
                  <div className="border-t border-border pt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2">
                      Admin Note to Customer (Visible on Order Tracker)
                    </p>

                    {editingNoteId === ord.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingNoteText}
                          onChange={(e) => setEditingNoteText(e.target.value)}
                          placeholder="e.g. Payment verified. Your parcel is scheduled for dispatch tomorrow."
                          rows={2}
                          className="text-xs"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              updateOrderStatus.mutate({
                                id: ord.id,
                                payment_status: ord.payment_status || ord.status,
                                status: ord.status,
                                admin_note: editingNoteText,
                              });
                              setEditingNoteId(null);
                            }}
                            className="text-xs uppercase tracking-[0.15em]"
                          >
                            Save Note
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingNoteId(null)}
                            className="text-xs uppercase tracking-[0.15em]"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4 bg-background/50 p-3 border border-border">
                        <p className="text-xs text-muted-foreground">
                          {ord.admin_note || "No message attached yet."}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingNoteId(ord.id);
                            setEditingNoteText(ord.admin_note || "");
                          }}
                          className="text-xs uppercase tracking-[0.15em]"
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        disabled={isApproved || updateOrderStatus.isPending}
                        onClick={() =>
                          updateOrderStatus.mutate({
                            id: ord.id,
                            payment_status: "approved",
                            status: "paid",
                          })
                        }
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-[0.15em] gap-1.5"
                      >
                        <CheckCircle className="size-3.5" /> Approve Payment
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isDeclined || updateOrderStatus.isPending}
                        onClick={() =>
                          updateOrderStatus.mutate({
                            id: ord.id,
                            payment_status: "declined",
                            status: "declined",
                          })
                        }
                        className="border-destructive/40 text-destructive hover:bg-destructive/10 text-xs uppercase tracking-[0.15em] gap-1.5"
                      >
                        <XCircle className="size-3.5" /> Decline Payment
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteOrder.mutate(ord.id)}
                      className="text-muted-foreground hover:text-destructive text-xs uppercase tracking-[0.15em] gap-1.5"
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Product Management */}
        <TabsContent value="products" className="mt-8 space-y-10">
          {/* Add Product Form */}
          <div className="border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-6">
              Add New Product Piece
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="p-name">Product Name *</Label>
                <Input
                  id="p-name"
                  placeholder="e.g. Void Web Heavyweight Hoodie"
                  value={draftProduct.name}
                  onChange={(e) => setDraftProduct((p) => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="p-slug">URL Slug (Auto-generated if empty)</Label>
                <Input
                  id="p-slug"
                  placeholder="void-web-heavyweight-hoodie"
                  value={draftProduct.slug}
                  onChange={(e) => setDraftProduct((p) => ({ ...p, slug: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="p-brand">Brand</Label>
                <Input
                  id="p-brand"
                  value={draftProduct.brand}
                  onChange={(e) => setDraftProduct((p) => ({ ...p, brand: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="p-category">Category</Label>
                <select
                  id="p-category"
                  value={draftProduct.category}
                  onChange={(e) => setDraftProduct((p) => ({ ...p, category: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="hoodies">Hoodies</option>
                  <option value="tees">Tees</option>
                  <option value="bottoms">Bottoms</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="p-price">Price (USD) *</Label>
                <Input
                  id="p-price"
                  type="number"
                  step="0.01"
                  placeholder="129.00"
                  value={draftProduct.price}
                  onChange={(e) => setDraftProduct((p) => ({ ...p, price: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="p-order">Sort Order Priority</Label>
                <Input
                  id="p-order"
                  type="number"
                  placeholder="0"
                  value={draftProduct.sort_order}
                  onChange={(e) => setDraftProduct((p) => ({ ...p, sort_order: e.target.value }))}
                />
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="p-specs">Specifications & Sizing Details</Label>
                <Input
                  id="p-specs"
                  placeholder="e.g. 100% Combed Cotton, 400 GSM French Terry, Oversized Boxy Cut"
                  value={draftProduct.specifications}
                  onChange={(e) => setDraftProduct((p) => ({ ...p, specifications: e.target.value }))}
                />
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="p-desc">Product Description</Label>
                <Textarea
                  id="p-desc"
                  placeholder="Provide rich details on fabric, silhouette, and story."
                  value={draftProduct.description}
                  onChange={(e) => setDraftProduct((p) => ({ ...p, description: e.target.value }))}
                />
              </div>

              <div className="grid gap-3 sm:col-span-2">
                <Label>Product Image *</Label>
                <div className="flex flex-wrap items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleProductImageUpload(file);
                    }}
                    className="max-w-xs"
                    disabled={uploadingProductImage}
                  />

                  {uploadingProductImage && <span className="text-xs text-muted-foreground">Uploading image…</span>}

                  {draftProduct.image_url && (
                    <div className="flex items-center gap-2">
                      <img
                        src={draftProduct.image_url}
                        alt="Preview"
                        className="size-12 object-cover border border-border"
                      />
                      <span className="text-xs font-mono text-muted-foreground truncate max-w-xs">
                        {draftProduct.image_url}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={() => createProduct.mutate()}
              disabled={createProduct.isPending || uploadingProductImage}
              className="mt-6 text-xs uppercase tracking-[0.2em]"
            >
              {createProduct.isPending ? "Adding…" : "Add Product to Catalogue"}
            </Button>
          </div>

          {/* Current Products Table */}
          <div className="border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-6">
              Current Catalogue ({(productsQuery.data || []).length} items)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="pb-3">Piece</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Stock Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(productsQuery.data || []).map((p: any) => (
                    <tr key={p.id} className="hover:bg-background/40">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="size-12 object-cover bg-background border border-border"
                          />
                          <div>
                            <p className="font-medium text-foreground">{p.name}</p>
                            <p className="text-xs font-mono text-muted-foreground">/{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-xs uppercase tracking-wider text-muted-foreground">{p.category}</td>
                      <td className="py-4 font-medium text-foreground">
                        ${Number(p.price || p.price_cents / 100).toFixed(2)}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => toggleStock.mutate({ id: p.id, in_stock: !p.in_stock })}
                          className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider border rounded cursor-pointer transition-colors ${
                            p.in_stock
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20"
                          }`}
                        >
                          {p.in_stock ? "In Stock" : "Sold Out"}
                        </button>
                      </td>
                      <td className="py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProduct.mutate(p.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Store Settings & Bank Account Details */}
        <TabsContent value="settings" className="mt-8 space-y-10">
          {/* Bank Transfer Details Form */}
          <div className="border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Bank Transfer Details & Payment Instructions
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              These details are presented to customers at checkout and used for transfer narrations.
            </p>

            {settingsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading settings…</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = settingsDraft || settingsQuery.data;
                  updateSettings.mutate(target);
                }}
                className="grid gap-5 sm:grid-cols-2"
              >
                <div className="grid gap-2">
                  <Label htmlFor="s-bank">Bank Name *</Label>
                  <Input
                    id="s-bank"
                    defaultValue={settingsQuery.data?.bank_name}
                    onChange={(e) =>
                      setSettingsDraft((d: any) => ({
                        ...(d || settingsQuery.data),
                        bank_name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="s-acc-name">Account Name *</Label>
                  <Input
                    id="s-acc-name"
                    defaultValue={settingsQuery.data?.account_name}
                    onChange={(e) =>
                      setSettingsDraft((d: any) => ({
                        ...(d || settingsQuery.data),
                        account_name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="s-acc-num">Account Number *</Label>
                  <Input
                    id="s-acc-num"
                    defaultValue={settingsQuery.data?.account_number}
                    onChange={(e) =>
                      setSettingsDraft((d: any) => ({
                        ...(d || settingsQuery.data),
                        account_number: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="s-whatsapp">Store WhatsApp (Digits Only, with Country Code) *</Label>
                  <Input
                    id="s-whatsapp"
                    placeholder="e.g. 15550192834"
                    defaultValue={settingsQuery.data?.whatsapp_number}
                    onChange={(e) =>
                      setSettingsDraft((d: any) => ({
                        ...(d || settingsQuery.data),
                        whatsapp_number: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="s-phone">Contact Phone</Label>
                  <Input
                    id="s-phone"
                    defaultValue={settingsQuery.data?.contact_phone}
                    onChange={(e) =>
                      setSettingsDraft((d: any) => ({
                        ...(d || settingsQuery.data),
                        contact_phone: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="s-email">Contact / Support Email</Label>
                  <Input
                    id="s-email"
                    type="email"
                    defaultValue={settingsQuery.data?.contact_email}
                    onChange={(e) =>
                      setSettingsDraft((d: any) => ({
                        ...(d || settingsQuery.data),
                        contact_email: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="s-instructions">Checkout Payment Instructions</Label>
                  <Textarea
                    id="s-instructions"
                    rows={3}
                    defaultValue={settingsQuery.data?.payment_instructions}
                    onChange={(e) =>
                      setSettingsDraft((d: any) => ({
                        ...(d || settingsQuery.data),
                        payment_instructions: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    disabled={updateSettings.isPending}
                    className="text-xs uppercase tracking-[0.2em]"
                  >
                    {updateSettings.isPending ? "Saving Changes…" : "Save Store Settings"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Appoint New Admin Section */}
          <div className="border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Appoint Store Staff / Admin
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              Grant administrative access to another registered user account by email.
            </p>

            <form onSubmit={handleGrantAdmin} className="flex flex-wrap items-center gap-3 max-w-md">
              <Input
                type="email"
                placeholder="staff@nathanclothes.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={appointingAdmin}
                className="text-xs uppercase tracking-[0.2em] gap-1.5"
              >
                <UserCheck className="size-4" />
                {appointingAdmin ? "Granting…" : "Grant Admin"}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
