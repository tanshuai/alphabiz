# 公共仓库版本开发指南

公共仓库地址: [alphabiz](https://github.com/tanshuai/alphabiz)

## 开发前的准备

请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/prepare-before-dev.md#%E5%BC%80%E5%8F%91%E5%89%8D%E7%9A%84%E5%87%86%E5%A4%87-">此文档</a> 进行开发前的准备。

## 开发流程步骤

### 1.Fork 公共仓库

请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#1-fork%E4%BB%93%E5%BA%93-">此文档</a> 进行 Fork 操作。

### 2.同步源仓库最新代码

如果源仓库没有更新，则可以跳过此步骤。如需同步，请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#2-%E5%90%8C%E6%AD%A5%E6%BA%90%E4%BB%93%E5%BA%93-">此文档</a> 。

### 3.克隆新创建的仓库到本地仓库

请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#3-%E5%85%8B%E9%9A%86%E4%BB%93%E5%BA%93-">此文档</a> 进行克隆操作。

### 4.安装本仓库的 Node.js 模块

在仓库根目录打开命令行，并执行以下命令：

```bash
yarn
```

如果遇到安装报错，请参考 [此文档](https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/development-issues-solutions.md#1--yarn-install-%E5%8F%AF%E8%83%BD%E9%81%87%E5%88%B0%E7%9A%84%E6%8A%A5%E9%94%99-)

### 5.安装 unpackaged 文件的 Node.js 模块

公共仓库中的 `dist/electron/UnPackaged` 是由上游应用仓库构建产出的应用包，需要单独安装它的 Node.js 模块。它依赖的两个应用包（`@zeeis/alphabiz-account`、`@zeeis/alphabiz-libdb`）发布在 GitHub Packages 上，该 registry 即使对公开包也要求 token，因此需要在 `~/.npmrc` 中配置带 `read:packages` 权限的 PAT，见 [use-github-pat.md](./use-github-pat.md)。在仓库根目录打开命令行，并执行以下命令：

```bash
yarn unpackaged
```

### 6.定制 app

请使用记事本或[代码编辑器](./prepare-before-dev.md#code-editor)工具，修改`developer/`配置文件。详细定制化配置信息请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/customized-content.md">此文档</a> 。

### 7.构建 app

在仓库根目录打开命令行，并执行以下命令：
```bash
yarn packager
```
注意以下内容：
- 生成的 app 存储路径为`dist/electron/[displayName]-[platform]-[arch]`
- 暂定调试流程:
  1. 重复执行步骤 7 和 8，检查新生成的 app。
  2. 修改配置后，开启 e2e 测试的 debug 模式并查看配置修改情况。可以通过 ctrl+c 关闭运行的命令行或关闭运行中的 electron 和 playwright 窗口，并重复操作 `yarn test:e2e:electron:custom --debug`
- 如需修改构建 app 安装包的配置，请参考 [此文档](https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/customized-content.md#8-%E5%AE%89%E8%A3%85%E5%8C%85%E9%85%8D%E7%BD%AE)。

### 8.生成安装包
在仓库根目录打开命令行，并执行以下命令：
```bash
yarn make
```
注意以下内容：
- 安装包存储路径为`out/installers/[app版本号]`
- 在 Windows 上，`yarn make` 会在打包前检查 APPX 签名证书：需要通过 `ALPHABIZ_APPX_PFX_PATH`、`ALPHABIZ_APPX_PFX_PASSWORD`、`ALPHABIZ_APPX_CERT_SHA256` 提供仓库外部的证书（见 [appx 安装包](./customized-content.md#9-appx%E5%AE%89%E8%A3%85%E5%8C%85)）。没有证书时，`yarn make:msi` 可以单独运行（它直接读取 `dist/electron/` 下的打包产物）；Squirrel 的 EXE 打包器读取 electron-forge 的 `out/` 目录，而该目录平时由 `yarn make` 从 `dist/electron/` 复制填充，因此需要先手动复制一次：`robocopy dist\electron\Alphabiz-win32-x64 out\Alphabiz-win32-x64 /E`，再运行 `yarn make:squirrel`（请把名称与架构替换为你自己的）。
- 如果需要在 Windows 上生成安装包，请先安装<a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/prepare-before-dev.md#7-%E5%9C%A8-windows-%E7%B3%BB%E7%BB%9F%E4%B8%8B%E9%9C%80%E8%A6%81%E5%AE%89%E8%A3%85-wix-toolset">Wix Toolset</a>
- 如果在`yarn make`过程中使用 Ctrl+C 强制退出，可能导致部分动态修改的文件无法恢复。如遇到此问题，请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#4-%E6%81%A2%E5%A4%8D%E8%A2%AB%E5%8A%A8%E6%80%81%E4%BF%AE%E6%94%B9%E7%9A%84%E6%96%87%E4%BB%B6-">这里</a> 解决。
- 在 Windows 系统下，可能会因为 Windows 路径长度限制而导致 yarn make 报错，提示某个文件路径过长。如遇到此问题，请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/development-issues-solutions.md#3-windows%E7%B3%BB%E7%BB%9F%E6%96%87%E4%BB%B6%E8%B7%AF%E5%BE%84%E8%BF%87%E9%95%BF-">这里</a> 解除路径长度限制。

### 9.编译其他版本App

请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/build-app.md">此文档</a> 编译其他版本的 App（如 snap、amd64、universal 版本的 dmg 安装包、Android、iOS 等）。
### 10.将安装包发布到 GitHub Releases 上
请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#5-%E6%89%8B%E5%8A%A8%E5%8F%91%E5%B8%83github-release-">此文档</a>

## 测试 & 自动发布

1. 公共仓库的测试用例位于`test/`文件夹下，私有仓库的测试用例位于`test-secret/`文件夹下。
2. 运行测试用例需要配置环境变量，请参考<a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#6-%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F-">此文档</a>
3. `test/`文件夹中的测试用例是从私有仓库同步的。如果要编写自己的测试用例，请建立一个新文件夹以避免冲突。
4. 如果测试失败，需要删除测试环境，请在命令行中输入以下命令：
```bash
yarn node copy-patch.js --post
```
5. 每次 push／PR 到 main 会运行 CI 与 CodeQL，具体内容请参考[这里](../../.github/workflows/ci.yml)；nightly 发布流水线已暂停，历史 nightly 版本见 [Releases](https://github.com/tanshuai/alphabiz/releases)。
6. 如果工作流中包含自动提交 commit 的步骤，建议统一设置 Actions Runner 的时区为东八区，以方便管理版本号中的日期。具体设置方法请参考<a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#7-workflow%E8%AE%BE%E7%BD%AE%E6%97%B6%E5%8C%BA%E6%AD%A5%E9%AA%A4-">此文档</a>
