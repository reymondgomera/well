/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Password_reset` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Password_reset_email_key";

-- DropIndex
DROP INDEX "Password_reset_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Password_reset_token_key" ON "Password_reset"("token");
