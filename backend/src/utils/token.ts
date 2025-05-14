// import jwt from 'jsonwebtoken'
//
// // Define the payload structure of the JWT
// type JwtPayload = {
//     userId: number
// }
//
// // This function creates a JWT with the user's ID and 1 hour expiry
// export const generateToken = (user: { id: number }) => {
//     const secret = process.env.JWT_SECRET
//
//     if (!secret) {
//         throw new Error('JWT_SECRET is not defined in environment variables')
//     }
//
//     return jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' })
// }
//
// // This function checks if the token is valid and returns the data
// export const verifyToken = (token: string): JwtPayload | null => {
//     const secret = process.env.JWT_SECRET
//
//     if (!secret) {
//         throw new Error('JWT_SECRET is not defined in environment variables')
//     }
//
//     try {
//         // jwt.verify returns "any" — we assert the expected payload shape
//         return jwt.verify(token, secret) as JwtPayload
//     } catch (error) {
//         // If token is expired or invalid, return null
//         return null
//     }
// }