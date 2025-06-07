import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DB_URL || process.env.AZURE_COSMOS_CONNECTIONSTRING;

mongoose.set('strictQuery', false);
mongoose
    .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('DB connection is successfully');
    })
    .catch((error) => {
        console.log('MongoDB connection error: ', error);
    });
