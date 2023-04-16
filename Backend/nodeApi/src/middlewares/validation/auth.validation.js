import joi from 'joi';
import { APIError } from '../../utils/error.js';

export class authValidation {
    // eslint-disable-next-line no-useless-constructor
    constructor() {}

    static register = async (req, res, next) => {
        try {
            await joi
                .object({
                    name: joi
                        .string()
                        .trim()
                        .min(3)
                        .max(50)
                        .required()
                        .messages({
                            'string.base': 'The name should be a string',
                            'string.empty': 'The name can not be empty',
                            'string.min':
                                'name length should be minimally 3 letter',
                            'string.max':
                                'name length should be maximum 50 letter',
                            'string.required': 'name is required'
                        }),
                    lastName: joi
                        .string()
                        .trim()
                        .min(3)
                        .max(50)
                        .required()
                        .messages({
                            'string.base': 'The lastName should be a string',
                            'string.empty': 'The lastName can not be empty',
                            'string.min':
                                'lastName length should be minimally 3 letter',
                            'string.max':
                                'lastName length should be maximum 50 letter',
                            'string.required': 'lastName is required'
                        }),
                    email: joi
                        .string()
                        .email()
                        .trim()
                        .min(4)
                        .max(50)
                        .required()
                        .messages({
                            'string.base': 'The Email should be a string',
                            'string.email': 'The Email is not valid',
                            'string.empty': 'The Email can not be empty',
                            'string.min':
                                'Email length should be minimally 4 letter',
                            'string.max':
                                'Email length should be maximum 50 letter',
                            'string.required': 'Email is required'
                        }),
                    password: joi
                        .string()
                        .trim()
                        .min(6)
                        .max(36)
                        .required()
                        .messages({
                            'string.base': 'The Password should be a string',
                            'string.empty': 'The Password can not be empty',
                            'string.min':
                                'Password length should be minimally 6 letter',
                            'string.max':
                                'Password length should be maximum 36 letter',
                            'string.required': 'Password is required'
                        })
                })
                .validateAsync(req.body);
        } catch (error) {
            if (error.details) {
                return res.status(400).json({
                    message: error.details[0].message,
                    success: false
                });
                // throw new APIError(error.details[0].message, 400);
            } else {
                throw new APIError('validation error', 400);
            }
        }
        next();
    };

    static login = async (req, res, next) => {
        try {
            await joi
                .object({
                    email: joi
                        .string()
                        .email()
                        .trim()
                        .min(3)
                        .max(50)
                        .required()
                        .messages({
                            'string.base': 'The Email should be a string',
                            'string.email': 'The Email is not valid',
                            'string.empty': 'The Email can not be empty',
                            'string.min':
                                'Email length should be minimally 3 letter',
                            'string.max':
                                'Email length should be maximum 50 letter',
                            'string.required': 'Email is required'
                        }),
                    password: joi
                        .string()
                        .trim()
                        .min(6)
                        .max(36)
                        .required()
                        .messages({
                            'string.base': 'The Password should be a string',
                            'string.empty': 'The Password can not be empty',
                            'string.min':
                                'Password length should be minimally 6 letter',
                            'string.max':
                                'Password length should be maximum 36 letter',
                            'string.required': 'Password is required'
                        })
                })
                .validateAsync(req.body);
        } catch (error) {
            console.log({ error });
            if (error.details) {
                return res.status(400).json({
                    message: error.details[0].message,
                    success: false
                });
                // throw new APIError(error.details[0].message, 400);
            } else {
                throw new APIError('validation error', 400);
            }
        }
        next();
    };
}
