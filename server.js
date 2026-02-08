const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 3000;
const MEMORIES_DIR = path.join(__dirname, 'memories');

// Serve static files
app.use(express.static(__dirname));

// API endpoint to get images from memories folder
app.get('/api/images', (req, res) => {
    try {
        if (!fs.existsSync(MEMORIES_DIR)) {
            fs.mkdirSync(MEMORIES_DIR, { recursive: true });
            return res.json([]);
        }

        const files = fs.readdirSync(MEMORIES_DIR);
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        
        const images = files
            .filter(file => imageExtensions.some(ext => file.toLowerCase().endsWith(ext)))
            .map(file => ({
                src: `/memories/${encodeURIComponent(file)}`,
                caption: file.replace(/\.[^.]+$/, '')
            }));

        res.json(images);
    } catch (error) {
        console.error('Error reading memories folder:', error);
        res.status(500).json({ error: 'Failed to read images' });
    }
});

app.listen(PORT, () => {
    console.log(`\n🎉 Valentine's Gallery Server Running!`);
    console.log(`\n📍 Open your browser and go to: http://localhost:${PORT}`);
    console.log(`\n📸 Add your images to the "memories" folder`);
    console.log(`\n✨ Supported formats: .jpg, .jpeg, .png, .gif, .webp`);
    console.log(`\n💕 Press Ctrl+C to stop the server\n`);
});
