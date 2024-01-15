import { Router } from 'express'
import { MovieModel } from '../models/movie.js'
export const moviesRouter = Router()
moviesRouter.get('/', MovieModel.getAll)
moviesRouter.get('/:id', MovieModel.getById)
moviesRouter.post('/', MovieModel.create)
moviesRouter.delete('/:id', MovieModel.delete)
moviesRouter.patch(' /:id', MovieModel.update)
