const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// API endpoint to save data
app.post('/api/save-data', async (req, res) => {
  try {
    const { filename, content } = req.body;
    const filePath = path.join(__dirname, '../src/data', filename);

    // 确保只能保存到 src/data 目录，且只能保存 .ts 文件
    if (!filePath.startsWith(path.join(__dirname, '../src/data')) || !filename.endsWith('.ts')) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    await fs.writeFile(filePath, content, 'utf8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
