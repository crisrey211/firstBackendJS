import path from 'node:path'

//como leer un json en ESModules de forma recomendada por ahora
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export const readJSON = (path) => require(path)
