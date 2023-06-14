-- CreateTable
CREATE TABLE "Password_reset" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Password_reset_id_key" ON "Password_reset"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Password_reset_email_key" ON "Password_reset"("email");
