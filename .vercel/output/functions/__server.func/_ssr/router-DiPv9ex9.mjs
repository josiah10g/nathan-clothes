import { r as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BgDHFF0o.mjs";
import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, k as redirect, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CM2SnB7T.mjs";
import { n as useAuth, t as AuthProvider } from "./useAuth-t4K7Z9WU.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { d as Menu, n as User, o as ShoppingBag, t as X } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$11 } from "./auth-BiTRuWDL.mjs";
import { n as useCart, t as CartProvider } from "./useCart-Dzk166AX.mjs";
import { t as Route$12 } from "./product._slug-r0UnF_Gz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DiPv9ex9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DdZGhJrG.css";
var NAV = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/shop",
		label: "Shop"
	},
	{
		to: "/about",
		label: "About"
	},
	{
		to: "/contact",
		label: "Contact"
	}
];
function Header() {
	const { count } = useCart();
	const { user, isAdmin, signOut } = useAuth();
	const router = useRouter();
	const [open, setOpen] = (0, import_react.useState)(false);
	const handleSignOut = async () => {
		await signOut();
		setOpen(false);
		router.navigate({
			to: "/",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "mr-2 inline-flex size-9 items-center justify-center text-foreground md:hidden",
					onClick: () => setOpen((v) => !v),
					"aria-label": open ? "Close menu" : "Open menu",
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-display text-lg tracking-brand sm:text-xl",
					children: "NATHAN'S CLOTHES"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-8 md:flex",
					children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: "text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground",
						children: item.label
					}, item.to)), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground",
						children: "Admin"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 sm:gap-2",
					children: [user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account",
						"aria-label": "Your account",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-5" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: handleSignOut,
						className: "hidden text-xs uppercase tracking-[0.2em] sm:inline-flex",
						children: "Sign out"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							search: {
								mode: "signin",
								redirect: void 0
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "text-xs uppercase tracking-[0.2em]",
								children: "Log in"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							search: {
								mode: "signup",
								redirect: void 0
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "default",
								className: "text-xs uppercase tracking-[0.2em]",
								children: "Sign up"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cart",
						"aria-label": "Cart",
						className: "relative",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: "flex items-center gap-1.5 px-2.5 text-xs uppercase tracking-[0.2em]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cart" }),
								count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground",
									children: count
								})
							]
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("border-t border-border md:hidden", open ? "block" : "hidden"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mx-auto flex max-w-7xl flex-col px-4 py-2",
				children: [
					NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						onClick: () => setOpen(false),
						className: "py-3 text-sm uppercase tracking-[0.2em] text-muted-foreground",
						children: item.label
					}, item.to)),
					isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						onClick: () => setOpen(false),
						className: "py-3 text-sm uppercase tracking-[0.2em] text-muted-foreground",
						children: "Admin"
					}),
					!user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1 border-t border-border pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							search: {
								mode: "signin",
								redirect: void 0
							},
							onClick: () => setOpen(false),
							className: "py-2.5 text-sm uppercase tracking-[0.2em] text-muted-foreground",
							children: "Log in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							search: {
								mode: "signup",
								redirect: void 0
							},
							onClick: () => setOpen(false),
							className: "py-2.5 text-sm uppercase tracking-[0.2em] text-foreground font-medium",
							children: "Sign up"
						})]
					}),
					user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSignOut,
						className: "py-3 text-left text-sm uppercase tracking-[0.2em] text-muted-foreground",
						children: "Sign out"
					})
				]
			})
		})]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-24 border-t border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-display text-xl tracking-brand",
					children: "NATHAN'S CLOTHES"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground",
					children: "Heavyweight monochrome streetwear, cut oversized and made in limited runs. 100% cotton, 350–400 GSM."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.25em] text-muted-foreground",
					children: "Explore"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							className: "hover:underline",
							children: "Shop all"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/about",
							className: "hover:underline",
							children: "About"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							className: "hover:underline",
							children: "Contact"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/account",
							className: "hover:underline",
							children: "Your orders"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.25em] text-muted-foreground",
					children: "Details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Free shipping over $150" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "30-day returns" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Oversized fit, 100% cotton" })
					]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border py-6 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" Nathan's Clothes"
			]
		})]
	});
}
function WhatsAppButton() {
	const url = `https://wa.me/2348000000000?text=${encodeURIComponent("Hello Nathan's Clothes! I would like to inquire about your products.")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		"aria-label": "Contact options",
		className: "fixed bottom-6 right-6 z-50 flex items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: url,
			target: "_blank",
			rel: "noopener noreferrer",
			"aria-label": "Chat with us on WhatsApp",
			className: "group relative flex items-center gap-2.5 rounded-sm border border-emerald-500/40 bg-zinc-950/95 px-4 py-2.5 text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-zinc-900 active:scale-[0.97] focus:outline-none focus:ring-1 focus:ring-emerald-400",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex size-5 items-center justify-center text-emerald-400 transition-transform group-hover:scale-105",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					width: "20",
					height: "20",
					stroke: "currentColor",
					strokeWidth: "2",
					fill: "none",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					className: "size-4.5 fill-emerald-500/20 text-emerald-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium uppercase tracking-[0.2em] text-zinc-200 group-hover:text-white",
				children: "Chat on WhatsApp"
			})]
		})
	});
}
function LoadingScreen() {
	const [visible, setVisible] = (0, import_react.useState)(true);
	const [fading, setFading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (sessionStorage.getItem("nc_initial_loaded")) {
			setVisible(false);
			return;
		}
		const fadeTimer = setTimeout(() => {
			setFading(true);
		}, 3600);
		const removeTimer = setTimeout(() => {
			setVisible(false);
			sessionStorage.setItem("nc_initial_loaded", "true");
		}, 4100);
		return () => {
			clearTimeout(fadeTimer);
			clearTimeout(removeTimer);
		};
	}, []);
	if (!visible) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": "true",
		className: `fixed inset-0 z-100 flex flex-col items-center justify-center bg-background transition-all duration-500 ease-out ${fading ? "pointer-events-none opacity-0 scale-105" : "opacity-100 scale-100"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex flex-col items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-10 -z-10 animate-pulse rounded-full bg-primary/10 blur-2xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-display text-2xl tracking-[0.4em] text-foreground sm:text-3xl animate-pulse",
					children: "NATHAN'S CLOTHES"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
					children: "Heavyweight Monochrome"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 h-0.5 w-36 overflow-hidden rounded-full bg-border/60",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full origin-left animate-loading-bar bg-foreground" })
				})
			]
		})
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$10 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Nathan's Clothing — Premium Dark Streetwear" },
			{
				name: "description",
				content: "Heavyweight monochrome streetwear in limited runs. Oversized hoodies, tees and joggers from Nathan's Clothing."
			},
			{
				property: "og:title",
				content: "Nathan's Clothing — Premium Dark Streetwear"
			},
			{
				property: "og:description",
				content: "Heavyweight monochrome streetwear in limited runs."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@300;400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$10.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CartProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingScreen, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-screen flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1 animate-page-enter",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppButton, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })
		] }) })
	});
}
var $$splitComponentImporter$9 = () => import("./routes-DUOyFl51.mjs");
var Route$9 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Nathan's Clothing — Premium Dark Streetwear" },
		{
			name: "description",
			content: "Limited-run heavyweight streetwear: oversized hoodies, tees and joggers in a strict monochrome palette. Shop the Nathan's Clothing collection."
		},
		{
			property: "og:title",
			content: "Nathan's Clothing — Premium Dark Streetwear"
		},
		{
			property: "og:description",
			content: "Limited-run heavyweight streetwear in a strict monochrome palette."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./route-Di7iQBCH.mjs");
var Route$8 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({
			to: "/auth",
			search: { redirect: location.href }
		});
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./about-CWvnnTlX.mjs");
var Route$7 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About — Nathan's Clothing" },
		{
			name: "description",
			content: "Nathan's Clothing makes heavyweight monochrome streetwear in limited runs — 100% cotton, oversized fit, hand-drawn graphics."
		},
		{
			property: "og:title",
			content: "About — Nathan's Clothing"
		},
		{
			property: "og:description",
			content: "Heavyweight monochrome streetwear, made in limited runs."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./account-BtBFN4fF.mjs");
var Route$6 = createFileRoute("/account")({
	head: () => ({ meta: [
		{ title: "Order Tracking & Account — Nathan's Clothes" },
		{
			name: "description",
			content: "Track your order by reference or sign in to view account history."
		},
		{
			property: "og:title",
			content: "Order Tracking & Account — Nathan's Clothes"
		},
		{
			property: "og:description",
			content: "Track your order by reference or sign in to view account history."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./cart-1oT3WA0c.mjs");
var Route$5 = createFileRoute("/cart")({
	head: () => ({ meta: [
		{ title: "Your Bag — Nathan's Clothing" },
		{
			name: "description",
			content: "Review the pieces in your bag before checking out."
		},
		{
			property: "og:title",
			content: "Your Bag — Nathan's Clothing"
		},
		{
			property: "og:description",
			content: "Review the pieces in your bag before checking out."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./checkout-aSFg_ULK.mjs");
var Route$4 = createFileRoute("/checkout")({
	head: () => ({ meta: [
		{ title: "Checkout & Bank Transfer — Nathan's Clothes" },
		{
			name: "description",
			content: "Complete your order with direct bank transfer payment."
		},
		{
			property: "og:title",
			content: "Checkout — Nathan's Clothes"
		},
		{
			property: "og:description",
			content: "Complete your order with direct bank transfer payment."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./contact-NdrsQNTu.mjs");
var Route$3 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact — Nathan's Clothing" },
		{
			name: "description",
			content: "Questions about sizing, an order or a collaboration? Send Nathan's Clothing a message and we'll reply within two business days."
		},
		{
			property: "og:title",
			content: "Contact — Nathan's Clothing"
		},
		{
			property: "og:description",
			content: "Send Nathan's Clothing a message."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./shop-DD32GlX_.mjs");
var Route$2 = createFileRoute("/shop")({
	head: () => ({ meta: [
		{ title: "Shop All — Nathan's Clothing" },
		{
			name: "description",
			content: "Browse every piece in the Nathan's Clothing collection: heavyweight hoodies, oversized tees and joggers in black, bone and washed grey."
		},
		{
			property: "og:title",
			content: "Shop All — Nathan's Clothing"
		},
		{
			property: "og:description",
			content: "Heavyweight hoodies, oversized tees and joggers in monochrome."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin-rVjUjWRL.mjs");
var Route$1 = createFileRoute("/_authenticated/admin")({
	head: () => ({ meta: [
		{ title: "Admin Management — Nathan's Clothes" },
		{
			name: "description",
			content: "Store management: verify bank transfers, products, and store settings."
		},
		{
			property: "og:title",
			content: "Admin Management — Nathan's Clothes"
		},
		{
			property: "og:description",
			content: "Store management panel for Nathan's Clothes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin-setup-D_AnKVmo.mjs");
var Route = createFileRoute("/_authenticated/admin-setup")({
	head: () => ({ meta: [
		{ title: "Owner Setup — Nathan's Clothing" },
		{
			name: "description",
			content: "One-time setup step to claim the store owner account."
		},
		{
			property: "og:title",
			content: "Owner Setup — Nathan's Clothing"
		},
		{
			property: "og:description",
			content: "One-time setup step to claim the store owner account."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$10
});
var AuthenticatedRouteRoute = Route$8.update({
	id: "/_authenticated",
	getParentRoute: () => Route$10
});
var AboutRoute = Route$7.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$10
});
var AccountRoute = Route$6.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$10
});
var AuthRoute = Route$11.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$10
});
var CartRoute = Route$5.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$10
});
var CheckoutRoute = Route$4.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$10
});
var ContactRoute = Route$3.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$10
});
var ShopRoute = Route$2.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$10
});
var AuthenticatedAdminRoute = Route$1.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminSetupRoute = Route.update({
	id: "/admin-setup",
	path: "/admin-setup",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ProductSlugRoute = Route$12.update({
	id: "/product/$slug",
	path: "/product/$slug",
	getParentRoute: () => Route$10
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute,
	AuthenticatedAdminSetupRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AboutRoute,
	AccountRoute,
	AuthRoute,
	CartRoute,
	CheckoutRoute,
	ContactRoute,
	ShopRoute,
	ProductSlugRoute
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
