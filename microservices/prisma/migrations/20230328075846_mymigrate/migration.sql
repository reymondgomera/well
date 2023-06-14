/*
  Warnings:

  - You are about to drop the column `Vital_Sings` on the `PhysicalCheckup` table. All the data in the column will be lost.
  - Added the required column `Vital_Signs` to the `PhysicalCheckup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Entity" DROP CONSTRAINT "Entity_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Reference" DROP CONSTRAINT "Reference_entityId_fkey";

-- AlterTable
ALTER TABLE "Entity" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "parentId" SET DATA TYPE TEXT;
DROP SEQUENCE "Entity_id_seq";

-- AlterTable
ALTER TABLE "PhysicalCheckup" DROP COLUMN "Vital_Sings",
ADD COLUMN     "Vital_Signs" JSONB NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE "PhysicalCheckup_id_seq";

-- AlterTable
ALTER TABLE "Reference" ALTER COLUMN "entityId" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Physician" (
    "id" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "MiddleInitial" TEXT DEFAULT 'N/A',
    "Address" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Physician_id_key" ON "Physician"("id");

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
