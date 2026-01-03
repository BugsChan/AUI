const AUI = require('aui');

var aui = new AUI({
    icon:{
        path:'./icon.png',
        width:32,
        height:32,
        position:'bottom',
        description:'打开AI提示'
    },
    window:{
        width:300,
        height:400,
        position:'bottom',
        description:'AI提示窗口',
        placeholder:'请输入您的问题'
    },
    description: "本网站是一个xxxxx,有xxxx功能",
    methods:{
        // 发送消息到指定用户
        sendMsg: {
            description: "这个方法的主要功能是向其它用户发送消息, AI要根据用户的要求，找到接收消息的用户ID并正确发送信息",
            method: function(id, msg){
                //TODO 发送消息到id用户
                console.log('sendMsg', id, msg);
            },
            params: [
                {
                    name:'id',
                    type:'string',
                    description:'接收消息的用户ID'
                },
                {
                    name:'msg',
                    type:'string',
                    description:'要发送的消息内容'
                }
            ],
            ui: ()=>{
                return {
                    type:'input',
                    cardImg: null,
                    attention: "请确认发送消息"
                }
            }
        },
        drawSth: {
            description: "这个方法的主要功能是在页面中绘制一些内容",
            method: function(svg){
                //TODO draw svg
                console.log('drawSth', svg);
            },
            params: [
                {
                    name:'svg',
                    type:'string',
                    description:'要绘制的内容, 格式为svg字符串'
                }
            ],
            ui: ()=>{
                return {
                    type:'button',
                    cardImg: "$svg", //通过$符, 可以在img中显示参数的内容
                    attention: "请确认绘制内容"
                }
            }
        },
        jumpToPageXX: {
            description: "这个方法的主要功能是跳转到XXX页面",
            method: "https://www.xxx.com", //跳转到XXX页面
            ui: ()=>{
                return {
                    type:'button',
                    cardImg: null,
                    attention: "请确认跳转页面"
                }
            }
        },
        takeATaxi: {
            description: "这个方法的主要功能是叫出租车",
            method: function(start, end){
                //TODO 叫出租车
                console.log('takeATaxi', start, end);
            },
            params: [
                {
                    name:'start',
                    type:'string',
                    description:'起始位置'
                },
                {
                    name:'end',
                    type:'string',
                    description:'目的地'
                }
            ],
            ui: ()=>{
                return {
                    type:'journey',
                    start:'start',
                    end:'end',
                    attention: "请确认叫出租车"
                }
            }
        }
    }
});