# openzz
开源中转 服务器端

服务器端口和密钥于index.js文件7-8行修改

教程:

1、安装nodejs任意版本

2、安装PM2（可选）

3、git获取代码
```shell
git clone https://github.com/SmileZD/openzz.git
```
4、进入项目
```shell
cd openzz 
```
5、安装依赖包
```shell
npm i 
```
6、通过PM2启动
```shell
pm2 start index.js --name openzz
```
或者使用通用方式启动
```shell
nohup node index & 
exit
```
