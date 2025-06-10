import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in .env file');
        }

        await mongoose.connect(uri);
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas', err);
        throw err;
    }
};

export default connectDB;