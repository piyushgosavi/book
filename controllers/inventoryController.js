const Library = require('../models/Library');
const Book = require('../models/Book');
const i18next = require('i18next');

exports.getLibraryInventory = async (req, res) => {
    try {
        const library = await Library.findById(req.params.id).populate('books');
        if (!library) return res.status(404).json({ message: i18next.t('libraryNotFound') });
        res.json(library.books);
    } catch (err) {
        res.status(500).json({ message: i18next.t('fetchInventoryError') });
    }
};

exports.addBookToInventory = async (req, res) => {
    try {
        const { bookId } = req.body;
        const library = await Library.findByIdAndUpdate(req.params.id, { $push: { books: bookId } }, { new: true });
        if (!library) return res.status(404).json({ message: i18next.t('libraryNotFound') });
        res.json({ message: i18next.t('bookAddedToInventory'), library });
    } catch (err) {
        res.status(500).json({ message: i18next.t('addInventoryError') });
    }
};

exports.removeBookFromInventory = async (req, res) => {
    try {
        const library = await Library.findByIdAndUpdate(req.params.id, { $pull: { books: req.params.bookId } }, { new: true });
        if (!library) return res.status(404).json({ message: i18next.t('libraryNotFound') });
        res.json({ message: i18next.t('bookRemovedFromInventory'), library });
    } catch (err) {
        res.status(500).json({ message: i18next.t('removeInventoryError') });
    }
};