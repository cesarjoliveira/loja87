import { prisma } from '../../lib/prisma'

export async function seedCategoriasGasto() {
  const categorias = [
    'Aluguel',
    'Energia elétrica',
    'Água',
    'Internet',
    'Material de escritório',
    'Manutenção',
    'Eventos',
    'Doações',
    'Outros'
  ]

  for (const nome of categorias) {
    const exists = await prisma.categoriaGasto.findFirst({
      where: { nome }
    })

    if (!exists) {
      await prisma.categoriaGasto.create({
        data: { nome }
      })
    }
  }
}