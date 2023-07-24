# Use Github PAT(Personal Access Token)

## 1. Create a personal access token

- 在 `Github` 首页点击右上角头像→ `Settings`

- 选择左侧菜单中的 `Developer settings`

- 选择 `Personal access tokens`, 选择`Tokens(classic)`, 点击 `Generate new token`, 点击 `Generate new token(classic)`

- 勾选下方 `Select scopes` 中的第一项(`repo`)、第三项(`write:packages`), 点击 `Generate toke`

- 复制生成的 `token`, 此 `token` 只会展示一次, 如果不慎遗失可以重新生成

## 2. Add to ~/.npmrc

在 `~/.npmrc` 文件(没有则创建一个)内添加一行, `YOUR_TOKEN` 替换为上文生成的 `token`

**注意!!!： 是`~`目录下, 不清楚请自行查找各操作系统下`~`目录所在位置。不要修改github 仓库根目录的`.npmrc`文件，以免在后面`yarn install`时，一直出现401错误。**

``` txt
//npm.pkg.github.com/:_authToken=YOUT_TOKEN
```

- 前往`~`文件夹的命令行：
在macOS和Linux中，使用命令 `cd ~`。
在Windows中，使用命令 `cd %userprofile%`。

## 3. Login to github registry

``` sh
npm login --registry=https://npm.pkg.github.com
# Username: YOUR_GITHUB_USERNAME
# Password: YOUR_TOKEN
# Email: YOUR_EMAIL

```

#### 可能遇到的报错：

报错原因：输入token错误

错误信息：
```
npm ERR! code E403
npm ERR! 403 403 Forbidden - PUT https://npm.pkg.github.com/-/user/org.couchdb.user:[Github用户名] - Permission denied
```

## 4. DONE

现在 `Alphabiz` 可以正确安装了

**克隆仓库后, 在仓库根目录打开命令行**

``` sh
# use yarn
yarn
```

`node_modules/electron` 将被重定向到 `node_modules/@zeeis/velectron`, 如出现问题可尝试移除 `node_modules` 文件夹后重试

NOTE: *当前有两个可能的警告来自 `electron v11.5.0` 本身*

``` txt
electron: The default of contextIsolation is deprecated ...
ExtensionLoadWarning: Warnings loading extension ...
```
