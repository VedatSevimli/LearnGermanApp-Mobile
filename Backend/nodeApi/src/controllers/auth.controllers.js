import { User } from '../models/user.model.js';

import bcrypt from 'bcrypt';
import { APIError } from '../utils/error.js';
import { Response } from '../utils/response.js';
import {
    createToken,
    createTempToken,
    decodedTempoararyToken
} from '../middlewares/auth.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendMail.js';
import moment from 'moment';

export const login = async (req, res) => {
    const { email, password } = req.body;
    let userInfo;
    try {
        userInfo = await User.findOne({ email });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error
        });
    }
    if (!userInfo) {
        return res.status(401).json({
            success: false,
            message: `There are no User in db like this email ${email}. Please check your email adres`
        });
    }

    const comparePassword = await bcrypt.compare(password, userInfo.password);

    if (!comparePassword) {
        // process.exit(1);
        return res.status(401).json({
            success: false,
            message: 'Password is false.'
        });
    }

    createToken(userInfo, res);
};

export const register = async (req, res) => {
    const { email } = req.body;

    const userCheck = await User.findOne({ email });

    if (userCheck) {
        return res.status(401).json({
            success: false,
            message: 'The email is allready used!'
        });
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);

    const userSave = new User(req.body);

    await userSave
        .save()
        .then((data) => {
            return new Response(data, 'Registration is successfull').created(
                res
            );
        })
        .catch(() => {
            throw new APIError(
                // eslint-disable-next-line quotes
                "The user couldn't registred! Please try again.",
                400
            );
        });
};

export const me = (req, res) => {
    return new Response(req.user).success(res);
};

export const forgetPassword = async (req, res) => {
    const { email } = req.body;

    const userInfo = await User.findOne({ email }).select(
        'name lastName email '
    );

    if (!userInfo) return new APIError('invalid User', 400);

    const resetCode = crypto.randomBytes(3).toString('hex');

    await sendEmail({
        from: 'bagerbahoz@outlook.de',
        to: userInfo.email,
        subject: 'reset pasword',
        text: `Yours rest cod : ${resetCode}`
    });

    await User.updateOne(
        { email },
        {
            reset: {
                code: resetCode,
                time: moment(new Date())
                    .add(15, 'minute')
                    .format('YYYY-MM-DD HH:mm:ss')
            }
        }
    );

    return new Response(true, 'please check your mailbox').success(res);
};

export const resetCodeCheck = async (req, res) => {
    const { email, code } = req.body;
    const userInfo = await User.findOne({ email }).select(
        '_id name lastName email reset'
    );

    if (!userInfo) throw new APIError('invalid user', 401);

    const dbTime = moment(userInfo?.reset?.time);
    const nowTime = moment(new Date());

    const timeDiff = dbTime.diff(nowTime, 'minutes');

    if (dbTime <= 0 || userInfo?.reset?.code !== code) {
        throw new APIError('invalid code', 401);
    }

    const tempToken = await createTempToken(userInfo._id, userInfo.email);

    return new Response({ tempToken }, 'you can reset your password').success(
        res
    );
};

export const resetPassword = async (req, res) => {
    const { password, tempToken } = req.body;

    const decodedToken = await decodedTempoararyToken(tempToken);

    const hashPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(
        { _id: decodedToken._id },
        {
            reset: {
                code: null,
                type: null
            },
            password: hashPassword
        }
    );

    return new Response(
        decodedToken,
        'the pasword changing is successfully'
    ).success(res);
};
