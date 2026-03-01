import { prisma } from '../../lib/prisma'
import { Request, Response } from 'express'
import { gerarPagamentosParaCliente } from '../../lib/generatePagamentos'
import { ensureProfile } from '../../lib/ensureProfile'

export async function createCliente(
  req: Request & { user?: any },
  res: Response
) {
  const { nome, email, telefone } = req.body

  if (!nome) {
    return res.status(400).json({ error: 'Nome é obrigatório' })
  }

  // 🔥 GARANTE QUE O PROFILE EXISTE
  await ensureProfile(req.user)

  const cliente = await prisma.cliente.create({
    data: {
      userId: req.user.id,
      nome,
      email,
      telefone,
      status: 'ATIVO'
    }
  })

  await gerarPagamentosParaCliente(cliente.id, req.user.id)

  return res.status(201).json(cliente)
}

export async function listClientes(req: Request & { user?: any }, res: Response) {
  const clientes = await prisma.cliente.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return res.json(clientes)
}

export async function updateCliente(req: Request & { user?: any }, res: Response) {
  const id = String(req.params.id)

  const cliente = await prisma.cliente.updateMany({
    where: {
      id,
      userId: req.user.id,
    },
    data: req.body,
  })

  return res.json({ success: true, cliente })
}

export async function deleteCliente(req: Request & { user?: any }, res: Response) {
  const id = String(req.params.id)

  await prisma.cliente.updateMany({
    where: {
      id,
      userId: req.user.id,
    },
    data: {
      status: 'INATIVO',
    },
  })

  return res.status(204).send()
}