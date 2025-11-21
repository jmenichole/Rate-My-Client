import express from 'express';
import db from '../database.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Get all reviews
router.get('/', (req, res) => {
  const query = `
    SELECT r.*, c.name as client_name, c.company as client_company
    FROM reviews r
    JOIN clients c ON r.client_id = c.id
    ORDER BY r.created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get reviews for a specific client
router.get('/client/:clientId', (req, res) => {
  const { clientId } = req.params;
  
  const query = `
    SELECT r.*, c.name as client_name, c.company as client_company
    FROM reviews r
    JOIN clients c ON r.client_id = c.id
    WHERE r.client_id = ?
    ORDER BY r.created_at DESC
  `;
  
  db.all(query, [clientId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get a single review
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT r.*, c.name as client_name, c.company as client_company
    FROM reviews r
    JOIN clients c ON r.client_id = c.id
    WHERE r.id = ?
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.json(row);
  });
});

// Create a new review
router.post('/', writeLimiter, (req, res) => {
  const {
    client_id,
    rating,
    title,
    description,
    red_flags,
    would_work_again,
    payment_promptness,
    communication_quality,
    scope_creep_issue
  } = req.body;
  
  // Validation
  if (!client_id || !rating || !title || !description) {
    res.status(400).json({ 
      error: 'client_id, rating, title, and description are required' 
    });
    return;
  }
  
  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: 'Rating must be between 1 and 5' });
    return;
  }
  
  const redFlagsJson = red_flags ? JSON.stringify(red_flags) : null;
  
  db.run(
    `INSERT INTO reviews (
      client_id, rating, title, description, red_flags,
      would_work_again, payment_promptness, communication_quality, scope_creep_issue
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      client_id, rating, title, description, redFlagsJson,
      would_work_again, payment_promptness, communication_quality, scope_creep_issue
    ],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        client_id,
        rating,
        title,
        description
      });
    }
  );
});

// Update a review
router.put('/:id', writeLimiter, (req, res) => {
  const { id } = req.params;
  const {
    rating,
    title,
    description,
    red_flags,
    would_work_again,
    payment_promptness,
    communication_quality,
    scope_creep_issue
  } = req.body;
  
  const redFlagsJson = red_flags ? JSON.stringify(red_flags) : null;
  
  db.run(
    `UPDATE reviews SET
      rating = ?, title = ?, description = ?, red_flags = ?,
      would_work_again = ?, payment_promptness = ?, 
      communication_quality = ?, scope_creep_issue = ?
    WHERE id = ?`,
    [
      rating, title, description, redFlagsJson,
      would_work_again, payment_promptness, communication_quality, 
      scope_creep_issue, id
    ],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Review not found' });
        return;
      }
      res.json({ message: 'Review updated successfully' });
    }
  );
});

// Delete a review
router.delete('/:id', writeLimiter, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM reviews WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.json({ message: 'Review deleted successfully' });
  });
});

export default router;
