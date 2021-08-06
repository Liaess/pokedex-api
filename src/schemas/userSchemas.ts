import joi from "joi";

export const userSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: joi.string().required()
});

export const idSchema = joi.object({
    id: joi.number().required()
});