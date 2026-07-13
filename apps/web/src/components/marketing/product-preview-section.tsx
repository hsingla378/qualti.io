import { ProductPreview } from './product-preview';
import { Reveal } from './reveal';
import { SectionContainer, SectionIntro } from './section-container';

export function ProductPreviewSection() {
  return (
    <SectionContainer className="marketing-atmosphere">
      <SectionIntro
        title="Built for the factory floor and the manager who decides what ships."
        align="center"
      >
        <p>
          Inspectors capture measurements and photos where the work happens. Quality managers see
          defects, open rework and the approval trail before dispatch.
        </p>
      </SectionIntro>
      <Reveal className="mt-12" delay={0.06} variant="scale">
        <ProductPreview />
      </Reveal>
    </SectionContainer>
  );
}
