import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
    static async getAll(req, res) {
        const { genre } = req.query
        const movies = await MovieModel.getAll({ genre })
        res.json(movies)
    }
    static async getById(req, res) {
        const { id } = req.params
        const movie = await MovieModel.getById({ id })
        if (movie) return res.json(movie)
        res.status(404).json({ message: 'Movie not found' })
    }
    static async create(req, res) {
        const result = validateMovie(req.body)
        console.log(result)
        if (!result.success) {
            return res
                .status(400)
                .json({ error: JSON.parse(result.error.message) })
        }
        const newMovie = await MovieModel.create({ input: result.data })
        res.status(201).json(newMovie)
    }
    static async delete(req, res) {
        const { id } = req.params
        const result = await MovieModel.delete({ id })
        if (result === false) {
            return res.status(404).json({ message: 'Movies not found' })
        }
        return res.json({ message: 'Movie deleted' })
    }
    static async update(req, res) {
        const result = validatePartialMovie(req.body)
        if (!result.success) {
            return res
                .status(400)
                .json({ error: 'ALGO EN LA VALIDACION HA FALLADO' })
        }
        const { id } = req.params
        console.log('object')
        const updatedMovie = await MovieModel.update({ id, input: result.data })
        return res.status(200).json(updatedMovie)
    }
}
