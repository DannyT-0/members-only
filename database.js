const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to MongoDB database");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1); // Exit the process with failure
	}
};

connectDB();

module.exports = mongoose;
