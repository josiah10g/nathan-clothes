import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-display text-xl tracking-brand">NATHAN&apos;S</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Heavyweight monochrome streetwear, cut oversized and made in limited runs. 100% cotton,
            350&ndash;400 GSM.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/shop" className="hover:underline">
                Shop all
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:underline">
                Your orders
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Details</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Free shipping over $150</li>
            <li>30-day returns</li>
            <li>Oversized fit, 100% cotton</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        &copy; {new Date().getFullYear()} Nathan&apos;s Clothes
      </div>
    </footer>
  );
}
