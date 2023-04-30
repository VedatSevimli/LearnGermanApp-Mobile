import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('DB connection is successfully');
    })
    .catch((error) => {
        console.log(error);
    });
