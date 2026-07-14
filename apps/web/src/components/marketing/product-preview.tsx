'use client';

import {
  AlertTriangle,
  ClipboardList,
  FileText,
  Filter,
  History,
  ImagePlus,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { useId, useState } from 'react';

import { cn } from '@/lib/utils';

const views = [
  {
    id: 'inspector',
    label: 'Inspector view',
    title: 'Capture what happened on the factory floor.',
    points: [
      'Assigned inspection',
      'Mobile checklist',
      'Measurement entry',
      'AI photo tagging',
      'Defect severity',
      'Draft saving',
    ],
  },
  {
    id: 'manager',
    label: 'Quality manager view',
    title: 'Decide what can ship before the batch leaves.',
    points: [
      'Batch result',
      'Defect summary',
      'Open corrective actions',
      'Factory filters',
      'Report generation',
      'Approval history',
    ],
  },
] as const;

type ViewId = (typeof views)[number]['id'];

export function ProductPreview() {
  const [activeView, setActiveView] = useState<ViewId>('inspector');
  const baseId = useId();
  const active = views.find((view) => view.id === activeView) ?? views[0];

  return (
    <div className="rounded-xl border border-marketing-line bg-marketing-panel p-4 sm:p-6">
      <div
        role="tablist"
        aria-label="Product preview views"
        className="grid grid-cols-2 gap-1 rounded-md border border-marketing-line bg-marketing-bg p-1"
      >
        {views.map((view) => {
          const selected = activeView === view.id;
          return (
            <button
              key={view.id}
              id={`${baseId}-${view.id}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-${view.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveView(view.id)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                  event.preventDefault();
                  setActiveView(activeView === 'inspector' ? 'manager' : 'inspector');
                }
              }}
              className={cn(
                'relative z-10 h-11 cursor-pointer rounded px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marketing-primary',
                selected
                  ? 'bg-white text-marketing-ink shadow-sm'
                  : 'text-marketing-muted hover:bg-white/60 hover:text-marketing-ink',
              )}
            >
              {view.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-${active.id}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${active.id}-tab`}
        className="mt-6 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]"
      >
        <div className="rounded-lg border border-marketing-line bg-marketing-bg p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-marketing-primary">
            {active.label}
          </p>
          <h3 className="mt-2 font-heading text-xl font-semibold tracking-tight text-marketing-ink sm:text-2xl">
            {active.title}
          </h3>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {active.points.map((point) => (
              <li
                key={point}
                className="border-l-2 border-marketing-primary/40 py-2 pl-3 text-[15px] text-marketing-ink"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>

        {activeView === 'inspector' ? <InspectorPanel /> : <ManagerPanel />}
      </div>
    </div>
  );
}

function InspectorPanel() {
  return (
    <div className="rounded-lg border border-marketing-line bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 border-b border-marketing-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-marketing-muted">Assigned inspection</p>
          <p className="font-semibold text-marketing-ink">Mango Wood Dining Chair</p>
          <p className="mt-1 text-sm text-marketing-muted">PO-24091 · Gurugram Factory</p>
        </div>
        <span className="w-fit rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800">
          Draft saving
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <PreviewRow
          icon={ClipboardList}
          label="Mobile checklist"
          value="Workmanship, stability, packaging"
        />
        <PreviewRow
          icon={SlidersHorizontal}
          label="Measurement entry"
          value="Seat height: 466 mm vs 460 ± 3 mm"
        />
        <PreviewRow icon={ImagePlus} label="Evidence photos" value="3 photos attached to defect" />
        <PreviewRow
          icon={Sparkles}
          label="AI assist"
          value="Tagged: loose joint · suggested Major"
        />
        <PreviewRow
          icon={AlertTriangle}
          label="Defect severity"
          value="Major: loose rear-left joint"
        />
      </div>

      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
        <p className="text-sm font-semibold text-amber-950">Open defect note</p>
        <p className="mt-1 text-sm leading-6 text-amber-950">
          Carton corner protection missing on sampled cartons. Photo and quantity stay on the same
          checklist item.
        </p>
      </div>
    </div>
  );
}

function ManagerPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
      <div className="rounded-lg border border-marketing-line bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 border-b border-marketing-line pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-marketing-muted">Batch result</p>
            <p className="font-semibold text-marketing-ink">Pending rework before dispatch</p>
          </div>
          <span className="w-fit rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
            4 open actions
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <PreviewRow
            icon={Filter}
            label="Factory / product"
            value="Gurugram Factory · PO-24091"
          />
          <PreviewRow
            icon={ClipboardList}
            label="Defect summary"
            value="1 critical · 3 major · 5 minor"
          />
          <PreviewRow
            icon={FileText}
            label="Report ready"
            value="Measurements, photos and status"
          />
          <PreviewRow
            icon={History}
            label="Approval history"
            value="Inspector submitted · manager returned"
          />
        </div>
      </div>

      <div className="rounded-lg border border-marketing-line bg-marketing-bg p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-marketing-primary">
          Report preview
        </p>
        <p className="mt-2 text-base font-semibold text-marketing-ink">Final inspection summary</p>
        <div className="mt-4 space-y-2 text-sm">
          {[
            ['Result', 'Pending rework'],
            ['Major defects', 'Loose rear-left joint'],
            ['Packaging', 'Corner protection missing'],
            ['Assignee', 'Production Team A'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-3 border-b border-marketing-line pb-2 last:border-b-0"
            >
              <span className="text-marketing-muted">{label}</span>
              <span className="text-right font-medium text-marketing-ink">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md bg-marketing-bg p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-marketing-primary" aria-hidden={true} />
      <div>
        <p className="text-sm font-semibold text-marketing-ink">{label}</p>
        <p className="mt-1 text-sm text-marketing-muted">{value}</p>
      </div>
    </div>
  );
}
