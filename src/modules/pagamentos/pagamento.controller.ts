import { prisma } from '../../lib/prisma'
import { Request, Response } from 'express'

export async function listarPagamentosPorCliente(
  req: Request & { user?: any },
  res: Response
) {
  const clienteId = String(req.params.clienteId)

  const pagamentos = await prisma.pagamento.findMany({
    where: {
      clienteId,
      userId: req.user.id
    },
    orderBy: {
      mesReferencia: 'asc'
    }
  })

  const resposta = pagamentos.map(p => ({
    id: p.id,
    mes: p.mesReferencia.toISOString().slice(0, 7), // YYYY-MM
    valor: p.valor,
    status: p.status,
    checkbox: {
      checked: p.status === 'PAGO',
      disabled: req.user.role !== 'ADMIN'
    }
  }))
    
  return res.json(resposta)
}

export async function marcarComoPago(req: any, res: any) {
  const id = String(req.params.id)

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  await prisma.pagamento.update({
    where: { id },
    data: {
      status: 'PAGO',
      pagoEm: new Date()
    }
  })

  return res.json({ success: true })
}

export async function planilhaAdmin(
  req: Request & { user?: any },
  res: Response
) {
  // 🔐 só admin
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  // busca todos os pagamentos do admin
  const pagamentos = await prisma.pagamento.findMany({
    where: {
      userId: req.user.id
    },
    include: {
      cliente: true
    },
    orderBy: [
      { cliente: { nome: 'asc' } },
      { mesReferencia: 'asc' }
    ]
  })

  // 📅 lista única de meses
  const meses = Array.from(
    new Set(
      pagamentos.map(p =>
        p.mesReferencia.toISOString().slice(0, 7)
      )
    )
  )

  // 🧱 agrupa por cliente
  const clientesMap: Record<string, any> = {}

  for (const p of pagamentos) {
    if (!clientesMap[p.clienteId]) {
      clientesMap[p.clienteId] = {
        clienteId: p.clienteId,
        nome: p.cliente.nome,
        pagamentos: {}
      }
    }

    const mes = p.mesReferencia.toISOString().slice(0, 7)

    clientesMap[p.clienteId].pagamentos[mes] = {
      pagamentoId: p.id,
      valor: p.valor,
      status: p.status,
      checked: p.status === 'PAGO'
    }
  }

  return res.json({
    meses,
    clientes: Object.values(clientesMap)
  })
}