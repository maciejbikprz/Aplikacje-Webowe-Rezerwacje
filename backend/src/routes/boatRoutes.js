const express = require('express');
const router = express.Router();
const controller = require('../controllers/boatController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', controller.getAllBoats);
router.get('/:id', controller.getBoatById);
router.post('/', verifyToken, isAdmin, controller.createBoat);
router.put('/:id', verifyToken, isAdmin, controller.updateBoat);
router.delete('/:id', verifyToken, isAdmin, controller.deleteBoat);

module.exports = router;