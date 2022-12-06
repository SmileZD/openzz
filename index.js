//加载依赖包
const tls = require('tls');
const net = require('net');
const ws = require('ws');

//设置ws服务端口
var serverPort=9501;//服务器ws端口
var secretKey='3DB8FDF54A9E898FB4F54FAC371ADBB5';//服务器密钥 任意长度大于1的字符
var key=Buffer.from(secretKey);

//简单加密
function am(content){
    //字符串转字节
    let data=Buffer.from(content);
    //按位异或
    for (var i = 0; i < data.length; i++){data[i] ^= key[i % key.length];}
    //字节转字符串
    return data.toString();
}

//简单解密
function em(content){
    //字符串转字节
    let data=Buffer.from(content);
    //按位异或
    for (var i = 0; i < data.length; i++){data[i] ^= key[i % key.length];}
    //字节转字符串
    return data.toString();
}

//启动ws服务器
function startws(){
    wss = new ws.Server({ port: serverPort })//wss是ws服务端对象
    wss.on('connection', (wsc) => {//当有客户端连接时开始执行 wsc是该客户端对象
        wsc.on('message', (message) => {//监听当收到客户端发来的信息
            message=message.toString();
            if (message.length>0) {//信息非空
                handleOnMessage(message,wsc)//处理客户端信息
            }
        })
        wsc.on('close',()=>{//监听当客户端断开时
            //尝试关掉矿池连接
            try {
                wsc.pool.forEach(element => {
                    element.close();
                    element=null;
                });
                wsc.pool=null;
            } catch (error) {}
            //尝试清理客户端
            try {wsc=null;} catch (error) {}
        })
    })
}

//处理客户端信息
function handleOnMessage(message,wsc){
    var data;
    try {
        const f=message[0];//获取信息首位
        message=message.slice(1);//去掉首位字符
        try {
            data=em(message).split('$');//解密 并用$符合分隔字符串
            var uuid=data[0];//客户端id
        } catch (e) {
            throw e
        }
        if(f=='s'){//首次连接或重新连接 和客户端约定 首字母s为矿机首次连接或重新连接
            if(data[1]&&data[2]&&data[3]){//如果结构正确，端口、矿池地址和是否ssl存在，连接矿池
                if(!wsc.pool){wsc.pool=[]}
                //尝试关掉原矿池连接
                try {wsc.pool[uuid].close()} catch (e) {}
                if(data[3]=='1'||data[3]==1){
                    //建立新tcp连接 并赋值给客户端对象的pool数组，key为客户端id
                    wsc.pool[uuid] = net.connect({ port: data[2], host: data[1] }, function () {//普通tcp连接 ssl连接使用tls
                        //监听当收到矿池数据
                        wsc.pool[uuid].on('data', function (d) {try {wsc.send('o'+am(''+uuid+'$'+d.toString()))} catch (e) {}})//加密后尝试发给客户端
                    })
                }else{
                    //建立新ssl连接 并赋值给客户端对象的pool数组，key为客户端id
                    wsc.pool[uuid] = tls.connect({ port: data[2], host: data[1] ,rejectUnauthorized: false }, function () {//普通tcp连接 ssl连接使用tls
                        //监听当收到矿池数据
                        wsc.pool[uuid].on('data', function (d) {try {wsc.send('o'+am(''+uuid+'$'+d.toString()))} catch (e) {}})//加密后尝试发给客户端
                    })
                }

                wsc.pool[uuid].on('close',function(){
                    try {
                        //矿池断开连接时，释放该连接
                        wsc.pool[uuid]=null;
                    } catch (e) {}
                })
                wsc.pool[uuid].on('error',function(){
                    try {
                        //矿池连接报错时，释放该连接
                        wsc.pool[uuid]=null;
                    } catch (e) {}
                })
            }
        }else{//非首次连接
            var pool=data[1];//矿机发送的矿池数据
            try {wsc.pool[uuid].write(Buffer.from(pool))} catch (e) {}//尝试发送给矿池
        }
    } catch (e) {
        console.log(e)     
    }
}
startws()
