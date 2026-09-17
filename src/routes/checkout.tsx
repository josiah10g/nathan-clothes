import { useState, useId, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Copy, Check, Upload, ArrowRight, MessageCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout & Bank Transfer — Nathan's Clothes" },
      { name: "description", content: "Complete your order with direct bank transfer payment." },
      { property: "og:title", content: "Checkout — Nathan's Clothes" },
      { property: "og:description", content: "Complete your order with direct bank transfer payment." },
    ],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  customer_name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .min(5, "Please enter a valid contact phone number")
    .max(25, "Phone number is too long"),
  address: z.string().trim().min(3, "Delivery address is required").max(300),
  notes: z.string().trim().max(500).optional(),
});

function generateReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "CK-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotalCents, clear, hydrated } = useCart();
  const navigate = useNavigate();
  const qc = useQueryClient();

  // Unique order reference for this checkout session
  const [orderReference, setOrderReference] = useState(() => generateReference());

  // Real-time synchronization for store bank details & instructions
  useEffect(() => {
    const channel = supabase
      .channel("checkout-realtime-settings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "store_settings" },
        () => {
          void qc.invalidateQueries({ queryKey: ["store-settings"] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);

  // Fetch store settings for bank transfer instructions
  const { data: storeSettings, isLoading: loadingSettings } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error("Error fetching store settings:", error);
        return null;
      }
      return data;
    },
  });

  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedReference, setCopiedReference] = useState(false);

  const [values, setValues] = useState({
    customer_name: (user?.user_metadata?.['full_name'] as string) ?? "",
    email: user?.email ?? "",
    phone: (user?.user_metadata?.['phone'] as string) ?? "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setValues((prev) => ({
        ...prev,
        email: prev.email || user.email || "",
        phone: prev.phone || (user.user_metadata?.['phone'] as string) || "",
        customer_name: prev.customer_name || (user.user_metadata?.['full_name'] as string) || "",
      }));
    }
  }, [user]);

  type CheckoutErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{
    reference: string;
    total: number;
    phone: string;
    customer_name: string;
  } | null>(null);

  const totalCents = subtotalCents;
  const totalNumeric = Math.round(totalCents) / 100;

  const handleCopy = (text: string, type: "account" | "reference") => {
    navigator.clipboard.writeText(text);
    if (type === "account") {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedReference(true);
      setTimeout(() => setCopiedReference(false), 2000);
    }
    toast.success("Copied to clipboard");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Receipt file must be under 10MB");
      return;
    }

    setReceiptFile(file);
    if (file.type.startsWith("image/")) {
      setReceiptPreview(URL.createObjectURL(file));
    } else {
      setReceiptPreview(null);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: CheckoutErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof z.infer<typeof schema>;
        if (field) next[field] = issue.message;
      }
      setErrors(next);
      toast.error("Please fill in all required shipping and contact details");
      return;
    }

    setErrors({});
    setSubmittingOrder(true);

    try {
      let receiptPath: string | null = null;

      // 1. Upload receipt to Supabase Storage if provided
      if (receiptFile) {
        const fileExt = receiptFile.name.split(".").pop() || "jpg";
        const sanitizedRef = orderReference.toLowerCase().replace(/[^a-z0-9]/g, "");
        const fileName = `${sanitizedRef}_${Date.now()}.${fileExt}`;
        const filePath = `receipts/${fileName}`;

        // Upload to payment-receipts bucket (public bucket)
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("payment-receipts")
          .upload(filePath, receiptFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.warn("Storage upload error on payment-receipts:", uploadError);
          // Fallback: store as base64 data URL so the order still saves with proof
          if (receiptFile.type.startsWith("image/") && receiptFile.size <= 4 * 1024 * 1024) {
            receiptPath = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(receiptFile);
            });
          } else {
            // For large files or PDFs, just record that a receipt was attempted
            receiptPath = filePath;
          }
        } else {
          // Store the full path so admin can retrieve via public URL
          receiptPath = uploadData?.path ?? filePath;
        }
      }

      // 2. Insert Order into Supabase
      const orderPayload = {
        reference: orderReference,
        user_id: user?.id ?? null,
        customer_name: parsed.data.customer_name,
        full_name: parsed.data.customer_name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        address: parsed.data.address,
        city: "",
        postal_code: "",
        country: "",
        notes: parsed.data.notes || "",
        items: items.map((i) => ({
          productId: i.productId,
          slug: i.slug,
          name: i.name,
          imageUrl: i.imageUrl,
          size: i.size,
          priceCents: i.priceCents,
          price: i.priceCents / 100,
          quantity: i.quantity,
          totalCents: i.priceCents * i.quantity,
        })),
        total: totalNumeric,
        total_cents: totalCents,
        status: "pending",
        payment_status: "pending",
        receipt_path: receiptPath,
        receipt_uploaded_at: new Date().toISOString(),
      };

      let confirmedRef = orderReference;
      const { data: createdOrder, error: orderError } = await supabase
        .from("orders")
        .insert(orderPayload)
        .select("id, reference, phone, customer_name, total")
        .maybeSingle();

      if (orderError) {
        // If the insert failed only because select was restricted by RLS, attempt insert without select
        if (orderError.code === "42501" || orderError.message?.toLowerCase().includes("permission")) {
          const { error: insertOnlyError } = await supabase
            .from("orders")
            .insert(orderPayload);
          if (insertOnlyError) {
            console.error("Order creation fallback error:", insertOnlyError);
            toast.error(`Order failed to submit: ${insertOnlyError.message}`);
            setSubmittingOrder(false);
            return;
          }
        } else {
          console.error("Order creation error:", orderError);
          toast.error(`Order failed to submit: ${orderError.message}`);
          setSubmittingOrder(false);
          return;
        }
      } else if (createdOrder?.reference) {
        confirmedRef = createdOrder.reference;
      }

      // 3. Clear cart and set confirmation state
      clear();
      setCompletedOrder({
        reference: confirmedRef,
        total: totalNumeric,
        phone: parsed.data.phone,
        customer_name: parsed.data.customer_name,
      });
      toast.success("Order submitted successfully!");
    } catch (err: any) {
      console.error("Checkout submission failed:", err);
      toast.error(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  // 4. Order Confirmation Screen
  if (completedOrder) {
    const whatsappNum = storeSettings?.whatsapp_number || "";
    const waText = encodeURIComponent(
      `Hello Nathan's Clothes, I just placed an order (Ref: ${completedOrder.reference}) for ₦${new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(completedOrder.total)}. Name: ${completedOrder.customer_name}. Here is my payment confirmation.`
    );
    const waUrl = whatsappNum ? `https://wa.me/${whatsappNum}?text=${waText}` : "#";

    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <div className="border border-border bg-surface p-8 text-center sm:p-12">
          <div className="mx-auto flex size-14 items-center justify-center border border-primary/50 bg-primary/10 text-primary">
            <Check className="size-7" />
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">Order Placed</p>
          <h1 className="mt-2 text-3xl font-bold uppercase tracking-wide sm:text-4xl">Thank You</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            We have received your order and payment receipt. Our verification team will review your transfer narration shortly.
          </p>

          <div className="my-8 border border-border bg-background/60 p-6 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order Reference</span>
              <button
                onClick={() => handleCopy(completedOrder.reference, "reference")}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                {copiedReference ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copiedReference ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-2 text-2xl font-mono font-bold tracking-wider text-foreground">
              {completedOrder.reference}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Save this reference number alongside your phone number (
              <span className="font-mono text-foreground">{completedOrder.phone}</span>) to track your order anytime.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-primary bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="size-4" />
              Confirm on WhatsApp
            </a>

            <Link
              to="/account"
              className="inline-flex items-center justify-center border border-border bg-surface px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-border"
            >
              Track Order Status
            </Link>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <Link to="/shop" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
              &larr; Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="text-3xl">Your bag is empty</h1>
        <p className="mt-3 text-sm text-muted-foreground">Add pieces to your bag before checking out.</p>
        <Link to="/shop" className="mt-8 inline-block">
          <Button className="text-xs uppercase tracking-[0.25em]">Shop the collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16 sm:px-6">
      <div className="mb-6 sm:mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Nathan&apos;s Clothes</p>
        <h1 className="mt-2 text-3xl sm:text-5xl font-bold font-serif uppercase tracking-tight">Checkout</h1>
      </div>

      <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1fr_380px] items-start">
        {/* Left Column: Form & Payment Transfer Steps */}
        <form onSubmit={handleSubmitOrder} className="space-y-6 sm:space-y-10 min-w-0">
          {/* Step 1: Customer Details */}
          <div className="border border-border bg-surface p-5 sm:p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground mb-5 sm:mb-6">
              1. Customer Information & Delivery Address
            </h2>

            <div className="grid gap-4 sm:gap-5">
              <div className="grid gap-2">
                <Label htmlFor="customer_name">Full Name *</Label>
                <Input
                  id="customer_name"
                  placeholder="e.g. Nathan Vance"
                  value={values.customer_name}
                  onChange={(e) => setValues((v) => ({ ...v, customer_name: e.target.value }))}
                />
                {errors.customer_name && <p className="text-xs text-destructive">{errors.customer_name}</p>}
              </div>

              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number (numbers only) *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="08012345678"
                    value={values.phone}
                    onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value.replace(/[^0-9]/g, "") }))}
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@gmail.com"
                    value={values.email}
                    onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  rows={3}
                  placeholder="House/Apartment number, street name, area, city, and state"
                  value={values.address}
                  onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
                />
                {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Order Notes / Delivery Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Special instructions for delivery (e.g. leave at front desk)"
                  value={values.notes}
                  onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Step 2: Manual Bank Transfer Details */}
          <div className="border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-6">
              2. Manual Bank Transfer Instructions
            </h2>

            <div className="border border-border bg-background/70 p-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Bank Name</p>
                  <p className="mt-1 font-medium text-foreground">
                    {storeSettings?.bank_name || "Standard Chartered Bank"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account Name</p>
                  <p className="mt-1 font-medium text-foreground">
                    {storeSettings?.account_name || "Nathan Clothes Limited"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border pt-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account Number</p>
                  <p className="mt-1 font-mono text-lg sm:text-xl font-semibold text-foreground tracking-wider break-all">
                    {storeSettings?.account_number || "0123456789"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(storeSettings?.account_number || "0123456789", "account")}
                  className="gap-1.5 text-xs uppercase tracking-[0.15em] shrink-0 self-start sm:self-auto"
                >
                  {copiedAccount ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copiedAccount ? "Copied" : "Copy Account"}
                </Button>
              </div>

              <div className="rounded border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Payment Instructions:</p>
                <p>
                  {storeSettings?.payment_instructions ||
                    "Please transfer the exact total to the account above. Use your order reference as the transaction narration and upload the payment receipt below."}
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Receipt Proof Upload */}
          <div className="border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-6">
              3. Upload Proof of Payment (Receipt / Screenshot - Optional)
            </h2>

            <div className="grid gap-4">
              <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-border bg-background/50 p-8 text-center hover:border-muted-foreground transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 size-full opacity-0 cursor-pointer"
                  id="receipt-upload"
                />
                <Upload className="size-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">
                  {receiptFile ? receiptFile.name : "Click or drag receipt image or PDF here"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Supports PNG, JPG, JPEG, WEBP or PDF up to 10MB</p>
              </div>

              {receiptPreview && (
                <div className="mt-2 border border-border p-3 bg-background max-w-xs">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Receipt Preview:</p>
                  <img src={receiptPreview} alt="Receipt proof" className="max-h-48 w-auto object-contain rounded" />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={submittingOrder}
            className="w-full text-xs uppercase tracking-[0.25em] py-6 text-sm"
          >
            {submittingOrder ? "Submitting Order & Verifying…" : `Complete Order · ${formatPrice(subtotalCents)}`}
          </Button>
        </form>

        {/* Right Column: Order Summary */}
        <aside className="h-fit border border-border bg-surface p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold">Your Bag</p>

          <ul className="mt-6 divide-y divide-border border-y border-border">
            {items.map((i) => (
              <li key={`${i.productId}-${i.size}`} className="py-4 flex items-center gap-4 text-sm">
                <img
                  src={i.imageUrl}
                  alt={i.name}
                  className="size-16 object-cover bg-background border border-border shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{i.name}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                    Size: {i.size} × {i.quantity}
                  </p>
                </div>
                <span className="font-medium text-foreground">{formatPrice(i.priceCents * i.quantity)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Subtotal</dt>
              <dd className="font-medium text-foreground">{formatPrice(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-4 text-base font-bold text-foreground">
              <dt>Total Amount</dt>
              <dd>{formatPrice(subtotalCents)}</dd>
            </div>
          </dl>

          <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground space-y-2">
            <p className="flex items-center gap-1.5">
              <Check className="size-3.5 text-primary" /> 100% Secure Manual Transfer
            </p>
            <p className="flex items-center gap-1.5">
              <Check className="size-3.5 text-primary" /> Fast dispatch upon receipt review
            </p>
            <p className="flex items-center gap-1.5">
              <Check className="size-3.5 text-primary" /> WhatsApp confirmation available
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
