/*
  Warnings:

  - The values [PENDENTE] on the enum `DividaStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `valor` on the `DividaPrivada` table. All the data in the column will be lost.
  - Added the required column `valorTotal` to the `DividaPrivada` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DividaStatus_new" AS ENUM ('ABERTA', 'QUITADA');
ALTER TABLE "public"."DividaPrivada" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "DividaPrivada" ALTER COLUMN "status" TYPE "DividaStatus_new" USING ("status"::text::"DividaStatus_new");
ALTER TYPE "DividaStatus" RENAME TO "DividaStatus_old";
ALTER TYPE "DividaStatus_new" RENAME TO "DividaStatus";
DROP TYPE "public"."DividaStatus_old";
ALTER TABLE "DividaPrivada" ALTER COLUMN "status" SET DEFAULT 'ABERTA';
COMMIT;

-- AlterTable
ALTER TABLE "DividaPrivada" DROP COLUMN "valor",
ADD COLUMN     "valorTotal" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ABERTA';

-- CreateTable
CREATE TABLE "PagamentoDivida" (
    "id" TEXT NOT NULL,
    "dividaId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataPago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PagamentoDivida_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PagamentoDivida" ADD CONSTRAINT "PagamentoDivida_dividaId_fkey" FOREIGN KEY ("dividaId") REFERENCES "DividaPrivada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
