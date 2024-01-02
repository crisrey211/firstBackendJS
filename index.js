import express, { json } from 'express'
import cors from 'cors'
import { moviesRouter } from './routes/movies.js'

const app = express()
app.use(json())
app.use(
    cors({
        origin: (origin, callback) => {
            const ACCEPTED_ORIGINS = [
                'http://localhost:3000',
                'http://localhost:1234',
                'http://172.30.240.1:5500',
                'http://movies.com',
                'http://midu.dev',
            ]
            if (ACCEPTED_ORIGINS.includes(origin)) {
                return callback(null, true)
            }

            if (!origin) {
                return callback(null, true)
            }

            return callback(new Error('Not alloweb by CORS'))
        },
    })
)
app.disable('x-powered-by')
app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
