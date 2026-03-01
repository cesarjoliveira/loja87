import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { ensureProfile } from '../../lib/ensureProfile'

export async function createGasto(
  req: Request & { user?: any },
  res: Response
) {
  const { categoriaId, valor, descricao, dataGasto } = req.body

  await ensureProfile(req.user)

  const gasto = await prisma.gasto.create({
    data: {
      userId: req.user.id,
      categoriaId,
      valor,
      descricao,
      dataGasto: new Date(dataGasto),
      criadoPor: req.user.email ?? 'Sistema'
    }
  })

  return res.status(201).json(gasto)
}

export async function listGastos(req: Request & { user?: any }, res: Response) {
  const { mes, categoriaId } = req.query

  const where: any = {
    userId: req.user.id
  }

  if (categoriaId) where.categoriaId = categoriaId

  if (mes) {
    const inicio = new Date(`${mes}-01`)
    const fim = new Date(inicio)
    fim.setMonth(fim.getMonth() + 1)

    where.dataGasto = {
      gte: inicio,
      lt: fim
    }
  }

  const gastos = await prisma.gasto.findMany({
    where,
    include: {
      categoria: true
    },
    orderBy: {
      dataGasto: 'desc'
    }
  })

  return res.json(gastos)
}
export async function resumoFinanceiro(req: Request & { user?: any }, res: Response) {
  const { mes } = req.query

  if (!mes) {
    return res.status(400).json({ error: 'Informe o mês (YYYY-MM)' })
  }

  const inicio = new Date(`${mes}-01`)
  const fim = new Date(inicio)
  fim.setMonth(fim.getMonth() + 1)

  const totalGastos = await prisma.gasto.aggregate({
    where: {
      userId: req.user.id,
      dataGasto: {
        gte: inicio,
        lt: fim
      }
    },
    _sum: {
      valor: true
    }
  })

  const totalRecebido = await prisma.pagamento.aggregate({
  where: {
    userId: req.user.id,
    status: 'PAGO',
    mesReferencia: {
      gte: inicio,
      lt: fim
    }
  },
  _sum: {
    valor: true
  }
})

  return res.json({
    mes,
    entradas: totalRecebido._sum.valor ?? 0,
    saidas: totalGastos._sum.valor ?? 0,
    saldo:
      (totalRecebido._sum.valor ?? 0) -
      (totalGastos._sum.valor ?? 0)
  })
}