import { navigationItems, QUALTI_CONTACT_EMAIL } from '@/lib/marketing-content';

import { BrandMark } from '@/components/brand-mark';

export function SiteFooter() {
  return (
    <footer className="border-t border-marketing-line bg-marketing-bg px-5 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_auto_auto]">
        <div>
          <BrandMark compact className="text-marketing-ink" />
          <p className="mt-4 max-w-md text-sm leading-7 text-marketing-muted">
            AI-powered quality control for furniture inspections — field audits, defect logging and
            buyer-ready reports in one place.
          </p>
          <p className="mt-6 text-sm text-marketing-muted">
            &copy; {new Date().getFullYear()} Qualti.io
          </p>
        </div>

        <nav aria-label="Footer product links">
          <h2 className="font-heading text-sm font-semibold text-marketing-ink">Explore</h2>
          <ul className="mt-3 space-y-2.5">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-marketing-muted transition-colors hover:text-marketing-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {QUALTI_CONTACT_EMAIL ? (
          <nav aria-label="Footer contact">
            <h2 className="font-heading text-sm font-semibold text-marketing-ink">Contact</h2>
            <ul className="mt-3 space-y-2.5">
              <li>
                <a
                  href={`mailto:${QUALTI_CONTACT_EMAIL}`}
                  className="text-sm text-marketing-muted transition-colors hover:text-marketing-ink"
                >
                  {QUALTI_CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href="#waitlist"
                  className="text-sm text-marketing-muted transition-colors hover:text-marketing-ink"
                >
                  Join the waitlist
                </a>
              </li>
            </ul>
          </nav>
        ) : null}
      </div>
    </footer>
  );
}
