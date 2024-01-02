import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'

const app = express()
app.use(json())
app.disable('x-powered-by')

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

//CORS PRE-Flight
//OPTIONS

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
