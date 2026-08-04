import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'runs')

// Keyed by benchId so <BenchTable bench-id="..."> can look a run up at build
// time — no runtime fetch, and the JSON never ships as a separate request.
declare const data: Record<string, any>
export { data }

export default {
  watch: ['./runs/*.json'],
  load(): Record<string, any> {
    const out: Record<string, any> = {}
    if (!fs.existsSync(dir)) return out
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.json')) continue
      const run = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
      if (run?.benchId) out[run.benchId] = run
    }
    return out
  }
}
