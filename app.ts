import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
app.use(express.json())
const port = 3000

const prisma = new PrismaClient()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/todo', async (req, res) => {
  const allTodos = await prisma.todo.findMany()
  res.status(200).json(allTodos)
})

app.get('/todo/:id', async (req, res) => {
  const id = req.params.id
  const todo = await prisma.todo.findFirst({
    where: {
      id: id,
    },
  })

  if (!todo) res.status(500).json()

  res.status(200).json(todo)
})

app.post('/todo', async (req, res) => {
  const { description, dueDate } = req.body
  const newTodo = await prisma.todo.create({
    data: {
      description: description,
      dueDate: new Date(dueDate),
    },
  })
  res.status(201).json(newTodo)
})

app.put('/todo/:id', async (req, res) => {
  const id = req.params.id
  const { description } = req.body

  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: { description: description },
  })

  res.json(updatedTodo)
})

app.delete('/todo/:id', async (req, res) => {
  const id = req.params.id

  const deletedTodo = await prisma.todo.delete({
    where: { id },
  })

  res.json(deletedTodo)
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
