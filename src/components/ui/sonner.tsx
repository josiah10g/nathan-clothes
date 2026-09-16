import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      richColors
      closeButton
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-950 group-[.toaster]:text-zinc-100 group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-md group-[.toaster]:font-mono group-[.toaster]:text-xs",
          description: "group-[.toast]:text-zinc-400 group-[.toast]:font-sans",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: "!bg-red-950/90 !text-red-200 !border-red-800/60",
          success: "!bg-emerald-950/90 !text-emerald-200 !border-emerald-800/60",
          warning: "!bg-amber-950/90 !text-amber-200 !border-amber-800/60",
          info: "!bg-zinc-900 !text-zinc-200 !border-zinc-700",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
