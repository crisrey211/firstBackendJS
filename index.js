require('dotenv').config()
const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const port = process.env.PORT

const app = express()
app.use(express.json())
app.disable('x-powered-by')

const ACCEPTED_ORIGINS = [
    'https://localhost:3000',
    'https://localhost:1234',
    'https://localhost:8020',
    'https://movies.com',
    'https://midu.dev',
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
        id: crypto.randomUUID(),
        ...result.data,
    }
    //Esto no es REST xq estamos guardadno el estado en memoria
    movies.push(newMovie)
    console.log(newMovie)
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
