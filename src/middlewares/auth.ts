import { Request, Response, NextFunction } from 'express'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '../lib/prisma'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function auth(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token ausente' })
  }

  const token = authHeader.replace('Bearer ', '')

  // 1️⃣ valida token
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ error: 'Token inválido' })
  }

  // 2️⃣ busca profile REAL
  const profile = await prisma.profile.findUnique({
    where: { id: data.user.id }
  })

  if (!profile) {
    return res.status(403).json({ error: 'Profile não encontrado' })
  }

  // 3️⃣ injeta usuário correto
  req.user = {
    id: profile.id,
    email: data.user.email,
    role: profile.role // 👈 AGORA SIM
  }

  next()
}