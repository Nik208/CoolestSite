const express = require('express');
const cors = require('cors'); 
require('dotenv').config();  

const authRoutes = require('./routes/auth');
const lessonsRoutes = require('./routes/lessons');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', lessonsRoutes);

app.get('/', (req, res) => {
    res.send('MPT API работает');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});