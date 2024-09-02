const Book = require('../models/Book');
const Library = require('../models/Library');
const bucket = require('../config/firebase');
const i18next = require('i18next');

const { v4: uuidv4} = require('uuid');


exports.getAllbook = async(req,res) =>{
    try {
        const books = await Book.find().populate('author library borrower');
        res.json(books);
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: i18next.t('fetchBooksError')});
    }

}


exports.getBookById = async(req,res) =>{
    try {
        
        const book = await Book.findById(req.params.id).populate('author library borrower');
        if (!book) return res.status(404).json({ message: i18next.t('bookNotFound') });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: i18next.t('fetchBookError') });
    }

}


exports.createBook = async (req, res) => {
    try {
        const { title, author, library, borrower } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: i18next.t('missingFile') });
        }

        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream({
            resumable: true,
            contentType: file.mimetype,
        });

        blobStream.on('error', (err) => {
            console.error('Error uploading to Firebase:', err);
            return res.status(500).json({ message: i18next.t('uploadError') });
        });

        blobStream.on('finish', async () => {
            try {
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                console.log('File uploaded to:', publicUrl);

                const book = new Book({
                    title,
                    author,
                    library,
                    borrower,
                    image: publicUrl,
                });

                await book.save();
                await Library.findByIdAndUpdate(library, { $push: { books: book._id } });

                res.status(201).json({ message: i18next.t('bookCreated'),book });
            } catch (saveErr) {
                console.error('Error saving book to database:', saveErr);
                res.status(500).json({ message: i18next.t('createBookError') });
            }
        });

        blobStream.end(file.buffer);
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ message: i18next.t('createBookError') });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, library, borrower, image: newImage } = req.body;
        let publicUrl;

        // Validate input
        if (!title && !author && !library && !newImage && !borrower) {
            return res.status(400).json({ message: i18next.t('noUpdateFields') });
        }

        // Handle image upload if a new image is provided
        if (req.file) {
            const file = req.file;
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream({
                resumable: true,
                contentType: file.mimetype,
            });

            blobStream.on('error', (err) => {
                console.error('Error uploading to Firebase:', err);
                return res.status(500).json({ message: i18next.t('uploadError') });
            });

            blobStream.on('finish', async () => {
                try {
                    publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    console.log('File uploaded to:', publicUrl);

                    // Find and update the book with the new image URL
                    const book = await Book.findByIdAndUpdate(id, { title, author, library, borrower, image: publicUrl }, { new: true });

                    if (!book) {
                        return res.status(404).json({ message: i18next.t('bookNotFound') });
                    }

                    res.json({ message: i18next.t('bookUpdated'), book });
                } catch (err) {
                    console.error('Error updating book with new image URL:', err);
                    res.status(500).json({ message: i18next.t('updateBookError') });
                }
            });

            blobStream.end(file.buffer);
        } else {
            // Handle case where no new image is provided
            const book = await Book.findByIdAndUpdate(id, { title, author, library, borrower }, { new: true });

            if (!book) {
                return res.status(404).json({ message: i18next.t('bookNotFound') });
            }

            res.json({ message: i18next.t('bookUpdated'), book });
        }
    } catch (err) {
        console.error('Error updating book:', err);
        res.status(500).json({ message: i18next.t('updateBookError') });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: i18next.t('bookNotFound') });
        await Library.findByIdAndUpdate(book.library, { $pull: { books: book._id } });
        res.json({ message: i18next.t('bookDeleted') });
    } catch (err) {
        res.status(500).json({ message: i18next.t('deleteBookError') });
    }
};