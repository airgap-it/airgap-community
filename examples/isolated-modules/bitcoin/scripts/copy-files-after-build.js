const { mkdirSync, copyFileSync, readdirSync, lstatSync, existsSync } = require('fs')
const { dirname, join, sep } = require('path')

const findFilesOnLevel = async (base) => {
  const files = []
  const filesInFolder = readdirSync(base)
  for (const file of filesInFolder) {
    const path = `${base}/${file}`
    const isDirectory = lstatSync(path).isDirectory()
    if (isDirectory) {
      files.push(...(await findFilesOnLevel(path)))
    } else if (file.endsWith('json') || file.endsWith('js')) {
      files.push(path)
      dirname(path)
        .split(sep)
        .reduce((prevPath, folder) => {
          const currentPath = join(prevPath, folder, sep)
          if (currentPath === 'src/') {
            return 'dist/'
          }

          if (!existsSync(currentPath)) {
            mkdirSync(currentPath)
          }

          return currentPath
        }, '')

      console.log('Copying file', path.replace('./src', './dist'))

      copyFileSync(path, path.replace('./src', './dist'))
    }
  }
  return files
}
findFilesOnLevel('./src/serializer/v3/schemas/generated')
  .then(() => {})
  .catch(console.error)
