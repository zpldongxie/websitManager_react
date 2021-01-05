# websiteManager_react

## 可执行脚本

### 启动项目

```bash
# 带mock数据
npm start
# 请求真实数据
npm run dev
```

运行这个脚本会启动服务，自动打开默认浏览器展示你的页面。当你重新编辑代码后，页面还会自动刷新。

### 构建项目

```bash
npm run build
```

运行这个脚本将会编译你的项目，你可以在项目中的 dist 目录中找到编译后的文件用于部署。编译之后的文件经过压缩。

```bash
npm run analyze
```

analyze 脚本做的事情与 build 的相同，但是他会打开一个页面来展示你的依赖信息。如果需要优化性能和包大小，你需要它。

### 检查代码样式

```bash
npm run lint
```

我们提供了一系列的 lint 脚本，包括 TypeScript，less，css，md 文件。你可以通过这个脚本来查看你的代码有哪些问题。在 commit 中我们自动运行相关 lint。

```bash
npm run lint:fix
```

这个脚本会自动修复一些 lint 错误，如果你被 lint 搞的焦头烂额，试试它吧。

### 测试代码

```bash
npm test
```

这个脚本会执行一系列测试，包括 e2e 测试

---

## 编译注意事项

```bash
npm i
```

第一次安装依赖包时，如果网络差，会出现编译失败的情况，切换 npm 源多试几次。
