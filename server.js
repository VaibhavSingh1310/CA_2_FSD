const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/api/books", require("./routes/bookRoutes"));
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database connected successfully");
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed");
    });