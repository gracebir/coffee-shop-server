/** @format */

import { Request, Response } from "express";
import prisma from "../utils/seed";
import bcrypt from "bcryptjs";
import { registerSchema } from "../validations/user.validation";
import Joi from "joi";

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
};
