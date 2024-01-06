import { readJSON } from '../utils.js'
import { randomUUID } from 'node:crypto'

const movies = readJSON('./movies.json')

export class MovieModel {
    static getAll = async ({ genre }) => {
        if (genre) {
            return movies.filter((item) => item.genre.includes(genre))
        }
        return movies
    }

    static async getById({ id }) {
        const movie = movies.find((item) => item.id === id)
        return movie
    }
    static async create({ input }) {
        //en BBDD
        const newMovie = {
            id: randomUUID(),
            ...input,
        }
        //Esto no es REST xq estamos guardadno el estado en memoria
        movies.push(newMovie)
        return newMovie
    }
    static async delete({ id }) {
        const movieIndex = movies.findIndex((movie) => movie.id === id)
        if (movieIndex === -1) return false
        movies.splice(movieIndex, 1)
        return true
    }
    static async update({ id, input }) {
        const movieIndex = movies.findIndex((movie) => movie.id === id)
        if (movieIndex === -1) return false
        movies[movieIndex] = { ...movies[movieIndex], ...input }
        return movies[movieIndex]
    }
}
