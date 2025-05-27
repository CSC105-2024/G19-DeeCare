import type {Context, Next} from "hono";
import {sign, verify} from "hono/jwt";
import {getCookie, setCookie} from "hono/cookie";
import {db} from "../index.js";

export const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";
export const COOKIE_NAME = "auth_token";

const cookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
};

export const setAuthCookie = async (c: Context, payload: object) => {
    const token = await sign({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + cookieOptions.maxAge
    }, JWT_SECRET);

    setCookie(c, COOKIE_NAME, token, cookieOptions);
    return token;
};

export const clearAuthCookie = (c: Context) => {
    setCookie(c, COOKIE_NAME, "", {...cookieOptions, maxAge: 0});
};

export const authMiddleware = async (c: Context, next: Next) => {
    try {
        // First try to get token from cookie
        let token = getCookie(c, COOKIE_NAME);

        // If no cookie, fallback to Authorization header for backward compatibility
        if (!token) {
            const authHeader = c.req.header("Authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            return c.json({error: "Authentication required"}, 401);
        }

        try {
            // Verify the token
            const decoded = await verify(token, JWT_SECRET);

            // Check if user exists in database
            const user = await db.user.findUnique({
                where: {id: decoded.userId as number},
                include: {
                    emergencyContact: true
                }
            });

            if (!user) {
                return c.json({error: "User not found"}, 401);
            }

            // Add user info to the context for later use
            c.set("userId", user.id);
            c.set("userRole", user.role);
            c.set("user", user);

            await next();
        } catch (error) {
            return c.json({error: "Invalid or expired token"}, 401);
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        return c.json({error: "Authentication error"}, 500);
    }
};