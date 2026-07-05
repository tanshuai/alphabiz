# 私有仓库版本开发指南

私有仓库地址: [alphabiz-app](https://github.com/tanshuai/alphabiz-app)

## 开发前的准备

请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/prepare-before-dev.md"  target="_blank">此文档</a> 进行开发前的准备。

## 开发流程步骤

### 1.Fork 私有仓库

请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md">此文档</a> 进行 Fork 操作。

### 2.同步源仓库最新代码

如果源仓库没有更新，则可以跳过此步骤。如需同步，请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#2-%E5%90%8C%E6%AD%A5%E6%BA%90%E4%BB%93%E5%BA%93-">此文档</a>。

### 3.克隆新创建的仓库到本地仓库

请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#3-%E5%85%8B%E9%9A%86%E4%BB%93%E5%BA%93-">此文档</a> 进行克隆操作。

### 4.安装本仓库的 Node.js 模块

在仓库根目录打开命令行，并执行以下命令：

```bash
yarn
```

如果遇到安装报错，请参考 [此文档](https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/development-issues-solutions.md)。

### 5.开启dev模式，方便调试代码  

在仓库根目录打开命令行，并执行以下命令：

```bash
yarn dev
```

如果遇到启动报错，请参考 [此文档](https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/development-issues-solutions.md#2--yarn-dev-%E5%8F%AF%E8%83%BD%E9%81%87%E5%88%B0%E7%9A%84%E6%8A%A5%E9%94%99-)。

### 6.定制 app

使用记事本或[代码编辑器](https://github.com/zeeis/customization-test/tree/main/docs/zh_cn/fork-repo-hint.md#code-editor)工具，修改`developer/`配置文件。等待 Electron 窗口刷新，若没有可以按 F5 手动刷新。调试完代码后，请使用 Ctrl + C 关闭 dev 模式。

详细定制化配置信息请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/customized-content.md">此文档</a>

### 7.构建 app

在仓库根目录打开命令行，并执行以下命令：

```bash
yarn build
```

1. app 生成路径为`dist/electron/[app 名称]-[系统名称]`。
2. 如需修改构建 app 安装包的配置，请参考 [此文档](https://github.com/zeeis/customization-test/blob/main/docs/zh_cn/customized-content.md#install-package-config)

### 8.生成安装包

在仓库根目录打开命令行，并执行以下命令：

```bash
yarn make
```

1. 安装包生成路径为`out/installers/[app 版本号]`。
2. 如果需要构建 Windows 版本的安装包，请安装 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/prepare-before-dev.md#7-%E5%9C%A8-windows-%E7%B3%BB%E7%BB%9F%E4%B8%8B%E9%9C%80%E8%A6%81%E5%AE%89%E8%A3%85-wix-toolset">wix-tool</a> 工具。

如果在 yarn make 过程中使用 Ctrl + C 强制退出，可能会导致部分动态修改的文件无法恢复。请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#4-%E6%81%A2%E5%A4%8D%E8%A2%AB%E5%8A%A8%E6%80%81%E4%BF%AE%E6%94%B9%E7%9A%84%E6%96%87%E4%BB%B6-">此文档</a> 解决此问题。

### 9.编译其他版本App

请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/build-app.md">此文档</a> 编译其他版本的 App（如 snap、amd64、universal 版本的 dmg 安装包、Android、iOS 等）。

### 10.将安装包发布到 GitHub Releases 上
请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#5-%E6%89%8B%E5%8A%A8%E5%8F%91%E5%B8%83github-release-">此文档</a>

## 测试 & 自动发布

1. 公共仓库的测试用例位于`test/`文件夹下，私有仓库的测试用例位于`test-secret/`文件夹下。
2. 运行测试用例需要配置环境变量，请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#6-%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F-">此文档</a>
3. 每晚会执行用于发布internal内部版本的工作流，具体内容请参考 [这里](https://github.com/tanshuai/alphabiz-app/blob/main/.github/workflows/release-internal.yml)
4. 由于私有仓库在使用 GitHub Actions 服务方面收费较贵，建议您创建 Windows 或 macOS 虚拟机，并在本地虚拟机中运行 Actions 工作流，以降低成本。请注意，虚拟机需要稳定的 VPN。
- 如需配置self-Runner，请参考 [此文档](https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#8-%E9%85%8D%E7%BD%AE-github-actions-self-runner-)
5. 如果工作流中包含自动提交 commit 的步骤，建议统一设置 Actions Runner 的时区为东八区，以方便管理版本号中的日期。具体设置方法请参考 <a href="https://github.com/tanshuai/alphabiz/blob/main/docs/zh_cn/fork-repo-hint.md#7-workflow%E8%AE%BE%E7%BD%AE%E6%97%B6%E5%8C%BA%E6%AD%A5%E9%AA%A4-">此文档</a>
