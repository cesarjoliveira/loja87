-- CreateEnum
CREATE TYPE "DividaStatus" AS ENUM ('PENDENTE', 'QUITADA');

-- CreateTable
CREATE TABLE "DividaPrivada" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "DividaStatus" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DividaPrivada_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DividaPrivada" ADD CONSTRAINT "DividaPrivada_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
