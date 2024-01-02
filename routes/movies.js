import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { readJSON } from '../utils.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

import path from 'node:path'

//como leer un json en ESModules de forma recomendada por ahora
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const movies = require('./../movies.json')

export const moviesRouter = Router()
const ACCEPTED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:1234',
    'http://172.30.240.1:5500',
    'http://movies.com',
    'http://midu.dev',
]

moviesRouter.get('/', (req, res) => {
    const { genre } = req.query
    if (genre) {
        const filtered_movies = movies.filter((item) =>
            item.genre.includes(genre)
        )
        return res.json(filtered_movies)
    }
    return res.json(movies)
})

moviesRouter.get('/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find((item) => item.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
})

moviesRouter.post('/', (req, res) => {
    const result = validateMovie(req.body)
    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = {
        id: randomUUID(),
        ...result.data,
    }
    //Esto no es REST xq estamos guardadno el estado en memoria
    movies.push(newMovie)
    res.status(201).json(newMovie)
})

moviesRouter.delete('/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex((movie) => movie.id === id)
    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movies not found' })
    }
    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })
})

moviesRouter.patch('/:id', (req, res) => {
    const { id } = req.params
    const result = validatePartialMovie(req.body)
    if (!result.success) {
        return res
            .status(400)
            .json({ error: 'ALGO EN LA VALIDACION HA FALLADO' })
    }
    const movieIndex = movies.findIndex((movie) => movie.id === id)
    if (movieIndex === -1)
        return res.status(404).json({ message: 'Movie not found' })
    const updateMovie = { ...movies[movieIndex], ...result.data }
    movies[movieIndex] = updateMovie
    return res.status(200).json(updateMovie)
})
