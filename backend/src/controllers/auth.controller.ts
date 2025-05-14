import * as AuthModel from "../models/auth.model.js";
import type {Context} from "hono";
import type {userData} from "../types/type.js";

const createUser = async (c: Context) => {
    try {
        // first check if email exists or not

        // return success: false
        // create later
        const {
            idNumber,
            firstName,
            lastName,
            dob,
            age,
            bloodType,
            email,
            password,
            // emergencyContact: {contactName, relationship}
        } = await c.req.json<userData>();
        const userData = {
            idNumber: idNumber,
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            age: age,
            bloodType: bloodType,
            email: email,
            password: password,
            // emergencyContact: {}
        };
        const user = await AuthModel.GetUserByEmail(email);
        const newUser = await AuthModel.Register(userData);
        return c.json({
            success: true,
            data: newUser,
            msg: "Registered successfully"
        });
    } catch (error) {
        return error;
    }
}

export {createUser};