/*
  Warnings:

  - You are about to drop the column `categoria` on the `Gasto` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `Gasto` table. All the data in the column will be lost.
  - Added the required column `categoriaId` to the `Gasto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `criadoPor` to the `Gasto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataGasto` to the `Gasto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gasto" DROP COLUMN "categoria",
DROP COLUMN "data",
ADD COLUMN     "categoriaId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "criadoPor" TEXT NOT NULL,
ADD COLUMN     "dataGasto" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "descricao" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CategoriaGasto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoriaGasto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaGasto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
