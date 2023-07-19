const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const _exec = promisify(require('child_process').exec)

const __execdirname = process.cwd()
const __gitproject = path.join(__execdirname, 'project')

function help() {
  console.log(`
    Build a community project.

    Usage: node project-build.ts [option]
      -h, --help            show help text
      -p, --project <file>  build the project described in the file
  `)
}

async function exec(cmd, options) {
  const execPromise = _exec(cmd, options)
  execPromise.child.stdout.on('data', (data) => {
    console.log(data)
  })

  return execPromise
}

async function cloneProject(json) {
  const url = json.repository.url
  const commit = json.repository.commit

  const cloneCmd = `git clone --depth=1 ${url} project`
  const checkoutCmd = `git fetch --depth=1 origin ${commit} && git checkout ${commit}`

  console.log('$', cloneCmd)
  await exec(cloneCmd)

  console.log('$', checkoutCmd)
  await exec(checkoutCmd, { cwd: __gitproject })
}

async function buildCode(json) {
  const buildCmd = json.build

  console.log('$', buildCmd)
  await exec(buildCmd, { cwd: __gitproject })
}

async function copyBundle(json) {
  const manifestPath = path.join(__gitproject, json.manifest)
  const manifestDir = path.dirname(manifestPath)
  const manifest = require(manifestPath)
  
  const include = manifest.include.map((file) => path.join(manifestDir, file))

  const distDir = path.join(__execdirname, 'dist')
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir)
  }

  const copyCmd = `cp ${manifestPath} ${include.join(' ')} ${distDir}`

  console.log('$', copyCmd)
  await exec(copyCmd, { cwd: __gitproject })
}

async function build(file) {
  const json = require(path.join(__execdirname, file))

  await cloneProject(json)
  await buildCode(json)
  await copyBundle(json)
}

let args = process.argv.slice(2)

while (args.length > 0) {
  if (args[0].startsWith('-h') || args[0].startsWith('--help')) {
    help()
    return
  }

  if (args[0].startsWith('-p') || args[0].startsWith('--project')) {
    build(args[1])
    return
  }
}