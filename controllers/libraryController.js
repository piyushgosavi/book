const Library = require('../models/Library');
const i18next = require('i18next');

exports.getAllLibraries = async (req, res) => {
    try {
        const libraries = await Library.find().populate({
            path: 'books',
            populate: { path: 'borrower' },
        });
        res.json(libraries);
    } catch (err) {
        res.status(500).json({ message: i18next.t('fetchLibrariesError') });
    }
};

exports.getLibraryById = async (req, res) => {
    try {
        const library = await Library.findById(req.params.id).populate({
            path: 'books',
            populate: { path: 'borrower' },
        });
        if (!library) return res.status(404).json({ message: i18next.t('libraryNotFound') });
        res.json(library);
    } catch (err) {
        res.status(500).json({ message: i18next.t('fetchLibraryError') });
    }
};

exports.createLibrary = async (req, res) => {
    try {
        const { name, address } = req.body;

        if (!name || !address) {
            return res.status(400).json({ message: "not present"});
        }

        const library = new Library({ name, address });
        await library.save();
        res.status(201).json({ message: i18next.t('libraryCreated'), library });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: i18next.t('createLibraryError') });
    }
};

exports.updateLibrary = async (req, res) => {
    try {
        const library = await Library.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!library) return res.status(404).json({ message: i18next.t('libraryNotFound') });
        res.json({ message: i18next.t('libraryUpdated'), library });
    } catch (err) {
        res.status(500).json({ message: i18next.t('updateLibraryError') });
    }
};

exports.deleteLibrary = async (req, res) => {
    try {
        const library = await Library.findByIdAndDelete(req.params.id);
        if (!library) return res.status(404).json({ message: i18next.t('libraryNotFound') });
        res.json({ message: i18next.t('libraryDeleted') });
    } catch (err) {
        res.status(500).json({ message: i18next.t('deleteLibraryError') });
    }
};
