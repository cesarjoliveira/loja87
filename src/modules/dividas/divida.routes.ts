import { Router } from 'express'
import { auth } from '../../middlewares/auth'
import {
  criarDivida,
  listarDividasAbertasPorCliente,
  pagarDivida,
} from './divida.controller'

const router = Router()
router.use(auth)

router.post('/', criarDivida)
router.get('/:id/dividas', listarDividasAbertasPorCliente)
router.patch('/:id/quitar', pagarDivida)

export default router