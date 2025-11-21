import express from 'express';
import db from '../database.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Get all clients
router.get('/', (req, res) => {
  const query = `
    SELECT c.*, 
           COUNT(r.id) as review_count,
           AVG(r.rating) as average_rating
    FROM clients c
    LEFT JOIN reviews r ON c.id = r.client_id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get a single client by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM clients WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json(row);
  });
});

// Search clients by name or company
router.get('/search/:query', (req, res) => {
  const { query } = req.params;
  const searchQuery = `%${query}%`;
  
  db.all(
    `SELECT c.*, 
            COUNT(r.id) as review_count,
            AVG(r.rating) as average_rating
     FROM clients c
     LEFT JOIN reviews r ON c.id = r.client_id
     WHERE c.name LIKE ? OR c.company LIKE ?
     GROUP BY c.id`,
    [searchQuery, searchQuery],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Create a new client
router.post('/', writeLimiter, (req, res) => {
  const { name, company, industry } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Client name is required' });
    return;
  }
  
  db.run(
    'INSERT INTO clients (name, company, industry) VALUES (?, ?, ?)',
    [name, company, industry],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        name,
        company,
        industry
      });
    }
  );
});

// Get client statistics
router.get('/:id/stats', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      COUNT(r.id) as total_reviews,
      AVG(r.rating) as average_rating,
      AVG(r.payment_promptness) as avg_payment_promptness,
      AVG(r.communication_quality) as avg_communication_quality,
      SUM(CASE WHEN r.would_work_again = 1 THEN 1 ELSE 0 END) as would_work_again_count,
      SUM(CASE WHEN r.scope_creep_issue = 1 THEN 1 ELSE 0 END) as scope_creep_count
    FROM reviews r
    WHERE r.client_id = ?
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

export default router;
