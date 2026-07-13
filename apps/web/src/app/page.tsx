import { DesignPartnerSection } from '@/components/marketing/design-partner-section';
import { FaqSection } from '@/components/marketing/faq-section';
import { FinalCta } from '@/components/marketing/final-cta';
import { HeroSection } from '@/components/marketing/hero-section';
import { InspectionCoverage } from '@/components/marketing/inspection-coverage';
import { OutcomesSection } from '@/components/marketing/outcomes-section';
import { PainSection } from '@/components/marketing/pain-section';
import { ProductPreviewSection } from '@/components/marketing/product-preview-section';
import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { WorkflowSection } from '@/components/marketing/workflow-section';
import { structuredData } from '@/lib/marketing-content';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-marketing-stage">
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <PainSection />
        <WorkflowSection />
        <InspectionCoverage />
        <ProductPreviewSection />
        <OutcomesSection />
        <DesignPartnerSection />
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
