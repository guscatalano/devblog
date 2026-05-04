#!/usr/bin/env node

import { createServer } from 'vitepress'

try {
  const server = await createServer('./docs', { port: 3001 })
  await server.listen()
  console.log('Server started on http://localhost:3001')
} catch (err) {
  console.error('Error starting server:', err)
  process.exit(1)
}
