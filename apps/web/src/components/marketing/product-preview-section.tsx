import { ProductPreview } from './product-preview';
import { SectionContainer, SectionIntro } from './section-container';

export function ProductPreviewSection() {
  return (
    <SectionContainer className="marketing-atmosphere">
      <SectionIntro
        title="Inspect on the floor. Decide with the full record."
        align="center"
      >
        <p>
          Inspectors capture measurements and photos in the field. AI helps tag defects. Quality
          managers see open rework and the approval trail before dispatch.
        </p>
      </SectionIntro>
      <div className="mt-12">
        <ProductPreview />
      </div>
    </SectionContainer>
  );
}
