## 构建APP

### 1. Snap安装包

###### 支持的仓库： 私有仓库、公共仓库

(1). 安装必要工具
```
sudo apt install snapd
sudo snap install snapcraft
sudo snap install multipass
```

(2).编译出deb安装包

fork-private-repo.md文档或fork-public-repo.md文档, 生成安装包之前(包括生成安装包)的步骤

(3).编译snap安装包

```bash
yarn make:snap
```

(4).生成snap密钥

```bash
# Generate SNAP TOKEN
snapcraft export-login --snaps [SNAP_NAME] --channels edge -
```

(5).上传到snap商店
```
export SNAPCRAFT_STORE_CREDENTIALS=[YOUR_SNAP_TOKEN]
snapcraft upload --release=edge ./[YOUR_SNAP_PATH]/*.snap
```

### 2. arm64、universal版本dmg安装包

###### 支持的仓库： 私有仓库、公共仓库

#### 准备条件：

(1). M1 Mac, 支持amd64架构

#### 步骤：

(1).安装node模块

```bash
yarn
```

(2).准备打包环境

```bash
node ./build-scripts/macos/get-env.js --darwin
cp ./build-scripts/macos/.env ./.env
```

(3).打包App

```bash
./build-scripts/macos/app/build.sh
```

(4).打包Dmg

```bash
./build-scripts/macos/dmg/build.sh
```

(5).运行结束后在`out/installers/[app版本号]`路径下生成 x64、amd64、universal版本的dmg安装包

### 3. mac商店版本
### 4. Android

### 5. IOS