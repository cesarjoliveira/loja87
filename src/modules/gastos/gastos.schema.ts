import { z } from 'zod'

export const createGastoSchema = z.object({
  categoriaId: z.string().uuid(),
  valor: z.number().positive(),
  descricao: z.string().optional(),
  dataGasto: z.string()
})