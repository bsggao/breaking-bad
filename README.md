# Breaking Bad · 化学反应式剧情档案

一个围绕《Breaking Bad》人物、五季剧情流程与关键事件制作的沉浸式单页主页。

项目使用 React + Vite 实现，包含：

- 可交互的 3D 化学元素立方体、轨道与蓝色晶体
- 六张可翻转的人物档案卡
- 五季剧情阶段切换与纵向剧情时间线
- 八个可打开的关键事件档案
- 桌面端视差、卡片倾斜、Canvas 分子网络
- 移动端适配与减少动画偏好支持

人物区使用角色宣传照，并通过统一的暗角、颗粒和化学绿滤镜融入档案视觉。图像仅用于非官方剧情介绍。

## 本地预览

```bash
npm install
npm run dev
```

浏览器打开 `http://127.0.0.1:4173`。

## 生产构建

```bash
npm run build
npm run preview
```

页面组件位于 `src/components`，剧情与人物数据集中维护在 `src/data.js`，静态图片由 `public/assets` 提供。
