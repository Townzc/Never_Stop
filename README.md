# Never Stop - 中年英语学习平台

为 40-65 岁中文母语者打造的生活英语学习网页应用。

## 🚀 在线体验

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTownzc%2FNever_Stop)

**一键部署步骤：**
1. 点击上方按钮，用 GitHub 账号登录 Vercel
2. 点击 "Deploy"，等待 1-2 分钟
3. 部署完成后会生成一个 `xxx.vercel.app` 的链接，直接分享给别人即可

**或者手动部署：**
1. 访问 [vercel.com/new](https://vercel.com/new)
2. 选择 "Import Git Repository"
3. 输入 `https://github.com/Townzc/Never_Stop`
4. 点击 Deploy，完成！

## 功能特色

- **评估测试** - 词汇/标识/听力/口语/发音五维能力评测
- **目标导向** - 根据学习目标（旅行/探亲/看病等）生成个性化路径
- **今日任务** - 每天 30-45 分钟，3 小课短时高频
- **跟读练习** - 录音 + 四维评分反馈 + 错音高亮
- **场景对话** - 餐厅/机场/药房等真实场景脚手架对话
- **标识识别** - 机场/商店/医院/交通标识训练
- **可视化进度** - 五维雷达图 + 学习热力图 + 里程碑
- **适老化设计** - 大字模式、高对比度、大触控目标

## 技术栈

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Zustand (状态管理)
- Recharts (雷达图)
- Web Speech API (语音)
- localStorage (数据持久化)

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── app/                    # 页面路由
│   ├── page.tsx           # 首页（今日任务）
│   ├── onboarding/        # 目标建档
│   ├── assessment/        # 评估测试
│   ├── lesson/[id]/       # 课程详情
│   └── progress/          # 学习进度
├── components/            # UI 组件
├── lib/                   # 工具函数和数据
│   ├── store.ts           # Zustand 状态管理
│   ├── mock-data.ts       # 课程/标识/场景数据
│   └── audio.ts           # 录音/播放工具
└── types/                 # TypeScript 类型定义
```

## 设计原则

- 字体：正文 18-20px，标题 24-28px
- 触控目标：>= 48dp
- 导航：底部 4 个 tab
- 课程：5-12 分钟/课
- 反馈：鼓励式，不用"失败"措辞
