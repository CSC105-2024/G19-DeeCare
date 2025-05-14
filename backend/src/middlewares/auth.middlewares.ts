import type {Context, Next} from "hono";
import {verify} from "hono/jwt";
import {db} from "../index.js";

export const authMiddleware = async (c: Context, next: Next) => {
    try {
        // Get the authorization header
        const authHeader = c.req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({error: "Authentication required"}, 401);
        }

        // Extract the token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return c.json({error: "Invalid token format"}, 401);
        }

        try {
            // Verify the token
            const decoded = await verify(token, process.env.JWT_SECRET || "your-default-secret");

            // Check if user exists in database
            const user = await db.user.findUnique({
                where: {id: decoded.userId as number},
            });

            if (!user) {
                return c.json({error: "User not found"}, 401);
            }

            // Add user ID to the context for later use
            c.set("userId", user.id);
            c.set("userRole", user.role);

            await next();
        } catch (error) {
            return c.json({error: "Invalid or expired token"}, 401);
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        return c.json({error: "Authentication error"}, 500);
    }
};