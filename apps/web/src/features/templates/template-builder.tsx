'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm, useWatch, type Control, type FieldErrors } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  emptyTemplateItem,
  emptyTemplateSection,
  emptyTemplateValues,
  templateFormSchema,
  toTemplateWriteInput,
  type TemplateFormValues,
} from './schema';
import { checklistIsPublishable, type TemplateItemType, type TemplateWriteInput } from './api';

const itemTypeOptions: Array<{ value: TemplateItemType; label: string }> = [
  { value: 'PASS_FAIL', label: 'Pass / Fail' },
  { value: 'TEXT', label: 'Text' },
  { value: 'NUMERIC', label: 'Numeric measurement' },
];

const fieldClassName =
  'flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50';

type TemplateBuilderProps = {
  initialValues?: TemplateFormValues;
  readOnly?: boolean;
  isSubmitting?: boolean;
  locked?: boolean;
  submitLabel: string;
  onSubmit: (values: TemplateWriteInput) => void;
  extraActions?: React.ReactNode;
  publishAction?: {
    label: string;
    isPending: boolean;
    onRequest: (input: TemplateWriteInput) => void;
  };
  error?: Error | null;
};

export function TemplateBuilder({
  initialValues,
  readOnly = false,
  isSubmitting = false,
  locked = false,
  submitLabel,
  onSubmit,
  extraActions,
  publishAction,
  error,
}: TemplateBuilderProps) {
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: initialValues ?? emptyTemplateValues,
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'sections',
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [form, initialValues]);

  const publishPending = Boolean(publishAction?.isPending);
  const disabled = readOnly || isSubmitting || locked || publishPending;

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => onSubmit(toTemplateWriteInput(values)))}
    >
      <div className="space-y-2">
        <Label htmlFor="template-name">Template name</Label>
        <Input
          id="template-name"
          placeholder="Incoming Furniture QC"
          disabled={disabled}
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">Checklist sections</h2>
            <p className="text-sm text-muted-foreground">
              Group pass/fail, text, and measurement items in the order inspectors will complete them.
            </p>
          </div>
          {readOnly ? null : (
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => append({ ...emptyTemplateSection, items: [{ ...emptyTemplateItem }] })}
            >
              <Plus className="size-4" />
              Add section
            </Button>
          )}
        </div>

        {fields.length === 0 ? (
          <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            No sections yet. Add a section to start the furniture QC checklist.
          </div>
        ) : (
          fields.map((section, sectionIndex) => (
            <SectionEditor
              key={section.id}
              control={form.control}
              errors={form.formState.errors}
              register={form.register}
              sectionIndex={sectionIndex}
              sectionCount={fields.length}
              disabled={disabled}
              readOnly={readOnly}
              onMove={move}
              onRemove={() => remove(sectionIndex)}
            />
          ))
        )}

        {form.formState.errors.sections?.root ? (
          <p className="text-sm text-destructive">{form.formState.errors.sections.root.message}</p>
        ) : typeof form.formState.errors.sections?.message === 'string' ? (
          <p className="text-sm text-destructive">{form.formState.errors.sections.message}</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-destructive">{error.message}</p> : null}

      {readOnly ? (
        extraActions ? <div className="flex flex-wrap gap-2">{extraActions}</div> : null
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={disabled}>
            {isSubmitting && !publishPending ? 'Saving...' : submitLabel}
          </Button>
          {publishAction ? (
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => {
                void form.handleSubmit((values) => {
                  const input = toTemplateWriteInput(values);

                  if (!checklistIsPublishable(input.sections)) {
                    form.setError('sections', {
                      type: 'manual',
                      message: 'Publishing requires at least one section with at least one item',
                    });
                    return;
                  }

                  publishAction.onRequest(input);
                })();
              }}
            >
              {publishPending ? 'Publishing...' : publishAction.label}
            </Button>
          ) : null}
          {extraActions}
        </div>
      )}
    </form>
  );
}

function SectionEditor({
  control,
  errors,
  register,
  sectionIndex,
  sectionCount,
  disabled,
  readOnly,
  onMove,
  onRemove,
}: {
  control: Control<TemplateFormValues>;
  errors: FieldErrors<TemplateFormValues>;
  register: ReturnType<typeof useForm<TemplateFormValues>>['register'];
  sectionIndex: number;
  sectionCount: number;
  disabled: boolean;
  readOnly: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.items`,
  });

  const sectionError = errors.sections?.[sectionIndex];

  return (
    <div className="space-y-4 rounded-xl border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1 space-y-2">
          <Label htmlFor={`section-name-${sectionIndex}`}>Section name</Label>
          <Input
            id={`section-name-${sectionIndex}`}
            placeholder="e.g. Visual inspection"
            disabled={disabled}
            {...register(`sections.${sectionIndex}.name`)}
          />
          {sectionError?.name ? (
            <p className="text-sm text-destructive">{sectionError.name.message}</p>
          ) : null}
        </div>
        {readOnly ? null : (
          <div className="flex shrink-0 gap-1 sm:pt-6">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Move section up"
              disabled={disabled || sectionIndex === 0}
              onClick={() => onMove(sectionIndex, sectionIndex - 1)}
            >
              <ChevronUp className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Move section down"
              disabled={disabled || sectionIndex === sectionCount - 1}
              onClick={() => onMove(sectionIndex, sectionIndex + 1)}
            >
              <ChevronDown className="size-4" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              aria-label="Remove section"
              disabled={disabled}
              onClick={onRemove}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {fields.map((item, itemIndex) => (
          <ItemEditor
            key={item.id}
            control={control}
            errors={errors}
            register={register}
            sectionIndex={sectionIndex}
            itemIndex={itemIndex}
            itemCount={fields.length}
            disabled={disabled}
            readOnly={readOnly}
            onMove={move}
            onRemove={() => remove(itemIndex)}
          />
        ))}
        {sectionError?.items?.message ? (
          <p className="text-sm text-destructive">{sectionError.items.message}</p>
        ) : null}
      </div>

      {readOnly ? null : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => append({ ...emptyTemplateItem })}
        >
          <Plus className="size-4" />
          Add item
        </Button>
      )}
    </div>
  );
}

function ItemEditor({
  control,
  errors,
  register,
  sectionIndex,
  itemIndex,
  itemCount,
  disabled,
  readOnly,
  onMove,
  onRemove,
}: {
  control: Control<TemplateFormValues>;
  errors: FieldErrors<TemplateFormValues>;
  register: ReturnType<typeof useForm<TemplateFormValues>>['register'];
  sectionIndex: number;
  itemIndex: number;
  itemCount: number;
  disabled: boolean;
  readOnly: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}) {
  const itemType = useWatch({
    control,
    name: `sections.${sectionIndex}.items.${itemIndex}.type`,
  });
  const itemError = errors.sections?.[sectionIndex]?.items?.[itemIndex];

  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
        <div className="space-y-2">
          <Label htmlFor={`item-name-${sectionIndex}-${itemIndex}`}>Item name</Label>
          <Input
            id={`item-name-${sectionIndex}-${itemIndex}`}
            placeholder="e.g. Seat height"
            disabled={disabled}
            {...register(`sections.${sectionIndex}.items.${itemIndex}.name`)}
          />
          {itemError && 'name' in itemError && itemError.name ? (
            <p className="text-sm text-destructive">{itemError.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`item-type-${sectionIndex}-${itemIndex}`}>Type</Label>
          <select
            id={`item-type-${sectionIndex}-${itemIndex}`}
            className={fieldClassName}
            disabled={disabled}
            {...register(`sections.${sectionIndex}.items.${itemIndex}.type`)}
          >
            {itemTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {readOnly ? null : (
          <div className="flex gap-1 md:pt-6">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Move item up"
              disabled={disabled || itemIndex === 0}
              onClick={() => onMove(itemIndex, itemIndex - 1)}
            >
              <ChevronUp className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Move item down"
              disabled={disabled || itemIndex === itemCount - 1}
              onClick={() => onMove(itemIndex, itemIndex + 1)}
            >
              <ChevronDown className="size-4" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              aria-label="Remove item"
              disabled={disabled || itemCount === 1}
              onClick={onRemove}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {itemType === 'NUMERIC' ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={`item-unit-${sectionIndex}-${itemIndex}`}>Unit</Label>
            <Input
              id={`item-unit-${sectionIndex}-${itemIndex}`}
              placeholder="cm"
              disabled={disabled}
              {...register(`sections.${sectionIndex}.items.${itemIndex}.unit`)}
            />
            {itemError && 'unit' in itemError && itemError.unit ? (
              <p className="text-sm text-destructive">{itemError.unit.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`item-min-${sectionIndex}-${itemIndex}`}>Minimum</Label>
            <Input
              id={`item-min-${sectionIndex}-${itemIndex}`}
              type="number"
              step="any"
              placeholder="42"
              disabled={disabled}
              {...register(`sections.${sectionIndex}.items.${itemIndex}.minValue`)}
            />
            {itemError && 'minValue' in itemError && itemError.minValue ? (
              <p className="text-sm text-destructive">{itemError.minValue.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`item-max-${sectionIndex}-${itemIndex}`}>Maximum</Label>
            <Input
              id={`item-max-${sectionIndex}-${itemIndex}`}
              type="number"
              step="any"
              placeholder="46"
              disabled={disabled}
              {...register(`sections.${sectionIndex}.items.${itemIndex}.maxValue`)}
            />
            {itemError && 'maxValue' in itemError && itemError.maxValue ? (
              <p className="text-sm text-destructive">{itemError.maxValue.message}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
