import * as AuthModel from "../models/auth.model.js";
import type {Context} from "hono";
import type {userData} from "../types/type.js";

/**
 * Register a new user
 */
const register = async (c: Context) => {
    try {
        const userData = await c.req.json<userData>();

        // Validate required fields
        if (!userData.idNumber || !userData.firstName || !userData.lastName ||
            !userData.dob || !userData.email || !userData.password ||
            !userData.age || !userData.bloodType) {
            return c.json({
                success: false,
                message: "Missing required fields"
            }, 400);
        }

        // Check if user already exists
        const existingUser = await AuthModel.GetUserByEmail(userData.email);
        if (existingUser) {
            return c.json({
                success: false,
                message: "Email already in use"
            }, 409);
        }

        // Register the user
        const result = await AuthModel.Register(userData);

        if (!result.success) {
            return c.json(result, 400);
        }

        return c.json({
            success: true,
            data: result.user,
            message: "User registered successfully"
        }, 201);
    } catch (error) {
        console.error("Error in register controller:", error);
        return c.json({
            success: false,
            message: "Server error during registration"
        }, 500);
    }
};

/**
 * Login a user
 */
const login = async (c: Context) => {
    try {
        const {idNumber, password} = await c.req.json<{ idNumber: string, password: string }>();

        // Validate required fields
        if (!idNumber || !password) {
            return c.json({
                success: false,
                message: "ID number and password are required"
            }, 400);
        }

        // Attempt login
        const result = await AuthModel.Login(idNumber, password);

        if (!result.success) {
            return c.json(result, 401);
        }

        return c.json({
            success: true,
            user: result.user,
            token: result.token,
            message: "Login successful"
        });
    } catch (error) {
        console.error("Error in login controller:", error);
        return c.json({
            success: false,
            message: "Server error during login"
        }, 500);
    }
};

/**
 * Get user profile (protected route)
 */
const getProfile = async (c: Context) => {
    try {
        const userId = c.get("userId") as number;

        if (!userId) {
            return c.json({
                success: false,
                message: "User ID not found"
            }, 401);
        }

        const user = await AuthModel.GetUserById(userId);

        if (!user) {
            return c.json({
                success: false,
                message: "User not found"
            }, 404);
        }

        return c.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("Error in getProfile controller:", error);
        return c.json({
            success: false,
            message: "Server error while fetching profile"
        }, 500);
    }
};

/**
 * Update user profile
 */
const updateProfile = async (c: Context) => {
    try {
        const userId = c.get("userId") as number;

        if (!userId) {
            return c.json({
                success: false,
                message: "User ID not found"
            }, 401);
        }

        const updateData = await c.req.json<{
            firstName?: string;
            lastName?: string;
            email?: string;
            bloodType?: string;
        }>();

        const result = await AuthModel.UpdateUser(userId, updateData);

        if (!result.success) {
            return c.json(result, 400);
        }

        return c.json({
            success: true,
            data: result.user,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        return c.json({
            success: false,
            message: "Server error while updating profile"
        }, 500);
    }
};

/**
 * Update user password
 */
const updatePassword = async (c: Context) => {
    try {
        const userId = c.get("userId") as number;

        if (!userId) {
            return c.json({
                success: false,
                message: "User ID not found"
            }, 401);
        }

        const {currentPassword, newPassword} = await c.req.json<{
            currentPassword: string;
            newPassword: string;
        }>();

        if (!currentPassword || !newPassword) {
            return c.json({
                success: false,
                message: "Current password and new password are required"
            }, 400);
        }

        if (newPassword.length < 6) {
            return c.json({
                success: false,
                message: "New password must be at least 6 characters long"
            }, 400);
        }

        const result = await AuthModel.UpdatePassword(userId, currentPassword, newPassword);

        if (!result.success) {
            return c.json(result, 400);
        }

        return c.json(result);
    } catch (error) {
        console.error("Error in updatePassword controller:", error);
        return c.json({
            success: false,
            message: "Server error while updating password"
        }, 500);
    }
};

/**
 * Update emergency contact
 */
const updateEmergencyContact = async (c: Context) => {
    try {
        const userId = c.get("userId") as number;

        if (!userId) {
            return c.json({
                success: false,
                message: "User ID not found"
            }, 401);
        }

        const contactData = await c.req.json<{
            contactName?: string;
            relationship?: string;
            contactPhone?: string;
            contactEmail?: string;
        }>();

        const result = await AuthModel.UpdateEmergencyContact(userId, contactData);

        if (!result.success) {
            return c.json(result, 400);
        }

        return c.json({
            success: true,
            data: result.emergencyContact,
            message: "Emergency contact updated successfully"
        });
    } catch (error) {
        console.error("Error in updateEmergencyContact controller:", error);
        return c.json({
            success: false,
            message: "Server error while updating emergency contact"
        }, 500);
    }
};

/**
 * Delete user account
 */
const deleteAccount = async (c: Context) => {
    try {
        const userId = c.get("userId") as number;

        if (!userId) {
            return c.json({
                success: false,
                message: "User ID not found"
            }, 401);
        }

        const result = await AuthModel.DeleteUser(userId);

        return c.json(result);
    } catch (error) {
        console.error("Error in deleteAccount controller:", error);
        return c.json({
            success: false,
            message: "Server error while deleting account"
        }, 500);
    }
};

export {
    register,
    login,
    getProfile,
    updateProfile,
    updatePassword,
    updateEmergencyContact,
    deleteAccount
};