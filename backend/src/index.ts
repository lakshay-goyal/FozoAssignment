import express from 'express'
import { prisma } from './database/prisma'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
  try {
    const { username, email, latitude, longitude } = req.body
    console.log({ username, email, latitude, longitude })
    const user = await prisma.user.create({
      data: { username, email, latitude, longitude },
    })
    res.status(201).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
