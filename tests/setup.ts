import * as fs from 'fs'
import * as path from 'path'

const envrcPath = path.join(__dirname, '..', '.envrc')
if (fs.existsSync(envrcPath)) {
  const lines = fs.readFileSync(envrcPath, 'utf-8').split('\n')
  lines.forEach(line => {
    const match = line.match(/^export\s+(\w+)=(.+)$/)
    if (match) {
      process.env[match[1]] = match[2].trim()
    }
  })
}
