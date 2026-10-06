# Replica QC 纯 Remotion 视频：前半段

本工程对应用户选中的 `Replica-QC-pure-remotion.mp4`：1920×1080、30fps、310帧，视频约10.333秒，含完整音尾的容器约10.346秒。

## 执行

需要 Node.js 22 或更新的兼容 LTS、npm、FFmpeg 和 ffprobe。首次安装依赖/下载浏览器需要联网，复现不需要原参考视频，也不需要 Gemini 或其他模型 API。

在本工程根目录运行：

```powershell
npm ci
npm run render:front
```

输出为 `out/Replica-QC-pure-remotion.mp4`。脚本自动用 ffprobe 核验并输出 `out/ffprobe.json`、`out/verification.json`，也可用 `npm run verify` 单独复核。可用 `BROWSER_EXECUTABLE`、`FFMPEG`、`FFPROBE` 指定本机可执行文件。Windows 默认优先使用已安装的 Chrome；其他环境由 Remotion 获取其支持的浏览器。路径含空格时无需修改脚本。

## 源码与素材

- `src/root.tsx` 只注册 `Replica`，只输出前半段。
- `src/replica.tsx` 保留当时导出版本的完整原始字节，含文字、卡片、矢量场景及动画。
- `src/background.json`、`logos.json`、`card-geometry.json`、`stars.json` 为生成画面的参数。
- `public/` 只有 `reference-audio.m4a`；没有任何视觉图片、视频或后半段素材。
- 核心文件中保留了历史未启用的续段函数，以保持源码哈希一致；这些函数没有注册、不会出现在本工程成片中。

音频通过 FFmpeg 直接复用完整流，不加 `-shortest`。修改文字、颜色、动画后继续运行同一命令即可。

## 来源与核验范围

核心源码与历史纯 Remotion 审计记录一致，历史目标视频 SHA-256 为 `613fc5f5961245c410616ba09fb3f40d46ef40acdf486abcbe9d2ec8675b2060`。历史成片和原参考视频均未装入本包。`evidence/` 是历史文字记录，里面的旧绝对路径仅为溯源，不是运行依赖。

本次整理只收窄注册入口、增加便携渲染/核验脚本，未改动画本体。本机已实际执行 `npm ci` 与 `npm run render:front`，310/310 帧及音频核验通过；输出只留在本地 `out/`，不会进入源码 ZIP。不同浏览器/编码器的结果可能存在像素或容器字节差异，不以整个 MP4 哈希相同作为复现条件。

给其他智能体使用时，复制本目录的 `给智能体的复现指令.txt`；异机使用须同时提供本文件夹或 ZIP。
