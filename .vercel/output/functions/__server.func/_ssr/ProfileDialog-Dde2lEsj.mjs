import { r as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime, d as DialogContent$1, f as DialogDescription$1, h as DialogTitle$1, l as Dialog$1, m as DialogPortal$1, p as DialogOverlay$1, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-cHXlBU3y.mjs";
import { t as supabase } from "./client-BpGEELM-.mjs";
import { n as useAuth } from "./useAuth-DAQ2dthM.mjs";
import { D as Camera, g as EyeOff, h as Eye, t as X } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/radix-ui__react-avatar.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProfileDialog-Dde2lEsj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function ProfileDialog({ open, onOpenChange }) {
	const { user } = useAuth();
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [avatarUrl, setAvatarUrl] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [savingProfile, setSavingProfile] = (0, import_react.useState)(false);
	const [uploadingAvatar, setUploadingAvatar] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user && open) {
			setFullName(user.user_metadata?.["full_name"] || "");
			setPhone(user.user_metadata?.["phone"] || "");
			setEmail(user.email || "");
			setAvatarUrl(user.user_metadata?.["avatar_url"] || "");
			setPassword("");
			setConfirmPassword("");
		}
	}, [user, open]);
	const handleAvatarUpload = async (file) => {
		if (!user) return;
		setUploadingAvatar(true);
		try {
			const ext = file.name.split(".").pop() || "jpg";
			const fileName = `avatar_${user.id}_${Date.now()}.${ext}`;
			const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file, { upsert: true });
			if (uploadError) throw uploadError;
			const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
			setAvatarUrl(publicUrlData.publicUrl);
			toast.success("Avatar image uploaded");
		} catch (err) {
			toast.error("Avatar upload failed: " + (err?.message || "Unknown error"));
		} finally {
			setUploadingAvatar(false);
		}
	};
	const handleSave = async (e) => {
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
			const updates = { data: {
				full_name: fullName.trim(),
				phone: phone.trim(),
				avatar_url: avatarUrl.trim()
			} };
			if (email.trim() && email.trim() !== user.email) updates.email = email.trim();
			if (password) updates.password = password;
			const { error } = await supabase.auth.updateUser(updates);
			if (error) throw error;
			if (updates.email && updates.email !== user.email) toast.success("Profile updated! Confirmation email sent to your new address.");
			else toast.success("Profile updated successfully");
			setPassword("");
			setConfirmPassword("");
			onOpenChange(false);
		} catch (err) {
			toast.error("Failed to update profile: " + (err?.message || "Unknown error"));
		} finally {
			setSavingProfile(false);
		}
	};
	const initials = (fullName || user?.email || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto border border-border bg-background p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-xl font-bold uppercase tracking-wide",
				children: "Account Profile"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
				className: "text-xs text-muted-foreground",
				children: "Update your public display name, email, password, and profile picture."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSave,
				className: "mt-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 border border-border/80 bg-surface/40 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
								className: "size-16 border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
									src: avatarUrl,
									alt: fullName || "User",
									className: "object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "bg-primary/10 text-primary font-bold",
									children: initials
								})]
							}), avatarUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAvatarUrl(""),
								className: "absolute -top-1 -right-1 size-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90",
								"aria-label": "Remove avatar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold uppercase tracking-wider text-foreground",
									children: "Profile Photo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Upload a square PNG or JPG"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										id: "profile-avatar-input",
										accept: "image/*",
										className: "hidden",
										onChange: (e) => {
											const f = e.target.files?.[0];
											if (f) handleAvatarUpload(f);
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: "outline",
										disabled: uploadingAvatar,
										onClick: () => document.getElementById("profile-avatar-input")?.click(),
										className: "gap-1.5 text-xs uppercase tracking-wider",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-3.5" }), uploadingAvatar ? "Uploading…" : "Choose Photo"]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "profile-name",
							className: "text-xs",
							children: "Display Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "profile-name",
							placeholder: "e.g. Nathan Vance",
							value: fullName,
							onChange: (e) => setFullName(e.target.value),
							className: "text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "profile-phone",
							className: "text-xs",
							children: "Phone Number (numbers only)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "profile-phone",
							type: "tel",
							inputMode: "numeric",
							pattern: "[0-9]*",
							placeholder: "08012345678",
							value: phone,
							onChange: (e) => setPhone(e.target.value.replace(/[^0-9]/g, "")),
							className: "text-sm font-mono"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "profile-email",
							className: "text-xs",
							children: "Email Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "profile-email",
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border pt-3 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wider font-semibold text-foreground",
								children: "Change Password (Optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Leave blank to keep your current password"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "profile-password",
									className: "text-xs",
									children: "New Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "profile-password",
										type: showPassword ? "text" : "password",
										placeholder: "At least 6 characters",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										className: "pr-10 text-sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowPassword((v) => !v),
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
										"aria-label": showPassword ? "Hide password" : "Show password",
										children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
									})]
								})]
							}),
							password && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "profile-confirm-password",
									className: "text-xs",
									children: "Confirm New Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "profile-confirm-password",
									type: showPassword ? "text" : "password",
									placeholder: "Re-type password",
									value: confirmPassword,
									onChange: (e) => setConfirmPassword(e.target.value),
									className: "text-sm"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-3 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							className: "text-xs uppercase tracking-wider",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: savingProfile || uploadingAvatar,
							className: "text-xs uppercase tracking-wider",
							children: savingProfile ? "Saving…" : "Save Changes"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { DialogContent as a, DialogTitle as c, Dialog as i, ProfileDialog as l, AvatarFallback as n, DialogDescription as o, AvatarImage as r, DialogHeader as s, Avatar as t };
