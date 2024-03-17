import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    name: String,
    data: Buffer
});
export const ImageUpload = mongoose.model('Images', ImageSchema);
