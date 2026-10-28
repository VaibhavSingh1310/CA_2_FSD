const express = require("express");
const router = express.Router();
const Book = require("../models/book");
router.post('/books',async(req,res)=>{
     try {
        const {title, author, category} = req.body;
        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }
        const book = await Book.create({title,author,category});
        res.status(201).json({
            message: "Book added successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
});
router.get('/books', async (req, res) => {
    try {
        const page = parseInt(req.query.page,10)||1;
        const limit =parseInt(req.query.limit, 10)||10;
        const safePage = page>0?page: 1;
        const safeLimit =limit>0?limit: 10;
        const skip = (safePage-1)*safeLimit;
        const books= await Book.find().skip(skip).limit(safeLimit);
        const total=await Book.countDocuments();
        res.status(200).json({
            currentPage: safePage,
            totalRecords: total,
            totalPages: Math.ceil(total/safeLimit),
            books:books
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching books",
            error: error.message
        });
    }
});
router.patch('/:id',async(req,res)=>{
    const {available} = req.body;
    if(!availbale){
        return res.status(404).json({
            message:"Book is currently unavailable"
        })
    }
    const book = Book.findByIdAndUpdate(
         req.params.id,{available},
    )
    if(!book){
        return res.status(404).json({
            message:"Book not found"
        })
    }
})