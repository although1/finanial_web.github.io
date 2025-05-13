const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

// 处理数据保存
app.post('/api/save-data', async (req, res) => {
  try {
    const { filePath, content } = req.body;
    const fullPath = path.join(__dirname, '..', filePath);
    
    await fs.writeFile(fullPath, content, 'utf8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
