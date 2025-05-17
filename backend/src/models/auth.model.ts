import {db} from "../index.ts";
import * as bcrypt from "bcrypt";
import {sign} from "hono/jwt";
import type {userData} from "../types/type.js";

// Define emergency contact data type
type emergencyContactData = {
    contactName?: string;
    relationship?: string;
    contactPhone?: string;
    contactEmail?: string;
};

/**
 * Register a new user with optional emergency contact
 */
const Register = async (userData: userData) => {
    try {
        // Check if user already exists with the same idNumber
        const existingUserById = await db.user.findUnique({
            where: {
                idNumber: userData.idNumber,
            },
        });

        if (existingUserById) {
            return {success: false, message: "User with this ID number already exists"};
        }

        // Check if user already exists with the same email
        const existingUserByEmail = await db.user.findUnique({
            where: {
                email: userData.email,
            },
        });

        if (existingUserByEmail) {
            return {success: false, message: "User with this email already exists"};
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Create the user with optional emergency contact
        const user = await db.user.create({
            data: {
                idNumber: userData.idNumber,
                firstName: userData.firstName,
                lastName: userData.lastName,
                dob: new Date(userData.dob),
                age: userData.age,
                bloodType: userData.bloodType,
                email: userData.email,
                password: hashedPassword,
                // role is set by the default in the schema, no need to specify
                ...(userData.emergencyContact && {
                    emergencyContact: {
                        create: {
                            contactName: userData.emergencyContact.contactName,
                            relationship: userData.emergencyContact.relationship,
                            contactPhone: userData.emergencyContact.contactPhone,
                            contactEmail: userData.emergencyContact.contactEmail,
                        }
                    }
                })
            },
            include: {
                emergencyContact: true,
            },
        });

        // Return the user without the password
        const {password, ...userWithoutPassword} = user;
        return {success: true, user: userWithoutPassword};
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

/**
 * Authenticate a user with idNumber and password
 */
const Login = async (idNumber: string, password: string) => {
    try {
        // Find the user by idNumber
        const user = await db.user.findUnique({
            where: {
                idNumber: idNumber,
            },
            include: {
                emergencyContact: true
            }
        });

        if (!user) {
            return {success: false, message: "User not found"};
        }

        // Compare the provided password with the stored hash
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return {success: false, message: "Invalid password"};
        }

        // Generate JWT token
        const token = await sign({
            userId: user.id,
            role: user.role
        }, process.env.JWT_SECRET || "your-default-secret");

        // For Hono JWT, expiration needs to be set in the payload if needed
        // const token = await sign({
        //    userId: user.id,
        //    role: user.role,
        //    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days from now
        // }, process.env.JWT_SECRET || "your-default-secret");

        // Return user without password
        const {password: _, ...userWithoutPassword} = user;
        return {
            success: true,
            user: userWithoutPassword,
            token
        };
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

/**
 * Get user by email
 */
const GetUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                email,
            },
            include: {
                emergencyContact: true,
            }
        });

        if (!user) {
            return null;
        }

        // Return user including password for internal verification
        return user;
    } catch (error) {
        console.error("Error getting user by email:", error);
        throw error;
    }
};

/**
 * Get user by ID
 */
const GetUserById = async (id: number) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id,
            },
            include: {
                emergencyContact: true,
                appointments: {
                    include: {
                        doctor: true
                    }
                }
            }
        });

        if (!user) {
            return null;
        }

        // Return user without password
        const {password, ...userWithoutPassword} = user;
        return userWithoutPassword;
    } catch (error) {
        console.error("Error getting user by ID:", error);
        throw error;
    }
};

/**
 * Update user profile
 */
const UpdateUser = async (userId: number, userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    bloodType?: string;
}) => {
    try {
        // Check if email is already in use by a different user
        if (userData.email) {
            const existingUser = await db.user.findUnique({
                where: {
                    email: userData.email,
                },
            });

            if (existingUser && existingUser.id !== userId) {
                return {success: false, message: "Email already in use by another account"};
            }
        }

        const updatedUser = await db.user.update({
            where: {
                id: userId,
            },
            data: userData,
            include: {
                emergencyContact: true,
            }
        });

        // Return user without password
        const {password, ...userWithoutPassword} = updatedUser;
        return {success: true, user: userWithoutPassword};
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

/**
 * Update user password
 */
const UpdatePassword = async (userId: number, currentPassword: string, newPassword: string) => {
    try {
        // Find the user
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return {success: false, message: "User not found"};
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);

        if (!isValidPassword) {
            return {success: false, message: "Current password is incorrect"};
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password
        await db.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword,
            },
        });

        return {success: true, message: "Password updated successfully"};
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
};

/**
 * Create or update emergency contact
 */
const UpdateEmergencyContact = async (userId: number, contactData: emergencyContactData) => {
    try {
        // Check if user has an emergency contact
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                emergencyContact: true,
            },
        });

        if (!user) {
            return {success: false, message: "User not found"};
        }

        let emergencyContact;

        if (user.emergencyContact) {
            // Update existing emergency contact
            emergencyContact = await db.emergencyContact.update({
                where: {
                    userId: userId,
                },
                data: {
                    contactName: contactData.contactName,
                    relationship: contactData.relationship,
                    contactPhone: contactData.contactPhone,
                    contactEmail: contactData.contactEmail,
                },
            });
        } else {
            // Create new emergency contact
            emergencyContact = await db.emergencyContact.create({
                data: {
                    contactName: contactData.contactName,
                    relationship: contactData.relationship,
                    contactPhone: contactData.contactPhone,
                    contactEmail: contactData.contactEmail,
                    userId: userId,
                },
            });
        }

        return {success: true, emergencyContact};
    } catch (error) {
        console.error("Error updating emergency contact:", error);
        throw error;
    }
};

/**
 * Delete a user account
 */
const DeleteUser = async (userId: number) => {
    try {
        // Delete emergency contact if exists
        await db.emergencyContact.deleteMany({
            where: {
                userId: userId,
            },
        });

        // Delete user's appointments
        await db.appointment.deleteMany({
            where: {
                userId: userId,
            },
        });

        // Delete the user
        await db.user.delete({
            where: {
                id: userId,
            },
        });

        return {success: true, message: "User account deleted successfully"};
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export {
    Register,
    Login,
    GetUserByEmail,
    GetUserById,
    UpdateUser,
    UpdatePassword,
    UpdateEmergencyContact,
    DeleteUser
};