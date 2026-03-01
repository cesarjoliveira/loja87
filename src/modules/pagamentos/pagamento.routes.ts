import { Router } from 'express'
import { auth } from '../../middlewares/auth'
import {
  listarPagamentosPorCliente,
  planilhaAdmin,
  marcarComoPago
} from './pagamento.controller'

const router = Router()

router.use(auth)


// 📊 planilha geral do admin
router.get('/planilha/admin', planilhaAdmin)

// GET /pagamentos/cliente/:clienteId
router.get('/cliente/:clienteId', listarPagamentosPorCliente)

// PATCH /pagamentos/:id/pagar
router.patch('/:id/pagar', marcarComoPago)

export default router