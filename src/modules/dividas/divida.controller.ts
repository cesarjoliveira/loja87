import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

interface Params {
    clienteId: string
}

export async function criarDivida(
  req: Request,
  res: Response
) {
  // 🔐 garante autenticação
  if (!req.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' })
  }

  // 🔐 somente admin
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  const { clienteId, valor, descricao } = req.body

  // 🧪 validações básicas
  if (!clienteId || !valor || !descricao) {
    return res.status(400).json({
      error: 'clienteId, valor e descricao são obrigatórios'
    })
  }

  if (typeof valor !== 'number' || valor <= 0) {
    return res.status(400).json({
      error: 'Valor deve ser um número maior que zero'
    })
  }

  // 🧾 cria a dívida
  const divida = await prisma.dividaPrivada.create({
    data: {
      clienteId,
      valorTotal: valor,
      descricao
    }
  })

  // ✅ retorna a dívida criada
  return res.status(201).json(divida)
}

export async function listarDividasAbertasPorCliente(
    req: Request<Params>,
    res: Response
) {
    const { clienteId } = req.params
    if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' })
    }
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' })
    }

    const dividas = await prisma.dividaPrivada.findMany({
        where: {
            clienteId,
            status: 'ABERTA'
        },
        include: {
            pagamentos: true
        }
    })

    const resultado = dividas.map(d => {
        const totalPago = d.pagamentos.reduce(
            (sum, p) => sum + p.valor,
            0
        )

        return {
            id: d.id,
            descricao: d.descricao,
            valorTotal: d.valorTotal,
            totalPago,
            saldo: d.valorTotal - totalPago
        }
    })

    res.json(resultado)
}

export async function pagarDivida(
    req: Request & { user?: any },
    res: Response
) {
    const { dividaId, valor } = req.body

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' })
    }

    const divida = await prisma.dividaPrivada.findUnique({
        where: { id: dividaId },
        include: { pagamentos: true }
    })

    if (!divida) {
        return res.status(404).json({ error: 'Dívida não encontrada' })
    }

    await prisma.pagamentoDivida.create({
        data: {
            dividaId,
            valor
        }
    })

    const totalPago =
        divida.pagamentos.reduce((s, p) => s + p.valor, 0) + valor

    if (totalPago >= divida.valorTotal) {
        await prisma.dividaPrivada.update({
            where: { id: dividaId },
            data: { status: 'QUITADA' }
        })
    }

    res.json({ success: true })
}