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
      { title: "Contact — Nathan's Clothes" },
      {
        name: "description",
        content:
          "Questions about sizing, an order or a collaboration? Send Nathan's Clothes a message and we'll reply within two business days.",
      },
      { property: "og:title", content: "Contact — Nathan's Clothes" },
      { property: "og:description", content: "Send Nathan's Clothes a message." },
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
      <h1 className="text-4xl sm:text-5xl">Contact</h1>
      <p className="mt-3 max-w-lg text-sm text-muted-foreground">
        Sizing, orders, wholesale or press &mdash; write to us and we&apos;ll reply within two
        business days.
      </p>

      <form onSubmit={onSubmit} className="mt-12 grid max-w-xl gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={values.name}
            maxLength={100}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
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
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="justify-self-start text-xs uppercase tracking-[0.25em]"
        >
          {submitting ? "Sending…" : "Send message"}
        </Button>
      </form>
    </div>
  );
}
