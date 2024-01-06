const mongoose = require('mongoose');

// Connect to the Database

const connectDb =async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB);
         console.log("Succesfully connected to MongoDB")
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDb;