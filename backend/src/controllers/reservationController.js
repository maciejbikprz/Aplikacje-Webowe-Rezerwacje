const db = require('../config/db');

exports.getReservations = async (req, res) => {
  try {
    let query = `
      SELECT r.*, 
             b.id as 'boat.id', b.name as 'boat.name', b.type as 'boat.type', b.description as 'boat.description',
             b.capacity as 'boat.capacity', b.pricePerDay as 'boat.pricePerDay',
             u.id as 'user.id', u.firstName as 'user.firstName', u.lastName as 'user.lastName', u.email as 'user.email'
      FROM reservations r 
      JOIN boats b ON r.boat_id = b.id 
      JOIN users u ON r.user_id = u.id
    `;
    let params = [];

    // If not admin, show only user's reservations
    if (req.user.role !== 'admin') {
      query += ' WHERE r.user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY r.created_at DESC';

    const [rows] = await db.query(query, params);
    
    // Transform the flat result into nested objects
    const reservations = rows.map(row => ({
      id: row.id,
      boatId: row.boat_id,
      userId: row.user_id,
      startDate: row.startDate,
      endDate: row.endDate,
      totalPrice: parseFloat(row.totalPrice),
      status: row.status,
      createdAt: row.created_at,
      boat: {
        id: row['boat.id'],
        name: row['boat.name'],
        type: row['boat.type'],
        description: row['boat.description'],
        capacity: row['boat.capacity'],
        pricePerDay: parseFloat(row['boat.pricePerDay'])
      },
      user: {
        id: row['user.id'],
        firstName: row['user.firstName'],
        lastName: row['user.lastName'],
        email: row['user.email']
      }
    }));

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Verify user can only see their own reservations (unless admin)
    if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const query = `
      SELECT r.*, 
             b.id as 'boat.id', b.name as 'boat.name', b.type as 'boat.type', b.description as 'boat.description',
             b.capacity as 'boat.capacity', b.pricePerDay as 'boat.pricePerDay'
      FROM reservations r 
      JOIN boats b ON r.boat_id = b.id 
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `;

    const [rows] = await db.query(query, [userId]);
    
    const reservations = rows.map(row => ({
      id: row.id,
      boatId: row.boat_id,
      userId: row.user_id,
      startDate: row.startDate,
      endDate: row.endDate,
      totalPrice: parseFloat(row.totalPrice),
      status: row.status,
      createdAt: row.created_at,
      boat: {
        id: row['boat.id'],
        name: row['boat.name'],
        type: row['boat.type'],
        description: row['boat.description'],
        capacity: row['boat.capacity'],
        pricePerDay: parseFloat(row['boat.pricePerDay'])
      }
    }));

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const { boatId, userId, startDate, endDate } = req.body;
    const authenticatedUserId = req.user.id;

    // Verify user can only create reservations for themselves (unless admin)
    if (req.user.role !== 'admin' && authenticatedUserId !== parseInt(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!boatId || !startDate || !endDate) {
      return res.status(400).json({ message: 'boatId, startDate, and endDate are required' });
    }

    // Check if boat exists and is available
    const [boats] = await db.query('SELECT * FROM boats WHERE id = ?', [boatId]);
    if (boats.length === 0) {
      return res.status(404).json({ message: 'Boat not found' });
    }

    const boat = boats[0];
    if (boat.status !== 'available') {
      return res.status(400).json({ message: 'Boat is not available for reservation' });
    }

    // Check for date conflicts
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Check for overlapping reservations
    const [conflicts] = await db.query(
      `SELECT id FROM reservations 
       WHERE boat_id = ? 
       AND status != 'cancelled'
       AND (
         (startDate <= ? AND endDate >= ?) OR
         (startDate <= ? AND endDate >= ?) OR
         (startDate >= ? AND endDate <= ?)
       )`,
      [boatId, startDate, startDate, endDate, endDate, startDate, endDate]
    );

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'Boat is already reserved for these dates' });
    }

    // Calculate total price
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * parseFloat(boat.pricePerDay);

    const [result] = await db.query(
      'INSERT INTO reservations (user_id, boat_id, startDate, endDate, totalPrice, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, boatId, startDate, endDate, totalPrice, 'confirmed']
    );

    const [newReservation] = await db.query(
      `SELECT r.*, 
              b.id as 'boat.id', b.name as 'boat.name', b.type as 'boat.type', b.description as 'boat.description',
              b.capacity as 'boat.capacity', b.pricePerDay as 'boat.pricePerDay'
       FROM reservations r 
       JOIN boats b ON r.boat_id = b.id 
       WHERE r.id = ?`,
      [result.insertId]
    );

    const reservation = {
      id: newReservation[0].id,
      boatId: newReservation[0].boat_id,
      userId: newReservation[0].user_id,
      startDate: newReservation[0].startDate,
      endDate: newReservation[0].endDate,
      totalPrice: parseFloat(newReservation[0].totalPrice),
      status: newReservation[0].status,
      boat: {
        id: newReservation[0]['boat.id'],
        name: newReservation[0]['boat.name'],
        type: newReservation[0]['boat.type'],
        description: newReservation[0]['boat.description'],
        capacity: newReservation[0]['boat.capacity'],
        pricePerDay: parseFloat(newReservation[0]['boat.pricePerDay'])
      }
    };

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const [existing] = await db.query('SELECT id FROM reservations WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    await db.query('UPDATE reservations SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Reservation status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT user_id FROM reservations WHERE id = ?', [req.params.id]);
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user can delete this reservation
    if (req.user.role !== 'admin' && existing[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await db.query('DELETE FROM reservations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};