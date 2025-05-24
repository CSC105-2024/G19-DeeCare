import type {Context} from 'hono'
import jwt from 'jsonwebtoken'

export const sendSecureCookie = async (c: Context) => {
    const key = 'firstSecureCookie'
    const value = 'This is the data inside the cookie but more secure this time.'
    const secret = process.env.jwt_secret_key as string

    if (!secret) {
        console.error('Missing jwt_secret_key in environment variables')
        return c.text('Server configuration error', 500)
    }

    try {
        const token = jwt.sign({value}, secret)
        c.header('Set-Cookie', `${key}=${token}; Path=/; HttpOnly; Secure`)
        return c.text('Secure Cookie set')
    } catch (error) {
        console.error(error)
        return c.text('An error occurred, Secure Cookie not set', 500)
    }
}