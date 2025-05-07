import { db } from "../index.ts";
import * as bcrypt from "bcrypt";

/**
 * Register a new user with their details
 */
const Register = async (userData: {
    idNumber: string;
    firstName: string;
    lastName: string;
    dob: string;
    age: number;
    bloodType?: string;
    email: string;
    password: string;
    emergencyContact?: {
        contactName: string;
        relationship: string;
        contactPhone: string;
        contactEmail?: string;
    };
}) => {
    try {
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
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

/**
 * Authenticate a user by idNumber and password
 */
const Login = async (idNumber: string, password: string) => {
    try {
        // Find the user by idNumber
        const user = await db.user.findUnique({
            where: {
                idNumber: idNumber,
            },
        });

        if (!user) {
            return { success: false, message: "User not found" };
        }

        // Compare the provided password with the stored hash
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return { success: false, message: "Invalid password" };
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword };
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

/**
 * Get user by ID
 */
const GetUserById = async (userId: number) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                emergencyContact: true,
            },
        });

        if (!user) {
            return null;
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        console.error("Error getting user:", error);
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
        const updatedUser = await db.user.update({
            where: {
                id: userId,
            },
            data: userData,
        });

        // Return user without password
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export { Register, Login, GetUserById, UpdateUser };