const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/User', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                u."IDUser",
                u."Name",
                u."Surname",
                u."Middlename",
                u.email,
                u.login,
                u.role,
                u.created_at,
                r."Title" as role_name
            FROM "User" AS u
            INNER JOIN "Roles" AS r
                ON u.role = r."IDRole"
        `);
        
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения пользователей' });
    }
});

module.exports = router;
