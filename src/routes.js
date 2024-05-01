import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"
import { title } from "node:process"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      
      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
        completed_at:search,
        created_at:search,
        updated_at:search,
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const createdAt = new Date()

      const newTask = ({
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: createdAt,
          updated_at: createdAt, // Como a task está sendo criada agora, a data será a mesma
      })

      database.insert('tasks', newTask)

      res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const { title, description } = req.body

      const updatedAt = new Date()

      database.update('tasks', id, {
        title,
        description,
        updated_at: updatedAt,
      })

      return res.writeHead(204).end()
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      const completedAt = new Date();

      database.update('tasks', id, {
          completed_at: completedAt,
          updated_at: completedAt,
      });

      return res.writeHead(204).end();
    },
  },

  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    },
  }
]