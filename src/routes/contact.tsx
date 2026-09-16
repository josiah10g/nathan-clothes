import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nathan's Clothing" },
      {
        name: "description",
        content:
          "Questions about sizing, an order or a collaboration? Send Nathan's Clothing a message and we'll reply within two business days.",
      },
      { property: "og:title", content: "Contact — Nathan's Clothing" },
      { property: "og:description", content: "Send Nathan's Clothing a message." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(5, "Tell us a little more").max(2000),
});

function Contact() {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject ?? "",
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Message could not be sent. Please try again.");
      return;
    }
    toast.success("Message sent — we'll be in touch soon.");
    setValues({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Concierge &amp; Client Support
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl">Let&apos;s Connect</h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Have questions about an upcoming limited drop, fit guidance, local delivery, or special orders? We treat every inquiry with priority. Reach our team below or connect directly on WhatsApp for immediate support.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-2 max-w-xl">
          <div className="border border-border/60 bg-surface/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground font-medium">Fast Turnaround</p>
            <p className="text-xs text-muted-foreground mt-1">Direct response within 24h</p>
          </div>
          <div className="border border-border/60 bg-surface/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground font-medium">Direct WhatsApp</p>
            <p className="text-xs text-muted-foreground mt-1">Live customer assistance</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-12 grid max-w-xl gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={values.name}
            maxLength={100}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
          {errors["name"] && <p className="text-xs text-destructive">{errors["name"]}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            maxLength={255}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
          {errors["email"] && <p className="text-xs text-destructive">{errors["email"]}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={values.subject}
            maxLength={150}
            onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            rows={6}
            value={values.message}
            maxLength={2000}
            onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          />
          {errors["message"] && <p className="text-xs text-destructive">{errors["message"]}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="text-xs uppercase tracking-[0.25em]"
          >
            {submitting ? "Sending…" : "Send message"}
          </Button>

          <a
            href="https://wa.me/2348000000000?text=Hello%20Nathan's%20Clothes!%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-emerald-500/50 bg-emerald-950/30 px-5 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300 transition-colors hover:bg-emerald-900/50 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 fill-emerald-500/30 text-emerald-400"
            >
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
            </svg>
            Chat via WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
}
