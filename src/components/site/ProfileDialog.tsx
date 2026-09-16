import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Mail, Lock, Eye, EyeOff, Upload, Check, Camera, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Sync current user info when dialog opens
  useEffect(() => {
    if (user && open) {
      setFullName((user.user_metadata?.["full_name"] as string) || "");
      setPhone((user.user_metadata?.["phone"] as string) || "");
      setEmail(user.email || "");
      setAvatarUrl((user.user_metadata?.["avatar_url"] as string) || "");
      setPassword("");
      setConfirmPassword("");
    }
  }, [user, open]);

  // Handle avatar upload
  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `avatar_${user.id}_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrlData.publicUrl);
      toast.success("Avatar image uploaded");
    } catch (err: any) {
      toast.error("Avatar upload failed: " + (err?.message || "Unknown error"));
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (password) {
      if (password.length < 6) {
        toast.error("New password must be at least 6 characters");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    setSavingProfile(true);
    try {
      const updates: {
        data: { full_name: string; phone: string; avatar_url: string };
        email?: string;
        password?: string;
      } = {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          avatar_url: avatarUrl.trim(),
        },
      };

      if (email.trim() && email.trim() !== user.email) {
        updates.email = email.trim();
      }

      if (password) {
        updates.password = password;
      }

      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;

      if (updates.email && updates.email !== user.email) {
        toast.success("Profile updated! Confirmation email sent to your new address.");
      } else {
        toast.success("Profile updated successfully");
      }

      setPassword("");
      setConfirmPassword("");
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Failed to update profile: " + (err?.message || "Unknown error"));
    } finally {
      setSavingProfile(false);
    }
  };

  const initials = (fullName || user?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto border border-border bg-background p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-wide">Account Profile</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update your public display name, email, password, and profile picture.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Avatar Picture Section */}
          <div className="flex items-center gap-4 border border-border/80 bg-surface/40 p-4">
            <div className="relative">
              <Avatar className="size-16 border border-border">
                <AvatarImage src={avatarUrl} alt={fullName || "User"} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
              </Avatar>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl("")}
                  className="absolute -top-1 -right-1 size-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90"
                  aria-label="Remove avatar"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Profile Photo
              </Label>
              <p className="text-[11px] text-muted-foreground">Upload a square PNG or JPG</p>
              <div className="pt-1">
                <input
                  type="file"
                  id="profile-avatar-input"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleAvatarUpload(f);
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={uploadingAvatar}
                  onClick={() => document.getElementById("profile-avatar-input")?.click()}
                  className="gap-1.5 text-xs uppercase tracking-wider"
                >
                  <Camera className="size-3.5" />
                  {uploadingAvatar ? "Uploading…" : "Choose Photo"}
                </Button>
              </div>
            </div>
          </div>

          {/* Full Name / Display Name */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-name" className="text-xs">
              Display Name
            </Label>
            <Input
              id="profile-name"
              placeholder="e.g. Nathan Vance"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-phone" className="text-xs">
              Phone Number (numbers only)
            </Label>
            <Input
              id="profile-phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="08012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              className="text-sm font-mono"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-email" className="text-xs">
              Email Address
            </Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Password Section */}
          <div className="border-t border-border pt-3 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-foreground">
                Change Password (Optional)
              </p>
              <p className="text-[11px] text-muted-foreground">Leave blank to keep your current password</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-password" className="text-xs">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="profile-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {password && (
              <div className="space-y-1.5">
                <Label htmlFor="profile-confirm-password" className="text-xs">
                  Confirm New Password
                </Label>
                <Input
                  id="profile-confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-sm"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs uppercase tracking-wider"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={savingProfile || uploadingAvatar}
              className="text-xs uppercase tracking-wider"
            >
              {savingProfile ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
