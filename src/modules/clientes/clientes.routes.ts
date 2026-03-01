import { Router } from 'express'
import { auth } from '../../middlewares/auth'
import {
  createCliente,
  listClientes,
  updateCliente,
  deleteCliente,
} from './clientes.controller'

const router = Router()

router.use(auth)

router.post('/', createCliente)
router.get('/', listClientes)
router.put('/:id', updateCliente)
router.delete('/:id', deleteCliente)

export default router