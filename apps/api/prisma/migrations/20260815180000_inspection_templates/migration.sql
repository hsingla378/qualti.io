-- CreateEnum
CREATE TYPE "TemplateVersionStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "TemplateItemType" AS ENUM ('PASS_FAIL', 'TEXT', 'NUMERIC');

-- CreateTable
CREATE TABLE "InspectionTemplate" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InspectionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateVersion" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "status" "TemplateVersionStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateSection" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateItem" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TemplateItemType" NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "unit" TEXT,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InspectionTemplate_organizationId_updatedAt_idx" ON "InspectionTemplate"("organizationId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "InspectionTemplate_id_organizationId_key" ON "InspectionTemplate"("id", "organizationId");

-- CreateIndex
CREATE INDEX "TemplateVersion_organizationId_idx" ON "TemplateVersion"("organizationId");

-- CreateIndex
CREATE INDEX "TemplateVersion_templateId_status_idx" ON "TemplateVersion"("templateId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateVersion_templateId_versionNumber_key" ON "TemplateVersion"("templateId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateVersion_id_organizationId_key" ON "TemplateVersion"("id", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateVersion_one_draft_per_template_key" ON "TemplateVersion"("templateId") WHERE "status" = 'DRAFT';

-- CreateIndex
CREATE INDEX "TemplateSection_organizationId_idx" ON "TemplateSection"("organizationId");

-- CreateIndex
CREATE INDEX "TemplateSection_versionId_sortOrder_idx" ON "TemplateSection"("versionId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateSection_id_organizationId_key" ON "TemplateSection"("id", "organizationId");

-- CreateIndex
CREATE INDEX "TemplateItem_organizationId_idx" ON "TemplateItem"("organizationId");

-- CreateIndex
CREATE INDEX "TemplateItem_sectionId_sortOrder_idx" ON "TemplateItem"("sectionId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateItem_id_organizationId_key" ON "TemplateItem"("id", "organizationId");

-- AddForeignKey
ALTER TABLE "InspectionTemplate" ADD CONSTRAINT "InspectionTemplate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateVersion" ADD CONSTRAINT "TemplateVersion_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateVersion" ADD CONSTRAINT "TemplateVersion_templateId_organizationId_fkey" FOREIGN KEY ("templateId", "organizationId") REFERENCES "InspectionTemplate"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateSection" ADD CONSTRAINT "TemplateSection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateSection" ADD CONSTRAINT "TemplateSection_versionId_organizationId_fkey" FOREIGN KEY ("versionId", "organizationId") REFERENCES "TemplateVersion"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateItem" ADD CONSTRAINT "TemplateItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateItem" ADD CONSTRAINT "TemplateItem_sectionId_organizationId_fkey" FOREIGN KEY ("sectionId", "organizationId") REFERENCES "TemplateSection"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
