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
        className="group relative flex items-center gap-2 rounded-full bg-black text-white px-4 py-2.5 shadow-2xl border border-white/10 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <span className="flex size-4 items-center justify-center text-white">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 text-white"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
          </svg>
        </span>
        <span className="text-xs font-medium text-white tracking-normal">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
}
