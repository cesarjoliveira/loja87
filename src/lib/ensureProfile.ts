import { prisma } from './prisma'

export async function ensureProfile(user: any) {
  const existing = await prisma.profile.findUnique({
    where: { id: user.id }
  })

  if (existing) return existing

  return prisma.profile.create({
    data: {
      id: user.id,
      nome: user.email ?? 'Usuário',
      role: 'USER'
    }
  })
}