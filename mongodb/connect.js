require('dotenv').config();
const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_secret}@cluster0.nbmyio1.mongodb.net/entregaFinal?retryWrites=true&w=majority&appName=Cluster0`;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// Define the User Schema
const userSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: {
        type: String,
        unique: true,
    }
});

// Create the User model
const User = mongoose.model('usuarios', userSchema);

async function getAllUsers() {
    try {
        const users = await User.find({});
        return users;
    } catch (error) {
        console.error('Error retrieving users:', error);
        throw error;
    }
}

async function createUser(userData) {
    try {
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        console.log('User created successfully:', savedUser);
        return savedUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

async function connect_check() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

async function run() {
    try {
        const users = await getAllUsers();
        console.log('All users:', users);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function addUser() {
    try {
        const newUser = {
            nombre: "Juan",
            apellido: "Pérez",
            email: "juan.perez@example.com"
        };
        await createUser(newUser);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Main execution
async function main() {
    try {
        // First check connection
        await connect_check();

        // Finally add a new user (commented out for now)
        await addUser();
        
        // Then get all users
        await run();
        

    } catch (error) {
        console.error('Error in main execution:', error);
    } finally {
        // Disconnect only after all operations are complete
        await mongoose.disconnect();
    }
}

// Run everything
main().catch(console.dir);

