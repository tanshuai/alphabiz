## <span id="issues">开发可能遇到的报错与解决方案</span>

### 1. <span id="yarn-install-error"> `Yarn install` 可能遇到的报错 </span>

#### (1). operation not permitted

**报错原因**：没有权限操作文件夹

**解决方案**：以管理员身份打开命令行窗口

#### <span id="401-unauthorized">(2). 401 Unauthorized </span>

**报错原因**：没有权限安装alphabiz的模块。Github PAT密钥没有配置好、或没有加入zeeis组织

**解决方案**：
1. 查看[github PAT密钥配置文档](https://github.com/zeeis/customization-test/tree/main/docs/zh_cn/use-github-pat.md)
2. 与alphabiz仓库[所有者](https://github.com/tanshuai)联系


错误信息:
```
error An unexpected error occurred: "https://npm.pkg.github.com/download/@zeeis/alphabiz-account/0.0.89/047893a2a1da0a6e2eb9bc8a9e7bd44c94e048dc: 
Request failed \"401 Unauthorized\"".
```
#### (3). 安装diskusage模块报错
**报错原因**：未安装好编译C++所需的工具，或node-gyp electron-rebuild出问题

**解决方案**：
1. 安装好[编译C++所需的工具](https://github.com/zeeis/customization-test/tree/main/docs/zh_cn/fork-repo-hint.md#build-c++)后，重试`yarn`
2. 若还是失败，可以尝试清空仓库根目录的node_modules文件夹和node-gyp缓存文件。

```bash
bush命令行:
rm -rf node_modules/
rm -rf C:/Users/[你的用户名]/AppData/Local/node-gyp/
```

错误信息：
```
error C:\Users\alphabiz\github\alphabiz-app\node_modules\diskusage: Command failed.
Exit code: 1
Command: node-gyp rebuild
Arguments:
Directory: C:\Users\alphabiz\github\alphabiz-app\node_modules\diskusage
```
#### (4). 安装electron模块报错

**报错原因**：网络问题，安装electron模块需要VPN

**解决方案**：请检查VPN后，重试`yarn install`

错误信息：
```
Exit code:1
Command: node install.js
Arguments:Directory: [YOUR_PATH]\node_modules\electron
Output:
RequestError: read ECONNRESET
```

#### (4). 时区报错

**报错原因**：
1. 系统时间变化：如果你的系统时间突然变化（比如夏令时变化，手动调整，NTP更新等），可能会导致此问题。
2. CPU负载高：如果你的CPU负载很高，系统时钟可能无法及时更新，导致libuv看到时间像是倒退了。
3. 软体错误：可能存在你的应用程式、Node.js或libuv的错误导致此问题。

**解决方案**：同步系统时区时间、降低CPU负载

错误信息：
```
yarn install v1.22.19
[1/5] Validating package.json...
[2/5] Resolving packages...
[3/5] Fetching packages...
[##############------------------------------------------------------] 611/2961
Assertion failed: new_time >= loop->time, file c:\ws\deps\uv\src\win\core.c, line 324
```

### 2. <span id="yarn-dev-error"> `Yarn dev` 可能遇到的报错 </span>

#### (1). <span id="version-json">缺少version.json文件解决办法: </span>

错误信息：
```
{
  errno: -4058,
  syscall: 'open',
  code: 'ENOENT,
  path: '[YOUR_PATH]\\public\\version.json'
}
```

验证: 运行`yarn node update-version.js`错误信息如下

```
exec error: Error: Command failed: git log -1 --date=format:"%Y%m%d%H%M”--format="%cd”
fatal: not a git repository (or any of the parent directories): .git

```

本app版本号根据github提交信息控制,见```./update-version.js```。

```
生成version.json命令行
yarn node update-version.js
```
**报错原因**：从github仓库下载的zip文件，没有携带github commit提交记录，无法自动生成version.json

**解决方案**：需要手动添加version.json文件到```public/```文件夹下、或恢复.git文件夹。

注意：在```yarn dev``` 或 ```yarn build``` 之前进行

```
version.json模板
{
  "packageVer": "0.2.0",
  "channel": "nightly",
  "buildTime": "202211301423",
  "buildCommit": "18c7d8b",
  "sourceCommit": "c6b8749",
  "version": "0.2.1-nightly-202211301423"
}
```

Key | Description 
:---- | :----
packageVer | (字符串) - package.json文件中的version
channel | (字符串) - 默认版本通道，建议与版本号中的通道统一
buildTime | (字符串) - 软件构建时间。github仓库最后一次commit的时间
buildCommit | (字符串) - 软件构建github提交记录。github仓库最后一次commit的SHA7，显示在APP标题栏，方便查找版本
sourceCommit | (字符串) - 软件资源github提交记录。若是私有仓库，则与buildCommit相同；若是公共仓库，则为私有仓库最后一次commit的SHA7，方便查找公共仓库发布的软件对应的私有仓库的提交记录
version | (字符串) - 完整版本号，规则 <a href="#version">见此</a>

#### (2). digital envelope routines::unsupported

**报错原因**：node版本过高，有些模块不支持

**解决方案**：
  方法1: node版本重装成16的
  方法2: 打开终端并粘贴如下所示

Linux and macOS (Windows Git Bash)-
```
export NODE_OPTIONS=--openssl-legacy-provider
```
Windows command prompt-
```
set NODE_OPTIONS=--openssl-legacy-provider
```
Windows PowerShell-
```
$env:NODE_OPTIONS = "--openssl-legacy-provider"
```

错误信息：

```
{
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}
```

#### (3). GPU 异常退出

**报错原因**：Ubuntu虚拟机环境下，可能是由于GPU驱动或者OpenGL等图形库没有正确安装或配置所致。

**解决方案**：禁用或升级VMware虚拟机的3D加速功能，避免虚拟化环境对GPU的影响。可以在虚拟机设置中进行调整。

错误信息：
```
{
  type: 'GPU',
  reason: 'abnormal-exit',
  exitCode: 512,
  serviceName: 'GPU'
}
App ·   Electron process was killed. Exiting...
```

### 3. <span id="path-to-long">windows系统文件路径过长: </span>

windows系统下，编译安装包时可能出现

解除路径长度限制方法, [见此](https://learn.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation?tabs=powershell)

管理员打开powerShell

```
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
-Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```
