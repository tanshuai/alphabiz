# <span id="customization">定制化可修改内容</span>

## 1. app信息,主题色,app协议等 `app.js`

Key | Default | Description 
:---- | :---- | :---- 
name | `Alphabiz` | (字符串) - 应用程序名称。**至少3个字符，只能使用 A-Z 和 a-z，不加空格，不使用特殊符号，需要符合部分安装包名称字符要求格式，以避免意外的错误发生。**
displayName | `[APP名称]` | (字符串) - 应用程序展示名称，用于显示应用程序标题。
fileName | `[APP名称]` | (字符串) - 简略的应用程序展示名称，用于安装包文件名、macOS 安装包标题。**注意：不超过 15 个字符，若超过需要手动修改 macOS 安装包标题配置。**
appId | `com.zeeis.alphabiz` | (字符串) - Android/iOS 应用程序的应用程序 ID。格式应该类似于`org.author.appname`。
snapName | `[小写APP名称]` | (字符串) - Snapcraft 的 bin 名称，可用于通过终端启动应用程序。默认值：`alphabiz`
author | `[APP名称] Team <dev@alpha.biz>` | (字符串) - 作者名称。
developer | `[APP名称] Team` | (字符串) - Windows 的开发人员名称。**注意，这个键不应该包含特殊字符（如上面的 `< >`）**。
appIdentifier | `org.zeeis.alphabiz` | (字符串) - 您在MAS ([Mac应用程序商店](https://developer.apple.com/account))注册的应用程序标识符。建议使用`com.YOUR_COMPANY.YOUR_APP_NAME`，没有特殊字符（空格等）。不同的标识符将被识别为不同的应用程序。
description | `[APP名称] Blockchain Cryptocurrency Application` | (字符串) - 描述
appxPackageIdentityName | `[APP名称]` | (字符串) - Appx 安装包识别名称。用于统一 Appx 安装包和 Microsoft Store 注册的软件包标识名称。
publisher | `CN=zeeis` | (字符串) - APPX 发布者；必须与 `ALPHABIZ_APPX_PFX_PATH` 指向的仓库外部签名证书一致。禁止把证书或私钥复制到仓库。
publisherDisplayName | `[APP名称] Team` | (字符串) - 发布者展示名称，符合 Microsoft Store 注册的名称。
homepage | `https://alpha.biz` | (字符串) - 应用程序的官方网站，在 Linux Debian 包中使用。
webEditionUrl | `https://web.alpha.biz` | (字符串) - 网页版客户端。
upgradeCode | `4d8a65aa-fc5b-421c-94ab-cb722ef737e2` | (字符串) - Windows 升级码。如果两个应用程序有相同的代码，Windows 将删除旧的安装时。您可以通过运行命令 `npx uuid v4` 创建自己的代码。
protocol | `alphabiz` | (字符串) - 链接协议。默认情况下，应用程序将注册 `alphabiz://` 作为它的url协议。**注意，至少3个字符，只能使用a-z，不能与微软商店保留的协议重复，不能与链接协议缩写重复**
shortProtocol | `ab` | (字符串) - 链接协议缩写，默认使用 `ab://` **注意，至少2个字符，只能使用a-z，不能与微软商店保留的协议重复，不能与链接协议、app名称重复**
versionsUrl | `https://raw.githubusercontent.com/  tanshuai/alphabiz/main/versions.json` | (字符串) - 应用程序检查该文件，判断是否需要强制更新，<a href="#forced-update">见此</a>
twitterAccount | `@alphabiz_app` | (字符串) - 用于反馈功能的推特账号
LIBDB_NAME | `[APP名称]` | (字符串) - 用于区分不同的媒体库。当应用程序名称相同时想要使用不同的媒体库时，您可以向 `LIBDB_NAME` 添加一个尾部来分隔库。
microsoftStoreProductId | `9PBCCV3MHK04` | (字符串) - 微软商店产品 ID。

**register(object):** 配置哪个地区的用户可以使用你的应用程序

| Key | Default | Description |
| :---- | :---- | :---- |
mode | `none` | (字符串) - `none`: 任何人都可以注册；`blacklist`: 名单中的国家将被禁用；`whitelist`: 只启用名单中的国家。**注意，启用白名单时，list至少包含一个国家代码**
list | `['US', 'CN']` | (数组) - 国家代码列表，必须是 GeoIP ISO 3166-1-alpha-2 代码，[见此](http://www.geonames.org/countries/)

**theme(object):** 主题

| Key | Default | Description |
| :---- | :---- | :---- |
**color** |  | 主题颜色 
primary | `#d1994b` | (字符串) - 首要主题颜色 
secondary | `#f3ce90` | (字符串) - 次要主题颜色 
accent | `#fbbb4a` | (字符串) - 强调主题颜色
**cornerLogoStyle**|  | 应用程序侧边栏左上角图标背景,修改下面的参数对位置进行微调
left | `-72px` | (字符串) - 水平方向
top | `-92px` | (字符串) - 垂直方向
height | `-245px` |  (字符串) - 图标大小

## 2. <span id="update-channel">更新通道信息 `update.js`</span>

**github(object)**

Key | Default | Description
:---- | :---- | :----
**github** |  | Github仓库配置。
username | `tanshuai` | (字符串) -  Github 用户名。
repo | `alphabiz` | (字符串) - Nightly 版本发布所在仓库。**注意：必须是Github公共仓库。**
branch | `main` | (字符串) - Nightly 版本发布所在的分支。
internalRepo | `alphabiz-app` | (字符串) - Internal 版本发布所在仓库。Internal 更新通道首先检查 Github 内部版本仓库，若保存了 GitHub PAT，则添加 GitHub PAT 后请求 Github 内部版本仓库，否则直接请求 Github 内部版本仓库。若在 Github 内部版本仓库找不到最新版本，则到 S3 储存桶寻找最新版本。**注意：若 Github 内部版本仓库是私有仓库，则需要先在高级设置中设置 GitHub PAT，再检查更新。**
**S3 Buckets** |  | S3储存桶配置
bucketUrl | `https://s3.amazonaws.com/internal.alpha.biz` | (字符串) - 内部版本更新通道-S3 储存桶链接，若不使用 S3 储存桶，则设置为`''`空字符串，例如`bucketUrl: ''`。
s3DownloadUrl| `https://d2v5t3td4po4es.cloudfront.net/releases/` | (字符串) - 可使用 AWS CloudFront 全球加速生成的 URL，若不使用 CloudFront，则修改为 [S3 bucket url] + [正确路径]。

**版本号规则，<a href="https://github.com/zeeis/customization-test/tree/main/docs/zh_cn/fork-repo-hint.md#version">见此</a>**

## 3. 动态配置文件 `dynamicConfig.js`

首先读取远程配置信息，若读取失败则读取本地配置信息。本地配置将在构建app时，保存在app中。

| Key | Default | Description |
| :---- | :---- | :---- |
**remote** |  | 远程配置 
url | `https://alpha.biz/app/remote_config.json` | (字符串) - 远程链接。用于存储动态配置文件
**local** |  | 本地配置
id | `local_config_v1` | (字符串) - 本地配置版本
oauth.enable | `false` | (字符串) - 是否开启 OAuth 登录。
oauth.providers | `['Github','Twitter']` | (数组) - 提供 OAuth 登录的平台。
update.enable | `false` | (字符串) - 是否开启更新通道。

## 4. <span id="forced-update">软件强制更新</span>

软件带有强制更新功能。当软件版本过低时，强制提示用户更新版本。

步骤：

(1) 在公共仓库根目录创建versions.json文件,设置最小版本号

```
versions.json模板
{
  "min": {
    "stable": "0.1.1",
    "nightly": "0.1.1-nightly-202205301917",
    "internal": "0.1.1-internal-202205301821"
  }
}
```

(2)修改变量`./developer/app.js/versinsUrl`

## 5. 服务条款` terms-of-service.md `

修改关于页面，服务条款文本内容

## <span id="app-icon">6. 图标</span>

将developer中的图标替换为同名的新图标

```
developer/                                # 定制化文件夹
├── assets/
|   └── icon-256.png                      # APP内图标
├── icons/
|   ├── favicon-16x16.png                 # MSI安装包提醒图标
|   └── favicon-32x32.png                 # MSI安装包提醒图标
├── platform-assets/
|   ├── linux/
|   |   └── 512x512.png                   # DEB安装包图标、媒体库频道、创作者页面默认背景
|   ├── mac/
|   |   ├── app.icns                      # Mac系统app图标
|   |   ├── background.png                # DMG安装包背景
|   |   ├── dmg-background.tiff           # DMG安装包背景
|   |   ├── trayiconTemplate.png          # Mac任务栏小图标(黑白)
|   |   └── volume-icon.icns              # DMG安装包磁盘图标
|   └── windows/
|   |   ├── icon.ico                      # Windows系统app图标
|   |   ├── icon/                         # APPX安装包assets
|   |   |   ├── Square150x150Logo.png     # APPX安装包图标
|   |   |   ├── Square44x44Logo.png       # APPX安装包图标
|   |   |   └── Square44x44Logo.targetsize-44_altform-unplated.png    # APPX软件任务栏图标
|   |   └── splash/                       # MSI安装包有关
|   |   |   ├── InstallSplash.gif         # EXE安装包运行动画
|   |   |   ├── background_493x312.png    # MSI安装包背景
|   |   |   └── banner_493x58.png         # MSI安装包横幅
├── favicon.ico                           # EXE安装包有关图标、Windows关联文件图标
└── icon-1024.png                         # Windows任务栏右侧小图标
```

## 7. 媒体库管理

#### (1) ` take-down.js `

当前媒体库支持下架功能，拥有权限的超级用户可以对媒体库中的用户、频道、推文进行下架、恢复，下架后不会出现在app中。

Key | Default | Description
:---- | :---- | :----
mode | `committee` | (字符串) - `admin` 频道被管理员投了一票后，将被下架; `committee` 半数及以上的委员会成员对频道投票后，该频道将会下架
admins | ['an_id_of_admin', 'an_id_of_other_admin' ] | (数组) - 管理员的预设键列表。**注意，应该使用pubkey，而不是id。导入媒体库密钥后，在主进程的devtools控制台输入`lib.user.is.pub`，获得当前导入密钥的pubkey**

#### (2) ` take-down.json `

由开发者进行下架的列表。**注意`take-down.json`应该存在于你自己的github存储库，储存库需为公共的,url为`https://raw.githubusercontent.com/${github.username}/${github.repo}/${github.branch}/developer/take-down.json`。链接中的变量为上方[更新通道信息](#update-channel)中的变量。将自动获取其下架列表的最新版本，不需要升级应用程序。**

Key | Default | Description
:---- | :---- | :----
users | `[{"id": "a_pubkey_of_user", "reason": "Serious Violation"}]` | (数组) - id需要填写pubkey,超级用户可以在浏览该用户频道或创作者页面时复制pubkey
channels | `[{"id": "an_id_of_channel", "reason": "Copyright Disputes"}]` | (数组)
posts | `[{"id": "an_id_of_post", "reason": "Adults Only"}]` | (数组)
reason | `Serious Violation` | (字符串) - `Serious Violation`: 严重违反; `Copyright Disputes`: 版权纠纷; `Adults Only`: 仅限成人,用于修正电影分级，修改用户可见电影分级后，可以看到该理由下架的频道

## 8. <span id="install-package-config">安装包配置</span>

#### (1). `yarn build` 配置文件:

electron-packager的详细配置可以参考[此处](https://electron.github.io/electron-packager/main/interfaces/electronpackager.options.html)

私有仓库的位置在 `./quasar.conf.js` 和 `./build-scripts/common/electron-packager.js`，而公共仓库的位置在 `./packager.js`。

#### (2). `yarn make` 配置文件:

electron-forge详细配置可以参考[此处](https://www.electronforge.io/config/makers)

app安装包图标的配置可以参考<a href="https://github.com/zeeis/customization-test/blob/main/docs/zh_cn/customized-content.md#app-icon">此处</a>

```bash
build-scripts/
├── common/
│   ├── electron-packager.js                # electron-packager配置文件
│   ├── forge.config.js                     # electron-forge配置文件，用于deb, DMG, Squirrel.Windows, AppX安装包配置信息
│   ├── make.js                             # 编译各平台安装包脚本
│   ├── extendInfo.js                       # masos扩展信息
│   ├── shasum.js                           # 工具类 - 用于下载安装包文件完整性检查
│   ├── getPackageFormat.js                 # 工具类 - 用于获取安装包格式
│   ├── skipPatch.js                        # 工具类 - 用于公共仓库跳过未使用的补丁
│   └── set-env.sh                          # 在编译macos平台的安装包前设置环境变量的脚本
├── linux/
│   └── snapcraft/
|   |   ├── desktop.template                # 桌面模板
|   |   ├── index.js                        # 编译snap脚本
|   |   └── snapcraft.template              # snapcraft模板
├── macos/
│   ├── app/
|   |   ├── build.sh                        # 编译app脚本
|   |   ├── buildEntitlements.js
|   |   ├── entitlements.inherit.plist
|   |   ├── entitlements.loginhelper.plist
|   |   ├── entitlements.mas.plist
|   |   ├── Info.mas.plist
|   |   ├── Info.plist
|   |   ├── sign.js
|   |   └── sign.sh
│   ├── dmg/
|   |   └── build.sh                        # 编译dmg脚本
│   ├── pkg/
|   |   └── build.sh                        # 编译pkg脚本
│   └── get-env.js 
├── windows/
├── ├── wix/
│   |   ├── make.js                         # 编译msi脚本
│   |   ├── template.xml                    # msi安装包manifest模板
│   |   ├── WiLangId.vbs                    
│   |   ├── WiSubStg.vbs                    
│   |   └── localizations/                  # 本地化
|   |   |   ├── en-US.wxl                   # 有关英文的语言代码
|   |   |   ├── zh-CN.wxl                   # 有关简体中文的语言代码
|   |   │   └── zh-TW.wxl                   # 有关繁体中文的语言代码
│   └── appx/
│   │   └── template.xml                    # appx安装包manifest模板
```

## 9. appx安装包

APPX 安装包必须使用显式配置的签名证书。仓库不再提供默认或测试
PFX，也不允许交互式生成的未知证书进入发布产物。

请把 PFX 保存在仓库之外，并在当前进程中设置绝对路径：

```powershell
$env:ALPHABIZ_APPX_PFX_PATH = "$env:TEMP\alphabiz-signing.pfx"
yarn make:appx
```

证书 subject 必须与 `developer/app.js` 中的 `publisher` 一致。预检会拒绝：

- 相对路径；
- 不存在或不是 `.pfx` 的文件；
- 位于仓库目录内的证书。

完整 Windows 打包命令 `yarn make` 在缺少该变量时也会提前失败，因此 CI
不得上传使用未知证书或交互式 fallback 生成的 APPX。

本地开发可以在系统临时目录中生成一次性自签名证书，测试结束后立即删除
PFX 和中间私钥。禁止把 PFX、PEM 私钥、`.key` 或 keystore 复制到项目目录。

CI 应从受保护的 secret 将 PFX 写入 runner 临时目录，只在打包 step 设置
`ALPHABIZ_APPX_PFX_PATH`，随后验证产物签名，并在 `always()` cleanup step
删除证书。证书准备或签名验证失败时必须停止发布。
