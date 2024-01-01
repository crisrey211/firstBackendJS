import z from 'zod'

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'movie title must be a string.',
        required_error: 'movie title is required.',
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url(),
    genre: z.array(
        z.enum([
            'Action',
            'Adventure',
            'Crime',
            'Comedy',
            'Drama',
            'Fantasy',
            'Horror',
            'Thriller',
            'Sci-Fi',
        ]),
        {
            required_error: 'Movie genre is required.',
            invalid_type_error: 'Movie genre must be an array of enum Genre',
        }
    ),
})

export function validateMovie(input) {
    return movieSchema.safeParse(input)
}
/*Validación para  */
export function validatePartialMovie(input) {
    return movieSchema.partial().safeParse(input)
}
