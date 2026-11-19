const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.post('/', async (req, res) => {
    try {
        const { title, author, category } = req.body;
        if (!title || !author || !category) {
            return res.status(400).json({
                message: "Title, author and category are required"
            });
        }
        const book = await Book.create({ title, author, category });
        res.status(201).json({
            message: "Book added successfully",
            book
        });
    } catch (error) {
        const statusCode = error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({
            message: statusCode === 400 ? "Invalid book details" : "Server error",
            error: error.message
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = Number.parseInt(req.query.page, 10) || 1;
        const limit = Number.parseInt(req.query.limit, 10) || 10;
        const safePage = page > 0 ? page : 1;
        const safeLimit = limit > 0 ? Math.min(limit, 100) : 10;
        const skip = (safePage - 1) * safeLimit;
        const [books, total] = await Promise.all([
            Book.find().sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
            Book.countDocuments()
        ]);

        res.status(200).json({
            currentPage: safePage,
            totalRecords: total,
            totalPages: Math.ceil(total / safeLimit),
            books
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching books",
            error: error.message
        });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { available } = req.body;

        if (typeof available !== "boolean") {
            return res.status(400).json({
                message: "Available must be a boolean"
            });
        }

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            {available},
            {new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book availability updated successfully",
            book
        });
    } catch (error) {
        const statusCode = error.name === "CastError" ? 400 : 500;
        res.status(statusCode).json({
            message: statusCode === 400 ? "Invalid book id" : "Server error",
            error: error.message
        });
    }
});

module.exports = router;
