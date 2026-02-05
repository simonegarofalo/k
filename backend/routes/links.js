const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireAuth = require("../middleware/requireAuth.js");

// Get all data form db
router.get('/', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const { sort } = req.query;

  const ORDER_BY_MAP = {
    date_asc: "created_at ASC",
    date_desc: "created_at DESC",
    az: "title ASC",
    za: "title DESC",
  };

  const orderBy =
    ORDER_BY_MAP[sort] || "created_at DESC";

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM links
      WHERE user_id = $1
      ORDER BY ${orderBy}
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      links: result.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch links" });
  }
});


// Add new link
router.post('/', requireAuth, async (req, res) => {
  const { url, title } = req.body;
  const userId = req.session.userId;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO links (url, title, user_id) VALUES ($1, $2, $3) RETURNING *',
      [url, title || url, userId]
    );

    res.status(201).json({
      success: true,
      link: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Delete a link
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  
  try {
    const result = await pool.query(
      'DELETE FROM links WHERE id = $1 AND user_id = $2 RETURNING *', 
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.status(200).json({
      success: true,
      link: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

