import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import routes from './routes'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  return res.json({ status: 'ok', message: 'API rodando 🚀' })
})

app.use(routes)

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`🔥 Server rodando na porta ${PORT}`)
})