
import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

export async function listarCategoriasGasto(
  req: Request,
  res: Response
) {
  const categorias = await prisma.categoriaGasto.findMany({
    orderBy: { nome: 'asc' }
  })

  res.json(categorias)
}