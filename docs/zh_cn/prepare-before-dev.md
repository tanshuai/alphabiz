# <span id="prepare-before-dev">开发前的准备 </span>

#### (1). 确保已经安装了 Git 命令行工具。
可以在命令行中输入 `git --version` 来检查是否已安装。推荐使用 [Github Desktop 工具](https://desktop.github.com/)。
#### (2). 确保已经安装了 Node.js。

建议安装版本为 16，可以在命令行中输入 `node -v` 和 `npm -v` 来检查是否已安装。如果需要管理多个 Node.js 版本，可以使用 [nvm](https://github.com/nvm-sh/nvm) 工具。可以从 [这里](https://nodejs.org/download/release/v16.19.0/) 下载 Node.js 16.19.0 安装包。

<details><summary>Git 和 Node.js 的安装方法（点击查看）</summary>

#### 在 macOS 上安装 Git 和 Node.js：

1. 打开终端应用程序。
2. 确保您已安装 Homebrew 包管理器。如果没有，请使用以下命令在终端中安装它：

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

3. 使用以下命令在终端中安装 Git 和 Node.js 16：

   ```bash
   brew install git node@16
   ```

4. 找到nodejs安装的路径，添加到环境变量中

  ```bash
  Intel芯片为例
  echo 'PATH="/usr/local/opt/node@16/bin:$PATH"' >> ~/.zshrc
  echo 'PATH="/usr/local/opt/node@16/bin:$PATH"' >> ~/.bash_profile
  ```

5. 等待安装完成后，您可以通过运行以下命令来验证 Git 和 Node.js 是否已成功安装：

   ```bash
   git --version
   node -v
   npm -v
   ```

#### 在 Windows 上安装 Git 和 Node.js：

1. 下载 Git for Windows 安装程序：https://git-scm.com/download/win
2. 运行安装程序并按照提示进行操作。默认选项通常是可以接受的。
3. 在安装过程中，确保选中“Git Bash Here”和“Use Git and optional Unix tools from the Command Prompt”选项。
4. 下载 Node.js 16.19.0 的 MSI 安装包：https://nodejs.org/download/release/v16.19.0/
5. 运行安装程序并按照提示进行操作。默认选项通常是可以接受的。
6. 等待安装完成后，您可以在命令提示符中输入以下命令来验证 Git 和 Node.js 是否已成功安装：

   ```bash
   git --version
   node -v
   npm -v
   ```

[git详细安装教程](https://blog.csdn.net/mukes/article/details/115693833?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168411971716800180655928%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=168411971716800180655928&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-115693833-null-null.142^v87^control_2,239^v2^insert_chatgpt&utm_term=%E5%AE%89%E8%A3%85git&spm=1018.2226.3001.4187)

[nodejs详细安装教程](https://blog.csdn.net/qq_48485223/article/details/122709354?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168411455616800227468654%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=168411455616800227468654&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-122709354-null-null.142^v87^control_2,239^v2^insert_chatgpt&utm_term=%E5%AE%89%E8%A3%85nodejs&spm=1018.2226.3001.4187)


#### 在 Linux 上安装 Git 和 Node.js：

1. 运行以下命令以确保您的软件包列表已更新：

   ```bash
   sudo apt-get update
   sudo apt update
   sudo apt install curl

   ```

2. 使用以下命令在终端中安装 Git 和 Node.js 16：

   ```bash
   sudo apt-get install git
   curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
   sudo apt -y install nodejs
   ```

3. 等待安装过程完成。
4. 验证是否成功安装了 Git 和 Node.js：在终端中输入以下命令，如果版本号显示出来，则表示已经成功安装。

   ```bash
   git --version
   node -v
   npm -v
   ```

注意：上述步骤可能需要管理员权限，因此您可能需要输入您的用户密码。另外，根据您所使用的 Linux 发行版，apt-get 命令可能会有所不同。

</details>

#### (3). <span id="build-c++">在 Windows 系统下，需要安装`Visual Studio 2015 及以上版本的桌面开发工具和 C++ 组件`以及`Python`。</span>详细请参考 [这篇文档](https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#environment-setup-and-configuration)。
此步骤用于windows系统下，编译仓库中的C++模块

安装 Python 时，需要安装版本大于等于 **3.6**，并且需要勾选 **Add Python to PATH** 选项，以便操作系统可以快速找到 Python 解释器。

下载链接:

- [Visual Studio 2019 Community](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)
- [Python3.11.3](https://www.python.org/downloads/release/python-3113/)
- [Visual Studio 2019安装详细教程](https://blog.csdn.net/YSJ367635984/article/details/104648941?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168613286216800186553666%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=168613286216800186553666&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-104648941-null-null.142^v88^insert_down38v5,239^v2^insert_chatgpt&utm_term=Visual%20Studio%202019&spm=1018.2226.3001.4187)
- [Python安装详细教程](https://blog.csdn.net/weixin_49237144/article/details/122915089?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168439792116782427455931%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=168439792116782427455931&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-2-122915089-null-null.142^v87^control_2,239^v2^insert_chatgpt&utm_term=python%E5%AE%89%E8%A3%85%E6%95%99%E7%A8%8B&spm=1018.2226.3001.4187)

<details><summary>Visual Studio至少安装项目(点击查看)</summary>

安装 Visual Studio Community 2019 时，需要至少选择安装以下组件：
- .NET 桌面开发
- 使用 C++ 的桌面开发

以2017年版本为例

<img width="968" alt="07d0eca3be5e96281364a6718e73194" src="https://user-images.githubusercontent.com/92558550/202946207-ffafb3e6-cd7b-450a-b8f8-412c0c538ed4.png">

</details>

#### (4). 确保安装 yarn

检查 yarn 的版本：`yarn -v`

安装 yarn：
```bash
npm install --global yarn
```

#### (5). 在 fork 私有仓库时，需要安装 @quasar/cli

安装 @quasar/cli：
```bash
yarn global add @quasar/cli
```

#### (6). <span id="github-pat">生成github PAT</span>
当前使用的一些模块仍然是 alphabiz 的私有模块，因此需要使用 zeeis 成员的 GitHub PAT。详情请参考 [这篇文档](https://github.com/zeeis/customization-test/tree/main/docs/zh_cn/use-github-pat.md)

#### (7). 在 Windows 系统下，需要安装 <span id="wix-tool">Wix Toolset</span>

Wix Toolset 是一个用于创建 Windows 安装程序的工具集。在 Windows 系统下构建 MSI 安装包时需要使用它。

安装前需要确认安装 .NET Framework 3.5.1。安装 Wix Toolset 可以从[官网](https://wixtoolset.org/)下载最新版本的 MSI 安装程序。安装完成后，需要将 Wix Toolset 的安装路径添加到系统 Path 变量中。默认情况下，Wix Toolset 的安装路径为：
```
C:\Program Files (x86)\WiX Toolset v3.11\bin
```

<details><summary>安装 .NET Framework 3.5.1 方法(点击查看)</summary>

.NET Framework 3.5.1是一款由微软公司开发的跨平台应用程序框架。许多Windows应用程序都需要它才能正常运行。如果您的Windows操作系统中没有安装  .NET Framework 3.5.1，则可以按照以下步骤进行安装：

方法1：

1. win + R,输入appwiz.cpl，打开控制面板-程序或功能
2. 点击[启动或关闭Windows功能]，找到“.NET Framework 3.5（包括.NET 2.0和3.0）”并勾选该选项。
3. 单击“确定”按钮，系统将自动下载并安装所需的文件。这可能需要一些时间，具体时间取决于您的网络速度和计算机性能。
4. 安装完成后，重新启动计算机以使更改生效。

方法2：

下载链接：https://dotnet.microsoft.com/zh-cn/download/visual-studio-sdks?cid=msbuild-developerpacks

1. 点击 .NET Framework 3.5 SP1 版本的 [运行时]，安装 .NET 安装包
2. 打开安装包，选择默认值，一直点击[确认]/[下一步]，直到安装完成。
3. 安装完成后，重新启动计算机以使更改生效。

</details>

<details><summary>安装Wix Toolset、配置环境变量方法(点击查看)</summary>

建议安装最后一个稳定版本的exe安装包

![image](https://user-images.githubusercontent.com/92558550/202830934-0796cc10-e0d6-4fc6-aa5c-ba7927df3fc8.png)

![image](https://user-images.githubusercontent.com/92558550/202830970-31e3ce1a-06d2-4c26-bbe1-cd9c3848f18a.png)

![image](https://user-images.githubusercontent.com/92558550/202830996-000220c6-73ff-4fe7-8453-83492c3b66ba.png)

下载完成后，打开exe文件，点击【安装】或【install】

![image](https://user-images.githubusercontent.com/92558550/202831028-89d203e6-7fc5-42bd-b82f-89b48b579f96.png)


以默认安装路径为例

```bash
C:\Program Files (x86)\WiX Toolset v3.11\bin
```
将以上路径添加到系统变量中

![image](https://user-images.githubusercontent.com/92558550/202156987-d90e0273-90c6-466c-9ecc-1261c7f14bad.png)

</details>

#### (8). <span id="code-editor">(可选) 确保已安装代码编辑器 </span>

推荐使用 [Visual Studio Code](https://code.visualstudio.com/) 作为代码编辑器。
[Visual Studio Code安装详细教程](https://blog.csdn.net/mankl/article/details/122784271?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168446324616800182771874%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=168446324616800182771874&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~hot_rank-5-122784271-null-null.142^v87^control_2,239^v2^insert_chatgpt&utm_term=visual%20studio%20code&spm=1018.2226.3001.4187)
