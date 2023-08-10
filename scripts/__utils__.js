function log(project, ...data) {
  console.log(`[${project.name}]`, ...data)
}

function error(project, message) {
  throw new Error(`[${project.name}] ${message}`)
}

module.exports = { log, error }