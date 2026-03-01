import { PrismaClient } from '@prisma/client'
import { seedCategoriasGasto } from '../modules/categoria-gasto/categoria-gasto.seed'

const prisma = new PrismaClient()


async function main() {
  await seedCategoriasGasto()
  // 🔹 Valor: R$ 250,00 (Jan/2025 → Fev/2026)
  const valor250Inicio = new Date('2025-01-01')
  const valor250Fim = new Date('2026-02-28')

  const existe250 = await prisma.mensalidadeValor.findFirst({
    where: {
      valor: 250,
      inicioMes: valor250Inicio
    }
  })

  if (!existe250) {
    await prisma.mensalidadeValor.create({
      data: {
        valor: 250,
        inicioMes: valor250Inicio,
        fimMes: valor250Fim
      }
    })
    console.log('✅ Mensalidade R$250 criada')
  } else {
    console.log('ℹ️ Mensalidade R$250 já existe')
  }

  // 🔹 Valor: R$ 270,00 (Mar/2026 → infinito)
  const valor270Inicio = new Date('2026-03-01')

  const existe270 = await prisma.mensalidadeValor.findFirst({
    where: {
      valor: 270,
      inicioMes: valor270Inicio
    }
  })

  if (!existe270) {
    await prisma.mensalidadeValor.create({
      data: {
        valor: 270,
        inicioMes: valor270Inicio,
        fimMes: null
      }
    })
    console.log('✅ Mensalidade R$270 criada')
  } else {
    console.log('ℹ️ Mensalidade R$270 já existe')
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })