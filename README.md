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
5、修改端口和密钥(9501为旧端口,12345为新端口,密钥同理) sed -i 's/旧数据/新数据/g' index.js
```shell
sed -i 's/9501/12345/g' index.js
sed -i 's/3DB8FDF54A9E898FB4F54FAC371ADBB5/AABBCCDDEEFFGG/g' index.js
```
6、安装依赖包
```shell
npm i 
```
7、通过PM2启动
```shell
pm2 start index.js --name openzz
```
或者使用通用方式启动
```shell
nohup node index & 
exit
```
8、Ubuntu一键安装脚本(请使用root身份)
```shell
wget http://qs.weikeji.icu/openzz.sh && bash openzz.sh
```
如果报错可以手动复制以下代码执行
```shell
cd ~
apt-get install wget git -y
wget https://cdn.npmmirror.com/binaries/node/latest-v16.x/node-v16.16.0-linux-x64.tar.xz
tar -xvf node-v16.16.0-linux-x64.tar.xz
cp -r ./node-v16.16.0-linux-x64 /usr/local/
rm -rf ./node-v16.16.0-linux-x64
rm -rf ./node-v16.16.0-linux-x64.tar.xz
ln -s /usr/local/node-v16.16.0-linux-x64/bin/npm /usr/local/bin
ln -s /usr/local/node-v16.16.0-linux-x64/bin/node /usr/local/bin
npm i pm2 -g
ln -s /usr/local/node-v16.16.0-linux-x64/lib/node_modules/pm2/bin/pm2-runtime /usr/local/bin
ln -s /usr/local/node-v16.16.0-linux-x64/lib/node_modules/pm2/bin/pm2 /usr/local/bin
ln -s /usr/local/node-v16.16.0-linux-x64/lib/node_modules/pm2/bin/pm2-dev /usr/local/bin
ln -s /usr/local/node-v16.16.0-linux-x64/lib/node_modules/pm2/bin/pm2-docker /usr/local/bin
git clone https://github.com/SmileZD/openzz.git
cd openzz
npm i
pm2 start index.js --name openzz
```
关闭命令
```shell
pm2 stop openzz
exit
```
重启服务命令
```shell
pm2 restart openzz
exit
```
设置开机自启
```shell
pm2 startup
pm2 save
```
取消开机自启
```shell
pm2 unstartup
```
