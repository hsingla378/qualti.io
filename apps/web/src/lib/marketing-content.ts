import {
  BadgeCheck,
  Boxes,
  Factory,
  FileCheck2,
  ListChecks,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://qualti.io';
export const QUALTI_CONTACT_EMAIL = 'himanshu@qualti.io';

export const navigationItems = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Product', href: '#product-pillars' },
  { label: 'Outcomes', href: '#outcomes' },
  { label: 'Waitlist', href: '#waitlist' },
  { label: 'FAQ', href: '#faq' },
] as const;

/** Resume-style "Technical Skills" → product capabilities */
export const capabilityGroups = [
  {
    label: 'AI assistance',
    items: [
      'Defect photo tagging',
      'Severity suggestions',
      'Recurring-issue signals',
      'Report draft assist',
    ],
  },
  {
    label: 'Field inspections',
    items: [
      'Mobile checklists',
      'Measurements & tolerances',
      'Photo evidence',
      'Offline-ready capture',
    ],
  },
  {
    label: 'Defect & rework',
    items: [
      'Critical / major / minor',
      'Corrective actions',
      'Rework verification',
      'Approval history',
    ],
  },
  {
    label: 'Reporting',
    items: [
      'Buyer-ready PDFs',
      'Dispatch decisions',
      'Batch audit trail',
      'Export & share',
    ],
  },
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
    body: 'Select the buyer, purchase order, product, factory, inspection type and checklist — AI can prefill common templates from past jobs.',
  },
  {
    title: 'Inspect on the factory floor',
    body: 'Record dimensions, material checks, workmanship, stability, function and packaging on a mobile-first checklist.',
  },
  {
    title: 'Capture defects with evidence',
    body: 'Add photographs, notes, affected quantities and severity. AI helps tag defects and suggest severity from similar past findings.',
  },
  {
    title: 'Assign and verify rework',
    body: 'Send corrective actions to production teams and collect corrected evidence before the batch moves.',
  },
  {
    title: 'Approve the batch',
    body: 'Mark it as pass, conditional pass, fail or pending rework with a complete audit trail.',
  },
  {
    title: 'Generate the report',
    body: 'Produce a consistent buyer-ready report with measurements, defects, evidence and approval status — drafted faster with AI assist.',
  },
] as const;

/** Resume-style "Projects" → three product pillars */
export const productPillars = [
  {
    title: 'Field audits',
    body: 'Mobile-first inspections on the factory floor — checklists, measurements, photos and pass/fail decisions where the work happens.',
    items: [
      'Buyer, PO and product verification',
      'Dimensions vs tolerances',
      'Workmanship and construction checks',
      'Packaging and dispatch readiness',
    ],
  },
  {
    title: 'Defect logging',
    body: 'Every defect stays attached to evidence, severity and ownership — so recurring issues stop disappearing into chat threads.',
    items: [
      'Photo evidence per defect',
      'Critical, major and minor severity',
      'AI tagging and severity suggestions',
      'Rework assignment and verification',
    ],
  },
  {
    title: 'Inspection reports',
    body: 'Buyer-ready reports with measurements, defects, evidence and the dispatch decision — one record instead of a manual PDF scramble.',
    items: [
      'Consistent report templates',
      'AI-assisted draft summaries',
      'Dispatch approval status',
      'Shareable audit trail',
    ],
  },
] as const;

/** Resume-style "Achievements" → product outcomes */
export const outcomes = [
  'Run field audits without losing evidence in WhatsApp or Excel',
  'Log defects with photos, severity and ownership in one place',
  'Generate buyer-ready inspection reports faster with AI assist',
  'Make open rework visible before dispatch',
  'Standardise QC across products and factories',
  'Spot recurring defects earlier across batches',
] as const;

export const waitlistBenefits = [
  'Early access when Qualti.io opens to the first factories',
  'Priority onboarding for furniture QC teams on the list',
  'Product updates as field audits, defect logging and reports ship',
  'A direct line to shape the first release with real floor feedback',
] as const;

export const faqs = [
  {
    question: 'Is Qualti.io only for furniture manufacturers?',
    answer:
      'The initial product is designed specifically around furniture production, final inspection, rework and dispatch approval. The underlying platform may later support other manufacturing workflows.',
  },
  {
    question: 'How does AI fit into the inspection workflow?',
    answer:
      'AI assists inspectors and managers — tagging defects from photos, suggesting severity from similar past findings, surfacing recurring issues, and helping draft clearer report summaries. Humans stay in control of pass/fail and dispatch decisions.',
  },
  {
    question: 'Can we use our existing inspection checklist?',
    answer:
      'Yes. When you join early access, we start from your existing Excel, paper or PDF checklist and adapt it into a structured digital workflow.',
  },
  {
    question: 'Does it support photographs and defect evidence?',
    answer:
      'Yes. Photographs, notes, affected quantities and severity attach directly to each defect — and AI can help classify them faster.',
  },
  {
    question: 'Will inspectors be able to use it on a phone?',
    answer:
      'The field-audit experience is mobile-first for factory-floor usage. Full offline support will be confirmed as early access opens.',
  },
  {
    question: 'Is Qualti.io available to buy today?',
    answer:
      'Not yet. Qualti.io is gathering early interest on a waitlist. Join the list to get notified when early access opens for the first furniture QC teams.',
  },
  {
    question: 'What happens after I join the waitlist?',
    answer:
      'We confirm your spot, send occasional product updates, and reach out when a slot opens for your company type. No commitment required to join.',
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
      'AI-powered furniture quality inspection software for field audits, defect logging and buyer-ready inspection reports.',
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
  { label: 'AI assist', value: 'Defect tagging', icon: Sparkles },
  { label: 'Inspection', value: 'Field audits', icon: Factory },
  { label: 'Evidence', value: 'Photos and notes', icon: FileCheck2 },
  { label: 'Decision', value: 'Pending rework', icon: ShieldCheck },
  { label: 'Report', value: 'Buyer-ready', icon: BadgeCheck },
  { label: 'Scope', value: 'Furniture QC', icon: Boxes },
  { label: 'Checklist', value: 'Mobile-first', icon: ListChecks },
] as const;
