const db = require('../config/db');

exports.getAllBoats = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM boats';
    let params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBoatById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM boats WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Boat not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBoat = async (req, res) => {
  try {
    const { name, type, description, capacity, pricePerDay, length, status, image } = req.body;
    
    if (!name || !type || !capacity || !pricePerDay) {
      return res.status(400).json({ message: 'Name, type, capacity, and pricePerDay are required' });
    }

    const [result] = await db.query(
      'INSERT INTO boats (name, type, description, capacity, pricePerDay, length, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, type, description || null, capacity, pricePerDay, length || null, status || 'available', image || null]
    );
    
    const [newBoat] = await db.query('SELECT * FROM boats WHERE id = ?', [result.insertId]);
    res.status(201).json(newBoat[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBoat = async (req, res) => {
  try {
    const { name, type, description, capacity, pricePerDay, length, status, image } = req.body;
    
    // Check if boat exists
    const [existing] = await db.query('SELECT id FROM boats WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Boat not found' });
    }

    await db.query(
      'UPDATE boats SET name=?, type=?, description=?, capacity=?, pricePerDay=?, length=?, status=?, image=? WHERE id=?',
      [name, type, description, capacity, pricePerDay, length, status, image, req.params.id]
    );
    
    const [updatedBoat] = await db.query('SELECT * FROM boats WHERE id = ?', [req.params.id]);
    res.json(updatedBoat[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBoat = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id FROM boats WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Boat not found' });
    }

    await db.query('DELETE FROM boats WHERE id = ?', [req.params.id]);
    res.json({ message: 'Boat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};