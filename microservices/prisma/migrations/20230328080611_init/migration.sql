/*
  Warnings:

  - The `id` column on the `Entity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `parentId` column on the `Entity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `entityId` on the `Reference` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Entity" DROP CONSTRAINT "Entity_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Reference" DROP CONSTRAINT "Reference_entityId_fkey";

-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "parentId",
ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "Reference" DROP COLUMN "entityId",
ADD COLUMN     "entityId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Entity_id_key" ON "Entity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Entity_parentId_key" ON "Entity"("parentId");

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
