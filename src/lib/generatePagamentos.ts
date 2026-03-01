import { prisma } from './prisma'

function gerarMeses(inicio: Date, fim: Date) {
  const meses: Date[] = []
  const data = new Date(inicio)

  while (data <= fim) {
    meses.push(new Date(data))
    data.setMonth(data.getMonth() + 1)
  }

  return meses
}

export async function gerarPagamentosParaCliente(
  clienteId: string,
  userId: string
) {
  const inicio = new Date('2025-01-01')
  const hoje = new Date()

  const meses = gerarMeses(inicio, hoje)

  for (const mes of meses) {
    const valorMensal = await prisma.mensalidadeValor.findFirst({
      where: {
        inicioMes: { lte: mes },
        OR: [{ fimMes: null }, { fimMes: { gte: mes } }]
      }
    })

    if (!valorMensal) continue

    await prisma.pagamento.upsert({
      where: {
        clienteId_mesReferencia: {
          clienteId,
          mesReferencia: mes
        }
      },
      update: {},
      create: {
        clienteId,
        userId,
        mesReferencia: mes,
        valor: valorMensal.valor,
        status: 'PENDENTE'
      }
    })
  }
}