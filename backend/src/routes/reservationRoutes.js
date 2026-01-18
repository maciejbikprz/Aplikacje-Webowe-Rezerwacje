const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservationController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, isAdmin, controller.getReservations);
router.get('/user/:userId', verifyToken, controller.getUserReservations);
router.post('/', verifyToken, controller.createReservation);
router.put('/:id', verifyToken, isAdmin, controller.updateReservationStatus);
router.delete('/:id', verifyToken, controller.deleteReservation);

module.exports = router;