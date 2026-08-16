-- AlterTable
ALTER TABLE "TemplateVersion" ADD COLUMN "draftTemplateId" TEXT;

-- Backfill existing drafts so uniqueness can move into the schema.
UPDATE "TemplateVersion"
SET "draftTemplateId" = "templateId"
WHERE "status" = 'DRAFT';

-- CreateIndex
CREATE UNIQUE INDEX "TemplateVersion_draftTemplateId_key" ON "TemplateVersion"("draftTemplateId");

-- DropIndex
DROP INDEX "TemplateVersion_one_draft_per_template_key";
