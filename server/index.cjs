const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// API endpoint to save data
app.post('/api/save-data', async (req, res) => {
  try {
    const { filename, content } = req.body;
    
    if (!filename || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 规范化文件路径
    const normalizedFilename = path.normalize(filename).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, '..', 'src', 'data', normalizedFilename);
    const dataDir = path.join(__dirname, '..', 'src', 'data');

    // 验证文件路径
    if (!filePath.startsWith(dataDir) || !filename.endsWith('.ts')) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    // 确保目标目录存在
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // 写入文件
    await fs.writeFile(filePath, content, 'utf8');
    
    console.log(`Successfully saved file: ${filePath}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ 
      error: 'Failed to save file',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
