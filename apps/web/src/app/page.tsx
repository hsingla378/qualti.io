import { CapabilitiesSection } from '@/components/marketing/capabilities-section';
import { FaqSection } from '@/components/marketing/faq-section';
import { FinalCta } from '@/components/marketing/final-cta';
import { HeroSection } from '@/components/marketing/hero-section';
import { OutcomesSection } from '@/components/marketing/outcomes-section';
import { ProductPillarsSection } from '@/components/marketing/product-pillars-section';
import { ProductPreviewSection } from '@/components/marketing/product-preview-section';
import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { WaitlistSection } from '@/components/marketing/waitlist-section';
import { WorkflowSection } from '@/components/marketing/workflow-section';
import { structuredData } from '@/lib/marketing-content';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-marketing-stage">
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <CapabilitiesSection />
        <WorkflowSection />
        <ProductPillarsSection />
        <ProductPreviewSection />
        <OutcomesSection />
        <WaitlistSection />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
    </div>
  );
}
