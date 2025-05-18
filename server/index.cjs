const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// 检查操作系统，并设置对应的换行符
const EOL = os.platform() === 'win32' ? '\r\n' : '\n';

const convertToSystemEOL = (content) => {
  // 首先统一将所有换行符转换为 \n
  content = content.replace(/\r\n|\r|\n/g, '\n');
  // 然后转换为系统对应的换行符
  return content.replace(/\n/g, EOL);
};

// API endpoint for running scripts
app.post('/api/run-script', async (req, res) => {
  try {
    const { command, args } = req.body;
    
    if (!command || !Array.isArray(args)) {
      return res.status(400).json({ error: 'Invalid command or arguments' });
    }

    const rootDir = path.join(__dirname, '..');

    // 根据操作系统选择合适的命令
    let finalCommand;
    let finalArgs;
    if (os.platform() === 'win32') {
      // 在 Windows 上，使用 npx 来运行 tsx
      finalCommand = 'npx';
      finalArgs = ['tsx', ...args];
    } else {
      finalCommand = command;
      finalArgs = args;
    }

    const scriptProcess = spawn(finalCommand, finalArgs, {
      cwd: rootDir,
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    scriptProcess.stdout.on('data', (data) => {
      stdout += data;
    });

    scriptProcess.stderr.on('data', (data) => {
      stderr += data;
    });

    scriptProcess.on('error', (error) => {
      console.error('Failed to start script:', error);
      res.status(500).json({
        error: 'Failed to start script',
        details: error.message
      });
    });

    scriptProcess.on('close', (code) => {
      if (code === 0) {
        res.json({ 
          success: true, 
          stdout,
          command: `${finalCommand} ${finalArgs.join(' ')}`
        });
      } else {
        res.status(500).json({
          error: 'Script execution failed',
          code,
          stdout,
          stderr,
          command: `${finalCommand} ${finalArgs.join(' ')}`
        });
      }
    });
  } catch (error) {
    console.error('Error running script:', error);
    res.status(500).json({
      error: 'Failed to run script',
      details: error.message
    });
  }
});

// API endpoint to save data
app.post('/api/save-data', async (req, res) => {
  try {
    const { filename, content, isJson } = req.body;
    
    if (!filename || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 规范化文件路径，移除任何尝试访问上级目录的部分
    const normalizedFilename = path.normalize(filename).replace(/^(\.\.[\/\\])+/, '');
    
    // 根据文件类型确定完整路径
    let filePath;
    if (normalizedFilename.startsWith('src/')) {
      // 如果路径已经包含 src/，则直接使用
      filePath = path.join(__dirname, '..', normalizedFilename);
    } else {
      // 否则假定文件应该在 src/data 目录下
      filePath = path.join(__dirname, '..', 'src', 'data', normalizedFilename);
    }
    const dataDir = path.join(__dirname, '..', 'src', 'data');

    // 验证文件路径和扩展名
    if (!filePath.startsWith(dataDir)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    // 验证文件扩展名
    const isValidExtension = isJson ? filename.endsWith('.json') : filename.endsWith('.ts');
    if (!isValidExtension) {
      return res.status(400).json({ error: 'Invalid file extension' });
    }

    // 确保目标目录存在
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // 转换内容的换行符为系统对应格式
    const contentWithCorrectEOL = convertToSystemEOL(content);

    // 写入文件
    await fs.writeFile(filePath, contentWithCorrectEOL, 'utf8');
    
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
