# Alphabiz documentation

Guides for building Alphabiz from this repository and for shipping your own branded app on the
same core. The English and 中文 guides describe the same workflow: the 中文 guides go deeper on
step-by-step setup and troubleshooting, the English guides are the reference for prerequisites and
the `developer/app.js` key table.

## English documentation

| Document | What it covers |
| --- | --- |
| [Build guide](en_us/README.md) | Prerequisites, fork and install steps, the `developer/app.js` key table, building installers, app updates, take-down, external i18n and terms of service |
| [Windows](en_us/windows.md) | Windows toolchain, the MSI target (x64 and arm64) and the APPX target with an externally supplied signing certificate |
| [macOS / Mac App Store](en_us/build-mac.md) | The `.app`, `.dmg` and `mas` targets, signing and App Store submission |
| [Fork checklist](en_us/fork-checklist.md) | Everything to change before you ship a fork: identifiers, runtime endpoints, take-down admins, assets, versions and signing |
| [External i18n](../i18n/README.md) | Layout of the translation directory that installed apps load at runtime, and the `check.js` validator |
| [Contributing](../CONTRIBUTING.md) | Development setup and pull request expectations |
| [Security policy](../SECURITY.md) | Supported versions, private vulnerability reporting and the rules for signing material |

## 中文文档

| 文档 | 内容 |
| --- | --- |
| [prepare-before-dev.md](zh_cn/prepare-before-dev.md) | 开发前的准备：Git、Node.js、Python、C++ 工具链、Yarn、WiX 等环境安装。 |
| [fork-public-repo.md](zh_cn/fork-public-repo.md) | 公共仓库版本开发指南：fork、同步上游、安装模块、定制、构建与生成安装包的完整流程。 |
| [fork-repo-hint.md](zh_cn/fork-repo-hint.md) | 开发流程步骤中的提示：fork／同步／克隆仓库、恢复被动态修改的文件、手动发布 release、测试环境变量、self-runner、版本号规则与强制更新。 |
| [customized-content.md](zh_cn/customized-content.md) | 定制化可修改内容：`app.js` 各键、更新通道、动态配置、强制更新、服务条款、图标、媒体库管理、安装包配置与 appx。 |
| [build-app.md](zh_cn/build-app.md) | 构建 APP：Snap 安装包，以及 arm64／universal 版本 dmg 安装包的构建步骤。 |
| [development-issues-solutions.md](zh_cn/development-issues-solutions.md) | 开发可能遇到的报错与解决方案：`yarn install`／`yarn dev` 常见报错、Windows 文件路径过长等。 |
| [fork-private-repo.md](zh_cn/fork-private-repo.md) | 私有仓库版本开发指南。仅供拥有上游应用仓库 alphabiz-app 访问权限的维护者使用；外部开发者请看 [fork-public-repo.md](zh_cn/fork-public-repo.md)。 |
| [use-github-pat.md](zh_cn/use-github-pat.md) | 使用 GitHub PAT（Personal Access Token）：仅开发私有仓库 alphabiz-app 时需要；公共仓库无需 PAT。 |
