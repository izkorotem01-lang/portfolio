const {spawnSync} = require('node:child_process')
const path = require('node:path')

const result = spawnSync(process.execPath, [path.join(__dirname, '..', '..', 'scripts', 'check-node-version.mjs')], {
  stdio: 'inherit',
})

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
