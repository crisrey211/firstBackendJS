import express, { json } from 'express'
import { randomUUID } from 'node:crypto'
import { validateMovie, validatePartialMovie } from './schemas/movies.js'

//como leer un json en ESModules de forma recomendada por ahora
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const movies = require('./movies.json')

const app = express()
app.use(json())
app.disable('x-powered-by')

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

//CORS PRE-Flight
//OPTIONS

const ACCEPTED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:1234',
    'http://172.30.240.1:5500',
    'http://movies.com',
    'http://midu.dev',
]

app.get('/movies', (req, res) => {
    //para solucionar el CORS
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin)
    }

    const { genre } = req.query
    if (genre) {
        const filtered_movies = movies.filter((item) =>
            item.genre.includes(genre)
        )
        return res.json(filtered_movies)
    }
    return res.json(movies)
})

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex((movie) => movie.id === id)
    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movies not found' })
    }
    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find((item) => item.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
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

app.patch('/movies/:id', (req, res) => {
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

app.options('/movies/:id', (req, res) => {
    const origin = req.header('origin')

    if (ACCEPTED_ORIGINS.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    }
    res.status(200)
})

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
