require('dotenv').config()
const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const port = process.env.PORT

const app = express()
app.use(express.json())
app.disable('x-powered-by')

app.get('/movies', (req, res) => {
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
    const { title, year, director, duration, rate, poster, genre } = req.body

    const newMovie = {
        id: crypto.randomUUID(),
        title,
        year,
        director,
        duration,
        rate: rate ?? 0,
        poster,
        genre,
    }
    //Esto no es REST xq estamos guardadno el estado en memoria
    movies.push(newMovie)
    console.log(newMovie)
    res.status(201).json(newMovie)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
