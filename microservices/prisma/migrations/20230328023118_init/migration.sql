-- CreateTable
CREATE TABLE "Treatment" (
    "id" SERIAL NOT NULL,
    "ref_cd" TEXT NOT NULL,
    "ref_nm" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Treatment_id_key" ON "Treatment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Treatment_ref_cd_key" ON "Treatment"("ref_cd");

-- CreateIndex
CREATE UNIQUE INDEX "Treatment_ref_nm_key" ON "Treatment"("ref_nm");
