require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'LeetJudge API is running' });
});

// Bootstrap application
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
