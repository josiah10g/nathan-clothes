import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      richColors={false}
      closeButton={false}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-900 group-[.toaster]:border group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:font-sans group-[.toaster]:text-[13px] group-[.toaster]:font-medium group-[.toaster]:px-4 group-[.toaster]:py-3.5",
          description: "group-[.toast]:text-zinc-500 group-[.toast]:font-sans group-[.toast]:text-xs",
          actionButton: "group-[.toast]:bg-zinc-900 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-700",
          success: "!bg-white !text-zinc-900 !border-zinc-200",
          error: "!bg-white !text-zinc-900 !border-red-200",
          warning: "!bg-white !text-zinc-900 !border-amber-200",
          info: "!bg-white !text-zinc-900 !border-zinc-200",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
