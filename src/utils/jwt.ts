/** @format */

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret_key = process.env.SECRET_KEY;

export const signInJwt = (payload: object, expiresIn: number | string) => {
    return jwt.sign(payload, secret_key!, { expiresIn });
};
