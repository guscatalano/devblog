import { createServer } from 'vitepress'

async function start() {
  const server = await createServer('./docs', { port: 3001 })
  await server.listen(3001)
  console.log('Server running at http://localhost:3001')
}

start().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
