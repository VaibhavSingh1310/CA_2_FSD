const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/api/books", require("./routes/bookRoutes"));

const port = Number.parseInt(process.env.PORT, 10) || 3000;

const startServer = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

if (require.main === module) {
    startServer().catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exitCode = 1;
    });
}

module.exports = app;
