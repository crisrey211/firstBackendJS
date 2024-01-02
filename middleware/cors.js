import cors from 'cors'

export const corsMiddleware = () =>
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
