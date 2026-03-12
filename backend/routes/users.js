const express = require('express');
const router = express.Router();
const {
  getUserById,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');


router.get('/:id', getUserById);


router.get('/', protect, getAllUsers);
router.delete('/:id', protect, deleteUser);

module.exports = router;
