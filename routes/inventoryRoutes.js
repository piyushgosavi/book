const express = require('express');
const {
    getLibraryInventory,
    addBookToInventory,
    removeBookFromInventory,
} = require('../controllers/inventoryController');
const { isAuthenticated, isAuthorized } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/:id/inventory', isAuthenticated,getLibraryInventory);
router.post('/:id/inventory', isAuthenticated,isAuthorized('Borrower'),addBookToInventory);
router.delete('/:id/inventory/:bookId',isAuthenticated,isAuthorized('Borrower'),removeBookFromInventory);

module.exports = router;
