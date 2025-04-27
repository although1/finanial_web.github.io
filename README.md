# Financial Dashboard

## 技术栈
- React 18 + TypeScript
- TailwindCSS 3
- ECharts 5 数据可视化

## 目录结构
```
project/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── charts/          # 图表组件库
│   │   │   ├── DetailedBarChart.tsx   # 多维度柱状图
│   │   │   ├── DistributionPieChart.tsx # 分布饼图
│   │   │   ├── RadarChart.tsx        # 多维度指标对比雷达图
│   │   │   ├── TreemapChart.tsx      # 成本结构分析树图
│   │   │   ├── TrendChart.tsx        # 趋势折线图
│   │   │   ├── WaterfallChart.tsx    # 财务数据流向瀑布图
│   │   │   └── ...                   # 其他可视化组件
│   │   ├── common/          # 公共组件
│   │   ├── Dashboard.tsx    # 核心仪表盘组件
│   │   └── Header.tsx       # 全局导航组件
│   ├── data/
│   │   ├── app_totals_*.json # 财务数据JSON文件
│   │   ├── cal_price.py     # 价格计算脚本
│   │   ├── convertJsonToMockData.ts # JSON转模拟数据工具
│   │   ├── dataProcessor.ts # 数据清洗转换处理器
│   │   ├── dataTypes.ts     # TypeScript类型定义
│   │   ├── mockData.ts      # 模拟数据
│   │   ├── mockData_origin.ts # 原始模拟数据
│   │   └── 个人记账.xlsx    # Excel记账模板
├── .bolt/                  # Bolt配置
│   └── config.json         # Bolt配置文件
├── .vite/                 # Vite缓存
│   └── deps/              # 依赖缓存
├── scripts/               # 脚本目录
├── .gitignore             # Git忽略规则
├── eslint.config.js       # ESLint配置
├── index.html             # 应用入口HTML
├── package-lock.json      # 依赖锁文件
├── package.json           # 依赖管理
├── postcss.config.js      # PostCSS配置
├── tailwind.config.js     # TailwindCSS配置
├── tsconfig.app.json      # TypeScript应用配置
├── tsconfig.json          # TypeScript主配置
├── tsconfig.node.json     # TypeScriptNode配置
└── vite.config.ts         # Vite构建配置
```

## 核心功能
### 数据处理系统
- `dataProcessor.ts`：提供数据标准化、格式转换和校验功能
- `dataTypes.ts`：定义财务数据相关TS类型（IncomeStatement等）

### 可视化系统
- 基于ECharts封装的可复用图表组件
- 支持动态主题切换（通过TailwindCSS实现）
- 图表类型包含：
  - 瀑布图（财务数据流向）
  - 雷达图（多维度指标对比）
  - 树图（成本结构分析）

## 开发指南
```bash
# 安装依赖
npm install
npm install -g typescript ts-node

# 启动开发服务器
npm run dev
node scripts/autoProcess.js

# 构建生产版本
npm run build
```

## 依赖说明
- 核心依赖：`echarts-for-react`实现图表集成
- 样式系统：TailwindCSS + Lucide图标库
- 代码规范：ESLint + React Hooks校验规则

"convert-data": "node --loader ts-node/esm src/data/convertJsonToMockData.ts"

### 待修改
目前每次更新完成个人记账.xlsx后，需要手动运行cal_price.py脚本，将xlsx转换为json文件，
然后再运行npm run convert-data脚本，生成模拟数据。
需要简化这些步骤，自动完成。