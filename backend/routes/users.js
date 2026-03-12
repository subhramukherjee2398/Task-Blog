const express = require('express');
const router = express.Router();
const {
  getUserById,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public route
router.get('/:id', getUserById);

// Protected routes
router.get('/', protect, getAllUsers);
router.delete('/:id', protect, deleteUser);

module.exports = router;
