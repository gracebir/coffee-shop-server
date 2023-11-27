/** @format */

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret_key = process.env.SECRET_KEY;

export const signInJwt = async (
    payload: object,
    expiresIn: number | string
) => {
    const token = await jwt.sign(payload, secret_key!, { expiresIn });
    return token;
};
