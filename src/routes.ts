import { Router } from 'express'
import clienteRoutes from './modules/clientes/clientes.routes'
import { auth } from './middlewares/auth'
import { ensureProfile } from './lib/ensureProfile'
import pagamentoRoutes from './modules/pagamentos/pagamento.routes'
import gastoRoutes from './modules/gastos/gastos.routes'
import categoriaGastoRoutes from './modules/categoria-gasto/categoria-gasto.routes'
import dividaRoutes from './modules/dividas/divida.routes'

const routes = Router()

routes.get('/me', auth, async (req: any, res) => {
  const profile = await ensureProfile(req.user)
  return res.json(profile)
})

routes.use('/clientes', clienteRoutes)
routes.use('/pagamentos', pagamentoRoutes)
routes.use('/gastos', gastoRoutes)
routes.use('/categoria-gasto', categoriaGastoRoutes)
routes.use('/dividas', dividaRoutes)

export default routes