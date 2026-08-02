# 杭州虫洞科技咨询有限公司 · 官网

跨境电商财税合规咨询的静态企业官网，由旧多页站点升级为单页展示站，并嵌入《跨境电商财税报告·从业者版》。

> 本目录是可发布副本。目标独立仓库：[`fleekelon/wormhole-tax-website`](https://github.com/fleekelon/wormhole-tax-website)。若 Cloud Agent 对该仓库无推送权限，可先在此维护，再手动同步。

## 本地预览

```bash
cd sites/wormhole-tax-website
python3 -m http.server 8080
```

打开 `http://localhost:8080`：

- 首页：`/`
- 报告在线阅读：`/report.html`

## 站点结构

| 路径                                                              | 说明                                  |
| ----------------------------------------------------------------- | ------------------------------------- |
| `index.html`                                                      | 单页官网（服务 / 关于 / 报告 / 联系） |
| `report.html`                                                     | PDF 在线阅读与下载                    |
| `assets/`                                                         | 主视觉、办公配图、报告封面与 PDF      |
| `about.html` / `services.html` / `contact.html` / `insights.html` | 旧路径兼容跳转                        |

## 同步到独立仓库

```bash
# 在有 wormhole-tax-website 写权限的环境中执行
rsync -a --delete \
  --exclude '.git' \
  sites/wormhole-tax-website/ \
  ../wormhole-tax-website/
```
