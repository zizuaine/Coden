import { z } from "zod";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config.js";


const signupSchema = z.object({
    email: z.string().min(3).max(50).email(),
    password: z.string().min(3).max(50),
    firstname: z.string().min(3).max(50),
    lastname: z.string().min(3).max(50)
});

async function registerService({ email, password, firstname, lastname }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exist")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        email,
        password: hashedPassword,
        firstname,
        lastname
    })

    return {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
    }
}

async function signinService({ email, password }) {
    const user = await User.findOne({ email });
    const secret = getJwtSecret();

    if (!user) throw new Error("Please Sign up first");

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) throw new Error("Invalid Credentials");

    const token = jwt.sign(
        {
            id: user._id.toString()
        },
        secret,
        {
            expiresIn: "1h"
        }
    )

    return {
        token,
        user: {
            id: user._id.toString(),
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname
        }
    }
}

export async function authRegisterController(req, res) {
    try {
        const parsed = signupSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        }
        await registerService(parsed.data);
        res.status(200).json({
            message: "Signed Up succesfully!"
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Something went wrong"
        });
    }
}

export async function authSignInController(req, res) {
    try {
        const user = await signinService(req.body);
        res.status(200).json({ message: "Signed In succesfully!", ...user })
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Something went wrong"
        });
    }
}