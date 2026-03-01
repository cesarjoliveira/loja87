import { z } from 'zod'

export const createClienteSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
})

export const updateClienteSchema = z.object({
  nome: z.string().min(2).optional(),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  status: z.enum(['ATIVO', 'INATIVO']).optional(),
})