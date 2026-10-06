# CutCod 投稿信息｜Replica QC 纯 Remotion（前半段）

- 分组：视频源代码
- 分类：产品动画
- 预览视频：`preview.mp4`
- 源码附件：当前目录中的 `src`、`public`、`scripts`、`package.json` 和 `package-lock.json`
- 技术规格：1920×1080，30fps，310 帧，画面约 10.33 秒，含音频流

## 推荐简介

这是一个用 React、SVG、CSS 和 Remotion 复现的产品宣传动效片段。工程保留可编辑的画面组件、几何参数、Logo 数据、星点数据、渲染脚本和参考音频，适合继续修改动效节奏、文案与视觉层级。

## 可直接复制的内容

```text
请在此工程中复现 Replica QC 纯 Remotion 视频前半段。使用 Node.js、npm、FFmpeg 和 ffprobe，执行 npm ci 与 npm run render:front；只注册 Replica 组合，使用 src/ 下 React/SVG/CSS 生成画面，复用 public/reference-audio.m4a 音频，输出 out/Replica-QC-pure-remotion.mp4，并运行 npm run verify 核验。
```

## 使用提示

先阅读 `README.md` 和 `给智能体的复现指令.txt`。原始工程的 `node_modules`、`out` 和历史校验文件没有复制到本地投稿目录，需要在干净环境重新安装依赖并渲染验证。
