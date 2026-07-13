import {
  BadgeCheck,
  Boxes,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Gauge,
  Hammer,
  ListChecks,
  PackageCheck,
  Ruler,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://qualti.io';
export const QUALTI_CONTACT_EMAIL = 'himanshu@qualti.io';

export const navigationItems = [
  { label: 'Product', href: '#product' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Coverage', href: '#features' },
  { label: 'Partners', href: '#design-partner' },
  { label: 'FAQ', href: '#faq' },
] as const;

export const currentWorkflow = [
  'Paper checklist',
  'Photos on WhatsApp',
  'Measurements in Excel',
  'Rework through phone calls',
  'PDF created manually',
] as const;

export const painConsequences = [
  'Missing inspection evidence',
  'Inconsistent buyer reports',
  'Slow rework follow-up',
  'Repeated defects across batches',
  'No central dispatch-approval record',
] as const;

export const workflowSteps = [
  {
    title: 'Prepare the inspection',
    body: 'Select the buyer, purchase order, product, factory, inspection type and checklist.',
  },
  {
    title: 'Inspect on the factory floor',
    body: 'Record dimensions, material checks, workmanship, stability, function and packaging.',
  },
  {
    title: 'Capture defects with evidence',
    body: 'Add photographs, notes, affected quantities and critical, major or minor severity.',
  },
  {
    title: 'Assign and verify rework',
    body: 'Send corrective actions to production teams and collect corrected evidence.',
  },
  {
    title: 'Approve the batch',
    body: 'Mark it as pass, conditional pass, fail or pending rework with a complete audit trail.',
  },
  {
    title: 'Generate the report',
    body: 'Produce a consistent buyer-ready report with measurements, defects, evidence and approval status.',
  },
] as const;

export const inspectionCoverage = [
  {
    title: 'Order and product verification',
    icon: ClipboardCheck,
    items: [
      'Buyer and purchase order',
      'Product code and approved sample',
      'Quantity and selected sample',
      'Material and finish specification',
    ],
  },
  {
    title: 'Dimensions and tolerances',
    icon: Ruler,
    items: [
      'Actual versus required measurements',
      'Configurable tolerances',
      'Pass/fail evaluation',
      'Measurement evidence',
    ],
  },
  {
    title: 'Workmanship and appearance',
    icon: Gauge,
    items: [
      'Scratches and dents',
      'Cracks and chips',
      'Colour or finish variation',
      'Glue marks, gaps and alignment',
    ],
  },
  {
    title: 'Construction and functionality',
    icon: Hammer,
    items: [
      'Joint strength',
      'Hardware and assembly',
      'Drawer and door movement',
      'Stability, wobble and load checks',
    ],
  },
  {
    title: 'Packaging and dispatch',
    icon: PackageCheck,
    items: [
      'Product protection',
      'Carton condition',
      'Labels and barcodes',
      'Hardware packets and instructions',
    ],
  },
  {
    title: 'Defects and corrective actions',
    icon: Wrench,
    items: [
      'Critical, major and minor severity',
      'Responsibility and due dates',
      'Rework evidence',
      'Approval and reopening history',
    ],
  },
] as const;

export const outcomes = [
  'Create consistent inspection reports faster',
  'Keep photographs attached to the correct defect',
  'Make open rework visible before dispatch',
  'Standardise QC across products and factories',
  'Trace who inspected, corrected and approved a batch',
  'Identify recurring defects over time',
] as const;

export const partnerReceives = [
  'One month of complimentary Qualti.io access when the pilot-ready version becomes available',
  'Early access to furniture-specific inspection workflows',
  'Direct influence over the initial product',
  'Priority consideration for the first pilot group',
] as const;

export const qualtiNeeds = [
  'A 20–30 minute online or offline conversation',
  'A walkthrough of the current QC process',
  'Optional anonymised checklist or report',
  'Feedback on early product concepts',
  'Optional future pilot participation',
] as const;

export const faqs = [
  {
    question: 'Is Qualti.io only for furniture manufacturers?',
    answer:
      'The initial product is being designed specifically around furniture production, final inspection, rework and dispatch approval. The underlying platform may later support other manufacturing workflows.',
  },
  {
    question: 'Can we use our existing inspection checklist?',
    answer:
      'Yes. The pilot process begins with your existing Excel, paper or PDF checklist and adapts it into a structured digital workflow.',
  },
  {
    question: 'Does it support photographs and defect evidence?',
    answer:
      'The product is being designed to attach photographs, notes, affected quantities and severity directly to each defect.',
  },
  {
    question: 'Can different buyers use different checklists and reports?',
    answer:
      'Buyer-specific templates, requirements and report formats are part of the planned product direction.',
  },
  {
    question: 'Will inspectors be able to use it on a phone?',
    answer:
      'The inspection experience is being designed mobile-first for factory-floor usage. Full offline support should be confirmed during pilot development.',
  },
  {
    question: 'Are you selling the software already?',
    answer:
      'Qualti.io is currently speaking with design partners and preparing initial pilots. Interested companies can schedule a short QC workflow conversation.',
  },
  {
    question: 'What happens to the documents we share?',
    answer:
      'Documents should be used only to understand and prototype the requested workflow. Companies can anonymise sensitive details before sharing.',
  },
] as const;

export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Qualti.io',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    description:
      'Furniture quality inspection and corrective-action software for factory and pre-dispatch workflows.',
    url: SITE_URL,
    image: `${SITE_URL}/brand/qualti-icon.png`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Qualti.io',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/qualti-icon.png`,
  },
] as const;

export const productSignals = [
  { label: 'Inspection type', value: 'Final inspection', icon: Factory },
  { label: 'Evidence', value: 'Photos and notes', icon: FileCheck2 },
  { label: 'Decision', value: 'Pending rework', icon: ShieldCheck },
  { label: 'Report', value: 'Buyer-ready', icon: BadgeCheck },
  { label: 'Scope', value: 'Furniture QC', icon: Boxes },
  { label: 'Checklist', value: 'Mobile-first', icon: ListChecks },
] as const;
