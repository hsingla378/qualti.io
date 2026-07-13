'use client';

import {
  AlertTriangle,
  ClipboardList,
  FileText,
  Filter,
  History,
  ImagePlus,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useId, useState } from 'react';

import { cn } from '@/lib/utils';

const views = [
  {
    id: 'inspector',
    label: 'Inspector view',
    points: [
      'Assigned inspection',
      'Mobile checklist',
      'Measurement entry',
      'Add-photo action',
      'Defect severity',
      'Draft-saving state',
    ],
  },
  {
    id: 'manager',
    label: 'Quality manager view',
    points: [
      'Batch result',
      'Defect summary',
      'Open corrective actions',
      'Factory/product filters',
      'Report-generation action',
      'Approval history',
      'Small report preview',
    ],
  },
] as const;

type ViewId = (typeof views)[number]['id'];

export function ProductPreview() {
  const [activeView, setActiveView] = useState<ViewId>('inspector');
  const baseId = useId();
  const reduceMotion = useReducedMotion();
  const active = views.find((view) => view.id === activeView) ?? views[0];

  function moveTab(direction: 1 | -1) {
    const activeIndex = views.findIndex((view) => view.id === activeView);
    const nextIndex = (activeIndex + direction + views.length) % views.length;
    setActiveView(views[nextIndex]?.id ?? 'inspector');
  }

  return (
    <div className="rounded-xl border border-marketing-line bg-marketing-panel/90 p-4 backdrop-blur-sm sm:p-6">
      <div
        role="tablist"
        aria-label="Product preview views"
        className="grid rounded-md border border-marketing-line bg-marketing-bg p-1 sm:inline-grid sm:grid-cols-2"
      >
        {views.map((view) => (
          <button
            key={view.id}
            id={`${baseId}-${view.id}-tab`}
            type="button"
            role="tab"
            aria-selected={activeView === view.id}
            aria-controls={`${baseId}-${view.id}-panel`}
            tabIndex={activeView === view.id ? 0 : -1}
            onClick={() => setActiveView(view.id)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                moveTab(1);
              }
              if (event.key === 'ArrowLeft') {
                event.preventDefault();
                moveTab(-1);
              }
            }}
            className={cn(
              'h-11 rounded px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marketing-primary',
              activeView === view.id
                ? 'bg-white text-marketing-ink shadow-sm'
                : 'text-marketing-muted hover:text-marketing-ink',
            )}
          >
            {view.label}
          </button>
        ))}
      </div>

      <motion.div
        key={active.id}
        id={`${baseId}-${active.id}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${active.id}-tab`}
        className="mt-6 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-lg border border-marketing-line bg-marketing-bg p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-marketing-primary">
            {active.label}
          </p>
          <h3 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-marketing-ink">
            {activeView === 'inspector'
              ? 'Capture what happened on the factory floor.'
              : 'Decide what can ship before the batch leaves.'}
          </h3>
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {active.points.map((point) => (
              <div
                key={point}
                className="border-l-2 border-marketing-primary/30 py-2 pl-3 text-[15px] text-marketing-ink"
              >
                {point}
              </div>
            ))}
          </div>
        </div>

        {activeView === 'inspector' ? <InspectorPanel /> : <ManagerPanel />}
      </motion.div>
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
        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800">
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
          value="Seat height: 466 mm against 460 ± 3 mm"
        />
        <PreviewRow icon={ImagePlus} label="Add-photo action" value="3 evidence photos attached" />
        <PreviewRow
          icon={AlertTriangle}
          label="Defect severity"
          value="Major: loose rear-left joint"
        />
      </div>
      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
        <p className="text-sm font-semibold text-amber-950">Open defect note</p>
        <p className="mt-1 text-sm leading-6 text-amber-950">
          Carton corner protection missing on sampled cartons. Photograph and affected quantity are
          attached to the same checklist item.
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
          <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
            4 open actions
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <PreviewRow
            icon={Filter}
            label="Factory/product filters"
            value="Gurugram Factory, PO-24091"
          />
          <PreviewRow
            icon={ClipboardList}
            label="Defect summary"
            value="1 critical, 3 major, 5 minor"
          />
          <PreviewRow
            icon={FileText}
            label="Report-generation action"
            value="Measurements, photos and status ready"
          />
          <PreviewRow
            icon={History}
            label="Approval history"
            value="Inspector submitted, manager returned"
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
            ['Packaging', 'Carton corner protection missing'],
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
    <div className="flex items-start gap-3 rounded-md bg-marketing-bg p-3 transition-colors duration-200 hover:bg-white">
      <Icon className="mt-0.5 size-4 shrink-0 text-marketing-primary" aria-hidden={true} />
      <div>
        <p className="text-sm font-semibold text-marketing-ink">{label}</p>
        <p className="mt-1 text-sm text-marketing-muted">{value}</p>
      </div>
    </div>
  );
}
