# TrendPulse Demo

用于展示 TrendPulse 趋势监测与产品机会分析 Agent 的轻量网站版本。

## Demo 范围

- PC 端优先的对话式研究界面
- 三组预置研究样本
- 对未收录主题给出明确提示，不返回无关结果
- 趋势信号、产品机会和证据线索展示
- 深色模式、移动端布局和无障碍键盘操作
- 无外部 API、无用户数据存储、无运行成本

## 本地预览

这是一个纯静态网站，可直接打开 `index.html`，也可以使用任意静态文件服务器预览。

例如：

```bash
python3 -m http.server 4173
```

浏览器打开 `http://localhost:4173`。

## 在线访问

网站通过 GitHub Pages 发布：

`https://laumj0515-cloud.github.io/trendpulse-demo/`

## 说明

Demo 使用预置研究样本，不会实时采集网络数据，也不会调用大模型。公开部署时无需配置 API Key。
