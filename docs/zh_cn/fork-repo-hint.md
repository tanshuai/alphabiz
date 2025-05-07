# <span id="hint">开发流程步骤中的提示</span>

### 1. <span id="fork-repo">Fork仓库: </span>

私有仓库地址: [alphabiz-app](https://github.com/tanshuai/alphabiz-app)
公共仓库地址: [alphabiz](https://github.com/tanshuai/alphabiz)

<details><summary>fork仓库方法(点击查看)</summary>

(1).点击[Fork]按钮。相同的仓库一个账号只能fork一次

(2).选择fork的仓库的名称。默认是源仓库名称

(3).点击[Create fork]按钮。创建fork

截图以`zeeis/customization-test`仓库为例

![image](https://user-images.githubusercontent.com/92558550/202063641-d763dea6-8583-4cac-8b57-39ec8860bd96.png)

</details>

本应用程序主要在main分支进行,部分新功能开发在其他分支中进行。若想在fork的仓库查看源仓库其他分支代码，请在fork仓库时取消勾选上图中的【只复制主分支】。

### 2. <span id="sync-upstream-repo">同步源仓库: </span>

<details><summary>同步源仓库方法(点击查看)</summary>

![image](https://user-images.githubusercontent.com/92558550/201583936-35e8d28a-08ee-4fb7-852f-8cc90a3b3666.png)

</details>

定制化功能主要修改developer文件，**若同步源仓库代码时发生冲突，建议以源仓库代码格式为主，再替换上自己修改的内容，以免影响功能使用。**

使用github desktop工具或使用命令行```git status```查看仓库状态，帮助自己找到冲突的位置在哪个文件中，修改文件内容解决冲突

<details><summary>使用github desktop应用解决分支冲突方法(点击查看)</summary>

(1) 当同步源仓库出现冲突时，舍弃fork仓库之前的提交，先将源仓库代码同步到fork仓库

<img width="777" alt="99390c7abdf52ec1a9e29733c901d83" src="https://user-images.githubusercontent.com/92558550/202372343-1cbfd55d-955f-414b-8d98-763e896da726.png">

(2) 在github desktop工具点击拉代码，将fork远程仓库拉到本地仓库，这时候github desktop会提示有代码冲突无法拉代码

<img width="642" alt="b66d20588e0c731de3fab620dead79f" src="https://user-images.githubusercontent.com/92558550/202371089-bd5ee8d1-19c3-49b3-a3c5-30f2aad0b8c0.png">

(3) 找到发生冲突的文件(下图github desktop 带三角形感叹号的文件)，在编辑器中打开

可以在[View conflicts]按钮中快速找到发生冲突的文件

<img width="722" alt="1e023a3636086f7b6c436758363093f" src="https://github.com/zeeis/customization-test/assets/92558550/712a4321-a90b-4545-9f94-d6c1e5e956ad">

<img width="805" alt="d89e1b0540f0fb834b915479438058d" src="https://user-images.githubusercontent.com/92558550/202371563-42d4fc80-41d3-4938-9a74-b6ad35442d83.png">

(4) 修改代码，删除不需要的代码，并保存，解决冲突

<img width="794" alt="0302edfad5759f51a0e0bd75b20018b" src="https://user-images.githubusercontent.com/92558550/202371638-886ee1e5-5e9b-467d-a744-0a91e1cbf9bd.png">

(5) 解决冲突后，文件图标变为绿色的√,点击[view conflict],点击[继续合并分支]

<img width="722" alt="a2a19c8efc95aa5c38d389ed34bea06" src="https://user-images.githubusercontent.com/92558550/202371685-fc018435-a6d1-4fa0-a630-8ecf0de405df.png">

<img width="722" alt="0e9d7b6197180d0b7fabfaeb09f3a6c" src="https://user-images.githubusercontent.com/92558550/202371781-90278875-bf51-4d76-9c48-30d38627024a.png">

(6) 最后将解决冲突的代码提交到远程仓库

<img width="722" alt="ffbd0ce2a3a8ec47e8e035011095f13" src="https://user-images.githubusercontent.com/92558550/202372292-22b39e62-6c37-4629-ae06-5b4c85878a9e.png">

</details> 

### 3. <span id="clone-repo">克隆仓库: </span>

方法：

<details><summary>(1) github desktop图形化工具(点击查看)</summary>

  (一)选择要克隆的仓库
第一种方式: 选择要克隆的仓库
    
<img width="894" alt="5c9c4bbb4847e08ffd2a091a4141de3" src="https://user-images.githubusercontent.com/92558550/201564694-a57a121d-dd69-421a-8be5-d228dde08919.png">

第二种方式: 复制要克隆的仓库的url

<img width="764" alt="c2fa9cfc756564ca2b7198e98d4c910" src="https://user-images.githubusercontent.com/92558550/201564728-51366560-3bc5-4e32-b93f-5148a398a484.png">

<img width="391" alt="48b7ccbf90af5c5fced9579e9bb67cf" src="https://github.com/zeeis/customization-test/assets/92558550/1aa7262b-5cc2-4adf-aa97-08d264b7eef9">

然后根据自己需求，修改本地文件夹的路径或名称

  (二)选择该分支用于自己的目的(提交代码到自己的仓库)

<img width="894" alt="57b1bfdcf64ca785846873fac6ace20" src="https://user-images.githubusercontent.com/92558550/201564704-12c96afa-927f-412d-a957-13dadce84c09.png">

</details>

<details><summary>(2) 命令行(点击查看)</summary>

  (一)复制仓库url

<img width="764" alt="c2fa9cfc756564ca2b7198e98d4c910" src="https://user-images.githubusercontent.com/92558550/201564728-51366560-3bc5-4e32-b93f-5148a398a484.png">

  (二)命令行输入 ```git clone [仓库url]```

<img width="739" alt="4aaad1bf3e83fa0601d1488caedb3c8" src="https://user-images.githubusercontent.com/92558550/201564738-3c91d844-61ab-489a-882f-9609dd0e13aa.png">

</details>

### 4. <span id="template">恢复被动态修改的文件: </span>

`yarn make`运行时会动态修改部分文件，若强制终止运行，会导致没有自动恢复文件。容易被不熟悉的人忽略，提交到github仓库，影响功能使用。

被修改的文件列表

文件名 | 修改内容
:---- | :----
appx/template.xml | 带双括号的内容。例如 `{{packageName}}`
package.json | `"name" "version" "description" "productName" "author"`根据developer/配置内容和版本号规则修改

github Desktop恢复文件方法： 在被修改的文件中，右键目标文件，选择[Discard changes]

命令行恢复文件方法： (确保package.json没有其他修改内容，以免恢复文件后，其他修改被恢复)

```bash
yarn node make.js --reset
```

### 5. <span id="github-release">手动发布github release: </span>

<details><summary>(1) 创建新标签(点击查看)</summary>

输入标签后，选择新建，**注意:标签格式为app版本号**，<a href="#version">见此</a>

![image](https://user-images.githubusercontent.com/92558550/202150283-8f45fa0d-e4e3-40aa-ae16-4c4f130fee19.png)

</details>

<details><summary>(2) 修改发布名称，上传安装包(点击查看)</summary>

![image](https://user-images.githubusercontent.com/92558550/202150667-97c68af3-c38e-4c6b-836c-ecd42dd30f7e.png)

</details>

### 6. <span id="test-env">测试环境变量: </span>

如果要运行自动测试并发布，需要预先配置环境变量。要在本地运行测试，请将环境变量添加到 .env 文件中；要在 GitHub Actions 运行测试，请将环境变量添加到 GitHub env 中。如果只是自动发布，则只需要配置好 GitHub PAT。

YAML 文件语法，请参见 [此处](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

<details><summary>私有仓库配置Guthub Actions环境变量方法(点击查看)</summary>

(1) 创建secret

![image](https://user-images.githubusercontent.com/92558550/203198648-3ac3210b-893c-4d37-996b-4435969fbc41.png)

![image](https://user-images.githubusercontent.com/92558550/203198873-c9e4dd41-544d-4ce3-acd8-71df5a81afac.png)

(2) 在 YAML 文件中使用。
  
![image](https://user-images.githubusercontent.com/92558550/203199029-64534cd0-26c9-4842-93c7-887715eb15ae.png) 

</details>

<details><summary>公共仓库配置Guthub Actions环境变量方法(点击查看)</summary>

(1) 创建环境

![image](https://user-images.githubusercontent.com/92558550/203199922-94142662-543f-43c6-ba96-e5bf35f2a5b0.png)

(2) 在环境中添加环境变量

![image](https://user-images.githubusercontent.com/92558550/203199580-d3762d9a-399c-4f38-8131-65dd456c820d.png)

(3) 在 YAML 文件中，先选择环境，再从环境中导入环境变量。

![image](https://user-images.githubusercontent.com/92558550/203199739-316e1b1e-5ce6-46a2-b028-3c8c1bb45ca4.png)

</details>

### 7. <span id="set-timezone">workflow设置时区步骤: </span>

在提交 commit 的步骤之前，将 runner 的时区设置为东八区。

```
ubuntu-latest runner

- name: Set Timezone
  run: |
    sudo timedatectl set-timezone Asia/Shanghai
    timedatectl status
```

原因请参见版本号规则日期部分，[见此](#version)

### 8. <span id="self-runner">配置 GitHub Actions Self-Runner: </span>

<details><summary>配置Self-Runner方法(点击查看)</summary>

(1) 在 Github 代码仓库的设置页面创建Self-Runner

![image](https://user-images.githubusercontent.com/92558550/203195890-8f443a1e-c886-40ad-99a2-eba1bc956803.png)

(2) 选择所要的操作系统

![image](https://user-images.githubusercontent.com/92558550/203196231-c3b9f68b-d8dc-4e4d-9611-b18797f929fe.png)

(3) 在虚拟机中运行下方的download、configure命令行

![image](https://user-images.githubusercontent.com/92558550/203197527-b8fd9f6b-5fa2-4238-b6ba-10d8aed20694.png)

(4) 连接上Github Actions

![image](https://user-images.githubusercontent.com/92558550/203197628-d631f186-0680-498b-b1ba-342ad9b3a734.png)

(5) 在.yaml中使用新建的Self-Runner

![image](https://user-images.githubusercontent.com/92558550/203197777-45601dd7-756a-4eaa-951d-620f3a4efbde.png)

</details>

### 9. <span id="version">版本号规则:</span>

当前应用分为三种通道:

(1) 稳定版本 (版本号没有后缀)：x.y.z

(2) 每晚公共仓库发布的版本: x.y.z-nightly-[日期]

(3) 内部发布版本：x.y.z-internal-[日期]

日期统一格式为：yyyymmddhhmmss，时区统一为东八区

如果要在应用中使用版本更新功能，则需要在 Github Releases 上发布自己的版本。详细信息请参考[alphabiz releases](https://github.com/tanshuai/alphabiz/releases)，并更改更新通道信息。具体方法请参见[此处](https://github.com/zeeis/customization-test/blob/main/docs/zh_cn/customized-content.md#update-channel)。需要注意以下几点：

1. tag标签名称: 版本号
2. assets(上传资源名称): [app名称]-版本名称.(安装包拓展名)(deb | dmg | msi)
3. 稳定版本需要 github releases 设置为 [Latest]标签 ,其他版本设置为 [Pre-release]

![image](https://user-images.githubusercontent.com/92558550/202152605-50638a94-2bdc-438b-a39b-9fb1b8fe0d4e.png)

### 10. <span id="forced-update">强制更新:</span>

该软件带有强制更新功能，需要在公共仓库根目录下创建 versions.json 文件，然后修改 `./developer/app.js` 中的 `versionsUrl` 参数。

