require('dotenv').config()
const express = require('express')
const movies = require('./movies.json')
const port = process.env.PORT
const app = express()
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
