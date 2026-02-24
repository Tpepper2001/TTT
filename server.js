const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// IMPORTANT: Render provides the port via process.env.PORT
const PORT = process.env.PORT || 3000;

app.post('/track', async (req, res) => {
    const { targetLink, fingerprint, type } = req.body;
    console.log(`[${type}] Visiting: ${targetLink}`);

    try {
        const response = await axios.get(targetLink, {
            headers: { 'User-Agent': fingerprint.userAgent },
            maxRedirects: 5,
            timeout: 10000,
            validateStatus: false
        });
        
        res.json({ 
            success: true, 
            finalUrl: response.request.res.responseUrl || targetLink 
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
