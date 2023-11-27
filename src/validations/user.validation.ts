/** @format */

import Joi from "joi";

export const registerSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

export const loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});
