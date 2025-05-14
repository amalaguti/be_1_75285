import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_secret}@cluster0.nbmyio1.mongodb.net/entregaFinal?retryWrites=true&w=majority&appName=Cluster0`;

// Removed strict API version requirement
const clientOptions = { };

export const connectDB = async () => {
    try {
        await mongoose.connect(uri, clientOptions);
        // Verify connection with a ping
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Successfully connected to MongoDB!");
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

export { uri, clientOptions };