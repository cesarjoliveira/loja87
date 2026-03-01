import { Router } from 'express'
import { auth } from '../../middlewares/auth'
import { createGasto, listGastos,resumoFinanceiro } from './gastos.controller'

const router = Router()

router.use(auth)
router.get('/resumo/mensal', resumoFinanceiro)
router.post('/', createGasto)
router.get('/', listGastos)

export default router