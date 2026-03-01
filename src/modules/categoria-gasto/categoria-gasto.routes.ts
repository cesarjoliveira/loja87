import { Router } from 'express'
import { auth } from '../../middlewares/auth'
import { listarCategoriasGasto } from './categoria-gasto.controller'

const router = Router()

router.use(auth)

// GET /categorias-gasto
router.get('/', listarCategoriasGasto)

export default router