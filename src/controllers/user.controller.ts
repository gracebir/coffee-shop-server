/** @format */

import { Request, Response } from "express";
import prisma from "../utils/seed";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "../validations/user.validation";
import Joi from "joi";
import { signInJwt } from "../utils/jwt";
import { createSession } from "../utils/session";

const getUser = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    return user;
};

export default {
    registerUser: async (req: Request, res: Response) => {
        const { name, email, password } = req.body;
        const user = await getUser(email);
        const validate = Joi.validate(req.body, registerSchema);
        if (validate.error)
            return res
                .status(400)
                .json({ error: validate.error.details[0].message });
        try {
            if (user)
                return res
                    .status(400)
                    .json({ message: "User email already exists!!!" });
            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashPassword,
                },
            });

            return res.status(201).json({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const validate = Joi.validate(req.body, loginSchema);
        if (validate.error)
            return res
                .status(400)
                .json({ error: validate.error.details[0].message });
        try {
            const user = await getUser(email);
            if (!user)
                return res.status(400).json({ message: "User does not exist" });

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch)
                return res.status(400).json({ message: "Incorrect password" });

            const session = createSession(user.email, user.name);

            const refreshToken = await signInJwt(
                { sessionId: session.sessionId },
                "1y"
            );
            const accessToken = await signInJwt(
                {
                    id: user.id,
                    email: user.email,
                    sessionId: session.sessionId,
                },
                "1d"
            );

            res.cookie("accessToken", accessToken, {
                maxAge: 300000,
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                maxAge: 3.154e10, // 1 year
                httpOnly: true,
            });
            return res.status(200).json({
                accessToken,
                id: user.id,
                email: user.email,
                name: user.name,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteUser: async (req: Request, res: Response) => {
        const userId = req.params.id;
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: parseInt(userId),
                },
            });
            if (!user)
                return res
                    .status(400)
                    .json({ message: "User does not exist !!!" });
            const removedUser = await prisma.user.delete({
                where: {
                    email: user.email,
                },
            });
            return res.status(200).json({
                message: `${removedUser.name} deleted successfully`,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    logout: (req: Request, res: Response) => {
        res.cookie("accessToken", "", {
            maxAge: 0,
            httpOnly: true,
        });
        return res.status(200).json({ message: "Logout successfully" });
    },
};
