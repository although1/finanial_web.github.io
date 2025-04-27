import chokidar from 'chokidar';
import { exec } from 'child_process';

// 监听的文件路径
const fileToWatch = 'src/data/personal_page.xlsx';

// 定义脚本执行函数
function runScripts() {
  console.log('检测到文件更新，开始执行脚本...');

  // 运行 cal_price.py 脚本
  exec('C:/Python313/python.exe c:/Users/HONGYAN/Desktop/project/src/data/cal_price.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`运行 cal_price.py 时出错: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`cal_price.py 错误输出: ${stderr}`);
      return;
    }
    console.log(`cal_price.py 输出: ${stdout}`);

    // 运行 npm run convert-data 脚本
    exec('npm run convert-data', (error, stdout, stderr) => {
      if (error) {
        console.error(`运行 convert-data 时出错: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`convert-data 错误输出: ${stderr}`);
        return;
      }
      console.log(`convert-data 输出: ${stdout}`);
    });
  });
}

// 初始化文件监听器
const watcher = chokidar.watch(fileToWatch, {
  persistent: true
});

// 监听文件变更事件
watcher.on('change', (path) => {
  console.log(`${path} 文件已更新`);
  runScripts();
});

console.log(`正在监听文件: ${fileToWatch}`);