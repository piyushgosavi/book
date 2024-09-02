const express = require('express');
const {
    getAllLibraries,
    getLibraryById,
    createLibrary,
    updateLibrary,
    deleteLibrary,
} = require('../controllers/libraryController');
const { isAuthenticated, isAuthorized } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/',isAuthenticated,getAllLibraries);
router.get('/:id',isAuthenticated,getLibraryById);
router.post('/', isAuthenticated,isAuthorized('Borrower'),createLibrary);
router.put('/:id', isAuthenticated,isAuthorized('Borrower'),updateLibrary);
router.delete('/:id',isAuthenticated,isAuthorized('Borrower'),deleteLibrary);

module.exports = router;