import mongoose from 'mongoose';

const userShema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        reset: {
            code: {
                type: String,
                default: null
            },

            time: {
                type: String,
                default: null
            }
        }
    },
    { collection: 'users', timestamps: true }
);

export const User = mongoose.model('users', userShema);
