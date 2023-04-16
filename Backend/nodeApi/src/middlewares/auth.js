import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { APIError } from '../utils/error.js';

export const createToken = async (user, res) => {
    const payload = {
        sub: user._id,
        name: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: 'HS512',
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return res.status(201).json({
        success: true,
        token,
        message: 'login is successfuly',
        userName: user.name,
        userlastName: user.lastName
    });
};

export const checkToken = async (req, res, next) => {
    const headerToken =
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ');
    if (!headerToken) {
        return res.status(401).json({
            success: false,
            message: 'Please sign in first!'
        });
        // throw new APIError("Please sign in first", 401);
    }

    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'invalid token'
            });
            // throw new APIError("invalid token", 401);
        }

        const userInfo = await User.findById(decoded.sub).select(
            '_id name lastName email '
        );

        if (!userInfo) throw new APIError('invalid token', 401);
        req.user = userInfo;
        next();
    });
};

export const createTempToken = async (userId, userEmail) => {
    const payload = {
        sub: userId,
        email: userEmail
    };

    const temptoken = jwt.sign(payload, process.env.JWT_TEMPORARY_KEY, {
        algorithm: 'HS512',
        expiresIn: process.env.JWT_TEMPORARY_EXPIRES_IN
    });

    return 'Bearer ' + temptoken;
};

export const decodedTempoararyToken = async (tempToken) => {
    let userInfo;
    const token = tempToken.split(' ')[1];
    await jwt.verify(
        token,
        process.env.JWT_TEMPORARY_KEY,
        async (err, decoded) => {
            if (err) throw new APIError('invalid token!', 401);
            userInfo = await User.findById(decoded.sub).select(
                '_id name lastName email'
            );

            if (!userInfo) throw new APIError('invalid token', 401);
        }
    );
    return userInfo;
};
