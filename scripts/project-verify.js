const { error, log } = require('./__utils__')
const fs = require('fs')
const path = require('path')
const ed25519Verify = require('@stablelib/ed25519').verify

const __execdirname = process.cwd()
const __dist = path.join(__execdirname, 'dist')

function help() {
  console.log(`
    Verify a community project.

    Usage: node project-build.ts [option]
      -h, --help            show help text
      -p, --project <file>  verify the project described in the file
  `)
}

async function verify(file) {
  const project = require(path.join(__execdirname, file))
  const signaturePath = path.join(__execdirname, project.signature)
  const manifestPath = path.join(__dist, 'manifest.json')

  const manifest = require(manifestPath)

  const manifestBytes = fs.readFileSync(manifestPath)
  const includeBytes = Buffer.concat(manifest.include.map((file) => fs.readFileSync(path.join(__dist, file))))
  const filesBytes = Buffer.concat([includeBytes, manifestBytes])

  const publicKey = Buffer.from(manifest.publicKey.replace(/^0x/, ''), 'hex')
  const signatureBytes = fs.readFileSync(signaturePath)

  if (!ed25519Verify(publicKey, filesBytes, signatureBytes)) {
    error(project, 'Invalid signature')
  }

  log(project, 'Signature correct')
}

let args = process.argv.slice(2)

while (args.length > 0) {
  if (args[0].startsWith('-h') || args[0].startsWith('--help')) {
    help()
    return
  }

  if (args[0].startsWith('-p') || args[0].startsWith('--project')) {
    verify(args[1])
    return
  }
}