export function WhatsAppButton() {
  const phone = "2348000000000"; // Can be replaced or configured
  const message = encodeURIComponent("Hello Nathan's Clothes! I would like to inquire about your products.");
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <aside
      aria-label="Contact options"
      className="fixed bottom-6 right-6 z-50 flex items-center"
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex items-center gap-2.5 rounded-sm border border-emerald-500/40 bg-zinc-950/95 px-4 py-2.5 text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-zinc-900 active:scale-[0.97] focus:outline-none focus:ring-1 focus:ring-emerald-400"
      >
        <span className="flex size-5 items-center justify-center text-emerald-400 transition-transform group-hover:scale-105">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4.5 fill-emerald-500/20 text-emerald-400"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
          </svg>
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-200 group-hover:text-white">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
}
