const express = require('express');
const router = express.Router();
const pool = require('../db');

// Получить всех авторов
router.get('/Author', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                "IDAuthor",
                "Name",
                "Surname",
                "MiddleName",
                "AvgRating",
                "Experience"
            FROM "Author"
        `);
        
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения авторов' });
    }
});

// Получить все книги
router.get('/Book', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                "IDBook",
                "Title",
                "Description",
                "ReleaseDate",
                "Rating"
            FROM "Book"
        `);
        
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения книг' });
    }
});

module.exports = router;