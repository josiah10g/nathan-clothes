import { useState, useRef } from "react";
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
  X,
  Edit3,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate, formatPrice } from "@/lib/format";
import { ProfileDialog } from "@/components/site/ProfileDialog";

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
  const { user, isAdmin, loading } = useAuth();
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
    category: "hoodies",
    description: "",
    specifications: "",
    price: "",
    in_stock: true,
    stock: "10",
    image_url: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingProductImage, setUploadingProductImage] = useState(false);

  // Deletion Confirmation Modal States (Card in Screen instead of localhost confirm)
  const [deleteProductTarget, setDeleteProductTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteOrderTarget, setDeleteOrderTarget] = useState<{ id: string; reference: string } | null>(null);

  // Edit Product Modal State
  const [editProductTarget, setEditProductTarget] = useState<{
    id: string;
    name: string;
    category: string;
    description: string;
    specifications: string;
    price: string;
    stock: string;
    in_stock: boolean;
    image_url: string;
  } | null>(null);

  // Edit Order Modal State
  const [editOrderTarget, setEditOrderTarget] = useState<{
    id: string;
    reference: string;
    customer_name: string;
    phone: string;
    email: string;
    address: string;
    status: string;
    payment_status: string;
    admin_note: string;
  } | null>(null);

  // Admin Profile Dialog State
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  // Appoint Admin State
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [appointingAdmin, setAppointingAdmin] = useState(false);

  // Settings Draft State
  const [settingsDraft, setSettingsDraft] = useState<any>(null);

  // 1. Order Actions Mutations
  const updateOrderDetails = useMutation({
    mutationFn: async (order: {
      id: string;
      customer_name: string;
      phone: string;
      email: string;
      address: string;
      status: string;
      payment_status: string;
      admin_note: string;
    }) => {
      const { error } = await supabase
        .from("orders")
        .update({
          customer_name: order.customer_name.trim(),
          phone: order.phone.trim(),
          email: order.email.trim(),
          address: order.address.trim(),
          status: order.status,
          payment_status: order.payment_status,
          admin_note: order.admin_note.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Order updated successfully");
      setEditOrderTarget(null);
      void qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (err: any) => {
      toast.error("Failed to update order: " + err.message);
    },
  });

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
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Order deleted");
      setDeleteOrderTarget(null);
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
      const { error } = await supabase.storage
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

  const handleRemoveProductImage = () => {
    setDraftProduct((p) => ({ ...p, image_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createProduct = useMutation({
    mutationFn: async () => {
      if (!draftProduct.name.trim()) throw new Error("Product name is required");
      // Auto-generate URL slug in background from product name and timestamp if needed
      const baseSlug = draftProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "product";
      const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
      const priceNumeric = Math.round(parseFloat(draftProduct.price) || 0);
      const priceCents = priceNumeric * 100;

      const stockNumeric = Math.max(0, parseInt(draftProduct.stock, 10) || 0);

      const { error } = await supabase.from("products").insert({
        name: draftProduct.name.trim(),
        slug,
        brand: "Nathan Clothes",
        category: draftProduct.category,
        description: draftProduct.description.trim(),
        specifications: draftProduct.specifications.trim(),
        price: priceNumeric,
        price_cents: priceCents,
        image_url: draftProduct.image_url.trim() || "/images/shadow-web-hoodie.jpg",
        in_stock: stockNumeric > 0 && draftProduct.in_stock,
        stock: stockNumeric,
        sort_order: 0,
        active: true,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product created successfully");
      setDraftProduct({
        name: "",
        category: "hoodies",
        description: "",
        specifications: "",
        price: "",
        in_stock: true,
        stock: "10",
        image_url: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      void qc.invalidateQueries({ queryKey: ["admin", "products"] });
      void qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      toast.error("Failed to create product: " + err.message);
    },
  });

  const updateProduct = useMutation({
    mutationFn: async (prod: {
      id: string;
      name: string;
      category: string;
      description: string;
      specifications: string;
      price: string;
      stock: string;
      in_stock: boolean;
      image_url: string;
    }) => {
      const priceCents = prod.price ? Math.round(Number(prod.price) * 100) : 0;
      const stockNum = parseInt(prod.stock || "0", 10);
      const { error } = await supabase
        .from("products")
        .update({
          name: prod.name.trim(),
          category: prod.category,
          description: prod.description.trim(),
          specifications: prod.specifications.trim(),
          price: prod.price ? Number(prod.price) : 0,
          price_cents: priceCents,
          stock: isNaN(stockNum) ? 0 : stockNum,
          in_stock: stockNum > 0,
          image_url: prod.image_url.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", prod.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      setEditProductTarget(null);
      void qc.invalidateQueries({ queryKey: ["admin", "products"] });
      void qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      toast.error("Failed to update product: " + err.message);
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product deleted");
      setDeleteProductTarget(null);
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

  const displayName = (user?.user_metadata?.["full_name"] as string) || user?.email?.split("@")[0] || "Admin";

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="border-b border-border pb-8">
        <div className="inline-block rounded-full bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border border-border">
          Admin Portal
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl font-serif font-bold tracking-tight text-foreground">
          Welcome, {displayName}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your store inventory, review customer bank receipts, and configure store settings.
        </p>
      </div>

      <Tabs defaultValue="orders" className="mt-10">
        <TabsList className="flex flex-wrap h-auto bg-transparent p-0 gap-2 border-b border-border pb-4 w-full justify-start rounded-none">
          <TabsTrigger
            value="orders"
            className="text-xs uppercase tracking-[0.15em] data-[state=active]:bg-foreground data-[state=active]:text-background rounded px-4 py-2"
          >
            Orders &amp; payments ({rawOrders.length})
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="text-xs uppercase tracking-[0.15em] data-[state=active]:bg-foreground data-[state=active]:text-background rounded px-4 py-2"
          >
            Products ({(productsQuery.data || []).length})
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="text-xs uppercase tracking-[0.15em] data-[state=active]:bg-foreground data-[state=active]:text-background rounded px-4 py-2"
          >
            Payment details &amp; staff
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Orders Management */}
        <TabsContent value="orders" className="mt-8 space-y-8">
          {/* KPI Metrics Summary Bar (matching reference) */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="border border-border bg-surface p-5 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Total Orders</p>
              <p className="text-3xl font-serif font-bold text-foreground">{rawOrders.length}</p>
            </div>
            <div className="border border-border bg-surface p-5 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Pending Requests</p>
              <p className="text-3xl font-serif font-bold text-foreground">
                {rawOrders.filter((o: any) => (o.payment_status || o.status) === "pending").length}
              </p>
            </div>
            <div className="border border-border bg-surface p-5 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Successful Orders</p>
              <p className="text-3xl font-serif font-bold text-foreground">
                {rawOrders.filter((o: any) => (o.payment_status || o.status) === "approved").length}
              </p>
            </div>
            <div className="border border-border bg-surface p-5 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Unique Customers</p>
              <p className="text-3xl font-serif font-bold text-foreground">
                {new Set(rawOrders.map((o: any) => o.email || o.phone)).size}
              </p>
            </div>
            <div className="border border-border bg-surface p-5 space-y-2 col-span-2 sm:col-span-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Confirmed Revenue</p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-foreground truncate">
                {formatPrice(
                  rawOrders
                    .filter((o: any) => (o.payment_status || o.status) === "approved")
                    .reduce((sum: number, o: any) => sum + (o.total_cents || Math.round(Number(o.total || 0) * 100)), 0)
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={orderFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrderFilter("all")}
                className="text-xs uppercase tracking-[0.15em] h-8 px-3"
              >
                All Requests
              </Button>
              <Button
                variant={orderFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrderFilter("pending")}
                className="text-xs uppercase tracking-[0.15em] h-8 px-3 gap-1.5"
              >
                <span className="size-2 rounded-full bg-amber-400" />
                Pending
              </Button>
              <Button
                variant={orderFilter === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrderFilter("approved")}
                className="text-xs uppercase tracking-[0.15em] h-8 px-3 gap-1.5"
              >
                <span className="size-2 rounded-full bg-emerald-400" />
                Successful
              </Button>
              <Button
                variant={orderFilter === "declined" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrderFilter("declined")}
                className="text-xs uppercase tracking-[0.15em] h-8 px-3 gap-1.5"
              >
                <span className="size-2 rounded-full bg-destructive" />
                Declined
              </Button>
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
                        {formatPrice(ord.total_cents || Math.round(Number(ord.total || 0) * 100))}
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
                              {formatPrice(
                                (it.priceCents || Math.round(Number(it.price || 0) * 100)) * it.quantity
                              )}
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setEditOrderTarget({
                            id: ord.id,
                            reference: ord.reference || `ORD-${ord.id.slice(0, 8)}`,
                            customer_name: ord.customer_name || "",
                            phone: ord.phone || "",
                            email: ord.email || "",
                            address: ord.address || "",
                            status: ord.status || "pending",
                            payment_status: ord.payment_status || "pending",
                            admin_note: ord.admin_note || "",
                          })
                        }
                        className="text-xs uppercase tracking-[0.15em] gap-1.5"
                      >
                        <Edit3 className="size-3.5" /> Edit Order
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDeleteOrderTarget({
                          id: ord.id,
                          reference: ord.reference || `ORD-${ord.id.slice(0, 8)}`,
                        })
                      }
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
                <Label htmlFor="p-price" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  PRICE IN NAIRA (LEAVE EMPTY FOR “PRICE ON REQUEST”)
                </Label>
                <div className="relative flex items-center border border-border bg-background focus-within:ring-1 focus-within:ring-ring">
                  <span className="pl-4 pr-2 text-base font-bold text-foreground select-none">
                    ₦
                  </span>
                  <input
                    id="p-price"
                    type="text"
                    inputMode="numeric"
                    placeholder="456,666"
                    value={
                      draftProduct.price
                        ? Number(draftProduct.price).toLocaleString("en-US")
                        : ""
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "");
                      setDraftProduct((p) => ({ ...p, price: raw }));
                    }}
                    className="h-12 w-full bg-transparent pr-4 text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="p-stock">Units in Stock *</Label>
                <Input
                  id="p-stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g. 10"
                  value={draftProduct.stock}
                  onChange={(e) => setDraftProduct((p) => ({ ...p, stock: e.target.value }))}
                />
                <p className="text-[11px] text-muted-foreground">Number of items available for purchase</p>
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
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="admin-product-image-file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleProductImageUpload(file);
                    }}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingProductImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2 text-xs uppercase tracking-[0.15em]"
                  >
                    <Upload className="size-4" />
                    {uploadingProductImage ? "Uploading…" : "Choose File"}
                  </Button>

                  {draftProduct.image_url && (
                    <div className="relative inline-flex items-center gap-3 border border-border bg-background/80 p-2 pr-4 rounded">
                      <img
                        src={draftProduct.image_url}
                        alt="Preview"
                        className="size-14 object-cover border border-border rounded"
                      />
                      <div className="min-w-0 max-w-xs">
                        <p className="text-xs font-medium text-foreground truncate">Image selected</p>
                        <p className="text-[11px] font-mono text-muted-foreground truncate">
                          {draftProduct.image_url}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveProductImage}
                        className="flex size-7 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                        title="Delete selected image"
                        aria-label="Delete selected image"
                      >
                        <X className="size-4" />
                      </button>
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
                    <th className="pb-3">Units in Stock</th>
                    <th className="pb-3">Status</th>
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
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-xs uppercase tracking-wider text-muted-foreground">{p.category}</td>
                      <td className="py-4 font-medium text-foreground">
                        {formatPrice(p.price_cents || Math.round(Number(p.price || 0) * 100))}
                      </td>
                      <td className="py-4 font-mono text-xs text-foreground">
                        {p.stock ?? (p.in_stock ? "In stock" : "0")}
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
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setEditProductTarget({
                                id: p.id,
                                name: p.name || "",
                                category: p.category || "hoodies",
                                description: p.description || "",
                                specifications: p.specifications || "",
                                price: p.price ? String(p.price) : p.price_cents ? String(p.price_cents / 100) : "",
                                stock: p.stock !== undefined && p.stock !== null ? String(p.stock) : "0",
                                in_stock: !!p.in_stock,
                                image_url: p.image_url || "",
                              })
                            }
                            className="text-muted-foreground hover:text-foreground"
                            title="Edit Piece"
                          >
                            <Edit3 className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteProductTarget({ id: p.id, name: p.name })}
                            className="text-muted-foreground hover:text-destructive"
                            title="Delete Piece"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
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
                    placeholder=""
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
                  <Label htmlFor="s-phone">Contact Phone (numbers only)</Label>
                  <Input
                    id="s-phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="08012345678"
                    defaultValue={settingsQuery.data?.contact_phone}
                    onChange={(e) =>
                      setSettingsDraft((d: any) => ({
                        ...(d || settingsQuery.data),
                        contact_phone: e.target.value.replace(/[^0-9]/g, ""),
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="s-email">Contact / Support Email</Label>
                  <Input
                    id="s-email"
                    type="email"
                    placeholder=""
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

      {/* Delete Product Confirmation Card Modal */}
      <AlertDialog
        open={!!deleteProductTarget}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteProductTarget(null);
        }}
      >
        <AlertDialogContent className="border border-border bg-background p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold uppercase tracking-wide">
              Delete Product Piece
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">{deleteProductTarget?.name}</strong> from the store catalogue?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel
              disabled={deleteProduct.isPending}
              className="text-xs uppercase tracking-wider"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteProduct.isPending}
              onClick={() => {
                if (deleteProductTarget) {
                  deleteProduct.mutate(deleteProductTarget.id);
                }
              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs uppercase tracking-wider"
            >
              {deleteProduct.isPending ? "Deleting…" : "Delete Product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Order Confirmation Card Modal */}
      <AlertDialog
        open={!!deleteOrderTarget}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteOrderTarget(null);
        }}
      >
        <AlertDialogContent className="border border-border bg-background p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold uppercase tracking-wide">
              Delete Order Record
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete order{" "}
              <strong className="font-mono text-foreground">{deleteOrderTarget?.reference}</strong>?
              This order and its payment records will be completely removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel
              disabled={deleteOrder.isPending}
              className="text-xs uppercase tracking-wider"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteOrder.isPending}
              onClick={() => {
                if (deleteOrderTarget) {
                  deleteOrder.mutate(deleteOrderTarget.id);
                }
              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs uppercase tracking-wider"
            >
              {deleteOrder.isPending ? "Deleting…" : "Delete Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Order Modal */}
      <Dialog
        open={!!editOrderTarget}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditOrderTarget(null);
        }}
      >
        <DialogContent className="max-w-lg border border-border bg-background p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold uppercase tracking-wide">
              Edit Order — {editOrderTarget?.reference}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify customer delivery information, payment confirmation, and internal note.
            </DialogDescription>
          </DialogHeader>

          {editOrderTarget && (
            <div className="mt-4 space-y-4 text-sm">
              <div className="grid gap-2">
                <Label htmlFor="edit-customer-name">Customer Full Name</Label>
                <Input
                  id="edit-customer-name"
                  value={editOrderTarget.customer_name}
                  onChange={(e) =>
                    setEditOrderTarget((prev) => prev ? { ...prev, customer_name: e.target.value } : null)
                  }
                  placeholder="e.g. Chukwuemeka Nathan"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-customer-phone">Phone Number (numbers only)</Label>
                <Input
                  id="edit-customer-phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={editOrderTarget.phone}
                  onChange={(e) =>
                    setEditOrderTarget((prev) =>
                      prev ? { ...prev, phone: e.target.value.replace(/[^0-9]/g, "") } : null
                    )
                  }
                  placeholder="08012345678"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-customer-email">Email Address</Label>
                <Input
                  id="edit-customer-email"
                  type="email"
                  value={editOrderTarget.email}
                  onChange={(e) =>
                    setEditOrderTarget((prev) => prev ? { ...prev, email: e.target.value } : null)
                  }
                  placeholder="customer@email.com"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-customer-address">Delivery Address</Label>
                <Textarea
                  id="edit-customer-address"
                  rows={2}
                  value={editOrderTarget.address}
                  onChange={(e) =>
                    setEditOrderTarget((prev) => prev ? { ...prev, address: e.target.value } : null)
                  }
                  placeholder="Street address, City, State"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="edit-payment-status">Payment Status</Label>
                  <select
                    id="edit-payment-status"
                    value={editOrderTarget.payment_status}
                    onChange={(e) =>
                      setEditOrderTarget((prev) => prev ? { ...prev, payment_status: e.target.value } : null)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs uppercase font-medium"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-order-status">Order Status</Label>
                  <select
                    id="edit-order-status"
                    value={editOrderTarget.status}
                    onChange={(e) =>
                      setEditOrderTarget((prev) => prev ? { ...prev, status: e.target.value } : null)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs uppercase font-medium"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="completed">Completed</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-admin-note">Admin Note (Visible on Order Tracker)</Label>
                <Textarea
                  id="edit-admin-note"
                  rows={2}
                  value={editOrderTarget.admin_note}
                  onChange={(e) =>
                    setEditOrderTarget((prev) => prev ? { ...prev, admin_note: e.target.value } : null)
                  }
                  placeholder="e.g. Payment verified. Your parcel is scheduled for dispatch tomorrow."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditOrderTarget(null)}
                  disabled={updateOrderDetails.isPending}
                  className="text-xs uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (editOrderTarget) {
                      updateOrderDetails.mutate(editOrderTarget);
                    }
                  }}
                  disabled={updateOrderDetails.isPending}
                  className="text-xs uppercase tracking-wider"
                >
                  {updateOrderDetails.isPending ? "Saving Changes…" : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={!!editProductTarget} onOpenChange={(open) => !open && setEditProductTarget(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border border-border bg-background p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-wide">Edit Product</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update piece details, price, inventory stock, or category.
            </DialogDescription>
          </DialogHeader>

          {editProductTarget && (
            <div className="mt-4 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="ep-name">Piece Name *</Label>
                <Input
                  id="ep-name"
                  value={editProductTarget.name}
                  onChange={(e) =>
                    setEditProductTarget((prev) => prev ? { ...prev, name: e.target.value } : null)
                  }
                  placeholder="e.g. Heavyweight Boxy Hoodie"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ep-category">Category *</Label>
                <select
                  id="ep-category"
                  value={editProductTarget.category}
                  onChange={(e) =>
                    setEditProductTarget((prev) => prev ? { ...prev, category: e.target.value } : null)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs uppercase font-medium"
                >
                  <option value="hoodies">Hoodies</option>
                  <option value="tees">Tees</option>
                  <option value="bottoms">Bottoms</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ep-price" className="text-xs uppercase tracking-wider font-semibold">
                  PRICE IN NAIRA (LEAVE EMPTY FOR “PRICE ON REQUEST”)
                </Label>
                <div className="relative flex items-center border border-border bg-background focus-within:ring-1 focus-within:ring-ring">
                  <span className="pl-4 pr-2 text-base font-bold text-foreground select-none">₦</span>
                  <input
                    id="ep-price"
                    type="text"
                    inputMode="numeric"
                    placeholder="456,666"
                    value={
                      editProductTarget.price
                        ? Number(editProductTarget.price).toLocaleString("en-US")
                        : ""
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "");
                      setEditProductTarget((prev) => prev ? { ...prev, price: raw } : null);
                    }}
                    className="h-12 w-full bg-transparent pr-4 text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ep-stock">Units in Stock *</Label>
                <Input
                  id="ep-stock"
                  type="number"
                  min="0"
                  step="1"
                  value={editProductTarget.stock}
                  onChange={(e) =>
                    setEditProductTarget((prev) => prev ? { ...prev, stock: e.target.value } : null)
                  }
                  placeholder="e.g. 10"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ep-specs">Specifications & Sizing Details</Label>
                <Input
                  id="ep-specs"
                  value={editProductTarget.specifications}
                  onChange={(e) =>
                    setEditProductTarget((prev) => prev ? { ...prev, specifications: e.target.value } : null)
                  }
                  placeholder="e.g. 100% Combed Cotton, 400 GSM"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ep-desc">Product Description</Label>
                <Textarea
                  id="ep-desc"
                  rows={3}
                  value={editProductTarget.description}
                  onChange={(e) =>
                    setEditProductTarget((prev) => prev ? { ...prev, description: e.target.value } : null)
                  }
                  placeholder="Provide details on fabric, silhouette, etc."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditProductTarget(null)}
                  disabled={updateProduct.isPending}
                  className="text-xs uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (editProductTarget) {
                      updateProduct.mutate(editProductTarget);
                    }
                  }}
                  disabled={updateProduct.isPending}
                  className="text-xs uppercase tracking-wider"
                >
                  {updateProduct.isPending ? "Saving Piece…" : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Profile Modal */}
      <ProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} />
    </div>
  );
}
