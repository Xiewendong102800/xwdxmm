/**
 * @Author: cuihuan
 * Date :2014/8/6
 *
 * @version :0.0.0.2
 *
 * @function: 搜索结果页的插件demo
 *
 * @update : 2014/8/6   创建基本模板
 * @update : 2014/8/12  修复下面提示框的问题
 * @update : 2014/8/14  修复ie7长度的问题
 * @update : 2014/8/14  修复结果页input sizing属性的问题
 * @update : 2014/8/15  添加is识别标志
 * @update : 2014/8/15  添加css异步调用
 * @update : 2014/8/19  添加css基于缓存机制，存在则不进行调用
 * @update : 2014/8/20  修复学术弹出框情况下出现滚动条的问题
 * @update : 2014/8/24  添加用于显示位置的属性
 * @update : 2014/8/24  默认情况先弹出层，只有在点击截图之后可以进行截图，两个颜色一样。
 * @update : 2014/8/24  抽取所有css通过class控制
 * @update : 2014/8/29  图片获取路径进行了变更
 * @update : 2014/8/29  修改截图逻辑
 * @update : 2014/9/2   高度的优化
 * @update : 2014/9/2   已经上线
 *
 * @version:0.0.0.3
 * @update : 2014/9/11  修复ie6下展现和高度的问题
 * @update : 2015/6/20 添加性能测试数据的捕获
 *
 */
var bds=bds||{};
bds.qa=bds.qa||{};
bds.qa.ShortCut = {
    base_url_path: 'https://ufosdk.baidu.com',
    up_file: false,                                  //是否是截图，默认支持canvas
    is_feedbacking: false,                           //是否正在反馈，防止多次点击
    appid: 0,                                        //产品线appid
    entrance_id: 0,                                  //展示位置的id
    send_img:false,                                  //是否在截图的标志
    img_data:"",                                     //最终的图片数据
    onlyUpFile: false,                               //用于扩展定制，是否需要需要截图能
    pro_data:"",                                     //产品线定制数据

    plugintitle: '意见反馈&nbsp;',
    myFeedbackHtml: '<font style="font-size:13px;color:#2d9ef8;line-height:13px;">|&nbsp;<a style="font-size:13px;color:#2d9ef8;line-height:13px;text-decoration:underline;" href="https://ufo.baidu.com/listen/history?type=history#/history" target="_blank">我的反馈</a></font>',
	issueTips: '反馈内容',
    issuePlaceholder: "欢迎提出您在使用过程中遇到的问题或宝贵建议（400字以内），感谢您对百度的支持。",
    emailPlaceholder: "请留下您的联系方式，以便我们及时回复您。",
    guide: '<span>申请删除百度快照内容，请在<a style="text-decoration:underline;" href="http://tousu.baidu.com/webmaster/add" target="_blank">网页搜索投诉中心</a>提交。</span><br>' +
            '<span>网站收录、流量等站长相关问题，请在<a style="text-decoration:underline;" href="http://zhanzhang.baidu.com/feedback/index" target="_blank">站长平台</a>反馈。</span>',
    cutFileTips: "&nbsp;点我，可以上传图片哦~",
    cutCanvasTips: '&nbsp;点我，可以在当前页面截图哦~&nbsp;',
    emailTips: "联系方式",
    commitContent: "提交反馈",
    typeTips:"您遇到的问题类型",
    dangerTypeTips:"(*必选)",
    dangerContentTips:"(*必填)",
    contentRequiredTips:"请填写反馈描述",
    emailRequiredTips:"请填写联系方式",
    submitOkTips:"您的意见我们已经收到，谢谢！",

    okStyle:'',
    showPosition: "right",                                  //用于扩展定制，是否需要需要截图能
    skinStyle: "flat",                                  //用于扩展定制，是否需要需要截图能

    requiredEmail:false,
    needMyFeedback:false,
    needIssueTips:true,
    needIssue:true,
    needCut:true,
    needEmail:true,
    needGuide:false,
    needType:false,

    needDrag:true,                  //拖拽功能
    typeArray: {},                  //需要定制的类型

    defaultCut:false,
    customHttpsFunc:"",
    submitOkFunc:"",

    //cutImg:"jietu.png",
    //upImg:"upload.png",


    win_width:"",   //采用预先获取屏幕的宽度，防止滚动条的影响
    dialogPosition : {
        top   : "5px",
        left  : "5px",
        right : "5px",
        bottom: "5px"
    },


    initRightBar: function (fb_styles,fb_data) {
        if (bds.qa.ShortCut.is_feedbacking) {
            return true;
        }
        bds.qa.ShortCut.is_feedbacking = true;
        bds.qa.ShortCut._disposeHttps(fb_styles);              //兼容https处理
        bds.qa.ShortCut._getMyJquery();               //自带jquery1.10 ，同时，防止，冲突。改变了jquery的标志

        bds.qa.ShortCut.load_first(fb_styles);       //第一次加载
        fb_data!=undefined?bds.qa.ShortCut._getProData(fb_data):"";

        //兼容json.stringfy ie6 &7
        if(bds.qa.ShortCut._isIE()){
            "object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(a){return 10>a?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return"string"==typeof b?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,h,g=gap,i=b[a];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(a)),"function"==typeof rep&&(i=rep.call(b,a,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,h=[],"[object Array]"===Object.prototype.toString.apply(i)){for(f=i.length,c=0;f>c;c+=1)h[c]=str(c,i)||"null";return e=0===h.length?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&"object"==typeof rep)for(f=rep.length,c=0;f>c;c+=1)"string"==typeof rep[c]&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=0===h.length?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var cx,escapable,gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(a,b,c){var d;if(gap="",indent="","number"==typeof c)for(d=0;c>d;d+=1)indent+=" ";else"string"==typeof c&&(indent=c);if(rep=b,b&&"function"!=typeof b&&("object"!=typeof b||"number"!=typeof b.length))throw new Error("JSON.stringify");return str("",{"":a})}),"function"!=typeof JSON.parse&&(cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&"object"==typeof e)for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),void 0!==d?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;if(text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();
        }
    },


    //进行第一次加载
    load_first: function (fb_options) {
        if(!fb_options){
            fb_options=bds.qa.ShortCut.default_options;
        }

        bds.qa.ShortCut.initialize(fb_options);
        bds.qa.ShortCut.getPrepare();
        bds.qa.ShortCut.init();
        //bds.qa.ShortCut.imgLog(bds.qa.ShortCut.base_url_path + '/?m=Client&a=clickCount&pro_id=' + bds.qa.ShortCut.appid+"&entra_id="+bds.qa.ShortCut.entrance_id);   //记录点击次数
        //bds.qa.ShortCut.imgLog('http://cp01-rdqa-dev401.cp01.baidu.com:8765/?m=Client&a=clickCount&pro_id=' + bds.qa.ShortCut.appid+"&entra_id="+bds.qa.ShortCut.entrance_id);   //记录点击次数
        
        // todo 上线打开
        //bds.qa.ShortCut.getPerfData();   //记录性能参数
    },


    //是否需要加载jquery，需要的话
    _getMyJquery:function(){
		(function(a,b){if(typeof module==="object"&&typeof module.exports==="object"){module.exports=a.document?b(a,true):function(c){if(!c.document){throw new Error("jQuery requires a window with a document")}return b(c)}}else{b(a)}}(typeof window!=="undefined"?window:this,function(ar,aB){var aV=[];var K=aV.slice;var aX=aV.concat;var s=aV.push;var bM=aV.indexOf;var bi={};var bR=bi.toString;var bE=bi.hasOwnProperty;var bJ={};var ap="1.11.2",G=function(e,i){return new G.fn.init(e,i)},w=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,u=/^-ms-/,aC=/-([\da-z])/gi,J=function(i,e){return e.toUpperCase()};G.fn=G.prototype={jquery:ap,constructor:G,selector:"",length:0,toArray:function(){return K.call(this)},get:function(e){return e!=null?(e<0?this[e+this.length]:this[e]):K.call(this)},pushStack:function(e){var i=G.merge(this.constructor(),e);i.prevObject=this;i.context=this.context;return i},each:function(i,e){return G.each(this,i,e)},map:function(e){return this.pushStack(G.map(this,function(b6,b5){return e.call(b6,b5,b6)}))},slice:function(){return this.pushStack(K.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(b6){var e=this.length,b5=+b6+(b6<0?e:0);return this.pushStack(b5>=0&&b5<e?[this[b5]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:s,sort:aV.sort,splice:aV.splice};G.extend=G.fn.extend=function(){var e,ca,b6,b5,cc,cb,b7=arguments[0]||{},b8=1,b9=arguments.length,cd=false;if(typeof b7==="boolean"){cd=b7;b7=arguments[b8]||{};b8++}if(typeof b7!=="object"&&!G.isFunction(b7)){b7={}}if(b8===b9){b7=this;b8--}for(;b8<b9;b8++){if((cc=arguments[b8])!=null){for(b5 in cc){e=b7[b5];b6=cc[b5];if(b7===b6){continue}if(cd&&b6&&(G.isPlainObject(b6)||(ca=G.isArray(b6)))){if(ca){ca=false;cb=e&&G.isArray(e)?e:[]}else{cb=e&&G.isPlainObject(e)?e:{}}b7[b5]=G.extend(cd,cb,b6)}else{if(b6!==undefined){b7[b5]=b6}}}}}return b7};G.extend({expando:"jQuery"+(ap+Math.random()).replace(/\D/g,""),isReady:true,error:function(e){throw new Error(e)},noop:function(){},isFunction:function(e){return G.type(e)==="function"},isArray:Array.isArray||function(e){return G.type(e)==="array"},isWindow:function(e){return e!=null&&e==e.window},isNumeric:function(e){return !G.isArray(e)&&(e-parseFloat(e)+1)>=0},isEmptyObject:function(i){var e;for(e in i){return false}return true},isPlainObject:function(b6){var i;if(!b6||G.type(b6)!=="object"||b6.nodeType||G.isWindow(b6)){return false}try{if(b6.constructor&&!bE.call(b6,"constructor")&&!bE.call(b6.constructor.prototype,"isPrototypeOf")){return false}}catch(b5){return false}if(bJ.ownLast){for(i in b6){return bE.call(b6,i)}}for(i in b6){}return i===undefined||bE.call(b6,i)},type:function(e){if(e==null){return e+""}return typeof e==="object"||typeof e==="function"?bi[bR.call(e)]||"object":typeof e},globalEval:function(e){if(e&&G.trim(e)){(ar.execScript||function(i){ar["eval"].call(ar,i)})(e)}},camelCase:function(e){return e.replace(u,"ms-").replace(aC,J)},nodeName:function(i,e){return i.nodeName&&i.nodeName.toLowerCase()===e.toLowerCase()},each:function(ca,b9,b6){var b8,b7=0,b5=ca.length,e=bj(ca);if(b6){if(e){for(;b7<b5;b7++){b8=b9.apply(ca[b7],b6);if(b8===false){break}}}else{for(b7 in ca){b8=b9.apply(ca[b7],b6);if(b8===false){break}}}}else{if(e){for(;b7<b5;b7++){b8=b9.call(ca[b7],b7,ca[b7]);if(b8===false){break}}}else{for(b7 in ca){b8=b9.call(ca[b7],b7,ca[b7]);if(b8===false){break}}}}return ca},trim:function(e){return e==null?"":(e+"").replace(w,"")},makeArray:function(e,b5){var i=b5||[];if(e!=null){if(bj(Object(e))){G.merge(i,typeof e==="string"?[e]:e)}else{s.call(i,e)}}return i},inArray:function(b7,b5,b6){var e;if(b5){if(bM){return bM.call(b5,b7,b6)}e=b5.length;b6=b6?b6<0?Math.max(0,e+b6):b6:0;for(;b6<e;b6++){if(b6 in b5&&b5[b6]===b7){return b6}}}return -1},merge:function(b8,b7){var e=+b7.length,b5=0,b6=b8.length;while(b5<e){b8[b6++]=b7[b5++]}if(e!==e){while(b7[b5]!==undefined){b8[b6++]=b7[b5++]}}b8.length=b6;return b8},grep:function(b5,b8,b9){var cb,b7=[],b6=0,e=b5.length,ca=!b9;for(;b6<e;b6++){cb=!b8(b5[b6],b6);if(cb!==ca){b7.push(b5[b6])}}return b7},map:function(b7,cb,e){var ca,b9=0,b6=b7.length,b5=bj(b7),b8=[];if(b5){for(;b9<b6;b9++){ca=cb(b7[b9],b9,e);if(ca!=null){b8.push(ca)}}}else{for(b9 in b7){ca=cb(b7[b9],b9,e);if(ca!=null){b8.push(ca)}}}return aX.apply([],b8)},guid:1,proxy:function(b7,b6){var e,b5,i;if(typeof b6==="string"){i=b7[b6];b6=b7;b7=i}if(!G.isFunction(b7)){return undefined}e=K.call(arguments,2);b5=function(){return b7.apply(b6||this,e.concat(K.call(arguments)))};b5.guid=b7.guid=b7.guid||G.guid++;return b5},now:function(){return +(new Date())},support:bJ});G.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(b5,e){bi["[object "+e+"]"]=e.toLowerCase()});function bj(b5){var e=b5.length,i=G.type(b5);if(i==="function"||G.isWindow(b5)){return false}if(b5.nodeType===1&&e){return true}return i==="array"||e===0||typeof e==="number"&&e>0&&(e-1) in b5}var b=(function(cg){var cy,ce,cl,cO,cK,de,cX,cf,dk,cM,cW,cw,cA,cn,c8,cs,ch,ca,cP,cm="sizzle"+1*new Date(),cH=cg.document,dg=0,c2=0,b6=cV(),c7=cV(),cE=cV(),cU=function(i,e){if(i===e){cW=true}return 0},cF=1<<31,cG=({}).hasOwnProperty,da=[],dd=da.pop,cI=da.push,b7=da.push,cj=da.slice,cb=function(dp,dn){var dm=0,e=dp.length;for(;dm<e;dm++){if(dp[dm]===dn){return dm}}return -1},b8="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",co="[\\x20\\t\\r\\n\\f]",b5="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",cJ=b5.replace("w","w#"),c4="\\["+co+"*("+b5+")(?:"+co+"*([*^$|!~]?=)"+co+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+cJ+"))|)"+co+"*\\]",db=":("+b5+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+c4+")*)|.*)\\)|)",cv=new RegExp(co+"+","g"),cp=new RegExp("^"+co+"+|((?:^|[^\\\\])(?:\\\\.)*)"+co+"+$","g"),c0=new RegExp("^"+co+"*,"+co+"*"),cB=new RegExp("^"+co+"*([>+~]|"+co+")"+co+"*"),cr=new RegExp("="+co+"*([^\\]'\"]*?)"+co+"*\\]","g"),cQ=new RegExp(db),cD=new RegExp("^"+cJ+"$"),c1={ID:new RegExp("^#("+b5+")"),CLASS:new RegExp("^\\.("+b5+")"),TAG:new RegExp("^("+b5.replace("w","w*")+")"),ATTR:new RegExp("^"+c4),PSEUDO:new RegExp("^"+db),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+co+"*(even|odd|(([+-]|)(\\d*)n|)"+co+"*(?:([+-]|)"+co+"*(\\d+)|))"+co+"*\\)|)","i"),bool:new RegExp("^(?:"+b8+")$","i"),needsContext:new RegExp("^"+co+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+co+"*((?:-\\d)?\\d*)"+co+"*\\)|)(?=[^-]|$)","i")},cc=/^(?:input|select|textarea|button)$/i,ck=/^h\d$/i,cN=/^[^{]+\{\s*\[native \w/,cR=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,cu=/[+~]/,cL=/'|\\/g,c3=new RegExp("\\\\([\\da-f]{1,6}"+co+"?|("+co+")|.)","ig"),cq=function(i,dn,e){var dm="0x"+dn-65536;return dm!==dm||e?dn:dm<0?String.fromCharCode(dm+65536):String.fromCharCode(dm>>10|55296,dm&1023|56320)},di=function(){cw()};try{b7.apply((da=cj.call(cH.childNodes)),cH.childNodes);da[cH.childNodes.length].nodeType}catch(cC){b7={apply:da.length?function(i,e){cI.apply(i,cj.call(e))}:function(dp,dn){var e=dp.length,dm=0;while((dp[e++]=dn[dm++])){}dp.length=e-1}}}function cY(dt,dm,dx,dy){var dz,dr,dq,dv,dw,dA,dp,e,dn,du;if((dm?dm.ownerDocument||dm:cH)!==cA){cw(dm)}dm=dm||cA;dx=dx||[];dv=dm.nodeType;if(typeof dt!=="string"||!dt||dv!==1&&dv!==9&&dv!==11){return dx}if(!dy&&c8){if(dv!==11&&(dz=cR.exec(dt))){if((dq=dz[1])){if(dv===9){dr=dm.getElementById(dq);if(dr&&dr.parentNode){if(dr.id===dq){dx.push(dr);return dx}}else{return dx}}else{if(dm.ownerDocument&&(dr=dm.ownerDocument.getElementById(dq))&&cP(dm,dr)&&dr.id===dq){dx.push(dr);return dx}}}else{if(dz[2]){b7.apply(dx,dm.getElementsByTagName(dt));return dx}else{if((dq=dz[3])&&ce.getElementsByClassName){b7.apply(dx,dm.getElementsByClassName(dq));return dx}}}}if(ce.qsa&&(!cs||!cs.test(dt))){e=dp=cm;dn=dm;du=dv!==1&&dt;if(dv===1&&dm.nodeName.toLowerCase()!=="object"){dA=de(dt);if((dp=dm.getAttribute("id"))){e=dp.replace(cL,"\\$&")}else{dm.setAttribute("id",e)}e="[id='"+e+"'] ";dw=dA.length;while(dw--){dA[dw]=e+ci(dA[dw])}dn=cu.test(dt)&&cS(dm.parentNode)||dm;du=dA.join(",")}if(du){try{b7.apply(dx,dn.querySelectorAll(du));return dx}catch(ds){}finally{if(!dp){dm.removeAttribute("id")}}}}}return cf(dt.replace(cp,"$1"),dm,dx,dy)}function cV(){var i=[];function e(dm,dn){if(i.push(dm+" ")>cl.cacheLength){delete e[i.shift()]}return(e[dm+" "]=dn)}return e}function dc(e){e[cm]=true;return e}function dh(i){var dn=cA.createElement("div");try{return !!i(dn)}catch(dm){return false}finally{if(dn.parentNode){dn.parentNode.removeChild(dn)}dn=null}}function cd(dm,dp){var e=dm.split("|"),dn=dm.length;while(dn--){cl.attrHandle[e[dn]]=dp}}function dl(i,e){var dn=e&&i,dm=dn&&i.nodeType===1&&e.nodeType===1&&(~e.sourceIndex||cF)-(~i.sourceIndex||cF);if(dm){return dm}if(dn){while((dn=dn.nextSibling)){if(dn===e){return -1}}}return i?1:-1}function cx(e){return function(dm){var i=dm.nodeName.toLowerCase();return i==="input"&&dm.type===e}}function dj(e){return function(dm){var i=dm.nodeName.toLowerCase();return(i==="input"||i==="button")&&dm.type===e}}function c5(e){return dc(function(i){i=+i;return dc(function(dm,dr){var dn,dq=e([],dm.length,i),dp=dq.length;while(dp--){if(dm[(dn=dq[dp])]){dm[dn]=!(dr[dn]=dm[dn])}}})})}function cS(e){return e&&typeof e.getElementsByTagName!=="undefined"&&e}ce=cY.support={};cK=cY.isXML=function(e){var i=e&&(e.ownerDocument||e).documentElement;return i?i.nodeName!=="HTML":false};cw=cY.setDocument=function(dm){var i,e,dn=dm?dm.ownerDocument||dm:cH;if(dn===cA||dn.nodeType!==9||!dn.documentElement){return cA}cA=dn;cn=dn.documentElement;e=dn.defaultView;if(e&&e!==e.top){if(e.addEventListener){e.addEventListener("unload",di,false)}else{if(e.attachEvent){e.attachEvent("onunload",di)}}}c8=!cK(dn);ce.attributes=dh(function(dp){dp.className="i";return !dp.getAttribute("className")});ce.getElementsByTagName=dh(function(dp){dp.appendChild(dn.createComment(""));return !dp.getElementsByTagName("*").length});ce.getElementsByClassName=cN.test(dn.getElementsByClassName);ce.getById=dh(function(dp){cn.appendChild(dp).id=cm;return !dn.getElementsByName||!dn.getElementsByName(cm).length});if(ce.getById){cl.find.ID=function(dr,dq){if(typeof dq.getElementById!=="undefined"&&c8){var dp=dq.getElementById(dr);return dp&&dp.parentNode?[dp]:[]}};cl.filter.ID=function(dq){var dp=dq.replace(c3,cq);return function(dr){return dr.getAttribute("id")===dp}}}else{delete cl.find.ID;cl.filter.ID=function(dq){var dp=dq.replace(c3,cq);return function(ds){var dr=typeof ds.getAttributeNode!=="undefined"&&ds.getAttributeNode("id");return dr&&dr.value===dp}}}cl.find.TAG=ce.getElementsByTagName?function(dp,dq){if(typeof dq.getElementsByTagName!=="undefined"){return dq.getElementsByTagName(dp)}else{if(ce.qsa){return dq.querySelectorAll(dp)}}}:function(dp,dt){var du,ds=[],dr=0,dq=dt.getElementsByTagName(dp);if(dp==="*"){while((du=dq[dr++])){if(du.nodeType===1){ds.push(du)}}return ds}return dq};cl.find.CLASS=ce.getElementsByClassName&&function(dp,dq){if(c8){return dq.getElementsByClassName(dp)}};ch=[];cs=[];if((ce.qsa=cN.test(dn.querySelectorAll))){dh(function(dp){cn.appendChild(dp).innerHTML="<a id='"+cm+"'></a><select id='"+cm+"-\f]' msallowcapture=''><option selected=''></option></select>";if(dp.querySelectorAll("[msallowcapture^='']").length){cs.push("[*^$]="+co+"*(?:''|\"\")")}if(!dp.querySelectorAll("[selected]").length){cs.push("\\["+co+"*(?:value|"+b8+")")}if(!dp.querySelectorAll("[id~="+cm+"-]").length){cs.push("~=")}if(!dp.querySelectorAll(":checked").length){cs.push(":checked")}if(!dp.querySelectorAll("a#"+cm+"+*").length){cs.push(".#.+[+~]")}});dh(function(dq){var dp=dn.createElement("input");dp.setAttribute("type","hidden");dq.appendChild(dp).setAttribute("name","D");if(dq.querySelectorAll("[name=d]").length){cs.push("name"+co+"*[*^$|!~]?=")}if(!dq.querySelectorAll(":enabled").length){cs.push(":enabled",":disabled")}dq.querySelectorAll("*,:x");cs.push(",.*:")})}if((ce.matchesSelector=cN.test((ca=cn.matches||cn.webkitMatchesSelector||cn.mozMatchesSelector||cn.oMatchesSelector||cn.msMatchesSelector)))){dh(function(dp){ce.disconnectedMatch=ca.call(dp,"div");ca.call(dp,"[s!='']:x");ch.push("!=",db)})}cs=cs.length&&new RegExp(cs.join("|"));ch=ch.length&&new RegExp(ch.join("|"));i=cN.test(cn.compareDocumentPosition);cP=i||cN.test(cn.contains)?function(dq,dp){var ds=dq.nodeType===9?dq.documentElement:dq,dr=dp&&dp.parentNode;return dq===dr||!!(dr&&dr.nodeType===1&&(ds.contains?ds.contains(dr):dq.compareDocumentPosition&&dq.compareDocumentPosition(dr)&16))}:function(dq,dp){if(dp){while((dp=dp.parentNode)){if(dp===dq){return true}}}return false};cU=i?function(dq,dp){if(dq===dp){cW=true;return 0}var dr=!dq.compareDocumentPosition-!dp.compareDocumentPosition;if(dr){return dr}dr=(dq.ownerDocument||dq)===(dp.ownerDocument||dp)?dq.compareDocumentPosition(dp):1;if(dr&1||(!ce.sortDetached&&dp.compareDocumentPosition(dq)===dr)){if(dq===dn||dq.ownerDocument===cH&&cP(cH,dq)){return -1}if(dp===dn||dp.ownerDocument===cH&&cP(cH,dp)){return 1}return cM?(cb(cM,dq)-cb(cM,dp)):0}return dr&4?-1:1}:function(dq,dp){if(dq===dp){cW=true;return 0}var dw,dt=0,dv=dq.parentNode,ds=dp.parentNode,dr=[dq],du=[dp];if(!dv||!ds){return dq===dn?-1:dp===dn?1:dv?-1:ds?1:cM?(cb(cM,dq)-cb(cM,dp)):0}else{if(dv===ds){return dl(dq,dp)}}dw=dq;while((dw=dw.parentNode)){dr.unshift(dw)}dw=dp;while((dw=dw.parentNode)){du.unshift(dw)}while(dr[dt]===du[dt]){dt++}return dt?dl(dr[dt],du[dt]):dr[dt]===cH?-1:du[dt]===cH?1:0};return dn};cY.matches=function(i,e){return cY(i,null,null,e)};cY.matchesSelector=function(dm,dp){if((dm.ownerDocument||dm)!==cA){cw(dm)}dp=dp.replace(cr,"='$1']");if(ce.matchesSelector&&c8&&(!ch||!ch.test(dp))&&(!cs||!cs.test(dp))){try{var i=ca.call(dm,dp);if(i||ce.disconnectedMatch||dm.document&&dm.document.nodeType!==11){return i}}catch(dn){}}return cY(dp,cA,null,[dm]).length>0};cY.contains=function(e,i){if((e.ownerDocument||e)!==cA){cw(e)}return cP(e,i)};cY.attr=function(dm,e){if((dm.ownerDocument||dm)!==cA){cw(dm)}var i=cl.attrHandle[e.toLowerCase()],dn=i&&cG.call(cl.attrHandle,e.toLowerCase())?i(dm,e,!c8):undefined;return dn!==undefined?dn:ce.attributes||!c8?dm.getAttribute(e):(dn=dm.getAttributeNode(e))&&dn.specified?dn.value:null};cY.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)};cY.uniqueSort=function(dn){var dp,dq=[],e=0,dm=0;cW=!ce.detectDuplicates;cM=!ce.sortStable&&dn.slice(0);dn.sort(cU);if(cW){while((dp=dn[dm++])){if(dp===dn[dm]){e=dq.push(dm)}}while(e--){dn.splice(dq[e],1)}}cM=null;return dn};cO=cY.getText=function(dq){var dp,dm="",dn=0,e=dq.nodeType;if(!e){while((dp=dq[dn++])){dm+=cO(dp)}}else{if(e===1||e===9||e===11){if(typeof dq.textContent==="string"){return dq.textContent}else{for(dq=dq.firstChild;dq;dq=dq.nextSibling){dm+=cO(dq)}}}else{if(e===3||e===4){return dq.nodeValue}}}return dm};cl=cY.selectors={cacheLength:50,createPseudo:dc,match:c1,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:true}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:true},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){e[1]=e[1].replace(c3,cq);e[3]=(e[3]||e[4]||e[5]||"").replace(c3,cq);if(e[2]==="~="){e[3]=" "+e[3]+" "}return e.slice(0,4)},CHILD:function(e){e[1]=e[1].toLowerCase();if(e[1].slice(0,3)==="nth"){if(!e[3]){cY.error(e[0])}e[4]=+(e[4]?e[5]+(e[6]||1):2*(e[3]==="even"||e[3]==="odd"));e[5]=+((e[7]+e[8])||e[3]==="odd")}else{if(e[3]){cY.error(e[0])}}return e},PSEUDO:function(i){var dm,e=!i[6]&&i[2];if(c1.CHILD.test(i[0])){return null}if(i[3]){i[2]=i[4]||i[5]||""}else{if(e&&cQ.test(e)&&(dm=de(e,true))&&(dm=e.indexOf(")",e.length-dm)-e.length)){i[0]=i[0].slice(0,dm);i[2]=e.slice(0,dm)}}return i.slice(0,3)}},filter:{TAG:function(e){var i=e.replace(c3,cq).toLowerCase();return e==="*"?function(){return true}:function(dm){return dm.nodeName&&dm.nodeName.toLowerCase()===i}},CLASS:function(i){var e=b6[i+" "];return e||(e=new RegExp("(^|"+co+")"+i+"("+co+"|$)"))&&b6(i,function(dm){return e.test(typeof dm.className==="string"&&dm.className||typeof dm.getAttribute!=="undefined"&&dm.getAttribute("class")||"")})},ATTR:function(i,dm,e){return function(dn){var dp=cY.attr(dn,i);if(dp==null){return dm==="!="}if(!dm){return true}dp+="";return dm==="="?dp===e:dm==="!="?dp!==e:dm==="^="?e&&dp.indexOf(e)===0:dm==="*="?e&&dp.indexOf(e)>-1:dm==="$="?e&&dp.slice(-e.length)===e:dm==="~="?(" "+dp.replace(cv," ")+" ").indexOf(e)>-1:dm==="|="?dp===e||dp.slice(0,e.length+1)===e+"-":false}},CHILD:function(dm,dr,e,ds,dn){var dq=dm.slice(0,3)!=="nth",i=dm.slice(-4)!=="last",dp=dr==="of-type";return ds===1&&dn===0?function(dt){return !!dt.parentNode}:function(dz,dw,dB){var dt,dF,dy,dD,dA,dv,dx=dq!==i?"nextSibling":"previousSibling",dE=dz.parentNode,du=dp&&dz.nodeName.toLowerCase(),dC=!dB&&!dp;if(dE){if(dq){while(dx){dy=dz;while((dy=dy[dx])){if(dp?dy.nodeName.toLowerCase()===du:dy.nodeType===1){return false}}dv=dx=dm==="only"&&!dv&&"nextSibling"}return true}dv=[i?dE.firstChild:dE.lastChild];if(i&&dC){dF=dE[cm]||(dE[cm]={});dt=dF[dm]||[];dA=dt[0]===dg&&dt[1];dD=dt[0]===dg&&dt[2];dy=dA&&dE.childNodes[dA];while((dy=++dA&&dy&&dy[dx]||(dD=dA=0)||dv.pop())){if(dy.nodeType===1&&++dD&&dy===dz){dF[dm]=[dg,dA,dD];break}}}else{if(dC&&(dt=(dz[cm]||(dz[cm]={}))[dm])&&dt[0]===dg){dD=dt[1]}else{while((dy=++dA&&dy&&dy[dx]||(dD=dA=0)||dv.pop())){if((dp?dy.nodeName.toLowerCase()===du:dy.nodeType===1)&&++dD){if(dC){(dy[cm]||(dy[cm]={}))[dm]=[dg,dD]}if(dy===dz){break}}}}}dD-=dn;return dD===ds||(dD%ds===0&&dD/ds>=0)}}},PSEUDO:function(e,i){var dm,dn=cl.pseudos[e]||cl.setFilters[e.toLowerCase()]||cY.error("unsupported pseudo: "+e);if(dn[cm]){return dn(i)}if(dn.length>1){dm=[e,e,"",i];return cl.setFilters.hasOwnProperty(e.toLowerCase())?dc(function(dr,dt){var dq,dp=dn(dr,i),ds=dp.length;while(ds--){dq=cb(dr,dp[ds]);dr[dq]=!(dt[dq]=dp[ds])}}):function(dp){return dn(dp,0,dm)}}return dn}},pseudos:{not:dc(function(e){var i=[],dm=[],dn=cX(e.replace(cp,"$1"));return dn[cm]?dc(function(dp,dv,ds,dq){var dt,du=dn(dp,null,dq,[]),dr=dp.length;while(dr--){if((dt=du[dr])){dp[dr]=!(dv[dr]=dt)}}}):function(dr,dq,dp){i[0]=dr;dn(i,null,dp,dm);i[0]=null;return !dm.pop()}}),has:dc(function(e){return function(i){return cY(e,i).length>0}}),contains:dc(function(e){e=e.replace(c3,cq);return function(i){return(i.textContent||i.innerText||cO(i)).indexOf(e)>-1}}),lang:dc(function(e){if(!cD.test(e||"")){cY.error("unsupported lang: "+e)}e=e.replace(c3,cq).toLowerCase();return function(dm){var i;do{if((i=c8?dm.lang:dm.getAttribute("xml:lang")||dm.getAttribute("lang"))){i=i.toLowerCase();return i===e||i.indexOf(e+"-")===0}}while((dm=dm.parentNode)&&dm.nodeType===1);return false}}),target:function(e){var i=cg.location&&cg.location.hash;return i&&i.slice(1)===e.id},root:function(e){return e===cn},focus:function(e){return e===cA.activeElement&&(!cA.hasFocus||cA.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===false},disabled:function(e){return e.disabled===true},checked:function(e){var i=e.nodeName.toLowerCase();return(i==="input"&&!!e.checked)||(i==="option"&&!!e.selected)},selected:function(e){if(e.parentNode){e.parentNode.selectedIndex}return e.selected===true},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling){if(e.nodeType<6){return false}}return true},parent:function(e){return !cl.pseudos.empty(e)},header:function(e){return ck.test(e.nodeName)},input:function(e){return cc.test(e.nodeName)},button:function(i){var e=i.nodeName.toLowerCase();return e==="input"&&i.type==="button"||e==="button"},text:function(i){var e;return i.nodeName.toLowerCase()==="input"&&i.type==="text"&&((e=i.getAttribute("type"))==null||e.toLowerCase()==="text")},first:c5(function(){return[0]}),last:c5(function(i,e){return[e-1]}),eq:c5(function(dm,i,e){return[e<0?e+i:e]}),even:c5(function(dn,e){var dm=0;for(;dm<e;dm+=2){dn.push(dm)}return dn}),odd:c5(function(dn,e){var dm=1;for(;dm<e;dm+=2){dn.push(dm)}return dn}),lt:c5(function(dp,dm,e){var dn=e<0?e+dm:e;for(;--dn>=0;){dp.push(dn)}return dp}),gt:c5(function(dp,dm,e){var dn=e<0?e+dm:e;for(;++dn<dm;){dp.push(dn)}return dp})}};cl.pseudos.nth=cl.pseudos.eq;for(cy in {radio:true,checkbox:true,file:true,password:true,image:true}){cl.pseudos[cy]=cx(cy)}for(cy in {submit:true,reset:true}){cl.pseudos[cy]=dj(cy)}function cT(){}cT.prototype=cl.filters=cl.pseudos;cl.setFilters=new cT();de=cY.tokenize=function(dn,du){var dm,dq,e,dt,ds,dr,i,dp=c7[dn+" "];if(dp){return du?0:dp.slice(0)}ds=dn;dr=[];i=cl.preFilter;while(ds){if(!dm||(dq=c0.exec(ds))){if(dq){ds=ds.slice(dq[0].length)||ds}dr.push((e=[]))}dm=false;if((dq=cB.exec(ds))){dm=dq.shift();e.push({value:dm,type:dq[0].replace(cp," ")});ds=ds.slice(dm.length)}for(dt in cl.filter){if((dq=c1[dt].exec(ds))&&(!i[dt]||(dq=i[dt](dq)))){dm=dq.shift();e.push({value:dm,type:dt,matches:dq});ds=ds.slice(dm.length)}}if(!dm){break}}return du?ds.length:ds?cY.error(dn):c7(dn,dr).slice(0)};function ci(dp){var dn=0,dm=dp.length,e="";for(;dn<dm;dn++){e+=dp[dn].value}return e}function c6(dp,e,dn){var i=e.dir,dq=dn&&i==="parentNode",dm=c2++;return e.first?function(dt,ds,dr){while((dt=dt[i])){if(dt.nodeType===1||dq){return dp(dt,ds,dr)}}}:function(dv,dt,ds){var dw,du,dr=[dg,dm];if(ds){while((dv=dv[i])){if(dv.nodeType===1||dq){if(dp(dv,dt,ds)){return true}}}}else{while((dv=dv[i])){if(dv.nodeType===1||dq){du=dv[cm]||(dv[cm]={});if((dw=du[i])&&dw[0]===dg&&dw[1]===dm){return(dr[2]=dw[2])}else{du[i]=dr;if((dr[2]=dp(dv,dt,ds))){return true}}}}}}}function b9(e){return e.length>1?function(dq,dp,dm){var dn=e.length;while(dn--){if(!e[dn](dq,dp,dm)){return false}}return true}:e[0]}function cz(dm,dq,dp){var dn=0,e=dq.length;for(;dn<e;dn++){cY(dm,dq[dn],dp)}return dp}function ct(du,dm,dt,dn,dr){var dp,dv=[],dq=0,ds=du.length,e=dm!=null;for(;dq<ds;dq++){if((dp=du[dq])){if(!dt||dt(dp,dn,dr)){dv.push(dp);if(e){dm.push(dq)}}}}return dv}function df(dm,i,dp,dn,dq,e){if(dn&&!dn[cm]){dn=df(dn)}if(dq&&!dq[cm]){dq=df(dq,e)}return dc(function(dz,dy,dt,dA){var dD,dx,du,dB=[],ds=[],dC=dy.length,dr=dz||cz(i||"*",dt.nodeType?[dt]:dt,[]),dv=dm&&(dz||!i)?ct(dr,dB,dm,dt,dA):dr,dw=dp?dq||(dz?dm:dC||dn)?[]:dy:dv;if(dp){dp(dv,dw,dt,dA)}if(dn){dD=ct(dw,ds);dn(dD,[],dt,dA);dx=dD.length;while(dx--){if((du=dD[dx])){dw[ds[dx]]=!(dv[ds[dx]]=du)}}}if(dz){if(dq||dm){if(dq){dD=[];dx=dw.length;while(dx--){if((du=dw[dx])){dD.push((dv[dx]=du))}}dq(null,(dw=[]),dD,dA)}dx=dw.length;while(dx--){if((du=dw[dx])&&(dD=dq?cb(dz,du):dB[dx])>-1){dz[dD]=!(dy[dD]=du)}}}}else{dw=ct(dw===dy?dw.splice(dC,dw.length):dw);if(dq){dq(null,dy,dw,dA)}else{b7.apply(dy,dw)}}})}function c9(e){var dn,dr,dp,ds=e.length,du=cl.relative[e[0].type],dw=du||cl.relative[" "],dq=du?1:0,dv=c6(function(i){return i===dn},dw,true),dt=c6(function(i){return cb(dn,i)>-1},dw,true),dm=[function(dz,dy,dx){var i=(!du&&(dx||dy!==dk))||((dn=dy).nodeType?dv(dz,dy,dx):dt(dz,dy,dx));dn=null;return i}];for(;dq<ds;dq++){if((dr=cl.relative[e[dq].type])){dm=[c6(b9(dm),dr)]}else{dr=cl.filter[e[dq].type].apply(null,e[dq].matches);if(dr[cm]){dp=++dq;for(;dp<ds;dp++){if(cl.relative[e[dp].type]){break}}return df(dq>1&&b9(dm),dq>1&&ci(e.slice(0,dq-1).concat({value:e[dq-2].type===" "?"*":""})).replace(cp,"$1"),dr,dq<dp&&c9(e.slice(dq,dp)),dp<ds&&c9((e=e.slice(dp))),dp<ds&&ci(e))}dm.push(dr)}}return b9(dm)}function cZ(dn,i){var e=i.length>0,dp=dn.length>0,dm=function(dy,dt,dz,dx,dC){var du,dv,dA,dD=0,dw="0",dE=dy&&[],dF=[],ds=dk,dr=dy||dp&&cl.find.TAG("*",dC),dq=(dg+=ds==null?1:Math.random()||0.1),dB=dr.length;if(dC){dk=dt!==cA&&dt}for(;dw!==dB&&(du=dr[dw])!=null;dw++){if(dp&&du){dv=0;while((dA=dn[dv++])){if(dA(du,dt,dz)){dx.push(du);break}}if(dC){dg=dq}}if(e){if((du=!dA&&du)){dD--}if(dy){dE.push(du)}}}dD+=dw;if(e&&dw!==dD){dv=0;while((dA=i[dv++])){dA(dE,dF,dt,dz)}if(dy){if(dD>0){while(dw--){if(!(dE[dw]||dF[dw])){dF[dw]=dd.call(dx)}}}dF=ct(dF)}b7.apply(dx,dF);if(dC&&!dy&&dF.length>0&&(dD+i.length)>1){cY.uniqueSort(dx)}}if(dC){dg=dq;dk=ds}return dE};return e?dc(dm):dm}cX=cY.compile=function(e,dn){var dp,dq=[],dr=[],dm=cE[e+" "];if(!dm){if(!dn){dn=de(e)}dp=dn.length;while(dp--){dm=c9(dn[dp]);if(dm[cm]){dq.push(dm)}else{dr.push(dm)}}dm=cE(e,cZ(dr,dq));dm.selector=e}return dm};cf=cY.select=function(dp,dn,ds,du){var dr,dm,dq,dw,dv,e=typeof dp==="function"&&dp,dt=!du&&de((dp=e.selector||dp));ds=ds||[];if(dt.length===1){dm=dt[0]=dt[0].slice(0);if(dm.length>2&&(dq=dm[0]).type==="ID"&&ce.getById&&dn.nodeType===9&&c8&&cl.relative[dm[1].type]){dn=(cl.find.ID(dq.matches[0].replace(c3,cq),dn)||[])[0];if(!dn){return ds}else{if(e){dn=dn.parentNode}}dp=dp.slice(dm.shift().value.length)}dr=c1.needsContext.test(dp)?0:dm.length;while(dr--){dq=dm[dr];if(cl.relative[(dw=dq.type)]){break}if((dv=cl.find[dw])){if((du=dv(dq.matches[0].replace(c3,cq),cu.test(dm[0].type)&&cS(dn.parentNode)||dn))){dm.splice(dr,1);dp=du.length&&ci(dm);if(!dp){b7.apply(ds,du);return ds}break}}}}(e||cX(dp,dt))(du,dn,!c8,ds,cu.test(dp)&&cS(dn.parentNode)||dn);return ds};ce.sortStable=cm.split("").sort(cU).join("")===cm;ce.detectDuplicates=!!cW;cw();ce.sortDetached=dh(function(e){return e.compareDocumentPosition(cA.createElement("div"))&1});if(!dh(function(e){e.innerHTML="<a href='#'></a>";return e.firstChild.getAttribute("href")==="#"})){cd("type|href|height|width",function(i,e,dm){if(!dm){return i.getAttribute(e,e.toLowerCase()==="type"?1:2)}})}if(!ce.attributes||!dh(function(e){e.innerHTML="<input/>";e.firstChild.setAttribute("value","");return e.firstChild.getAttribute("value")===""})){cd("value",function(i,e,dm){if(!dm&&i.nodeName.toLowerCase()==="input"){return i.defaultValue}})}if(!dh(function(e){return e.getAttribute("disabled")==null})){cd(b8,function(i,e,dn){var dm;if(!dn){return i[e]===true?e.toLowerCase():(dm=i.getAttributeNode(e))&&dm.specified?dm.value:null}})}return cY})(ar);G.find=b;G.expr=b.selectors;G.expr[":"]=G.expr.pseudos;G.unique=b.uniqueSort;G.text=b.getText;G.isXMLDoc=b.isXML;G.contains=b.contains;var bO=G.expr.match.needsContext;var c=(/^<(\w+)\s*\/?>(?:<\/\1>|)$/);var aP=/^.[^:#\[\.,]*$/;function aF(e,i,b5){if(G.isFunction(i)){return G.grep(e,function(b7,b6){return !!i.call(b7,b6,b7)!==b5})}if(i.nodeType){return G.grep(e,function(b6){return(b6===i)!==b5})}if(typeof i==="string"){if(aP.test(i)){return G.filter(i,e,b5)}i=G.filter(i,e)}return G.grep(e,function(b6){return(G.inArray(b6,i)>=0)!==b5})}G.filter=function(b6,e,b5){var i=e[0];if(b5){b6=":not("+b6+")"}return e.length===1&&i.nodeType===1?G.find.matchesSelector(i,b6)?[i]:[]:G.find.matches(b6,G.grep(e,function(b7){return b7.nodeType===1}))};G.fn.extend({find:function(b5){var b8,b7=[],b6=this,e=b6.length;if(typeof b5!=="string"){return this.pushStack(G(b5).filter(function(){for(b8=0;b8<e;b8++){if(G.contains(b6[b8],this)){return true}}}))}for(b8=0;b8<e;b8++){G.find(b5,b6[b8],b7)}b7=this.pushStack(e>1?G.unique(b7):b7);b7.selector=this.selector?this.selector+" "+b5:b5;return b7},filter:function(e){return this.pushStack(aF(this,e||[],false))},not:function(e){return this.pushStack(aF(this,e||[],true))},is:function(e){return !!aF(this,typeof e==="string"&&bO.test(e)?G(e):e||[],false).length}});var bQ,n=ar.document,br=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,bN=G.fn.init=function(e,b5){var i,b6;if(!e){return this}if(typeof e==="string"){if(e.charAt(0)==="<"&&e.charAt(e.length-1)===">"&&e.length>=3){i=[null,e,null]}else{i=br.exec(e)}if(i&&(i[1]||!b5)){if(i[1]){b5=b5 instanceof G?b5[0]:b5;G.merge(this,G.parseHTML(i[1],b5&&b5.nodeType?b5.ownerDocument||b5:n,true));if(c.test(i[1])&&G.isPlainObject(b5)){for(i in b5){if(G.isFunction(this[i])){this[i](b5[i])}else{this.attr(i,b5[i])}}}return this}else{b6=n.getElementById(i[2]);if(b6&&b6.parentNode){if(b6.id!==i[2]){return bQ.find(e)}this.length=1;this[0]=b6}this.context=n;this.selector=e;return this}}else{if(!b5||b5.jquery){return(b5||bQ).find(e)}else{return this.constructor(b5).find(e)}}}else{if(e.nodeType){this.context=this[0]=e;this.length=1;return this}else{if(G.isFunction(e)){return typeof bQ.ready!=="undefined"?bQ.ready(e):e(G)}}}if(e.selector!==undefined){this.selector=e.selector;this.context=e.context}return G.makeArray(e,this)};bN.prototype=G.fn;bQ=G(n);var W=/^(?:parents|prev(?:Until|All))/,U={children:true,contents:true,next:true,prev:true};G.extend({dir:function(b5,i,b7){var e=[],b6=b5[i];while(b6&&b6.nodeType!==9&&(b7===undefined||b6.nodeType!==1||!G(b6).is(b7))){if(b6.nodeType===1){e.push(b6)}b6=b6[i]}return e},sibling:function(b5,i){var e=[];for(;b5;b5=b5.nextSibling){if(b5.nodeType===1&&b5!==i){e.push(b5)}}return e}});G.fn.extend({has:function(b7){var b5,b6=G(b7,this),e=b6.length;return this.filter(function(){for(b5=0;b5<e;b5++){if(G.contains(this,b6[b5])){return true}}})},closest:function(b6,b8){var b9,b7=0,b5=this.length,e=[],ca=bO.test(b6)||typeof b6!=="string"?G(b6,b8||this.context):0;for(;b7<b5;b7++){for(b9=this[b7];b9&&b9!==b8;b9=b9.parentNode){if(b9.nodeType<11&&(ca?ca.index(b9)>-1:b9.nodeType===1&&G.find.matchesSelector(b9,b6))){e.push(b9);break}}}return this.pushStack(e.length>1?G.unique(e):e)},index:function(e){if(!e){return(this[0]&&this[0].parentNode)?this.first().prevAll().length:-1}if(typeof e==="string"){return G.inArray(this[0],G(e))}return G.inArray(e.jquery?e[0]:e,this)},add:function(e,i){return this.pushStack(G.unique(G.merge(this.get(),G(e,i))))},addBack:function(e){return this.add(e==null?this.prevObject:this.prevObject.filter(e))}});function a4(i,e){do{i=i[e]}while(i&&i.nodeType!==1);return i}G.each({parent:function(i){var e=i.parentNode;return e&&e.nodeType!==11?e:null},parents:function(e){return G.dir(e,"parentNode")},parentsUntil:function(b5,e,b6){return G.dir(b5,"parentNode",b6)},next:function(e){return a4(e,"nextSibling")},prev:function(e){return a4(e,"previousSibling")},nextAll:function(e){return G.dir(e,"nextSibling")},prevAll:function(e){return G.dir(e,"previousSibling")},nextUntil:function(b5,e,b6){return G.dir(b5,"nextSibling",b6)},prevUntil:function(b5,e,b6){return G.dir(b5,"previousSibling",b6)},siblings:function(e){return G.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return G.sibling(e.firstChild)},contents:function(e){return G.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:G.merge([],e.childNodes)}},function(e,i){G.fn[e]=function(b7,b5){var b6=G.map(this,i,b7);if(e.slice(-5)!=="Until"){b5=b7}if(b5&&typeof b5==="string"){b6=G.filter(b5,b6)}if(this.length>1){if(!U[e]){b6=G.unique(b6)}if(W.test(e)){b6=b6.reverse()}}return this.pushStack(b6)}});var aK=(/\S+/g);var o={};function ak(i){var e=o[i]={};G.each(i.match(aK)||[],function(b6,b5){e[b5]=true});return e}G.Callbacks=function(cc){cc=typeof cc==="string"?(o[cc]||ak(cc)):G.extend({},cc);var b6,b7,e,b8,i,b9,ca=[],cb=!cc.once&&[],b5=function(ce){b7=cc.memory&&ce;e=true;i=b9||0;b9=0;b8=ca.length;b6=true;for(;ca&&i<b8;i++){if(ca[i].apply(ce[0],ce[1])===false&&cc.stopOnFalse){b7=false;break}}b6=false;if(ca){if(cb){if(cb.length){b5(cb.shift())}}else{if(b7){ca=[]}else{cd.disable()}}}},cd={add:function(){if(ca){var cf=ca.length;(function ce(cg){G.each(cg,function(ci,ch){var cj=G.type(ch);if(cj==="function"){if(!cc.unique||!cd.has(ch)){ca.push(ch)}}else{if(ch&&ch.length&&cj!=="string"){ce(ch)}}})})(arguments);if(b6){b8=ca.length}else{if(b7){b9=cf;b5(b7)}}}return this},remove:function(){if(ca){G.each(arguments,function(cg,ce){var cf;while((cf=G.inArray(ce,ca,cf))>-1){ca.splice(cf,1);if(b6){if(cf<=b8){b8--}if(cf<=i){i--}}}})}return this},has:function(ce){return ce?G.inArray(ce,ca)>-1:!!(ca&&ca.length)},empty:function(){ca=[];b8=0;return this},disable:function(){ca=cb=b7=undefined;return this},disabled:function(){return !ca},lock:function(){cb=undefined;if(!b7){cd.disable()}return this},locked:function(){return !cb},fireWith:function(cf,ce){if(ca&&(!e||cb)){ce=ce||[];ce=[cf,ce.slice?ce.slice():ce];if(b6){cb.push(ce)}else{b5(ce)}}return this},fire:function(){cd.fireWith(this,arguments);return this},fired:function(){return !!e}};return cd};G.extend({Deferred:function(b5){var i=[["resolve","done",G.Callbacks("once memory"),"resolved"],["reject","fail",G.Callbacks("once memory"),"rejected"],["notify","progress",G.Callbacks("memory")]],b6="pending",b7={state:function(){return b6},always:function(){e.done(arguments).fail(arguments);return this},then:function(){var b8=arguments;return G.Deferred(function(b9){G.each(i,function(cb,ca){var cc=G.isFunction(b8[cb])&&b8[cb];e[ca[1]](function(){var cd=cc&&cc.apply(this,arguments);if(cd&&G.isFunction(cd.promise)){cd.promise().done(b9.resolve).fail(b9.reject).progress(b9.notify)}else{b9[ca[0]+"With"](this===b7?b9.promise():this,cc?[cd]:arguments)}})});b8=null}).promise()},promise:function(b8){return b8!=null?G.extend(b8,b7):b7}},e={};b7.pipe=b7.then;G.each(i,function(b9,b8){var cb=b8[2],ca=b8[3];b7[b8[1]]=cb.add;if(ca){cb.add(function(){b6=ca},i[b9^1][2].disable,i[2][2].lock)}e[b8[0]]=function(){e[b8[0]+"With"](this===e?b7:this,arguments);return this};e[b8[0]+"With"]=cb.fireWith});b7.promise(e);if(b5){b5.call(e,e)}return e},when:function(b6){var b9=0,e=K.call(arguments),ca=e.length,b8=ca!==1||(b6&&G.isFunction(b6.promise))?ca:0,cd=b8===1?b6:G.Deferred(),b7=function(ce,cg,cf){return function(i){cg[ce]=this;cf[ce]=arguments.length>1?K.call(arguments):i;if(cf===cc){cd.notifyWith(cg,cf)}else{if(!(--b8)){cd.resolveWith(cg,cf)}}}},cc,b5,cb;if(ca>1){cc=new Array(ca);b5=new Array(ca);cb=new Array(ca);for(;b9<ca;b9++){if(e[b9]&&G.isFunction(e[b9].promise)){e[b9].promise().done(b7(b9,cb,e)).fail(cd.reject).progress(b7(b9,b5,cc))}else{--b8}}}if(!b8){cd.resolveWith(cb,e)}return cd.promise()}});var be;G.fn.ready=function(e){G.ready.promise().done(e);return this};G.extend({isReady:false,readyWait:1,holdReady:function(e){if(e){G.readyWait++}else{G.ready(true)}},ready:function(e){if(e===true?--G.readyWait:G.isReady){return}if(!n.body){return setTimeout(G.ready)}G.isReady=true;if(e!==true&&--G.readyWait>0){return}be.resolveWith(n,[G]);if(G.fn.triggerHandler){G(n).triggerHandler("ready");G(n).off("ready")}}});function ab(){if(n.addEventListener){n.removeEventListener("DOMContentLoaded",r,false);ar.removeEventListener("load",r,false)}else{n.detachEvent("onreadystatechange",r);ar.detachEvent("onload",r)}}function r(){if(n.addEventListener||event.type==="load"||n.readyState==="complete"){ab();G.ready()}}G.ready.promise=function(b7){if(!be){be=G.Deferred();if(n.readyState==="complete"){setTimeout(G.ready)}else{if(n.addEventListener){n.addEventListener("DOMContentLoaded",r,false);ar.addEventListener("load",r,false)}else{n.attachEvent("onreadystatechange",r);ar.attachEvent("onload",r);var b6=false;try{b6=ar.frameElement==null&&n.documentElement}catch(b5){}if(b6&&b6.doScroll){(function i(){if(!G.isReady){try{b6.doScroll("left")}catch(b8){return setTimeout(i,50)}ab();G.ready()}})()}}}}return be.promise(b7)};var aJ=typeof undefined;var bk;for(bk in G(bJ)){break}bJ.ownLast=bk!=="0";bJ.inlineBlockNeedsLayout=false;G(function(){var b5,b6,e,i;e=n.getElementsByTagName("body")[0];if(!e||!e.style){return}b6=n.createElement("div");i=n.createElement("div");i.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px";e.appendChild(i).appendChild(b6);if(typeof b6.style.zoom!==aJ){b6.style.cssText="display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";bJ.inlineBlockNeedsLayout=b5=b6.offsetWidth===3;if(b5){e.style.zoom=1}}e.removeChild(i)});(function(){var b5=n.createElement("div");if(bJ.deleteExpando==null){bJ.deleteExpando=true;try{delete b5.test}catch(i){bJ.deleteExpando=false}}b5=null})();G.acceptData=function(b5){var i=G.noData[(b5.nodeName+" ").toLowerCase()],e=+b5.nodeType||1;return e!==1&&e!==9?false:!i||i!==true&&b5.getAttribute("classid")===i};var V=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,aH=/([A-Z])/g;function bw(b6,b5,b7){if(b7===undefined&&b6.nodeType===1){var i="data-"+b5.replace(aH,"-$1").toLowerCase();b7=b6.getAttribute(i);if(typeof b7==="string"){try{b7=b7==="true"?true:b7==="false"?false:b7==="null"?null:+b7+""===b7?+b7:V.test(b7)?G.parseJSON(b7):b7}catch(b8){}G.data(b6,b5,b7)}else{b7=undefined}}return b7}function bA(i){var e;for(e in i){if(e==="data"&&G.isEmptyObject(i[e])){continue}if(e!=="toJSON"){return false}}return true}function aj(b8,i,b9,b7){if(!G.acceptData(b8)){return}var ca,b6,cc=G.expando,cb=b8.nodeType,e=cb?G.cache:b8,b5=cb?b8[cc]:b8[cc]&&cc;if((!b5||!e[b5]||(!b7&&!e[b5].data))&&b9===undefined&&typeof i==="string"){return}if(!b5){if(cb){b5=b8[cc]=aV.pop()||G.guid++}else{b5=cc}}if(!e[b5]){e[b5]=cb?{}:{toJSON:G.noop}}if(typeof i==="object"||typeof i==="function"){if(b7){e[b5]=G.extend(e[b5],i)}else{e[b5].data=G.extend(e[b5].data,i)}}b6=e[b5];if(!b7){if(!b6.data){b6.data={}}b6=b6.data}if(b9!==undefined){b6[G.camelCase(i)]=b9}if(typeof i==="string"){ca=b6[i];if(ca==null){ca=b6[G.camelCase(i)]}}else{ca=b6}return ca}function ac(ca,b8,b6){if(!G.acceptData(ca)){return}var b5,b9,e=ca.nodeType,b7=e?G.cache:ca,cb=e?ca[G.expando]:G.expando;if(!b7[cb]){return}if(b8){b5=b6?b7[cb]:b7[cb].data;if(b5){if(!G.isArray(b8)){if(b8 in b5){b8=[b8]}else{b8=G.camelCase(b8);if(b8 in b5){b8=[b8]}else{b8=b8.split(" ")}}}else{b8=b8.concat(G.map(b8,G.camelCase))}b9=b8.length;while(b9--){delete b5[b8[b9]]}if(b6?!bA(b5):!G.isEmptyObject(b5)){return}}}if(!b6){delete b7[cb].data;if(!bA(b7[cb])){return}}if(e){G.cleanData([ca],true)}else{if(bJ.deleteExpando||b7!=b7.window){delete b7[cb]}else{b7[cb]=null}}}G.extend({cache:{},noData:{"applet ":true,"embed ":true,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){e=e.nodeType?G.cache[e[G.expando]]:e[G.expando];return !!e&&!bA(e)},data:function(i,e,b5){return aj(i,e,b5)},removeData:function(i,e){return ac(i,e)},_data:function(i,e,b5){return aj(i,e,b5,true)},_removeData:function(i,e){return ac(i,e,true)}});G.fn.extend({data:function(b7,ca){var b6,b5,b9,b8=this[0],e=b8&&b8.attributes;if(b7===undefined){if(this.length){b9=G.data(b8);if(b8.nodeType===1&&!G._data(b8,"parsedAttrs")){b6=e.length;while(b6--){if(e[b6]){b5=e[b6].name;if(b5.indexOf("data-")===0){b5=G.camelCase(b5.slice(5));bw(b8,b5,b9[b5])}}}G._data(b8,"parsedAttrs",true)}}return b9}if(typeof b7==="object"){return this.each(function(){G.data(this,b7)})}return arguments.length>1?this.each(function(){G.data(this,b7,ca)}):b8?bw(b8,b7,G.data(b8,b7)):undefined},removeData:function(e){return this.each(function(){G.removeData(this,e)})}});G.extend({queue:function(b5,i,b6){var e;if(b5){i=(i||"fx")+"queue";e=G._data(b5,i);if(b6){if(!e||G.isArray(b6)){e=G._data(b5,i,G.makeArray(b6))}else{e.push(b6)}}return e||[]}},dequeue:function(b8,b7){b7=b7||"fx";var i=G.queue(b8,b7),b9=i.length,b6=i.shift(),e=G._queueHooks(b8,b7),b5=function(){G.dequeue(b8,b7)};if(b6==="inprogress"){b6=i.shift();b9--}if(b6){if(b7==="fx"){i.unshift("inprogress")}delete e.stop;b6.call(b8,b5,e)}if(!b9&&e){e.empty.fire()}},_queueHooks:function(b5,i){var e=i+"queueHooks";return G._data(b5,e)||G._data(b5,e,{empty:G.Callbacks("once memory").add(function(){G._removeData(b5,i+"queue");G._removeData(b5,e)})})}});G.fn.extend({queue:function(e,i){var b5=2;if(typeof e!=="string"){i=e;e="fx";b5--}if(arguments.length<b5){return G.queue(this[0],e)}return i===undefined?this:this.each(function(){var b6=G.queue(this,e,i);G._queueHooks(this,e);if(e==="fx"&&b6[0]!=="inprogress"){G.dequeue(this,e)}})},dequeue:function(e){return this.each(function(){G.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(b7,ca){var b6,b8=1,cb=G.Deferred(),e=this,b5=this.length,b9=function(){if(!(--b8)){cb.resolveWith(e,[e])}};if(typeof b7!=="string"){ca=b7;b7=undefined}b7=b7||"fx";while(b5--){b6=G._data(e[b5],b7+"queueHooks");if(b6&&b6.empty){b8++;b6.empty.add(b9)}}b9();return cb.promise(ca)}});var aL=(/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;var bK=["Top","Right","Bottom","Left"];var bz=function(i,e){i=e||i;return G.css(i,"display")==="none"||!G.contains(i.ownerDocument,i)};var aW=G.access=function(e,b9,cc,ca,b5,cd,cb){var b6=0,b7=e.length,b8=cc==null;if(G.type(cc)==="object"){b5=true;for(b6 in cc){G.access(e,b9,b6,cc[b6],true,cd,cb)}}else{if(ca!==undefined){b5=true;if(!G.isFunction(ca)){cb=true}if(b8){if(cb){b9.call(e,ca);b9=null}else{b8=b9;b9=function(ce,i,cf){return b8.call(G(ce),cf)}}}if(b9){for(;b6<b7;b6++){b9(e[b6],cc,cb?ca:ca.call(e[b6],b6,b9(e[b6],cc)))}}}}return b5?e:b8?b9.call(e):b7?b9(e[0],cc):cd};var aS=(/^(?:checkbox|radio)$/i);(function(){var i=n.createElement("input"),b7=n.createElement("div"),b5=n.createDocumentFragment();b7.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";bJ.leadingWhitespace=b7.firstChild.nodeType===3;bJ.tbody=!b7.getElementsByTagName("tbody").length;bJ.htmlSerialize=!!b7.getElementsByTagName("link").length;bJ.html5Clone=n.createElement("nav").cloneNode(true).outerHTML!=="<:nav></:nav>";i.type="checkbox";i.checked=true;b5.appendChild(i);bJ.appendChecked=i.checked;b7.innerHTML="<textarea>x</textarea>";bJ.noCloneChecked=!!b7.cloneNode(true).lastChild.defaultValue;b5.appendChild(b7);b7.innerHTML="<input type='radio' checked='checked' name='t'/>";bJ.checkClone=b7.cloneNode(true).cloneNode(true).lastChild.checked;bJ.noCloneEvent=true;if(b7.attachEvent){b7.attachEvent("onclick",function(){bJ.noCloneEvent=false});b7.cloneNode(true).click()}if(bJ.deleteExpando==null){bJ.deleteExpando=true;try{delete b7.test}catch(b6){bJ.deleteExpando=false}}})();(function(){var b5,e,b6=n.createElement("div");for(b5 in {submit:true,change:true,focusin:true}){e="on"+b5;if(!(bJ[b5+"Bubbles"]=e in ar)){b6.setAttribute(e,"t");bJ[b5+"Bubbles"]=b6.attributes[e].expando===false}}b6=null})();var bB=/^(?:input|select|textarea)$/i,bc=/^key/,A=/^(?:mouse|pointer|contextmenu)|click/,by=/^(?:focusinfocus|focusoutblur)$/,bv=/^([^.]*)(?:\.(.+)|)$/;function Q(){return true}function bs(){return false}function au(){try{return n.activeElement}catch(e){}}G.event={global:{},add:function(ca,ce,cj,cd,cb){var cc,ch,ci,b8,e,b7,cg,b9,cf,b5,b6,i=G._data(ca);if(!i){return}if(cj.handler){b8=cj;cj=b8.handler;cb=b8.selector}if(!cj.guid){cj.guid=G.guid++}if(!(ch=i.events)){ch=i.events={}}if(!(b7=i.handle)){b7=i.handle=function(ck){return typeof G!==aJ&&(!ck||G.event.triggered!==ck.type)?G.event.dispatch.apply(b7.elem,arguments):undefined};b7.elem=ca}ce=(ce||"").match(aK)||[""];ci=ce.length;while(ci--){cc=bv.exec(ce[ci])||[];cf=b6=cc[1];b5=(cc[2]||"").split(".").sort();if(!cf){continue}e=G.event.special[cf]||{};cf=(cb?e.delegateType:e.bindType)||cf;e=G.event.special[cf]||{};cg=G.extend({type:cf,origType:b6,data:cd,handler:cj,guid:cj.guid,selector:cb,needsContext:cb&&G.expr.match.needsContext.test(cb),namespace:b5.join(".")},b8);if(!(b9=ch[cf])){b9=ch[cf]=[];b9.delegateCount=0;if(!e.setup||e.setup.call(ca,cd,b5,b7)===false){if(ca.addEventListener){ca.addEventListener(cf,b7,false)}else{if(ca.attachEvent){ca.attachEvent("on"+cf,b7)}}}}if(e.add){e.add.call(ca,cg);if(!cg.handler.guid){cg.handler.guid=cj.guid}}if(cb){b9.splice(b9.delegateCount++,0,cg)}else{b9.push(cg)}G.event.global[cf]=true}ca=null},remove:function(b8,ce,cj,b9,ca){var cc,ch,cd,cb,ci,cg,e,b7,cf,b5,b6,i=G.hasData(b8)&&G._data(b8);if(!i||!(cg=i.events)){return}ce=(ce||"").match(aK)||[""];ci=ce.length;while(ci--){cd=bv.exec(ce[ci])||[];cf=b6=cd[1];b5=(cd[2]||"").split(".").sort();if(!cf){for(cf in cg){G.event.remove(b8,cf+ce[ci],cj,b9,true)}continue}e=G.event.special[cf]||{};cf=(b9?e.delegateType:e.bindType)||cf;b7=cg[cf]||[];cd=cd[2]&&new RegExp("(^|\\.)"+b5.join("\\.(?:.*\\.|)")+"(\\.|$)");cb=cc=b7.length;while(cc--){ch=b7[cc];if((ca||b6===ch.origType)&&(!cj||cj.guid===ch.guid)&&(!cd||cd.test(ch.namespace))&&(!b9||b9===ch.selector||b9==="**"&&ch.selector)){b7.splice(cc,1);if(ch.selector){b7.delegateCount--}if(e.remove){e.remove.call(b8,ch)}}}if(cb&&!b7.length){if(!e.teardown||e.teardown.call(b8,b5,i.handle)===false){G.removeEvent(b8,cf,i.handle)}delete cg[cf]}}if(G.isEmptyObject(cg)){delete i.handle;G._removeData(b8,"events")}},trigger:function(b6,cd,b9,ci){var b8,ce,ch,cj,b5,cc,cb,ca=[b9||n],cg=bE.call(b6,"type")?b6.type:b6,b7=bE.call(b6,"namespace")?b6.namespace.split("."):[];ch=cc=b9=b9||n;if(b9.nodeType===3||b9.nodeType===8){return}if(by.test(cg+G.event.triggered)){return}if(cg.indexOf(".")>=0){b7=cg.split(".");cg=b7.shift();b7.sort()}ce=cg.indexOf(":")<0&&"on"+cg;b6=b6[G.expando]?b6:new G.Event(cg,typeof b6==="object"&&b6);b6.isTrigger=ci?2:3;b6.namespace=b7.join(".");b6.namespace_re=b6.namespace?new RegExp("(^|\\.)"+b7.join("\\.(?:.*\\.|)")+"(\\.|$)"):null;b6.result=undefined;if(!b6.target){b6.target=b9}cd=cd==null?[b6]:G.makeArray(cd,[b6]);b5=G.event.special[cg]||{};if(!ci&&b5.trigger&&b5.trigger.apply(b9,cd)===false){return}if(!ci&&!b5.noBubble&&!G.isWindow(b9)){cj=b5.delegateType||cg;if(!by.test(cj+cg)){ch=ch.parentNode}for(;ch;ch=ch.parentNode){ca.push(ch);cc=ch}if(cc===(b9.ownerDocument||n)){ca.push(cc.defaultView||cc.parentWindow||ar)}}cb=0;while((ch=ca[cb++])&&!b6.isPropagationStopped()){b6.type=cb>1?cj:b5.bindType||cg;b8=(G._data(ch,"events")||{})[b6.type]&&G._data(ch,"handle");if(b8){b8.apply(ch,cd)}b8=ce&&ch[ce];if(b8&&b8.apply&&G.acceptData(ch)){b6.result=b8.apply(ch,cd);if(b6.result===false){b6.preventDefault()}}}b6.type=cg;if(!ci&&!b6.isDefaultPrevented()){if((!b5._default||b5._default.apply(ca.pop(),cd)===false)&&G.acceptData(b9)){if(ce&&b9[cg]&&!G.isWindow(b9)){cc=b9[ce];if(cc){b9[ce]=null}G.event.triggered=cg;try{b9[cg]()}catch(cf){}G.event.triggered=undefined;if(cc){b9[ce]=cc}}}}return b6.result},dispatch:function(b5){b5=G.event.fix(b5);var b9,ca,cc,b6,b8,cd=[],cb=K.call(arguments),b7=(G._data(this,"events")||{})[b5.type]||[],e=G.event.special[b5.type]||{};cb[0]=b5;b5.delegateTarget=this;if(e.preDispatch&&e.preDispatch.call(this,b5)===false){return}cd=G.event.handlers.call(this,b5,b7);b9=0;while((b6=cd[b9++])&&!b5.isPropagationStopped()){b5.currentTarget=b6.elem;b8=0;while((cc=b6.handlers[b8++])&&!b5.isImmediatePropagationStopped()){if(!b5.namespace_re||b5.namespace_re.test(cc.namespace)){b5.handleObj=cc;b5.data=cc.data;ca=((G.event.special[cc.origType]||{}).handle||cc.handler).apply(b6.elem,cb);if(ca!==undefined){if((b5.result=ca)===false){b5.preventDefault();b5.stopPropagation()}}}}}if(e.postDispatch){e.postDispatch.call(this,b5)}return b5.result},handlers:function(e,b6){var b5,ca,b9,b8,cc=[],b7=b6.delegateCount,cb=e.target;if(b7&&cb.nodeType&&(!e.button||e.type!=="click")){for(;cb!=this;cb=cb.parentNode||this){if(cb.nodeType===1&&(cb.disabled!==true||e.type!=="click")){b9=[];for(b8=0;b8<b7;b8++){ca=b6[b8];b5=ca.selector+" ";if(b9[b5]===undefined){b9[b5]=ca.needsContext?G(b5,this).index(cb)>=0:G.find(b5,this,null,[cb]).length}if(b9[b5]){b9.push(ca)}}if(b9.length){cc.push({elem:cb,handlers:b9})}}}}if(b7<b6.length){cc.push({elem:this,handlers:b6.slice(b7)})}return cc},fix:function(b8){if(b8[G.expando]){return b8}var b6,ca,b9,b7=b8.type,b5=b8,e=this.fixHooks[b7];if(!e){this.fixHooks[b7]=e=A.test(b7)?this.mouseHooks:bc.test(b7)?this.keyHooks:{}}b9=e.props?this.props.concat(e.props):this.props;b8=new G.Event(b5);b6=b9.length;while(b6--){ca=b9[b6];b8[ca]=b5[ca]}if(!b8.target){b8.target=b5.srcElement||n}if(b8.target.nodeType===3){b8.target=b8.target.parentNode}b8.metaKey=!!b8.metaKey;return e.filter?e.filter(b8,b5):b8},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(i,e){if(i.which==null){i.which=e.charCode!=null?e.charCode:e.keyCode}return i}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(b6,b5){var e,b7,b8,i=b5.button,b9=b5.fromElement;if(b6.pageX==null&&b5.clientX!=null){b7=b6.target.ownerDocument||n;b8=b7.documentElement;e=b7.body;b6.pageX=b5.clientX+(b8&&b8.scrollLeft||e&&e.scrollLeft||0)-(b8&&b8.clientLeft||e&&e.clientLeft||0);b6.pageY=b5.clientY+(b8&&b8.scrollTop||e&&e.scrollTop||0)-(b8&&b8.clientTop||e&&e.clientTop||0)}if(!b6.relatedTarget&&b9){b6.relatedTarget=b9===b6.target?b5.toElement:b9}if(!b6.which&&i!==undefined){b6.which=(i&1?1:(i&2?3:(i&4?2:0)))}return b6}},special:{load:{noBubble:true},focus:{trigger:function(){if(this!==au()&&this.focus){try{this.focus();return false}catch(i){}}},delegateType:"focusin"},blur:{trigger:function(){if(this===au()&&this.blur){this.blur();return false}},delegateType:"focusout"},click:{trigger:function(){if(G.nodeName(this,"input")&&this.type==="checkbox"&&this.click){this.click();return false}},_default:function(e){return G.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){if(e.result!==undefined&&e.originalEvent){e.originalEvent.returnValue=e.result}}}},simulate:function(i,b7,b6,b5){var b8=G.extend(new G.Event(),b6,{type:i,isSimulated:true,originalEvent:{}});if(b5){G.event.trigger(b8,null,b7)}else{G.event.dispatch.call(b7,b8)}if(b8.isDefaultPrevented()){b6.preventDefault()}}};G.removeEvent=n.removeEventListener?function(b5,i,e){if(b5.removeEventListener){b5.removeEventListener(i,e,false)}}:function(b6,b5,e){var i="on"+b5;if(b6.detachEvent){if(typeof b6[i]===aJ){b6[i]=null}b6.detachEvent(i,e)}};G.Event=function(i,e){if(!(this instanceof G.Event)){return new G.Event(i,e)}if(i&&i.type){this.originalEvent=i;this.type=i.type;this.isDefaultPrevented=i.defaultPrevented||i.defaultPrevented===undefined&&i.returnValue===false?Q:bs}else{this.type=i}if(e){G.extend(this,e)}this.timeStamp=i&&i.timeStamp||G.now();this[G.expando]=true};G.Event.prototype={isDefaultPrevented:bs,isPropagationStopped:bs,isImmediatePropagationStopped:bs,preventDefault:function(){var i=this.originalEvent;this.isDefaultPrevented=Q;if(!i){return}if(i.preventDefault){i.preventDefault()}else{i.returnValue=false}},stopPropagation:function(){var i=this.originalEvent;this.isPropagationStopped=Q;if(!i){return}if(i.stopPropagation){i.stopPropagation()}i.cancelBubble=true},stopImmediatePropagation:function(){var i=this.originalEvent;this.isImmediatePropagationStopped=Q;if(i&&i.stopImmediatePropagation){i.stopImmediatePropagation()}this.stopPropagation()}};G.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(i,e){G.event.special[i]={delegateType:e,bindType:e,handle:function(b7){var b5,b9=this,b8=b7.relatedTarget,b6=b7.handleObj;if(!b8||(b8!==b9&&!G.contains(b9,b8))){b7.type=b6.origType;b5=b6.handler.apply(this,arguments);b7.type=e}return b5}}});if(!bJ.submitBubbles){G.event.special.submit={setup:function(){if(G.nodeName(this,"form")){return false}G.event.add(this,"click._submit keypress._submit",function(b6){var b5=b6.target,i=G.nodeName(b5,"input")||G.nodeName(b5,"button")?b5.form:undefined;if(i&&!G._data(i,"submitBubbles")){G.event.add(i,"submit._submit",function(e){e._submit_bubble=true});G._data(i,"submitBubbles",true)}})},postDispatch:function(e){if(e._submit_bubble){delete e._submit_bubble;if(this.parentNode&&!e.isTrigger){G.event.simulate("submit",this.parentNode,e,true)}}},teardown:function(){if(G.nodeName(this,"form")){return false}G.event.remove(this,"._submit")}}}if(!bJ.changeBubbles){G.event.special.change={setup:function(){if(bB.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio"){G.event.add(this,"propertychange._change",function(e){if(e.originalEvent.propertyName==="checked"){this._just_changed=true}});G.event.add(this,"click._change",function(e){if(this._just_changed&&!e.isTrigger){this._just_changed=false}G.event.simulate("change",this,e,true)})}return false}G.event.add(this,"beforeactivate._change",function(b5){var i=b5.target;if(bB.test(i.nodeName)&&!G._data(i,"changeBubbles")){G.event.add(i,"change._change",function(e){if(this.parentNode&&!e.isSimulated&&!e.isTrigger){G.event.simulate("change",this.parentNode,e,true)}});G._data(i,"changeBubbles",true)}})},handle:function(i){var e=i.target;if(this!==e||i.isSimulated||i.isTrigger||(e.type!=="radio"&&e.type!=="checkbox")){return i.handleObj.handler.apply(this,arguments)}},teardown:function(){G.event.remove(this,"._change");return !bB.test(this.nodeName)}}}if(!bJ.focusinBubbles){G.each({focus:"focusin",blur:"focusout"},function(b5,e){var i=function(b6){G.event.simulate(e,b6.target,G.event.fix(b6),true)};G.event.special[e]={setup:function(){var b7=this.ownerDocument||this,b6=G._data(b7,e);if(!b6){b7.addEventListener(b5,i,true)}G._data(b7,e,(b6||0)+1)},teardown:function(){var b7=this.ownerDocument||this,b6=G._data(b7,e)-1;if(!b6){b7.removeEventListener(b5,i,true);G._removeData(b7,e)}else{G._data(b7,e,b6)}}}})}G.fn.extend({on:function(b5,e,b8,b7,i){var b6,b9;if(typeof b5==="object"){if(typeof e!=="string"){b8=b8||e;e=undefined}for(b6 in b5){this.on(b6,e,b8,b5[b6],i)}return this}if(b8==null&&b7==null){b7=e;b8=e=undefined}else{if(b7==null){if(typeof e==="string"){b7=b8;b8=undefined}else{b7=b8;b8=e;e=undefined}}}if(b7===false){b7=bs}else{if(!b7){return this}}if(i===1){b9=b7;b7=function(ca){G().off(ca);return b9.apply(this,arguments)};b7.guid=b9.guid||(b9.guid=G.guid++)}return this.each(function(){G.event.add(this,b5,b7,b8,e)})},one:function(i,e,b6,b5){return this.on(i,e,b6,b5,1)},off:function(b5,e,b7){var i,b6;if(b5&&b5.preventDefault&&b5.handleObj){i=b5.handleObj;G(b5.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler);return this}if(typeof b5==="object"){for(b6 in b5){this.off(b6,e,b5[b6])}return this}if(e===false||typeof e==="function"){b7=e;e=undefined}if(b7===false){b7=bs}return this.each(function(){G.event.remove(this,b5,b7,e)})},trigger:function(e,i){return this.each(function(){G.event.trigger(e,i,this)})},triggerHandler:function(e,b5){var i=this[0];if(i){return G.event.trigger(e,b5,i,true)}}});function bL(e){var b5=g.split("|"),i=e.createDocumentFragment();if(i.createElement){while(b5.length){i.createElement(b5.pop())}}return i}var g="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",aI=/ jQuery\d+="(?:null|\d+)"/g,bC=new RegExp("<(?:"+g+")[\\s/>]","i"),b4=/^\s+/,aN=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,b2=/<([\w:]+)/,p=/<tbody/i,H=/<|&#?\w+;/,a9=/<(?:script|style|link)/i,bP=/checked\s*(?:[^=]|=\s*.checked.)/i,bx=/^$|\/(?:java|ecma)script/i,ay=/^true\/(.*)/,aU=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,S={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:bJ.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},a0=bL(n),l=a0.appendChild(n.createElement("div"));S.optgroup=S.option;S.tbody=S.tfoot=S.colgroup=S.caption=S.thead;S.th=S.td;function a(b7,e){var b5,b8,b6=0,b9=typeof b7.getElementsByTagName!==aJ?b7.getElementsByTagName(e||"*"):typeof b7.querySelectorAll!==aJ?b7.querySelectorAll(e||"*"):undefined;if(!b9){for(b9=[],b5=b7.childNodes||b7;(b8=b5[b6])!=null;b6++){if(!e||G.nodeName(b8,e)){b9.push(b8)}else{G.merge(b9,a(b8,e))}}}return e===undefined||e&&G.nodeName(b7,e)?G.merge([b7],b9):b9}function bX(e){if(aS.test(e.type)){e.defaultChecked=e.checked}}function ba(i,e){return G.nodeName(i,"table")&&G.nodeName(e.nodeType!==11?e:e.firstChild,"tr")?i.getElementsByTagName("tbody")[0]||i.appendChild(i.ownerDocument.createElement("tbody")):i}function bS(e){e.type=(G.find.attr(e,"type")!==null)+"/"+e.type;return e}function ag(i){var e=ay.exec(i.type);if(e){i.type=e[1]}else{i.removeAttribute("type")}return i}function X(b5,e){var b7,b6=0;for(;(b7=b5[b6])!=null;b6++){G._data(b7,"globalEval",!e||G._data(e[b6],"globalEval"))}}function ax(cb,b6){if(b6.nodeType!==1||!G.hasData(cb)){return}var b8,b7,e,ca=G._data(cb),b9=G._data(b6,ca),b5=ca.events;if(b5){delete b9.handle;b9.events={};for(b8 in b5){for(b7=0,e=b5[b8].length;b7<e;b7++){G.event.add(b6,b8,b5[b8][b7])}}}if(b9.data){b9.data=G.extend({},b9.data)}}function N(b7,i){var b8,b6,b5;if(i.nodeType!==1){return}b8=i.nodeName.toLowerCase();if(!bJ.noCloneEvent&&i[G.expando]){b5=G._data(i);for(b6 in b5.events){G.removeEvent(i,b6,b5.handle)}i.removeAttribute(G.expando)}if(b8==="script"&&i.text!==b7.text){bS(i).text=b7.text;ag(i)}else{if(b8==="object"){if(i.parentNode){i.outerHTML=b7.outerHTML}if(bJ.html5Clone&&(b7.innerHTML&&!G.trim(i.innerHTML))){i.innerHTML=b7.innerHTML}}else{if(b8==="input"&&aS.test(b7.type)){i.defaultChecked=i.checked=b7.checked;if(i.value!==b7.value){i.value=b7.value}}else{if(b8==="option"){i.defaultSelected=i.selected=b7.defaultSelected}else{if(b8==="input"||b8==="textarea"){i.defaultValue=b7.defaultValue}}}}}}G.extend({clone:function(b7,b8,cb){var b5,b6,cc,b9,ca,e=G.contains(b7.ownerDocument,b7);if(bJ.html5Clone||G.isXMLDoc(b7)||!bC.test("<"+b7.nodeName+">")){cc=b7.cloneNode(true)}else{l.innerHTML=b7.outerHTML;l.removeChild(cc=l.firstChild)}if((!bJ.noCloneEvent||!bJ.noCloneChecked)&&(b7.nodeType===1||b7.nodeType===11)&&!G.isXMLDoc(b7)){b5=a(cc);ca=a(b7);for(b9=0;(b6=ca[b9])!=null;++b9){if(b5[b9]){N(b6,b5[b9])}}}if(b8){if(cb){ca=ca||a(b7);b5=b5||a(cc);for(b9=0;(b6=ca[b9])!=null;b9++){ax(b6,b5[b9])}}else{ax(b7,cc)}}b5=a(cc,"script");if(b5.length>0){X(b5,!e&&a(b7,"script"))}b5=ca=b6=null;return cc},buildFragment:function(b5,b7,cb,ch){var cc,b9,cf,cg,ci,ce,b6,ca=b5.length,b8=bL(b7),e=[],cd=0;for(;cd<ca;cd++){b9=b5[cd];if(b9||b9===0){if(G.type(b9)==="object"){G.merge(e,b9.nodeType?[b9]:b9)}else{if(!H.test(b9)){e.push(b7.createTextNode(b9))}else{cg=cg||b8.appendChild(b7.createElement("div"));ci=(b2.exec(b9)||["",""])[1].toLowerCase();b6=S[ci]||S._default;cg.innerHTML=b6[1]+b9.replace(aN,"<$1></$2>")+b6[2];cc=b6[0];while(cc--){cg=cg.lastChild}if(!bJ.leadingWhitespace&&b4.test(b9)){e.push(b7.createTextNode(b4.exec(b9)[0]))}if(!bJ.tbody){b9=ci==="table"&&!p.test(b9)?cg.firstChild:b6[1]==="<table>"&&!p.test(b9)?cg:0;cc=b9&&b9.childNodes.length;while(cc--){if(G.nodeName((ce=b9.childNodes[cc]),"tbody")&&!ce.childNodes.length){b9.removeChild(ce)}}}G.merge(e,cg.childNodes);cg.textContent="";while(cg.firstChild){cg.removeChild(cg.firstChild)}cg=b8.lastChild}}}}if(cg){b8.removeChild(cg)}if(!bJ.appendChecked){G.grep(a(e,"input"),bX)}cd=0;while((b9=e[cd++])){if(ch&&G.inArray(b9,ch)!==-1){continue}cf=G.contains(b9.ownerDocument,b9);cg=a(b8.appendChild(b9),"script");if(cf){X(cg)}if(cb){cc=0;while((b9=cg[cc++])){if(bx.test(b9.type||"")){cb.push(b9)}}}}cg=null;return b8},cleanData:function(b6,ce){var b9,cc,b7,cb,ca=0,cd=G.expando,e=G.cache,b8=bJ.deleteExpando,b5=G.event.special;for(;(b9=b6[ca])!=null;ca++){if(ce||G.acceptData(b9)){b7=b9[cd];cb=b7&&e[b7];if(cb){if(cb.events){for(cc in cb.events){if(b5[cc]){G.event.remove(b9,cc)}else{G.removeEvent(b9,cc,cb.handle)}}}if(e[b7]){delete e[b7];if(b8){delete b9[cd]}else{if(typeof b9.removeAttribute!==aJ){b9.removeAttribute(cd)}else{b9[cd]=null}}aV.push(b7)}}}}}});G.fn.extend({text:function(e){return aW(this,function(i){return i===undefined?G.text(this):this.empty().append((this[0]&&this[0].ownerDocument||n).createTextNode(i))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var i=ba(this,e);i.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var i=ba(this,e);i.insertBefore(e,i.firstChild)}})},before:function(){return this.domManip(arguments,function(e){if(this.parentNode){this.parentNode.insertBefore(e,this)}})},after:function(){return this.domManip(arguments,function(e){if(this.parentNode){this.parentNode.insertBefore(e,this.nextSibling)}})},remove:function(b5,e){var b8,b6=b5?G.filter(b5,this):this,b7=0;for(;(b8=b6[b7])!=null;b7++){if(!e&&b8.nodeType===1){G.cleanData(a(b8))}if(b8.parentNode){if(e&&G.contains(b8.ownerDocument,b8)){X(a(b8,"script"))}b8.parentNode.removeChild(b8)}}return this},empty:function(){var b5,e=0;for(;(b5=this[e])!=null;e++){if(b5.nodeType===1){G.cleanData(a(b5,false))}while(b5.firstChild){b5.removeChild(b5.firstChild)}if(b5.options&&G.nodeName(b5,"select")){b5.options.length=0}}return this},clone:function(i,e){i=i==null?false:i;e=e==null?i:e;return this.map(function(){return G.clone(this,i,e)})},html:function(e){return aW(this,function(b8){var b7=this[0]||{},b6=0,b5=this.length;if(b8===undefined){return b7.nodeType===1?b7.innerHTML.replace(aI,""):undefined}if(typeof b8==="string"&&!a9.test(b8)&&(bJ.htmlSerialize||!bC.test(b8))&&(bJ.leadingWhitespace||!b4.test(b8))&&!S[(b2.exec(b8)||["",""])[1].toLowerCase()]){b8=b8.replace(aN,"<$1></$2>");try{for(;b6<b5;b6++){b7=this[b6]||{};if(b7.nodeType===1){G.cleanData(a(b7,false));b7.innerHTML=b8}}b7=0}catch(b9){}}if(b7){this.empty().append(b8)}},null,e,arguments.length)},replaceWith:function(){var e=arguments[0];this.domManip(arguments,function(i){e=this.parentNode;G.cleanData(a(this));if(e){e.replaceChild(i,this)}});return e&&(e.length||e.nodeType)?this:this.remove()},detach:function(e){return this.remove(e,true)},domManip:function(cb,cg){cb=aX.apply([],cb);var ca,b6,cc,b8,cf,e,b9=0,b7=this.length,ce=this,ch=b7-1,cd=cb[0],b5=G.isFunction(cd);if(b5||(b7>1&&typeof cd==="string"&&!bJ.checkClone&&bP.test(cd))){return this.each(function(ci){var i=ce.eq(ci);if(b5){cb[0]=cd.call(this,ci,i.html())}i.domManip(cb,cg)})}if(b7){e=G.buildFragment(cb,this[0].ownerDocument,false,this);ca=e.firstChild;if(e.childNodes.length===1){e=ca}if(ca){b8=G.map(a(e,"script"),bS);cc=b8.length;for(;b9<b7;b9++){b6=e;if(b9!==ch){b6=G.clone(b6,true,true);if(cc){G.merge(b8,a(b6,"script"))}}cg.call(this[b9],b6,b9)}if(cc){cf=b8[b8.length-1].ownerDocument;G.map(b8,ag);for(b9=0;b9<cc;b9++){b6=b8[b9];if(bx.test(b6.type||"")&&!G._data(b6,"globalEval")&&G.contains(cf,b6)){if(b6.src){if(G._evalUrl){G._evalUrl(b6.src)}}else{G.globalEval((b6.text||b6.textContent||b6.innerHTML||"").replace(aU,""))}}}}e=ca=null}}return this}});G.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,i){G.fn[e]=function(b6){var b7,b9=0,b8=[],b5=G(b6),ca=b5.length-1;for(;b9<=ca;b9++){b7=b9===ca?this:this.clone(true);G(b5[b9])[i](b7);s.apply(b8,b7.get())}return this.pushStack(b8)}});var aR,ad={};function bb(e,b7){var i,b5=G(b7.createElement(e)).appendTo(b7.body),b6=ar.getDefaultComputedStyle&&(i=ar.getDefaultComputedStyle(b5[0]))?i.display:G.css(b5[0],"display");b5.detach();return b6}function az(b5){var i=n,e=ad[b5];if(!e){e=bb(b5,i);if(e==="none"||!e){aR=(aR||G("<iframe frameborder='0' width='0' height='0'/>")).appendTo(i.documentElement);i=(aR[0].contentWindow||aR[0].contentDocument).document;i.write();i.close();e=bb(b5,i);aR.detach()}ad[b5]=e}return e}(function(){var e;bJ.shrinkWrapBlocks=function(){if(e!=null){return e}e=false;var b6,i,b5;i=n.getElementsByTagName("body")[0];if(!i||!i.style){return}b6=n.createElement("div");b5=n.createElement("div");b5.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px";i.appendChild(b5).appendChild(b6);if(typeof b6.style.zoom!==aJ){b6.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1";b6.appendChild(n.createElement("div")).style.width="5px";e=b6.offsetWidth!==3}i.removeChild(b5);return e}})();var a5=(/^margin/);var bt=new RegExp("^("+aL+")(?!px)[a-z%]+$","i");var bp,bI,bn=/^(top|right|bottom|left)$/;if(ar.getComputedStyle){bp=function(e){if(e.ownerDocument.defaultView.opener){return e.ownerDocument.defaultView.getComputedStyle(e,null)}return ar.getComputedStyle(e,null)};bI=function(ca,b6,e){var b8,i,b9,b5,b7=ca.style;e=e||bp(ca);b5=e?e.getPropertyValue(b6)||e[b6]:undefined;if(e){if(b5===""&&!G.contains(ca.ownerDocument,ca)){b5=G.style(ca,b6)}if(bt.test(b5)&&a5.test(b6)){b8=b7.width;i=b7.minWidth;b9=b7.maxWidth;b7.minWidth=b7.maxWidth=b7.width=b5;b5=e.width;b7.width=b8;b7.minWidth=i;b7.maxWidth=b9}}return b5===undefined?b5:b5+""}}else{if(n.documentElement.currentStyle){bp=function(e){return e.currentStyle};bI=function(b8,b6,e){var ca,i,b9,b5,b7=b8.style;e=e||bp(b8);b5=e?e[b6]:undefined;if(b5==null&&b7&&b7[b6]){b5=b7[b6]}if(bt.test(b5)&&!bn.test(b6)){ca=b7.left;i=b8.runtimeStyle;b9=i&&i.left;if(b9){i.left=b8.currentStyle.left}b7.left=b6==="fontSize"?"1em":b5;b5=b7.pixelLeft+"px";b7.left=ca;if(b9){i.left=b9}}return b5===undefined?b5:b5+""||"auto"}}}function bd(e,i){return{get:function(){var b5=e();if(b5==null){return}if(b5){delete this.get;return}return(this.get=i).apply(this,arguments)}}}(function(){var ca,b6,i,b9,b8,b5,e;ca=n.createElement("div");ca.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";i=ca.getElementsByTagName("a")[0];b6=i&&i.style;if(!b6){return}b6.cssText="float:left;opacity:.5";bJ.opacity=b6.opacity==="0.5";bJ.cssFloat=!!b6.cssFloat;ca.style.backgroundClip="content-box";ca.cloneNode(true).style.backgroundClip="";bJ.clearCloneStyle=ca.style.backgroundClip==="content-box";bJ.boxSizing=b6.boxSizing===""||b6.MozBoxSizing===""||b6.WebkitBoxSizing==="";G.extend(bJ,{reliableHiddenOffsets:function(){if(b5==null){b7()}return b5},boxSizingReliable:function(){if(b8==null){b7()}return b8},pixelPosition:function(){if(b9==null){b7()}return b9},reliableMarginRight:function(){if(e==null){b7()}return e}});function b7(){var ce,cb,cd,cc;cb=n.getElementsByTagName("body")[0];if(!cb||!cb.style){return}ce=n.createElement("div");cd=n.createElement("div");cd.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px";cb.appendChild(cd).appendChild(ce);ce.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute";b9=b8=false;e=true;if(ar.getComputedStyle){b9=(ar.getComputedStyle(ce,null)||{}).top!=="1%";b8=(ar.getComputedStyle(ce,null)||{width:"4px"}).width==="4px";cc=ce.appendChild(n.createElement("div"));cc.style.cssText=ce.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0";cc.style.marginRight=cc.style.width="0";ce.style.width="1px";e=!parseFloat((ar.getComputedStyle(cc,null)||{}).marginRight);ce.removeChild(cc)}ce.innerHTML="<table><tr><td></td><td>t</td></tr></table>";cc=ce.getElementsByTagName("td");cc[0].style.cssText="margin:0;border:0;padding:0;display:none";b5=cc[0].offsetHeight===0;if(b5){cc[0].style.display="";cc[1].style.display="none";b5=cc[0].offsetHeight===0}cb.removeChild(cd)}})();G.swap=function(b8,b7,b9,b6){var b5,i,e={};for(i in b7){e[i]=b8.style[i];b8.style[i]=b7[i]}b5=b9.apply(b8,b6||[]);for(i in b7){b8.style[i]=e[i]}return b5};var ae=/alpha\([^)]*\)/i,aD=/opacity\s*=\s*([^)]*)/,bF=/^(none|table(?!-c[ea]).+)/,ai=new RegExp("^("+aL+")(.*)$","i"),R=new RegExp("^([+-])=("+aL+")","i"),bh={position:"absolute",visibility:"hidden",display:"block"},P={letterSpacing:"0",fontWeight:"400"},a1=["Webkit","O","Moz","ms"];function d(b7,b5){if(b5 in b7){return b5}var b8=b5.charAt(0).toUpperCase()+b5.slice(1),e=b5,b6=a1.length;while(b6--){b5=a1[b6]+b8;if(b5 in b7){return b5}}return e}function bY(i,b6){var ca,b9,e,b8=[],b7=0,b5=i.length;for(;b7<b5;b7++){b9=i[b7];if(!b9.style){continue}b8[b7]=G._data(b9,"olddisplay");ca=b9.style.display;if(b6){if(!b8[b7]&&ca==="none"){b9.style.display=""}if(b9.style.display===""&&bz(b9)){b8[b7]=G._data(b9,"olddisplay",az(b9.nodeName))}}else{e=bz(b9);if(ca&&ca!=="none"||!e){G._data(b9,"olddisplay",e?ca:G.css(b9,"display"))}}}for(b7=0;b7<b5;b7++){b9=i[b7];if(!b9.style){continue}if(!b6||b9.style.display==="none"||b9.style.display===""){b9.style.display=b6?b8[b7]||"":"none"}}return i}function aT(e,b5,b6){var i=ai.exec(b5);return i?Math.max(0,i[1]-(b6||0))+(i[2]||"px"):b5}function aZ(b8,b6,e,ca,b5){var b7=e===(ca?"border":"content")?4:b6==="width"?1:0,b9=0;for(;b7<4;b7+=2){if(e==="margin"){b9+=G.css(b8,e+bK[b7],true,b5)}if(ca){if(e==="content"){b9-=G.css(b8,"padding"+bK[b7],true,b5)}if(e!=="margin"){b9-=G.css(b8,"border"+bK[b7]+"Width",true,b5)}}else{b9+=G.css(b8,"padding"+bK[b7],true,b5);if(e!=="padding"){b9+=G.css(b8,"border"+bK[b7]+"Width",true,b5)}}}return b9}function bT(b7,b5,e){var b6=true,b8=b5==="width"?b7.offsetWidth:b7.offsetHeight,i=bp(b7),b9=bJ.boxSizing&&G.css(b7,"boxSizing",false,i)==="border-box";if(b8<=0||b8==null){b8=bI(b7,b5,i);if(b8<0||b8==null){b8=b7.style[b5]}if(bt.test(b8)){return b8}b6=b9&&(bJ.boxSizingReliable()||b8===b7.style[b5]);b8=parseFloat(b8)||0}return(b8+aZ(b7,b5,e||(b9?"border":"content"),b6,i))+"px"}G.extend({cssHooks:{opacity:{get:function(b5,e){if(e){var i=bI(b5,"opacity");return i===""?"1":i}}}},cssNumber:{columnCount:true,fillOpacity:true,flexGrow:true,flexShrink:true,fontWeight:true,lineHeight:true,opacity:true,order:true,orphans:true,widows:true,zIndex:true,zoom:true},cssProps:{"float":bJ.cssFloat?"cssFloat":"styleFloat"},style:function(b7,b5,cc,b6){if(!b7||b7.nodeType===3||b7.nodeType===8||!b7.style){return}var ca,cb,cd,b8=G.camelCase(b5),i=b7.style;b5=G.cssProps[b8]||(G.cssProps[b8]=d(i,b8));cd=G.cssHooks[b5]||G.cssHooks[b8];if(cc!==undefined){cb=typeof cc;if(cb==="string"&&(ca=R.exec(cc))){cc=(ca[1]+1)*ca[2]+parseFloat(G.css(b7,b5));cb="number"}if(cc==null||cc!==cc){return}if(cb==="number"&&!G.cssNumber[b8]){cc+="px"}if(!bJ.clearCloneStyle&&cc===""&&b5.indexOf("background")===0){i[b5]="inherit"}if(!cd||!("set" in cd)||(cc=cd.set(b7,cc,b6))!==undefined){try{i[b5]=cc}catch(b9){}}}else{if(cd&&"get" in cd&&(ca=cd.get(b7,false,b6))!==undefined){return ca}return i[b5]}},css:function(b9,b8,i,b5){var b7,ca,e,b6=G.camelCase(b8);b8=G.cssProps[b6]||(G.cssProps[b6]=d(b9.style,b6));e=G.cssHooks[b8]||G.cssHooks[b6];if(e&&"get" in e){ca=e.get(b9,true,i)}if(ca===undefined){ca=bI(b9,b8,b5)}if(ca==="normal"&&b8 in P){ca=P[b8]}if(i===""||i){b7=parseFloat(ca);return i===true||G.isNumeric(b7)?b7||0:ca}return ca}});G.each(["height","width"],function(b5,e){G.cssHooks[e]={get:function(b7,b6,i){if(b6){return bF.test(G.css(b7,"display"))&&b7.offsetWidth===0?G.swap(b7,bh,function(){return bT(b7,e,i)}):bT(b7,e,i)}},set:function(b7,b8,i){var b6=i&&bp(b7);return aT(b7,b8,i?aZ(b7,e,i,bJ.boxSizing&&G.css(b7,"boxSizing",false,b6)==="border-box",b6):0)}}});if(!bJ.opacity){G.cssHooks.opacity={get:function(i,e){return aD.test((e&&i.currentStyle?i.currentStyle.filter:i.style.filter)||"")?(0.01*parseFloat(RegExp.$1))+"":e?"1":""},set:function(b7,b8){var b6=b7.style,i=b7.currentStyle,b5=G.isNumeric(b8)?"alpha(opacity="+b8*100+")":"",e=i&&i.filter||b6.filter||"";b6.zoom=1;if((b8>=1||b8==="")&&G.trim(e.replace(ae,""))===""&&b6.removeAttribute){b6.removeAttribute("filter");if(b8===""||i&&!i.filter){return}}b6.filter=ae.test(e)?e.replace(ae,b5):e+" "+b5}}}G.cssHooks.marginRight=bd(bJ.reliableMarginRight,function(i,e){if(e){return G.swap(i,{display:"inline-block"},bI,[i,"marginRight"])}});G.each({margin:"",padding:"",border:"Width"},function(e,i){G.cssHooks[e+i]={expand:function(b7){var b5=0,b6={},b8=typeof b7==="string"?b7.split(" "):[b7];for(;b5<4;b5++){b6[e+bK[b5]+i]=b8[b5]||b8[b5-2]||b8[0]}return b6}};if(!a5.test(e)){G.cssHooks[e+i].set=aT}});G.fn.extend({css:function(e,i){return aW(this,function(b9,b7,ca){var b6,b5,cb={},b8=0;if(G.isArray(b7)){b6=bp(b9);b5=b7.length;for(;b8<b5;b8++){cb[b7[b8]]=G.css(b9,b7[b8],false,b6)}return cb}return ca!==undefined?G.style(b9,b7,ca):G.css(b9,b7)},e,i,arguments.length>1)},show:function(){return bY(this,true)},hide:function(){return bY(this)},toggle:function(e){if(typeof e==="boolean"){return e?this.show():this.hide()}return this.each(function(){if(bz(this)){G(this).show()}else{G(this).hide()}})}});function D(b5,i,b7,e,b6){return new D.prototype.init(b5,i,b7,e,b6)}G.Tween=D;D.prototype={constructor:D,init:function(b6,i,b8,e,b7,b5){this.elem=b6;this.prop=b8;this.easing=b7||"swing";this.options=i;this.start=this.now=this.cur();this.end=e;this.unit=b5||(G.cssNumber[b8]?"":"px")},cur:function(){var e=D.propHooks[this.prop];return e&&e.get?e.get(this):D.propHooks._default.get(this)},run:function(b5){var i,e=D.propHooks[this.prop];if(this.options.duration){this.pos=i=G.easing[this.easing](b5,this.options.duration*b5,0,1,this.options.duration)}else{this.pos=i=b5}this.now=(this.end-this.start)*i+this.start;if(this.options.step){this.options.step.call(this.elem,this.now,this)}if(e&&e.set){e.set(this)}else{D.propHooks._default.set(this)}return this}};D.prototype.init.prototype=D.prototype;D.propHooks={_default:{get:function(e){var i;if(e.elem[e.prop]!=null&&(!e.elem.style||e.elem.style[e.prop]==null)){return e.elem[e.prop]}i=G.css(e.elem,e.prop,"");return !i||i==="auto"?0:i},set:function(e){if(G.fx.step[e.prop]){G.fx.step[e.prop](e)}else{if(e.elem.style&&(e.elem.style[G.cssProps[e.prop]]!=null||G.cssHooks[e.prop])){G.style(e.elem,e.prop,e.now+e.unit)}else{e.elem[e.prop]=e.now}}}}};D.propHooks.scrollTop=D.propHooks.scrollLeft={set:function(e){if(e.elem.nodeType&&e.elem.parentNode){e.elem[e.prop]=e.now}}};G.easing={linear:function(e){return e},swing:function(e){return 0.5-Math.cos(e*Math.PI)/2}};G.fx=D.prototype.init;G.fx.step={};var I,bg,bH=/^(?:toggle|show|hide)$/,F=new RegExp("^(?:([+-])=|)("+aL+")([a-z%]*)$","i"),bG=/queueHooks$/,aM=[k],a7={"*":[function(e,ca){var cb=this.createTween(e,ca),b5=cb.cur(),b7=F.exec(ca),b9=b7&&b7[3]||(G.cssNumber[e]?"":"px"),i=(G.cssNumber[e]||b9!=="px"&&+b5)&&F.exec(G.css(cb.elem,e)),b6=1,b8=20;if(i&&i[3]!==b9){b9=b9||i[3];b7=b7||[];i=+b5||1;do{b6=b6||".5";i=i/b6;G.style(cb.elem,e,i+b9)}while(b6!==(b6=cb.cur()/b5)&&b6!==1&&--b8)}if(b7){i=cb.start=+i||+b5||0;cb.unit=b9;cb.end=b7[1]?i+(b7[1]+1)*b7[2]:+b7[2]}return cb}]};function aa(){setTimeout(function(){I=undefined});return(I=G.now())}function bD(b6,b8){var b7,e={height:b6},b5=0;b8=b8?1:0;for(;b5<4;b5+=2-b8){b7=bK[b5];e["margin"+b7]=e["padding"+b7]=b6}if(b8){e.opacity=e.width=b6}return e}function ah(b7,b9,b6){var b5,b8=(a7[b9]||[]).concat(a7["*"]),i=0,e=b8.length;for(;i<e;i++){if((b5=b8[i].call(b6,b9,b7))){return b5}}}function k(b7,cb,e){var b5,ce,b8,ci,ch,cf,ca,cd,b9=this,cc={},i=b7.style,b6=b7.nodeType&&bz(b7),cg=G._data(b7,"fxshow");if(!e.queue){ch=G._queueHooks(b7,"fx");if(ch.unqueued==null){ch.unqueued=0;cf=ch.empty.fire;ch.empty.fire=function(){if(!ch.unqueued){cf()}}}ch.unqueued++;b9.always(function(){b9.always(function(){ch.unqueued--;if(!G.queue(b7,"fx").length){ch.empty.fire()}})})}if(b7.nodeType===1&&("height" in cb||"width" in cb)){e.overflow=[i.overflow,i.overflowX,i.overflowY];ca=G.css(b7,"display");cd=ca==="none"?G._data(b7,"olddisplay")||az(b7.nodeName):ca;if(cd==="inline"&&G.css(b7,"float")==="none"){if(!bJ.inlineBlockNeedsLayout||az(b7.nodeName)==="inline"){i.display="inline-block"}else{i.zoom=1}}}if(e.overflow){i.overflow="hidden";if(!bJ.shrinkWrapBlocks()){b9.always(function(){i.overflow=e.overflow[0];i.overflowX=e.overflow[1];i.overflowY=e.overflow[2]})}}for(b5 in cb){ce=cb[b5];if(bH.exec(ce)){delete cb[b5];b8=b8||ce==="toggle";if(ce===(b6?"hide":"show")){if(ce==="show"&&cg&&cg[b5]!==undefined){b6=true}else{continue}}cc[b5]=cg&&cg[b5]||G.style(b7,b5)}else{ca=undefined}}if(!G.isEmptyObject(cc)){if(cg){if("hidden" in cg){b6=cg.hidden}}else{cg=G._data(b7,"fxshow",{})}if(b8){cg.hidden=!b6}if(b6){G(b7).show()}else{b9.done(function(){G(b7).hide()})}b9.done(function(){var cj;G._removeData(b7,"fxshow");for(cj in cc){G.style(b7,cj,cc[cj])}});for(b5 in cc){ci=ah(b6?cg[b5]:0,b5,b9);if(!(b5 in cg)){cg[b5]=ci.start;if(b6){ci.end=ci.start;ci.start=b5==="width"||b5==="height"?1:0}}}}else{if((ca==="none"?az(b7.nodeName):ca)==="inline"){i.display=ca}}}function a8(b6,b9){var b5,i,b8,b7,e;for(b5 in b6){i=G.camelCase(b5);b8=b9[i];b7=b6[b5];if(G.isArray(b7)){b8=b7[1];b7=b6[b5]=b7[0]}if(b5!==i){b6[i]=b7;delete b6[b5]}e=G.cssHooks[i];if(e&&"expand" in e){b7=e.expand(b7);delete b6[i];for(b5 in b7){if(!(b5 in b6)){b6[b5]=b7[b5];b9[b5]=b8}}}else{b9[i]=b8}}}function j(i,e,cb){var cc,b9,b8=0,b7=aM.length,cd=G.Deferred().always(function(){delete b6.elem}),b6=function(){if(b9){return false}var cj=I||aa(),ci=Math.max(0,b5.startTime+b5.duration-cj),cg=ci/b5.duration||0,cf=1-cg,ch=0,ce=b5.tweens.length;for(;ch<ce;ch++){b5.tweens[ch].run(cf)}cd.notifyWith(i,[b5,cf,ci]);if(cf<1&&ce){return ci}else{cd.resolveWith(i,[b5]);return false}},b5=cd.promise({elem:i,props:G.extend({},e),opts:G.extend(true,{specialEasing:{}},cb),originalProperties:e,originalOptions:cb,startTime:I||aa(),duration:cb.duration,tweens:[],createTween:function(cg,ce){var cf=G.Tween(i,b5.opts,cg,ce,b5.opts.specialEasing[cg]||b5.opts.easing);b5.tweens.push(cf);return cf},stop:function(cg){var cf=0,ce=cg?b5.tweens.length:0;if(b9){return this}b9=true;for(;cf<ce;cf++){b5.tweens[cf].run(1)}if(cg){cd.resolveWith(i,[b5,cg])}else{cd.rejectWith(i,[b5,cg])}return this}}),ca=b5.props;a8(ca,b5.opts.specialEasing);for(;b8<b7;b8++){cc=aM[b8].call(b5,i,ca,b5.opts);if(cc){return cc}}G.map(ca,ah,b5);if(G.isFunction(b5.opts.start)){b5.opts.start.call(i,b5)}G.fx.timer(G.extend(b6,{elem:i,anim:b5,queue:b5.opts.queue}));return b5.progress(b5.opts.progress).done(b5.opts.done,b5.opts.complete).fail(b5.opts.fail).always(b5.opts.always)}G.Animation=G.extend(j,{tweener:function(b5,b6){if(G.isFunction(b5)){b6=b5;b5=["*"]}else{b5=b5.split(" ")}var b7,i=0,e=b5.length;for(;i<e;i++){b7=b5[i];a7[b7]=a7[b7]||[];a7[b7].unshift(b6)}},prefilter:function(i,e){if(e){aM.unshift(i)}else{aM.push(i)}}});G.speed=function(b5,b6,i){var e=b5&&typeof b5==="object"?G.extend({},b5):{complete:i||!i&&b6||G.isFunction(b5)&&b5,duration:b5,easing:i&&b6||b6&&!G.isFunction(b6)&&b6};e.duration=G.fx.off?0:typeof e.duration==="number"?e.duration:e.duration in G.fx.speeds?G.fx.speeds[e.duration]:G.fx.speeds._default;if(e.queue==null||e.queue===true){e.queue="fx"}e.old=e.complete;e.complete=function(){if(G.isFunction(e.old)){e.old.call(this)}if(e.queue){G.dequeue(this,e.queue)}};return e};G.fn.extend({fadeTo:function(e,b6,b5,i){return this.filter(bz).css("opacity",0).show().end().animate({opacity:b6},e,b5,i)},animate:function(b9,b6,b8,b7){var b5=G.isEmptyObject(b9),i=G.speed(b6,b8,b7),e=function(){var ca=j(this,G.extend({},b9),i);if(b5||G._data(this,"finish")){ca.stop(true)}};e.finish=e;return b5||i.queue===false?this.each(e):this.queue(i.queue,e)},stop:function(b5,e,i){var b6=function(b7){var b8=b7.stop;delete b7.stop;b8(i)};if(typeof b5!=="string"){i=e;e=b5;b5=undefined}if(e&&b5!==false){this.queue(b5||"fx",[])}return this.each(function(){var ca=true,b8=b5!=null&&b5+"queueHooks",b7=G.timers,b9=G._data(this);if(b8){if(b9[b8]&&b9[b8].stop){b6(b9[b8])}}else{for(b8 in b9){if(b9[b8]&&b9[b8].stop&&bG.test(b8)){b6(b9[b8])}}}for(b8=b7.length;b8--;){if(b7[b8].elem===this&&(b5==null||b7[b8].queue===b5)){b7[b8].anim.stop(i);ca=false;b7.splice(b8,1)}}if(ca||!i){G.dequeue(this,b5)}})},finish:function(e){if(e!==false){e=e||"fx"}return this.each(function(){var b8,b9=G._data(this),b6=b9[e+"queue"],b5=b9[e+"queueHooks"],i=G.timers,b7=b6?b6.length:0;b9.finish=true;G.queue(this,e,[]);if(b5&&b5.stop){b5.stop.call(this,true)}for(b8=i.length;b8--;){if(i[b8].elem===this&&i[b8].queue===e){i[b8].anim.stop(true);i.splice(b8,1)}}for(b8=0;b8<b7;b8++){if(b6[b8]&&b6[b8].finish){b6[b8].finish.call(this)}}delete b9.finish})}});G.each(["toggle","show","hide"],function(b5,e){var b6=G.fn[e];G.fn[e]=function(i,b8,b7){return i==null||typeof i==="boolean"?b6.apply(this,arguments):this.animate(bD(e,true),i,b8,b7)}});G.each({slideDown:bD("show"),slideUp:bD("hide"),slideToggle:bD("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,i){G.fn[e]=function(b5,b7,b6){return this.animate(i,b5,b7,b6)}});G.timers=[];G.fx.tick=function(){var b6,e=G.timers,b5=0;I=G.now();for(;b5<e.length;b5++){b6=e[b5];if(!b6()&&e[b5]===b6){e.splice(b5--,1)}}if(!e.length){G.fx.stop()}I=undefined};G.fx.timer=function(e){G.timers.push(e);if(e()){G.fx.start()}else{G.timers.pop()}};G.fx.interval=13;G.fx.start=function(){if(!bg){bg=setInterval(G.fx.tick,G.fx.interval)}};G.fx.stop=function(){clearInterval(bg);bg=null};G.fx.speeds={slow:600,fast:200,_default:400};G.fn.delay=function(i,e){i=G.fx?G.fx.speeds[i]||i:i;e=e||"fx";return this.queue(e,function(b7,b6){var b5=setTimeout(b7,i);b6.stop=function(){clearTimeout(b5)}})};(function(){var i,b7,b6,e,b5;b7=n.createElement("div");b7.setAttribute("className","t");b7.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";e=b7.getElementsByTagName("a")[0];b6=n.createElement("select");b5=b6.appendChild(n.createElement("option"));i=b7.getElementsByTagName("input")[0];e.style.cssText="top:1px";bJ.getSetAttribute=b7.className!=="t";bJ.style=/top/.test(e.getAttribute("style"));bJ.hrefNormalized=e.getAttribute("href")==="/a";bJ.checkOn=!!i.value;bJ.optSelected=b5.selected;bJ.enctype=!!n.createElement("form").enctype;b6.disabled=true;bJ.optDisabled=!b5.disabled;i=n.createElement("input");i.setAttribute("value","");bJ.input=i.getAttribute("value")==="";i.value="t";i.setAttribute("type","radio");bJ.radioValue=i.value==="t"})();var at=/\r/g;G.fn.extend({val:function(b6){var e,i,b7,b5=this[0];if(!arguments.length){if(b5){e=G.valHooks[b5.type]||G.valHooks[b5.nodeName.toLowerCase()];if(e&&"get" in e&&(i=e.get(b5,"value"))!==undefined){return i}i=b5.value;return typeof i==="string"?i.replace(at,""):i==null?"":i}return}b7=G.isFunction(b6);return this.each(function(b8){var b9;if(this.nodeType!==1){return}if(b7){b9=b6.call(this,b8,G(this).val())}else{b9=b6}if(b9==null){b9=""}else{if(typeof b9==="number"){b9+=""}else{if(G.isArray(b9)){b9=G.map(b9,function(ca){return ca==null?"":ca+""})}}}e=G.valHooks[this.type]||G.valHooks[this.nodeName.toLowerCase()];if(!e||!("set" in e)||e.set(this,b9,"value")===undefined){this.value=b9}})}});G.extend({valHooks:{option:{get:function(e){var i=G.find.attr(e,"value");return i!=null?i:G.trim(G.text(e))}},select:{get:function(b5){var cb,e,ca=b5.options,b8=b5.selectedIndex,b7=b5.type==="select-one"||b8<0,cc=b7?null:[],b9=b7?b8+1:ca.length,b6=b8<0?b9:b7?b8:0;for(;b6<b9;b6++){e=ca[b6];if((e.selected||b6===b8)&&(bJ.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!G.nodeName(e.parentNode,"optgroup"))){cb=G(e).val();if(b7){return cb}cc.push(cb)}}return cc},set:function(b9,ca){var cb,e,b7=b9.options,b8=G.makeArray(ca),b6=b7.length;while(b6--){e=b7[b6];if(G.inArray(G.valHooks.option.get(e),b8)>=0){try{e.selected=cb=true}catch(b5){e.scrollHeight}}else{e.selected=false}}if(!cb){b9.selectedIndex=-1}return b7}}}});G.each(["radio","checkbox"],function(){G.valHooks[this]={set:function(e,i){if(G.isArray(i)){return(e.checked=G.inArray(G(e).val(),i)>=0)}}};if(!bJ.checkOn){G.valHooks[this].get=function(e){return e.getAttribute("value")===null?"on":e.value}}});var bf,b1,y=G.expr.attrHandle,av=/^(?:checked|selected)$/i,z=bJ.getSetAttribute,L=bJ.input;G.fn.extend({attr:function(e,i){return aW(this,G.attr,e,i,arguments.length>1)},removeAttr:function(e){return this.each(function(){G.removeAttr(this,e)})}});G.extend({attr:function(b7,b6,b8){var e,b5,i=b7.nodeType;if(!b7||i===3||i===8||i===2){return}if(typeof b7.getAttribute===aJ){return G.prop(b7,b6,b8)}if(i!==1||!G.isXMLDoc(b7)){b6=b6.toLowerCase();e=G.attrHooks[b6]||(G.expr.match.bool.test(b6)?b1:bf)}if(b8!==undefined){if(b8===null){G.removeAttr(b7,b6)}else{if(e&&"set" in e&&(b5=e.set(b7,b8,b6))!==undefined){return b5}else{b7.setAttribute(b6,b8+"");return b8}}}else{if(e&&"get" in e&&(b5=e.get(b7,b6))!==null){return b5}else{b5=G.find.attr(b7,b6);return b5==null?undefined:b5}}},removeAttr:function(b7,b8){var b5,e,b6=0,b9=b8&&b8.match(aK);if(b9&&b7.nodeType===1){while((b5=b9[b6++])){e=G.propFix[b5]||b5;if(G.expr.match.bool.test(b5)){if(L&&z||!av.test(b5)){b7[e]=false}else{b7[G.camelCase("default-"+b5)]=b7[e]=false}}else{G.attr(b7,b5,"")}b7.removeAttribute(z?b5:e)}}},attrHooks:{type:{set:function(e,i){if(!bJ.radioValue&&i==="radio"&&G.nodeName(e,"input")){var b5=e.value;e.setAttribute("type",i);if(b5){e.value=b5}return i}}}}});b1={set:function(i,b5,e){if(b5===false){G.removeAttr(i,e)}else{if(L&&z||!av.test(e)){i.setAttribute(!z&&G.propFix[e]||e,e)}else{i[G.camelCase("default-"+e)]=i[e]=true}}return e}};G.each(G.expr.match.bool.source.match(/\w+/g),function(b5,e){var b6=y[e]||G.find.attr;y[e]=L&&z||!av.test(e)?function(b9,b8,ca){var b7,i;if(!ca){i=y[b8];y[b8]=b7;b7=b6(b9,b8,ca)!=null?b8.toLowerCase():null;y[b8]=i}return b7}:function(b7,i,b8){if(!b8){return b7[G.camelCase("default-"+i)]?i.toLowerCase():null}}});if(!L||!z){G.attrHooks.value={set:function(i,b5,e){if(G.nodeName(i,"input")){i.defaultValue=b5}else{return bf&&bf.set(i,b5,e)}}}}if(!z){bf={set:function(b5,b6,i){var e=b5.getAttributeNode(i);if(!e){b5.setAttributeNode((e=b5.ownerDocument.createAttribute(i)))}e.value=b6+="";if(i==="value"||b6===b5.getAttribute(i)){return b6}}};y.id=y.name=y.coords=function(b5,i,b6){var e;if(!b6){return(e=b5.getAttributeNode(i))&&e.value!==""?e.value:null}};G.valHooks.button={get:function(b5,i){var e=b5.getAttributeNode(i);if(e&&e.specified){return e.value}},set:bf.set};G.attrHooks.contenteditable={set:function(i,b5,e){bf.set(i,b5===""?false:b5,e)}};G.each(["width","height"],function(b5,e){G.attrHooks[e]={set:function(i,b6){if(b6===""){i.setAttribute(e,"auto");return b6}}}})}if(!bJ.style){G.attrHooks.style={get:function(e){return e.style.cssText||undefined},set:function(e,i){return(e.style.cssText=i+"")}}}var aO=/^(?:input|select|textarea|button|object)$/i,v=/^(?:a|area)$/i;G.fn.extend({prop:function(e,i){return aW(this,G.prop,e,i,arguments.length>1)},removeProp:function(e){e=G.propFix[e]||e;return this.each(function(){try{this[e]=undefined;delete this[e]}catch(i){}})}});G.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(b8,b7,b9){var b6,e,b5,i=b8.nodeType;if(!b8||i===3||i===8||i===2){return}b5=i!==1||!G.isXMLDoc(b8);if(b5){b7=G.propFix[b7]||b7;e=G.propHooks[b7]}if(b9!==undefined){return e&&"set" in e&&(b6=e.set(b8,b9,b7))!==undefined?b6:(b8[b7]=b9)}else{return e&&"get" in e&&(b6=e.get(b8,b7))!==null?b6:b8[b7]}},propHooks:{tabIndex:{get:function(i){var e=G.find.attr(i,"tabindex");return e?parseInt(e,10):aO.test(i.nodeName)||v.test(i.nodeName)&&i.href?0:-1}}}});if(!bJ.hrefNormalized){G.each(["href","src"],function(b5,e){G.propHooks[e]={get:function(i){return i.getAttribute(e,4)}}})}if(!bJ.optSelected){G.propHooks.selected={get:function(i){var e=i.parentNode;if(e){e.selectedIndex;if(e.parentNode){e.parentNode.selectedIndex}}return null}}}G.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){G.propFix[this.toLowerCase()]=this});if(!bJ.enctype){G.propFix.enctype="encoding"}var B=/[\t\r\n\f]/g;G.fn.extend({addClass:function(cc){var b6,b5,cd,ca,b7,cb,b8=0,b9=this.length,e=typeof cc==="string"&&cc;if(G.isFunction(cc)){return this.each(function(i){G(this).addClass(cc.call(this,i,this.className))})}if(e){b6=(cc||"").match(aK)||[];for(;b8<b9;b8++){b5=this[b8];cd=b5.nodeType===1&&(b5.className?(" "+b5.className+" ").replace(B," "):" ");if(cd){b7=0;while((ca=b6[b7++])){if(cd.indexOf(" "+ca+" ")<0){cd+=ca+" "}}cb=G.trim(cd);if(b5.className!==cb){b5.className=cb}}}}return this},removeClass:function(cc){var b6,b5,cd,ca,b7,cb,b8=0,b9=this.length,e=arguments.length===0||typeof cc==="string"&&cc;if(G.isFunction(cc)){return this.each(function(i){G(this).removeClass(cc.call(this,i,this.className))})}if(e){b6=(cc||"").match(aK)||[];for(;b8<b9;b8++){b5=this[b8];cd=b5.nodeType===1&&(b5.className?(" "+b5.className+" ").replace(B," "):"");if(cd){b7=0;while((ca=b6[b7++])){while(cd.indexOf(" "+ca+" ")>=0){cd=cd.replace(" "+ca+" "," ")}}cb=cc?G.trim(cd):"";if(b5.className!==cb){b5.className=cb}}}}return this},toggleClass:function(b5,e){var i=typeof b5;if(typeof e==="boolean"&&i==="string"){return e?this.addClass(b5):this.removeClass(b5)}if(G.isFunction(b5)){return this.each(function(b6){G(this).toggleClass(b5.call(this,b6,this.className,e),e)})}return this.each(function(){if(i==="string"){var b7,b8=0,b6=G(this),b9=b5.match(aK)||[];while((b7=b9[b8++])){if(b6.hasClass(b7)){b6.removeClass(b7)}else{b6.addClass(b7)}}}else{if(i===aJ||i==="boolean"){if(this.className){G._data(this,"__className__",this.className)}this.className=this.className||b5===false?"":G._data(this,"__className__")||""}}})},hasClass:function(e){var b6=" "+e+" ",b7=0,b5=this.length;for(;b7<b5;b7++){if(this[b7].nodeType===1&&(" "+this[b7].className+" ").replace(B," ").indexOf(b6)>=0){return true}}return false}});G.each(("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu").split(" "),function(b5,e){G.fn[e]=function(b6,i){return arguments.length>0?this.on(e,null,b6,i):this.trigger(e)}});G.fn.extend({hover:function(e,i){return this.mouseenter(e).mouseleave(i||e)},bind:function(e,b5,i){return this.on(e,null,b5,i)},unbind:function(e,i){return this.off(e,null,i)},delegate:function(e,i,b6,b5){return this.on(i,e,b6,b5)},undelegate:function(e,i,b5){return arguments.length===1?this.off(e,"**"):this.off(i,e||"**",b5)}});var bo=G.now();var x=(/\?/);var a6=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;G.parseJSON=function(e){if(ar.JSON&&ar.JSON.parse){return ar.JSON.parse(e+"")}var i,b6=null,b5=G.trim(e+"");return b5&&!G.trim(b5.replace(a6,function(b9,b7,b8,ca){if(i&&b7){b6=0}if(b6===0){return b9}i=b8||b7;b6+=!ca-!b8;return""}))?(Function("return "+b5))():G.error("Invalid JSON: "+e)};G.parseXML=function(b6){var i,b5;if(!b6||typeof b6!=="string"){return null}try{if(ar.DOMParser){b5=new DOMParser();i=b5.parseFromString(b6,"text/xml")}else{i=new ActiveXObject("Microsoft.XMLDOM");i.async="false";i.loadXML(b6)}}catch(b7){i=undefined}if(!i||!i.documentElement||i.getElementsByTagName("parsererror").length){G.error("Invalid XML: "+b6)}return i};var b3,Z,aw=/#.*$/,O=/([?&])_=[^&]*/,am=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,t=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,q=/^(?:GET|HEAD)$/,aQ=/^\/\//,a2=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,bU={},ao={},a3="*/".concat("*");try{Z=location.href}catch(bl){Z=n.createElement("a");Z.href="";Z=Z.href}b3=a2.exec(Z.toLowerCase())||[];function E(e){return function(b7,b9){if(typeof b7!=="string"){b9=b7;b7="*"}var b6,b8=0,b5=b7.toLowerCase().match(aK)||[];if(G.isFunction(b9)){while((b6=b5[b8++])){if(b6.charAt(0)==="+"){b6=b6.slice(1)||"*";(e[b6]=e[b6]||[]).unshift(b9)}else{(e[b6]=e[b6]||[]).push(b9)}}}}}function bZ(e,b5,b7,b6){var i={},b8=(e===ao);function b9(ca){var cb;i[ca]=true;G.each(e[ca]||[],function(cd,cc){var ce=cc(b5,b7,b6);if(typeof ce==="string"&&!b8&&!i[ce]){b5.dataTypes.unshift(ce);b9(ce);return false}else{if(b8){return !(cb=ce)}}});return cb}return b9(b5.dataTypes[0])||!i["*"]&&b9("*")}function bW(b7,b6){var e,i,b5=G.ajaxSettings.flatOptions||{};for(i in b6){if(b6[i]!==undefined){(b5[i]?b7:(e||(e={})))[i]=b6[i]}}if(e){G.extend(true,b7,e)}return b7}function h(cb,b9,e){var b6,b7,i,b8,b5=cb.contents,ca=cb.dataTypes;while(ca[0]==="*"){ca.shift();if(b7===undefined){b7=cb.mimeType||b9.getResponseHeader("Content-Type")}}if(b7){for(b8 in b5){if(b5[b8]&&b5[b8].test(b7)){ca.unshift(b8);break}}}if(ca[0] in e){i=ca[0]}else{for(b8 in e){if(!ca[0]||cb.converters[b8+" "+ca[0]]){i=b8;break}if(!b6){b6=b8}}i=i||b6}if(i){if(i!==ca[0]){ca.unshift(i)}return e[i]}}function al(cf,b7,cb,i){var b5,ca,cc,b8,b6,ce={},cd=cf.dataTypes.slice();if(cd[1]){for(cc in cf.converters){ce[cc.toLowerCase()]=cf.converters[cc]}}ca=cd.shift();while(ca){if(cf.responseFields[ca]){cb[cf.responseFields[ca]]=b7}if(!b6&&i&&cf.dataFilter){b7=cf.dataFilter(b7,cf.dataType)}b6=ca;ca=cd.shift();if(ca){if(ca==="*"){ca=b6}else{if(b6!=="*"&&b6!==ca){cc=ce[b6+" "+ca]||ce["* "+ca];if(!cc){for(b5 in ce){b8=b5.split(" ");if(b8[1]===ca){cc=ce[b6+" "+b8[0]]||ce["* "+b8[0]];if(cc){if(cc===true){cc=ce[b5]}else{if(ce[b5]!==true){ca=b8[0];cd.unshift(b8[1])}}break}}}}if(cc!==true){if(cc&&cf["throws"]){b7=cc(b7)}else{try{b7=cc(b7)}catch(b9){return{state:"parsererror",error:cc?b9:"No conversion from "+b6+" to "+ca}}}}}}}}return{state:"success",data:b7}}G.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Z,type:"GET",isLocal:t.test(b3[1]),global:true,processData:true,async:true,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":a3,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":true,"text json":G.parseJSON,"text xml":G.parseXML},flatOptions:{url:true,context:true}},ajaxSetup:function(i,e){return e?bW(bW(i,G.ajaxSettings),e):bW(G.ajaxSettings,i)},ajaxPrefilter:E(bU),ajaxTransport:E(ao),ajax:function(b7,b9){if(typeof b7==="object"){b9=b7;b7=undefined}b9=b9||{};var ci,ck,b8,ce,cf,cc,cl,b5,cd=G.ajaxSetup({},b9),cq=cd.context||cd,cp=cd.context&&(cq.nodeType||cq.jquery)?G(cq):G.event,cr=G.Deferred(),cn=G.Callbacks("once memory"),ca=cd.statusCode||{},co={},ch={},b6=0,cb="canceled",cj={readyState:0,getResponseHeader:function(i){var e;if(b6===2){if(!b5){b5={};while((e=am.exec(ce))){b5[e[1].toLowerCase()]=e[2]}}e=b5[i.toLowerCase()]}return e==null?null:e},getAllResponseHeaders:function(){return b6===2?ce:null},setRequestHeader:function(i,cs){var e=i.toLowerCase();if(!b6){i=ch[e]=ch[e]||i;co[i]=cs}return this},overrideMimeType:function(e){if(!b6){cd.mimeType=e}return this},statusCode:function(i){var e;if(i){if(b6<2){for(e in i){ca[e]=[ca[e],i[e]]}}else{cj.always(i[cj.status])}}return this},abort:function(i){var e=i||cb;if(cl){cl.abort(e)}cg(0,e);return this}};cr.promise(cj).complete=cn.add;cj.success=cj.done;cj.error=cj.fail;cd.url=((b7||cd.url||Z)+"").replace(aw,"").replace(aQ,b3[1]+"//");cd.type=b9.method||b9.type||cd.method||cd.type;cd.dataTypes=G.trim(cd.dataType||"*").toLowerCase().match(aK)||[""];if(cd.crossDomain==null){ci=a2.exec(cd.url.toLowerCase());cd.crossDomain=!!(ci&&(ci[1]!==b3[1]||ci[2]!==b3[2]||(ci[3]||(ci[1]==="http:"?"80":"443"))!==(b3[3]||(b3[1]==="http:"?"80":"443"))))}if(cd.data&&cd.processData&&typeof cd.data!=="string"){cd.data=G.param(cd.data,cd.traditional)}bZ(bU,cd,b9,cj);if(b6===2){return cj}cc=G.event&&cd.global;if(cc&&G.active++===0){G.event.trigger("ajaxStart")}cd.type=cd.type.toUpperCase();cd.hasContent=!q.test(cd.type);b8=cd.url;if(!cd.hasContent){if(cd.data){b8=(cd.url+=(x.test(b8)?"&":"?")+cd.data);delete cd.data}if(cd.cache===false){cd.url=O.test(b8)?b8.replace(O,"$1_="+bo++):b8+(x.test(b8)?"&":"?")+"_="+bo++}}if(cd.ifModified){if(G.lastModified[b8]){cj.setRequestHeader("If-Modified-Since",G.lastModified[b8])}if(G.etag[b8]){cj.setRequestHeader("If-None-Match",G.etag[b8])}}if(cd.data&&cd.hasContent&&cd.contentType!==false||b9.contentType){cj.setRequestHeader("Content-Type",cd.contentType)}cj.setRequestHeader("Accept",cd.dataTypes[0]&&cd.accepts[cd.dataTypes[0]]?cd.accepts[cd.dataTypes[0]]+(cd.dataTypes[0]!=="*"?", "+a3+"; q=0.01":""):cd.accepts["*"]);for(ck in cd.headers){cj.setRequestHeader(ck,cd.headers[ck])}if(cd.beforeSend&&(cd.beforeSend.call(cq,cj,cd)===false||b6===2)){return cj.abort()}cb="abort";for(ck in {success:1,error:1,complete:1}){cj[ck](cd[ck])}cl=bZ(ao,cd,b9,cj);if(!cl){cg(-1,"No Transport")}else{cj.readyState=1;if(cc){cp.trigger("ajaxSend",[cj,cd])}if(cd.async&&cd.timeout>0){cf=setTimeout(function(){cj.abort("timeout")},cd.timeout)}try{b6=1;cl.send(co,cg)}catch(cm){if(b6<2){cg(-1,cm)}else{throw cm}}}function cg(cu,cw,i,ct){var e,cy,cx,cv,cz,cs=cw;if(b6===2){return}b6=2;if(cf){clearTimeout(cf)}cl=undefined;ce=ct||"";cj.readyState=cu>0?4:0;e=cu>=200&&cu<300||cu===304;if(i){cv=h(cd,cj,i)}cv=al(cd,cv,cj,e);if(e){if(cd.ifModified){cz=cj.getResponseHeader("Last-Modified");if(cz){G.lastModified[b8]=cz}cz=cj.getResponseHeader("etag");if(cz){G.etag[b8]=cz}}if(cu===204||cd.type==="HEAD"){cs="nocontent"}else{if(cu===304){cs="notmodified"}else{cs=cv.state;cy=cv.data;cx=cv.error;e=!cx}}}else{cx=cs;if(cu||!cs){cs="error";if(cu<0){cu=0}}}cj.status=cu;cj.statusText=(cw||cs)+"";if(e){cr.resolveWith(cq,[cy,cs,cj])}else{cr.rejectWith(cq,[cj,cs,cx])}cj.statusCode(ca);ca=undefined;if(cc){cp.trigger(e?"ajaxSuccess":"ajaxError",[cj,cd,e?cy:cx])}cn.fireWith(cq,[cj,cs]);if(cc){cp.trigger("ajaxComplete",[cj,cd]);if(!(--G.active)){G.event.trigger("ajaxStop")}}}return cj},getJSON:function(e,i,b5){return G.get(e,i,b5,"json")},getScript:function(e,i){return G.get(e,undefined,i,"script")}});G.each(["get","post"],function(e,b5){G[b5]=function(i,b7,b8,b6){if(G.isFunction(b7)){b6=b6||b8;b8=b7;b7=undefined}return G.ajax({url:i,type:b5,dataType:b6,data:b7,success:b8})}});G._evalUrl=function(e){return G.ajax({url:e,type:"GET",dataType:"script",async:false,global:false,"throws":true})};G.fn.extend({wrapAll:function(e){if(G.isFunction(e)){return this.each(function(b5){G(this).wrapAll(e.call(this,b5))})}if(this[0]){var i=G(e,this[0].ownerDocument).eq(0).clone(true);if(this[0].parentNode){i.insertBefore(this[0])}i.map(function(){var b5=this;while(b5.firstChild&&b5.firstChild.nodeType===1){b5=b5.firstChild}return b5}).append(this)}return this},wrapInner:function(e){if(G.isFunction(e)){return this.each(function(b5){G(this).wrapInner(e.call(this,b5))})}return this.each(function(){var b5=G(this),i=b5.contents();if(i.length){i.wrapAll(e)}else{b5.append(e)}})},wrap:function(e){var i=G.isFunction(e);return this.each(function(b5){G(this).wrapAll(i?e.call(this,b5):e)})},unwrap:function(){return this.parent().each(function(){if(!G.nodeName(this,"body")){G(this).replaceWith(this.childNodes)}}).end()}});G.expr.filters.hidden=function(e){return e.offsetWidth<=0&&e.offsetHeight<=0||(!bJ.reliableHiddenOffsets()&&((e.style&&e.style.display)||G.css(e,"display"))==="none")};G.expr.filters.visible=function(e){return !G.expr.filters.hidden(e)};var bu=/%20/g,aY=/\[\]$/,T=/\r?\n/g,m=/^(?:submit|button|image|reset|file)$/i,aA=/^(?:input|select|textarea|keygen)/i;function f(e,b7,i,b6){var b5;if(G.isArray(b7)){G.each(b7,function(b9,b8){if(i||aY.test(e)){b6(e,b8)}else{f(e+"["+(typeof b8==="object"?b9:"")+"]",b8,i,b6)}})}else{if(!i&&G.type(b7)==="object"){for(b5 in b7){f(e+"["+b5+"]",b7[b5],i,b6)}}else{b6(e,b7)}}}G.param=function(b5,i){var e,b6=[],b7=function(b8,b9){b9=G.isFunction(b9)?b9():(b9==null?"":b9);b6[b6.length]=encodeURIComponent(b8)+"="+encodeURIComponent(b9)};if(i===undefined){i=G.ajaxSettings&&G.ajaxSettings.traditional}if(G.isArray(b5)||(b5.jquery&&!G.isPlainObject(b5))){G.each(b5,function(){b7(this.name,this.value)})}else{for(e in b5){f(e,b5[e],i,b7)}}return b6.join("&").replace(bu,"+")};G.fn.extend({serialize:function(){return G.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=G.prop(this,"elements");return e?G.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!G(this).is(":disabled")&&aA.test(this.nodeName)&&!m.test(e)&&(this.checked||!aS.test(e))}).map(function(e,b5){var b6=G(this).val();return b6==null?null:G.isArray(b6)?G.map(b6,function(i){return{name:b5.name,value:i.replace(T,"\r\n")}}):{name:b5.name,value:b6.replace(T,"\r\n")}}).get()}});G.ajaxSettings.xhr=ar.ActiveXObject!==undefined?function(){return !this.isLocal&&/^(get|post|head|put|delete|options)$/i.test(this.type)&&M()||af()}:M;var aG=0,aq={},aE=G.ajaxSettings.xhr();if(ar.attachEvent){ar.attachEvent("onunload",function(){for(var e in aq){aq[e](undefined,true)}})}bJ.cors=!!aE&&("withCredentials" in aE);aE=bJ.ajax=!!aE;if(aE){G.ajaxTransport(function(e){if(!e.crossDomain||bJ.cors){var i;return{send:function(b8,b6){var b5,b7=e.xhr(),b9=++aG;b7.open(e.type,e.url,e.async,e.username,e.password);if(e.xhrFields){for(b5 in e.xhrFields){b7[b5]=e.xhrFields[b5]}}if(e.mimeType&&b7.overrideMimeType){b7.overrideMimeType(e.mimeType)}if(!e.crossDomain&&!b8["X-Requested-With"]){b8["X-Requested-With"]="XMLHttpRequest"}for(b5 in b8){if(b8[b5]!==undefined){b7.setRequestHeader(b5,b8[b5]+"")}}b7.send((e.hasContent&&e.data)||null);i=function(cc,cb){var cd,cf,ca;if(i&&(cb||b7.readyState===4)){delete aq[b9];i=undefined;b7.onreadystatechange=G.noop;if(cb){if(b7.readyState!==4){b7.abort()}}else{ca={};cd=b7.status;if(typeof b7.responseText==="string"){ca.text=b7.responseText}try{cf=b7.statusText}catch(ce){cf=""}if(!cd&&e.isLocal&&!e.crossDomain){cd=ca.text?200:404}else{if(cd===1223){cd=204}}}}if(ca){b6(cd,cf,ca,b7.getAllResponseHeaders())}};if(!e.async){i()}else{if(b7.readyState===4){setTimeout(i)}else{b7.onreadystatechange=aq[b9]=i}}},abort:function(){if(i){i(undefined,true)}}}}})}function M(){try{return new ar.XMLHttpRequest()}catch(i){}}function af(){try{return new ar.ActiveXObject("Microsoft.XMLHTTP")}catch(i){}}G.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){G.globalEval(e);return e}}});G.ajaxPrefilter("script",function(e){if(e.cache===undefined){e.cache=false}if(e.crossDomain){e.type="GET";e.global=false}});G.ajaxTransport("script",function(b5){if(b5.crossDomain){var i,e=n.head||G("head")[0]||n.documentElement;return{send:function(b6,b7){i=n.createElement("script");i.async=true;if(b5.scriptCharset){i.charset=b5.scriptCharset}i.src=b5.url;i.onload=i.onreadystatechange=function(b9,b8){if(b8||!i.readyState||/loaded|complete/.test(i.readyState)){i.onload=i.onreadystatechange=null;if(i.parentNode){i.parentNode.removeChild(i)}i=null;if(!b8){b7(200,"success")}}};e.insertBefore(i,e.firstChild)},abort:function(){if(i){i.onload(undefined,true)}}}}});var Y=[],an=/(=)\?(?=&|$)|\?\?/;G.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Y.pop()||(G.expando+"_"+(bo++));this[e]=true;return e}});G.ajaxPrefilter("json jsonp",function(b6,e,b7){var b8,i,b5,b9=b6.jsonp!==false&&(an.test(b6.url)?"url":typeof b6.data==="string"&&!(b6.contentType||"").indexOf("application/x-www-form-urlencoded")&&an.test(b6.data)&&"data");if(b9||b6.dataTypes[0]==="jsonp"){b8=b6.jsonpCallback=G.isFunction(b6.jsonpCallback)?b6.jsonpCallback():b6.jsonpCallback;if(b9){b6[b9]=b6[b9].replace(an,"$1"+b8)}else{if(b6.jsonp!==false){b6.url+=(x.test(b6.url)?"&":"?")+b6.jsonp+"="+b8}}b6.converters["script json"]=function(){if(!b5){G.error(b8+" was not called")}return b5[0]};b6.dataTypes[0]="json";i=ar[b8];ar[b8]=function(){b5=arguments};b7.always(function(){ar[b8]=i;if(b6[b8]){b6.jsonpCallback=e.jsonpCallback;Y.push(b8)}if(b5&&G.isFunction(i)){i(b5[0])}b5=i=undefined});return"script"}});G.parseHTML=function(b7,i,b6){if(!b7||typeof b7!=="string"){return null}if(typeof i==="boolean"){b6=i;i=false}i=i||n;var b5=c.exec(b7),e=!b6&&[];if(b5){return[i.createElement(b5[1])]}b5=G.buildFragment([b7],i,e);if(e&&e.length){G(e).remove()}return G.merge([],b5.childNodes)};var b0=G.fn.load;G.fn.load=function(b5,ca,b8){if(typeof b5!=="string"&&b0){return b0.apply(this,arguments)}var e,b7,b6,i=this,b9=b5.indexOf(" ");if(b9>=0){e=G.trim(b5.slice(b9,b5.length));b5=b5.slice(0,b9)}if(G.isFunction(ca)){b8=ca;ca=undefined}else{if(ca&&typeof ca==="object"){b6="POST"}}if(i.length>0){G.ajax({url:b5,type:b6,dataType:"html",data:ca}).done(function(cb){b7=arguments;i.html(e?G("<div>").append(G.parseHTML(cb)).find(e):cb)}).complete(b8&&function(cc,cb){i.each(b8,b7||[cc.responseText,cb,cc])})}return this};G.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,b5){G.fn[b5]=function(i){return this.on(b5,i)}});G.expr.filters.animated=function(e){return G.grep(G.timers,function(i){return e===i.elem}).length};var bV=ar.document.documentElement;function bq(e){return G.isWindow(e)?e:e.nodeType===9?e.defaultView||e.parentWindow:false}G.offset={setOffset:function(e,cf,b7){var ca,b6,cd,b9,cb,cg,ce,b8=G.css(e,"position"),b5=G(e),cc={};if(b8==="static"){e.style.position="relative"}cb=b5.offset();cd=G.css(e,"top");cg=G.css(e,"left");ce=(b8==="absolute"||b8==="fixed")&&G.inArray("auto",[cd,cg])>-1;if(ce){ca=b5.position();b9=ca.top;b6=ca.left}else{b9=parseFloat(cd)||0;b6=parseFloat(cg)||0}if(G.isFunction(cf)){cf=cf.call(e,b7,cb)}if(cf.top!=null){cc.top=(cf.top-cb.top)+b9}if(cf.left!=null){cc.left=(cf.left-cb.left)+b6}if("using" in cf){cf.using.call(e,cc)}else{b5.css(cc)}}};G.fn.extend({offset:function(i){if(arguments.length){return i===undefined?this:this.each(function(b9){G.offset.setOffset(this,i,b9)})}var e,b8,b6={top:0,left:0},b5=this[0],b7=b5&&b5.ownerDocument;if(!b7){return}e=b7.documentElement;if(!G.contains(e,b5)){return b6}if(typeof b5.getBoundingClientRect!==aJ){b6=b5.getBoundingClientRect()}b8=bq(b7);return{top:b6.top+(b8.pageYOffset||e.scrollTop)-(e.clientTop||0),left:b6.left+(b8.pageXOffset||e.scrollLeft)-(e.clientLeft||0)}},position:function(){if(!this[0]){return}var b5,b6,e={top:0,left:0},i=this[0];if(G.css(i,"position")==="fixed"){b6=i.getBoundingClientRect()}else{b5=this.offsetParent();b6=this.offset();if(!G.nodeName(b5[0],"html")){e=b5.offset()}e.top+=G.css(b5[0],"borderTopWidth",true);e.left+=G.css(b5[0],"borderLeftWidth",true)}return{top:b6.top-e.top-G.css(i,"marginTop",true),left:b6.left-e.left-G.css(i,"marginLeft",true)}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||bV;while(e&&(!G.nodeName(e,"html")&&G.css(e,"position")==="static")){e=e.offsetParent}return e||bV})}});G.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(i,b5){var e=/Y/.test(b5);G.fn[i]=function(b6){return aW(this,function(b7,b9,ca){var b8=bq(b7);if(ca===undefined){return b8?(b5 in b8)?b8[b5]:b8.document.documentElement[b9]:b7[b9]}if(b8){b8.scrollTo(!e?ca:G(b8).scrollLeft(),e?ca:G(b8).scrollTop())}else{b7[b9]=ca}},i,b6,arguments.length,null)}});G.each(["top","left"],function(e,b5){G.cssHooks[b5]=bd(bJ.pixelPosition,function(b6,i){if(i){i=bI(b6,b5);return bt.test(i)?G(b6).position()[b5]+"px":i}})});G.each({Height:"height",Width:"width"},function(e,i){G.each({padding:"inner"+e,content:i,"":"outer"+e},function(b5,b6){G.fn[b6]=function(b8,ca){var b9=arguments.length&&(b5||typeof b8!=="boolean"),b7=b5||(b8===true||ca===true?"margin":"border");return aW(this,function(cc,cb,cd){var ce;if(G.isWindow(cc)){return cc.document.documentElement["client"+e]}if(cc.nodeType===9){ce=cc.documentElement;return Math.max(cc.body["scroll"+e],ce["scroll"+e],cc.body["offset"+e],ce["offset"+e],ce["client"+e])}return cd===undefined?G.css(cc,cb,b7):G.style(cc,cb,cd,b7)},i,b9?b8:undefined,b9,null)}})});G.fn.size=function(){return this.length};G.fn.andSelf=G.fn.addBack;if(typeof define==="function"&&define.amd){define("jquery",[],function(){return G})}var bm=ar.jQuery,C=ar.$;G.noConflict=function(e){if(ar.$===G){ar.$=C}if(e&&ar.jQuery===G){ar.jQuery=bm}return G};if(typeof aB===aJ){ar.jQuery2=ar.$2=G}return G}));
        bds.qa.ShortCut.fbJQ = $2.noConflict();
    },


    //初始化定制的数据
    initialize: function (options) {
        //对每一个参数都做了兼容性配置
        this.appid = options.appid ? options.appid : bds.qa.ShortCut.default_options.appid;
        this.entrance_id = options.entrance_id != undefined ? options.entrance_id : bds.qa.ShortCut.default_options.entrance_id;

        this.needIssueTips = options.needIssueTips != undefined ? options.needIssueTips : bds.qa.ShortCut.default_options.needIssueTips;
        this.needIssue = options.needIssue != undefined ? options.needIssue : bds.qa.ShortCut.default_options.needIssue;
        this.needCut = options.needCut != undefined ? options.needCut : bds.qa.ShortCut.default_options.needCut;
        this.needMyFeedback = options.needMyFeedback != undefined ? options.needMyFeedback : bds.qa.ShortCut.default_options.needMyFeedback;

        this.needEmail = options.needEmail != undefined ? options.needEmail : bds.qa.ShortCut.default_options.needEmail;
        this.needGuide = options.needGuide != undefined ? options.needGuide : bds.qa.ShortCut.default_options.needGuide;
        this.typeArray = options.typeArray != undefined ? options.typeArray : bds.qa.ShortCut.default_options.typeArray;
        this.needType = options.needType != undefined ? options.needType : bds.qa.ShortCut.default_options.needType;
        this.needDrag = options.needDrag != undefined ? options.needDrag : bds.qa.ShortCut.default_options.needDrag;
        this.defaultCut = options.defaultCut != undefined ? options.defaultCut : bds.qa.ShortCut.default_options.defaultCut;
        this.submitOkFunc = options.submitOkFunc != undefined ? options.submitOkFunc : bds.qa.ShortCut.default_options.submitOkFunc;

        this.plugintitle = options.plugintitle != undefined ? options.plugintitle : bds.qa.ShortCut.default_options.plugintitle;
        this.myFeedbackHtml = options.myFeedbackHtml != undefined ? options.myFeedbackHtml : bds.qa.ShortCut.default_options.myFeedbackHtml;
        this.issueTips = options.issueTips != undefined ? options.issueTips : bds.qa.ShortCut.default_options.issueTips;
        this.issuePlaceholder = options.issuePlaceholder != undefined ? options.issuePlaceholder : bds.qa.ShortCut.default_options.issuePlaceholder;
        this.emailPlaceholder = options.emailPlaceholder != undefined ? options.emailPlaceholder : bds.qa.ShortCut.default_options.emailPlaceholder;
        this.guide = options.guide != undefined ? options.guide : bds.qa.ShortCut.default_options.guide;
        this.cutFileTips = options.cutFileTips != undefined ? options.cutFileTips : bds.qa.ShortCut.default_options.cutFileTips;
        this.cutCanvasTips = options.cutCanvasTips != undefined ? options.cutCanvasTips : bds.qa.ShortCut.default_options.cutCanvasTips;
        this.emailTips = options.emailTips != undefined ? options.emailTips : bds.qa.ShortCut.default_options.emailTips;
        this.commitContent = options.commitContent != undefined ? options.commitContent : bds.qa.ShortCut.default_options.commitContent;
        this.typeTips = options.typeTips != undefined ? options.typeTips : bds.qa.ShortCut.default_options.typeTips;
        this.dangerTypeTips = options.dangerTypeTips != undefined ? options.dangerTypeTips : bds.qa.ShortCut.default_options.dangerTypeTips;
        this.dangerContentTips = options.dangerContentTips != undefined ? options.dangerContentTips : bds.qa.ShortCut.default_options.dangerContentTips;
        this.onlyUpFile = options.onlyUpFile != undefined ? options.onlyUpFile : bds.qa.ShortCut.default_options.onlyUpFile;
        this.contentRequiredTips = options.contentRequiredTips != undefined ? options.contentRequiredTips : bds.qa.ShortCut.default_options.contentRequiredTips;
        this.emailRequiredTips = options.emailRequiredTips != undefined ? options.emailRequiredTips : bds.qa.ShortCut.default_options.emailRequiredTips;
        this.requiredEmail = options.requiredEmail != undefined ? options.requiredEmail : bds.qa.ShortCut.default_options.requiredEmail;
        this.submitOkTips = options.submitOkTips != undefined ? options.submitOkTips : bds.qa.ShortCut.default_options.submitOkTips;

        this.showPosition = options.showPosition != undefined ? options.showPosition : bds.qa.ShortCut.default_options.showPosition;
        this.skinStyle = options.skinStyle != undefined ? options.skinStyle : bds.qa.ShortCut.default_options.skinStyle;

        this.okStyle = options.okStyle != undefined ? options.okStyle : '<img src="'+bds.qa.ShortCut.base_url_path+'/Public/feedback/img/fb_ok.png" style="margin-right:10px;display:inline;vertical-align:middle;"><span style="font-size: 16px;">'+ this.submitOkTips +'</span>';
//        this.okStyle = options.okStyle != undefined ? options.okStyle : '<img src="http://cp01-rdqa-dev401.cp01.baidu.com:8765/Public/feedback/img/fb_ok.png" style="margin-right:10px;display:inline;vertical-align:middle;"><span style="font-size: 16px;">您的意见我们已经收到，谢谢！</span>';

        //this.cutImg = options.cutImg != undefined ? options.cutImg : bds.qa.ShortCut.default_options.cutImg;
        //this.upImg = options.upImg != undefined ? options.upImg : bds.qa.ShortCut.default_options.upImg;

        this.win_width = parseInt(Math.max(document.body.scrollWidth, document.documentElement.clientWidth, document.body.clientWidth));
        this.dialogPosition = options.dialogPosition? options.dialogPosition:bds.qa.ShortCut.default_options.dialogPosition;
        bds.qa.ShortCut._getImg();

        //ios6以下没有上传和截图
        if (bds.qa.ShortCut.skinStyle == 'pad') {
            this.needCut = bds.qa.ShortCut._isUpperIos6();
        }
    },

    //识别浏览器的判定和是否截图的判定
    getPrepare: function () {
        //没有截图和识别浏览器不支持的时候，定义为已经存在
        bds.qa.ShortCut.up_file = !bds.qa.ShortCut._identifyBrowser();
        if (bds.qa.ShortCut.onlyUpFile > 0) {
            bds.qa.ShortCut.up_file = true;
        }

        if(bds.qa.ShortCut.skinStyle =="pad"){
            bds.qa.ShortCut.up_file = true;
            //bds.qa.ShortCut.upImg = "padUp.png";
        }

        bds.qa.ShortCut._getCss();
    },


    //初始化截图功能
    init: function () {
        bds.qa.ShortCut.init_action_dialog();
        bds.qa.ShortCut.init_bind_action();
        if((!bds.qa.ShortCut._isIE6())&&bds.qa.ShortCut.needDrag){
            bds.qa.ShortCut.init_drag();
        }else{
            bds.qa.ShortCut.fbJQ(".fb-header").css("cursor","default");
        }
        bds.qa.ShortCut.init_post_data();
    },


    init_action_dialog: function () {
        var drawToolNodeExist = document.getElementById("fb_baidu_right_dialog");

        //判定容器是否存在,已经存在则不进行渲染
        if (!drawToolNodeExist) {
            var drawToolHtml = '';
            //内容提示框
            var content_tips_div = bds.qa.ShortCut.needIssueTips?'<div  class ="fb-tips-block"><span class="fb-content-tips">'+bds.qa.ShortCut.issueTips+'</span><span class = "fb-danger-tips"> '+bds.qa.ShortCut.dangerContentTips+'</span></div>':'';

            //内容域
            var content_textarea =bds.qa.ShortCut.needIssue?'<div class="fb-textarea fb-content-block"><textarea maxlength="400" class ="fb-des-content" name="issuedesc" id="fb_des_content" data-exclude="true">' + bds.qa.ShortCut.issuePlaceholder + '</textarea></div>':'';

            // 处理反馈类型的展现
            var level_block ="";
            if(bds.qa.ShortCut.needType){
                level_block = '<div class="fb-level-type-block">' +
                '<div class="fb-level-title"><span>'+bds.qa.ShortCut.typeTips+'</span><span class="fb-danger-tips"> '+bds.qa.ShortCut.dangerTypeTips+'</span></div><ul>';

                try {
                    // 第一个为默认选项
                    for (var key in bds.qa.ShortCut.typeArray) {
                        level_block += '<li value="' + bds.qa.ShortCut.typeArray[key] + '">' +
                        '<div class="fb-radio">' +
                        '</div><span>' + key + '</span></li>';
                        is_first = false;
                    }
                    level_block+='</ul></div>';
                }catch (e){
                    //todo 错误的日志，打向服务器
                    //e.name + e.message;
                    level_block = "";
                }
            }

            //提出公共变量为最终定制做铺垫
            var danger_email_tips = bds.qa.ShortCut.requiredEmail ? bds.qa.ShortCut.dangerContentTips : '';
            var email_div = bds.qa.ShortCut.needEmail?'<div class="fb-block fb-email-block">' +
                                '<div class="fb-phone-txt">' + bds.qa.ShortCut.emailTips + '<span class = "fb-danger-tips"> '+danger_email_tips+'</span></div>' +
                                '<div><input type="text" class="fb-email" maxlength="100" value="' + bds.qa.ShortCut.emailPlaceholder + '" id="feedback_email"></div>' +
                            '</div>':'';

            var guide_div = bds.qa.ShortCut.needGuide?'<div class="fb-guide fb-guide-block">' +bds.qa.ShortCut.guide+ '</div>':'';

            var myFeedbackHtml = bds.qa.ShortCut.needMyFeedback ? bds.qa.ShortCut.myFeedbackHtml : '';
            if (bds.qa.ShortCut.up_file) {
            // if (true) {
                //渲染上传
                cut_div = bds.qa.ShortCut.needCut?'<div class="fb-block fb-cut-block" ><div class="fb-cut-block-ie"><input class="fb-cut-input" type="file" id="fb_shangchuan" name="screenshot" onchange="bds.qa.ShortCut._checkFileType(this)"></div>' +
                    '<span id="fb_shangchuan_txt" class="fb-shangchuan">' + bds.qa.ShortCut.cutFileTips + '</span></div>':'';

                drawToolHtml = '<div class="fb-modal " data-html2canvas-ignore="true">' +
                    '<div class="fb-header" id="fb_dialog_header" unselectable="on" onselectstart="return false;">' +
                    '<a class="fb-close" id="fb_close_x">×</a>' +
                    '<h3  class="fb-header-tips">' + bds.qa.ShortCut.plugintitle + myFeedbackHtml + '</h3>' +
                    '</div>' +
                    '<div class="fb-body" id="fb_qa_feedback_body">' +
                    '<div class="fb-action">' +
                    '<form id="fb_right_post_form" enctype="application/x-www-form-urlencoded" action="' + bds.qa.ShortCut.base_url_path + '/?m=Client&a=postMsg" method="post" onsubmit = "return false;">'
//                    '<form id="fb_right_post_form" enctype="application/x-www-form-urlencoded" action="http://cp01-rdqa-dev401.cp01.baidu.com:8765/?m=Client&a=postMsg" method="post">'
                    + level_block + content_tips_div + content_textarea + cut_div + email_div +
                    '</form></div>' +
                    '<div class="fb-footer">' +
                    '<div class="fb-btn fb-btn-primary" id="fb_right_post_save">'+bds.qa.ShortCut.commitContent+'</div>' +
                    '</div>' +guide_div+
                    '</div>' +
                    '</div>';
            } else {
                bds.qa.ShortCut.up_file = false;

                var cut_div = bds.qa.ShortCut.needCut?'<div class="fb-block fb-cut-block">' +
                '<div><a class="fb-cut-btn" id="fb_jietu" href="javascript:void(0);"></a><span id = "fb_tips_span" >'+bds.qa.ShortCut.cutCanvasTips+'</span></div>' +
                              '</div> ':'';

                drawToolHtml = '<div class="fb-modal " data-html2canvas-ignore="true">' +
                    '<div class="fb-header" id="fb_dialog_header" unselectable="on" onselectstart="return false;">' +
                    '<a class="fb-close" id="fb_close_x">×</a>' +
                    '<h3  class = "fb-header-tips">' + bds.qa.ShortCut.plugintitle + myFeedbackHtml + '</h3>' +
                    '</div>' +
                    '<div class="fb-body" id="fb_qa_feedback_body">' +
                    '<div class="fb-action">'
                    + level_block + content_tips_div+content_textarea + cut_div+ email_div+
                    '</div>' +
                    '<div class="fb-footer">' +
                    '<div class="fb-btn fb-btn-primary" id="fb_right_canvas_save">'+bds.qa.ShortCut.commitContent+'</div>' +
                    '</div>' +guide_div+
                    '</div></div>';
            }
            //位置， 先声明后使用
            var drawToolNode = document.createElement("div");
            drawToolNode.id = "fb_baidu_right_dialog";
            drawToolNode.className = "fb-feedback-right-dialog";

            if (!bds.qa.ShortCut._isIE6()) {
                drawToolNode.style.display = "none";
                drawToolNode.style.position = "fixed";
            }

            drawToolNode.style.zIndex = 999999;
            drawToolNode.innerHTML = drawToolHtml;

            //所有样式下都先给出一个弹出层
            var fb_wizard = document.createElement("div");
            fb_wizard.id = "fb_baidu_wizard";
            fb_wizard.className = "fb-baidu-wizard";
            bds.qa.ShortCut.fbJQ("body").append(fb_wizard);

            bds.qa.ShortCut._getWizardPosition();
            bds.qa.ShortCut.fbJQ("body").append(drawToolNode);

            var t= setTimeout("bds.qa.ShortCut._fixedPage()",500);
        }
    },


    //绑定事件
    init_bind_action: function () {
        bds.qa.ShortCut.fbJQ(".fb-modal textarea").focus(function () {
            if (bds.qa.ShortCut.fbJQ(this).val() == bds.qa.ShortCut.issuePlaceholder) {
                bds.qa.ShortCut.fbJQ(this).val("");
                if (bds.qa.ShortCut.fbJQ("#fb_pop_tips")) {
                    bds.qa.ShortCut.fbJQ("#fb_pop_tips").remove();
                }
            }
        });

        bds.qa.ShortCut.fbJQ(".fb-modal textarea").blur(function () {
            if (bds.qa.ShortCut.fbJQ(this).val() == "") {
                bds.qa.ShortCut.fbJQ(this).css("color", "#9a9a9a");
                bds.qa.ShortCut.fbJQ(this).val(bds.qa.ShortCut.issuePlaceholder);
            }
        });

        bds.qa.ShortCut.fbJQ(".fb-modal textarea").keydown(function () {
            if (bds.qa.ShortCut.fbJQ(this).val() != bds.qa.ShortCut.issuePlaceholder) {
                bds.qa.ShortCut.fbJQ(this).css("color", "black");
                if (bds.qa.ShortCut.fbJQ("#fb_pop_tips")) {
                    bds.qa.ShortCut.fbJQ("#fb_pop_tips").remove();
                }
            }
        });

        bds.qa.ShortCut.fbJQ(".fb-modal .fb-email").focus(function () {
            if (bds.qa.ShortCut.fbJQ(this).val() == bds.qa.ShortCut.emailPlaceholder) {
                bds.qa.ShortCut.fbJQ(this).val("");
            }
        });

        bds.qa.ShortCut.fbJQ(".fb-modal .fb-email").blur(function () {
            if (bds.qa.ShortCut.fbJQ(this).val() == "") {
                bds.qa.ShortCut.fbJQ(this).css("color", "#9a9a9a");
                bds.qa.ShortCut.fbJQ(this).val(bds.qa.ShortCut.emailPlaceholder);
            }
        });

        bds.qa.ShortCut.fbJQ(".fb-modal textarea").keyup(function () {
            if (bds.qa.ShortCut.fbJQ(this).val().length >= 400) {
                var sub_str = bds.qa.ShortCut.fbJQ(this).val().substr(0, 400);
                bds.qa.ShortCut.fbJQ(this).val(sub_str);
            }
        });

        bds.qa.ShortCut.fbJQ(".fb-modal .fb-email").keydown(function () {
            if (bds.qa.ShortCut.fbJQ(this).val() != bds.qa.ShortCut.emailPlaceholder) {
                bds.qa.ShortCut.fbJQ(this).css("color", "black");
            }
        });

        // 选择框的函数
        bds.qa.ShortCut.fbJQ(".fb-radio").click(function () {
            bds.qa.ShortCut.fbJQ(".fb-checked").removeClass("fb-checked");
            bds.qa.ShortCut.fbJQ(this).parent().addClass("fb-checked");
        });

        //兼容ie7 input框的长度
//        if (bds.qa.ShortCut._isIE7()) {
//            bds.qa.ShortCut.fbJQ(".fb-email").css("width", "300px");
//        }

//        var fb_baidu_right_dialog = document.getElementById("fb_baidu_right_dialog");
//        fb_baidu_right_dialog.onselectstart = function () {               //不能被选中
//            return false;
//        };

        //关闭事件，按钮，全部清除
        bds.qa.ShortCut.fbJQ("#fb_close_x").click(function () {
            var remove = function () {
                bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").remove();
                bds.qa.ShortCut.fbJQ("#ShortCut_wizard").remove();
                bds.qa.ShortCut.fbJQ("#fb_base_wizard_canvas").remove();
                bds.qa.ShortCut.fbJQ("#fb_baidu_wizard").remove();
                bds.qa.ShortCut.fbJQ("#fb_right_dialog_canvas").remove();
                bds.qa.ShortCut.fbJQ("#fb_right_dialog_pagecanvas").remove();
                bds.qa.ShortCut.fbJQ("#fb_right_dialog_pagecanvas2").remove();
                bds.qa.ShortCut.fbJQ(".fb_cancel_flag").remove();
                bds.qa.ShortCut.fbJQ("#fb_popwindow").remove();
                bds.qa.ShortCut.fbJQ('#fb_cut_img').remove();
            };

            if (bds.qa.ShortCut.skinStyle == "pad") {
                remove();
            }else{
                bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").slideUp("slow");
                setTimeout(remove, 1000);
            }

            bds.qa.ShortCut.is_feedbacking = false;
            bds.qa.ShortCut.send_img = false;

        });

        bds.qa.ShortCut.fbJQ("#fb_jietu").click(function () {
            if (bds.qa.ShortCut.send_img == false) {
                bds.qa.ShortCut.defaultCut = true;
                bds.qa.ShortCut.fbJQ("#fb_right_dialog_canvas").css("cursor", 'crosshair');
                bds.qa.ShortCut.fbJQ("#fb_jietu").css("cursor", 'crosshair');
                // bds.qa.ShortCut.get_Snapshot();
                // bds.qa.ShortCut.get_pic();
                bds.qa.ShortCut.init_img_render();
            }
        });

        //pad 下面屏幕下面的兼容行
        if (bds.qa.ShortCut.skinStyle == "pad") {
            //绑定屏幕倒置事件
            bds.qa.ShortCut.fbJQ(window).on('orientationchange', function (e) {
                bds.qa.ShortCut._repaint();
            });

            //兼容ios5下面键盘弹出事件()
            bds.qa.ShortCut.fbJQ(".fb-des-content").on("focus", function () {
                bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("position", "absolute");
            });

            bds.qa.ShortCut.fbJQ(".fb-email").on("focus", function () {
                bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("position", "absolute");
            });
        }

        //非canvas下面的屏幕扩大和缩小事件
        //if(bds.qa.ShortCut.up_file&&(bds.qa.ShortCut.skinStyle != "pad")){
            //bds.qa.ShortCut.fbJQ(window).resize(bds.qa.ShortCut._repaint());
        //}

        //声明事件的时候给提交绑定事件
        bds.qa.ShortCut.bindclick = 0;

        if (bds.qa.ShortCut._isIE6()) {
            if (bds.qa.ShortCut.showPosition == "right" || bds.qa.ShortCut.showPosition == "bottom_left" || bds.qa.ShortCut.showPosition == "bottom_right") {
                bds.qa.ShortCut.fbJQ(window).scroll(function () {
                    bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("top", parseInt(document.documentElement.clientHeight + document.documentElement.scrollTop - bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").height() - 5) + "px");
                })
            }

            //兼容ie6下面的居中
            if (bds.qa.ShortCut.showPosition == "center") {
                bds.qa.ShortCut.fbJQ(window).scroll(function () {
                    bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("top", parseInt((bds.qa.ShortCut._getClientWidth() - bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").width()) / 2) + "px");
                })
            }
        }

        //is异步情况下关闭首页
        bds.qa.ShortCut.fbJQ(window).on("index_off", function () {
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").remove();
            bds.qa.ShortCut.fbJQ("#ShortCut_wizard").remove();
            bds.qa.ShortCut.fbJQ("#fb_base_wizard_canvas").remove();
            bds.qa.ShortCut.fbJQ("#fb_baidu_wizard").remove();
            bds.qa.ShortCut.fbJQ("#fb_right_dialog_canvas").remove();
            bds.qa.ShortCut.fbJQ("#fb_right_dialog_pagecanvas").remove();
            bds.qa.ShortCut.fbJQ("#fb_right_dialog_pagecanvas2").remove();
            bds.qa.ShortCut.fbJQ(".fb_cancel_flag").remove();
            bds.qa.ShortCut.fbJQ("#fb_popwindow").remove();
            bds.qa.ShortCut.fbJQ('#fb_cut_img').remove();
            bds.qa.ShortCut.is_feedbacking = false;
            bds.qa.ShortCut.send_img = false;
        });
    },

    //拖拽的实现
    init_drag: function () {
        var isIE = (document.all) ? true : false;

        var getTarg = function (id) {
            return "string" == typeof id ? document.getElementById(id) : id;
        };

        var Class = {
            create: function () {
                return function () {
                    this.initialize.apply(this, arguments);
                }
            }
        };

        var Extend = function (destination, source) {
            for (var property in source) {
                destination[property] = source[property];
            }
        };

        var Bind = function (object, fun) {
            return function () {
                return fun.apply(object, arguments);
            }
        };

        var BindAsEventListener = function (object, fun) {
            return function (event) {
                return fun.call(object, (event || window.event));
            }
        };

        function addEventHandler(oTarget, sEventType, fnHandler) {
            if (oTarget.addEventListener) {
                oTarget.addEventListener(sEventType, fnHandler, false);
            } else if (oTarget.attachEvent) {
                oTarget.attachEvent("on" + sEventType, fnHandler);
            } else {
                oTarget["on" + sEventType] = fnHandler;
            }
        }

        function removeEventHandler(oTarget, sEventType, fnHandler) {
            if (oTarget.removeEventListener) {
                oTarget.removeEventListener(sEventType, fnHandler, false);
            } else if (oTarget.detachEvent) {
                oTarget.detachEvent("on" + sEventType, fnHandler);
            } else {
                oTarget["on" + sEventType] = null;
            }
        }

        //拖放程序
        bds.qa.ShortCut.SimpleDrag = Class.create();
        bds.qa.ShortCut.SimpleDrag.prototype = {
            //拖放对象,触发对象
            initialize: function (drag, bedrag) {
                this.Drag = getTarg(drag);
                this.beDrag = getTarg(bedrag);
                this._x = this._y = 0;
                this._fM = BindAsEventListener(this, this.Move);
                this._fS = Bind(this, this.Stop);
                addEventHandler(this.Drag, "mousedown", BindAsEventListener(this, this.Start));
            },
            //准备拖动
            Start: function (oEvent) {
                if (oEvent.preventDefault) {
                    oEvent.preventDefault();
                } else {
                    oEvent.returnValue = false;
                }
                this._x = oEvent.clientX - this.beDrag.offsetLeft;
                this._y = oEvent.clientY - this.beDrag.offsetTop;
                addEventHandler(document, "mousemove", this._fM);
                addEventHandler(document, "mouseup", this._fS);
            },

            //拖动
            Move: function (oEvent) {
                if (!bds.qa.ShortCut._isIE6()) {
                    var fb_height = bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").height();
                    var fb_width = bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").width();
                    var client_width = 0;
                    if (document.documentElement && document.documentElement.clientWidth) {
                        client_width = document.documentElement.clientWidth;
                    } else if (document.body) {
                        client_width = document.body.clientWidth;
                        /*某些情况下Chrome不认document.documentElement.clientWidth则对于Chrome的处理。*/
                    }

                    var client_height = 0;
                    if (document.documentElement && document.documentElement.clientHeight) {
                        client_height = document.documentElement.clientHeight;
                    } else if (document.body) {
                        client_height = document.body.clientHeight;
                        /*某些情况下Chrome不认document.documentElement.clientHeight则对于Chrome的处理。*/
                    }

                    var client_left = oEvent.clientX - this._x;
                    var client_top = oEvent.clientY - this._y;

                    var height_cut = fb_height;
                    var width_cut = fb_width;
                    if (bds.qa.ShortCut._isIE()) {
                        height_cut = fb_height;
                        width_cut = fb_width;
                    }

                    if (client_left < 0) {
                        client_left = 0;
                    }
                    if (client_left > client_width - width_cut) {
                        client_left = client_width - width_cut;
                    }

                    if (client_top < 0) {
                        client_top = 0;
                    }

                    if (client_top > client_height - height_cut) {
                        client_top = client_height - height_cut;
                    }

                    this.beDrag.style.left = client_left + "px";
                    this.beDrag.style.top = client_top + "px";
                    this.Drag.style.left = client_left + 1 + "px";
                    if (bds.qa.ShortCut._isIE()) {
                        this.Drag.style.top = client_top + 1 + "px";
                    } else {
                        this.Drag.style.top = client_top + 2 + "px";
                    }
                } else {
                    this.beDrag.style.left = oEvent.clientX - this._x + "px";
                    this.beDrag.style.top = oEvent.clientY - this._y + "px";
                    this.Drag.style.left = oEvent.clientX - this._x + 1 + "px";
                    this.Drag.style.top = oEvent.clientY - this._y + 2 + "px";
                }
                this.beDrag.style.bottom = "";
                this.beDrag.style.right = "";
            },
            //停止拖动
            Stop: function () {
                removeEventHandler(document, "mousemove", this._fM);
                removeEventHandler(document, "mouseup", this._fS);
            }
        };
        new bds.qa.ShortCut.SimpleDrag("fb_dialog_header", "fb_baidu_right_dialog");
    },


    init_post_data: function () {
        //截图数据传输
        bds.qa.ShortCut.fbJQ("#fb_right_canvas_save").click(function () {
            if (bds.qa.ShortCut.send_img == false) {
                var des_info = bds.qa.ShortCut.fbJQ("#fb_des_content").val();
                var email = bds.qa.ShortCut.fbJQ("#feedback_email").val();
                if (email == bds.qa.ShortCut.emailPlaceholder) {
                    email = "";
                }

                // 必填提示为空则非碧天
                if ((des_info == '' || des_info == bds.qa.ShortCut.issuePlaceholder) && (bds.qa.ShortCut.dangerContentTips != "")) {
                    bds.qa.ShortCut.popwindow(bds.qa.ShortCut.contentRequiredTips, 200);
                    return false;
                }

                // 联系方式必填提示
                if (email == '' && bds.qa.ShortCut.requiredEmail) {
                    bds.qa.ShortCut.popwindow(bds.qa.ShortCut.emailRequiredTips, 200);
                    return false;
                }

                if ((bds.qa.ShortCut.needType)&&(bds.qa.ShortCut.dangerTypeTips != "")&&(bds.qa.ShortCut.fbJQ(".fb-checked").attr("value")==undefined)) {
                    bds.qa.ShortCut.popwindow("请选择反馈分类", 200);
                    return false;
                }
                bds.qa.ShortCut.sendCanvasData();
            }
        });

        //非截图的数据上传
        bds.qa.ShortCut.fbJQ("#fb_right_post_save").click(function () {
            var des_info = bds.qa.ShortCut.fbJQ("#fb_des_content").val();
            var email = bds.qa.ShortCut.fbJQ("#feedback_email").val();
            if (email == bds.qa.ShortCut.emailPlaceholder) {
                email = "";
            }
            if ((des_info == '' || des_info == bds.qa.ShortCut.issuePlaceholder)&&(bds.qa.ShortCut.dangerContentTips != "")) {
                bds.qa.ShortCut.popwindow(bds.qa.ShortCut.contentRequiredTips, 200);
                return false;
            }

            // 联系方式必填提示
            if (email == '' && bds.qa.ShortCut.requiredEmail) {
                bds.qa.ShortCut.popwindow(bds.qa.ShortCut.emailRequiredTips, 200);
                return false;
            }

            if ((bds.qa.ShortCut.needType)&&(bds.qa.ShortCut.dangerTypeTips != "") && (bds.qa.ShortCut.fbJQ(".fb-checked").attr("value") == undefined)) {
                bds.qa.ShortCut.popwindow("请选择反馈分类", 200);
                return false;
            }
            var image_name = bds.qa.ShortCut.fbJQ("#fb_shangchuan").val() || '';
            var img_type = bds.qa.ShortCut.checkImage(image_name);
            if (image_name && !img_type) {
                bds.qa.ShortCut.popwindow("请上传PNG,JPEG,GIF等图片文件", 200);
                var f = bds.qa.ShortCut.fbJQ('#fb_shangchuan');
                f.after(f.clone().val(''));
                f.remove();
                bds.qa.ShortCut.fbJQ(".fb_shangchuan_txt").html("");
                return false;
            }
            bds.qa.ShortCut.postCrossDomainDataForm(bds.qa.ShortCut.sendDataResult);
        });
    },


    get_Snapshot:function(){
        /*
          0.4.1
        */

        (function (window, document, undefined) {

            "use strict";

            var _html2canvas = {},
                previousElement,
                computedCSS,
                html2canvas;

            _html2canvas.Util = {};

            _html2canvas.Util.log = function (a) {
                if (_html2canvas.logging && window.console && window.console.log) {
                    window.console.log(a);
                }
            };

            _html2canvas.Util.trimText = (function (isNative) {
                return function (input) {
                    return isNative ? isNative.apply(input) : ((input || '') + '').replace(/^\s+|\s+$/g, '');
                };
            })(String.prototype.trim);

            _html2canvas.Util.asFloat = function (v) {
                return parseFloat(v);
            };

            (function () {
                // TODO: support all possible length values
                var TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g;
                var TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g;
                _html2canvas.Util.parseTextShadows = function (value) {
                    if (!value || value === 'none') {
                        return [];
                    }

                    // find multiple shadow declarations
                    var shadows = value.match(TEXT_SHADOW_PROPERTY),
                        results = [];
                    for (var i = 0; shadows && (i < shadows.length); i++) {
                        var s = shadows[i].match(TEXT_SHADOW_VALUES);
                        results.push({
                            color: s[0],
                            offsetX: s[1] ? s[1].replace('px', '') : 0,
                            offsetY: s[2] ? s[2].replace('px', '') : 0,
                            blur: s[3] ? s[3].replace('px', '') : 0
                        });
                    }
                    return results;
                };
            })();


            _html2canvas.Util.parseBackgroundImage = function (value) {
                var whitespace = ' \r\n\t',
                    method, definition, prefix, prefix_i, block, results = [],
                    c, mode = 0, numParen = 0, quote, args;

                var appendResult = function () {
                    if (method) {
                        if (definition.substr(0, 1) === '"') {
                            definition = definition.substr(1, definition.length - 2);
                        }
                        if (definition) {
                            args.push(definition);
                        }
                        if (method.substr(0, 1) === '-' &&
                            (prefix_i = method.indexOf('-', 1) + 1) > 0) {
                            prefix = method.substr(0, prefix_i);
                            method = method.substr(prefix_i);
                        }
                        results.push({
                            prefix: prefix,
                            method: method.toLowerCase(),
                            value: block,
                            args: args
                        });
                    }
                    args = []; //for some odd reason, setting .length = 0 didn't work in safari
                    method =
                        prefix =
                            definition =
                                block = '';
                };

                appendResult();
                for (var i = 0, ii = value.length; i < ii; i++) {
                    c = value[i];
                    if (mode === 0 && whitespace.indexOf(c) > -1) {
                        continue;
                    }
                    switch (c) {
                        case '"':
                            if (!quote) {
                                quote = c;
                            }
                            else if (quote === c) {
                                quote = null;
                            }
                            break;

                        case '(':
                            if (quote) {
                                break;
                            }
                            else if (mode === 0) {
                                mode = 1;
                                block += c;
                                continue;
                            } else {
                                numParen++;
                            }
                            break;

                        case ')':
                            if (quote) {
                                break;
                            }
                            else if (mode === 1) {
                                if (numParen === 0) {
                                    mode = 0;
                                    block += c;
                                    appendResult();
                                    continue;
                                } else {
                                    numParen--;
                                }
                            }
                            break;

                        case ',':
                            if (quote) {
                                break;
                            }
                            else if (mode === 0) {
                                appendResult();
                                continue;
                            }
                            else if (mode === 1) {
                                if (numParen === 0 && !method.match(/^url$/i)) {
                                    args.push(definition);
                                    definition = '';
                                    block += c;
                                    continue;
                                }
                            }
                            break;
                    }

                    block += c;
                    if (mode === 0) {
                        method += c;
                    }
                    else {
                        definition += c;
                    }
                }
                appendResult();

                return results;
            };

            _html2canvas.Util.Bounds = function (element) {
                var clientRect, bounds = {};

                if (element.getBoundingClientRect) {
                    clientRect = element.getBoundingClientRect();

                    // TODO add scroll position to bounds, so no scrolling of window necessary
                    bounds.top = clientRect.top;
                    bounds.bottom = clientRect.bottom || (clientRect.top + clientRect.height);
                    bounds.left = clientRect.left;

                    bounds.width = element.offsetWidth;
                    bounds.height = element.offsetHeight;
                }

                return bounds;
            };

            // TODO ideally, we'd want everything to go through this function instead of Util.Bounds,
            // but would require further work to calculate the correct positions for elements with offsetParents
            _html2canvas.Util.OffsetBounds = function (element) {
                var parent = element.offsetParent ? _html2canvas.Util.OffsetBounds(element.offsetParent) : {
                    top: 0,
                    left: 0
                };

                return {
                    top: element.offsetTop + parent.top,
                    bottom: element.offsetTop + element.offsetHeight + parent.top,
                    left: element.offsetLeft + parent.left,
                    width: element.offsetWidth,
                    height: element.offsetHeight
                };
            };

            function toPX(element, attribute, value) {
                var rsLeft = element.runtimeStyle && element.runtimeStyle[attribute],
                    left,
                    style = element.style;

                // Check if we are not dealing with pixels, (Opera has issues with this)
                // Ported from jQuery css.js
                // From the awesome hack by Dean Edwards
                // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

                // If we're not dealing with a regular pixel number
                // but a number that has a weird ending, we need to convert it to pixels

                if (!/^-?[0-9]+\.?[0-9]*(?:px)?$/i.test(value) && /^-?\d/.test(value)) {
                    // Remember the original values
                    left = style.left;

                    // Put in the new values to get a computed value out
                    if (rsLeft) {
                        element.runtimeStyle.left = element.currentStyle.left;
                    }
                    style.left = attribute === "fontSize" ? "1em" : (value || 0);
                    value = style.pixelLeft + "px";

                    // Revert the changed values
                    style.left = left;
                    if (rsLeft) {
                        element.runtimeStyle.left = rsLeft;
                    }
                }

                if (!/^(thin|medium|thick)$/i.test(value)) {
                    return Math.round(parseFloat(value)) + "px";
                }

                return value;
            }

            function asInt(val) {
                return parseInt(val, 10);
            }

            function parseBackgroundSizePosition(value, element, attribute, index) {
                value = (value || '').split(',');
                value = value[index || 0] || value[0] || 'auto';
                value = _html2canvas.Util.trimText(value).split(' ');

                if (attribute === 'backgroundSize' && (!value[0] || value[0].match(/cover|contain|auto/))) {
                    //these values will be handled in the parent function
                } else {
                    value[0] = (value[0].indexOf("%") === -1) ? toPX(element, attribute + "X", value[0]) : value[0];
                    if (value[1] === undefined) {
                        if (attribute === 'backgroundSize') {
                            value[1] = 'auto';
                            return value;
                        } else {
                            // IE 9 doesn't return double digit always
                            value[1] = value[0];
                        }
                    }
                    value[1] = (value[1].indexOf("%") === -1) ? toPX(element, attribute + "Y", value[1]) : value[1];
                }
                return value;
            }

            _html2canvas.Util.getCSS = function (element, attribute, index) {
                if (previousElement !== element) {
                    computedCSS = document.defaultView.getComputedStyle(element, null);
                }

                var value = computedCSS[attribute];

                if (/^background(Size|Position)$/.test(attribute)) {
                    return parseBackgroundSizePosition(value, element, attribute, index);
                } else if (/border(Top|Bottom)(Left|Right)Radius/.test(attribute)) {
                    var arr = value.split(" ");
                    if (arr.length <= 1) {
                        arr[1] = arr[0];
                    }
                    return arr.map(asInt);
                }

                return value;
            };

            _html2canvas.Util.resizeBounds = function (current_width, current_height, target_width, target_height, stretch_mode) {
                var target_ratio = target_width / target_height,
                    current_ratio = current_width / current_height,
                    output_width, output_height;

                if (!stretch_mode || stretch_mode === 'auto') {
                    output_width = target_width;
                    output_height = target_height;
                } else if (target_ratio < current_ratio ^ stretch_mode === 'contain') {
                    output_height = target_height;
                    output_width = target_height * current_ratio;
                } else {
                    output_width = target_width;
                    output_height = target_width / current_ratio;
                }

                return {
                    width: output_width,
                    height: output_height
                };
            };

            function backgroundBoundsFactory(prop, el, bounds, image, imageIndex, backgroundSize) {
                var bgposition = _html2canvas.Util.getCSS(el, prop, imageIndex),
                    topPos,
                    left,
                    percentage,
                    val;

                if (bgposition.length === 1) {
                    val = bgposition[0];

                    bgposition = [];

                    bgposition[0] = val;
                    bgposition[1] = val;
                }

                if (bgposition[0].toString().indexOf("%") !== -1) {
                    percentage = (parseFloat(bgposition[0]) / 100);
                    left = bounds.width * percentage;
                    if (prop !== 'backgroundSize') {
                        left -= (backgroundSize || image).width * percentage;
                    }
                } else {
                    if (prop === 'backgroundSize') {
                        if (bgposition[0] === 'auto') {
                            left = image.width;
                        } else {
                            if (/contain|cover/.test(bgposition[0])) {
                                var resized = _html2canvas.Util.resizeBounds(image.width, image.height, bounds.width, bounds.height, bgposition[0]);
                                left = resized.width;
                                topPos = resized.height;
                            } else {
                                left = parseInt(bgposition[0], 10);
                            }
                        }
                    } else {
                        left = parseInt(bgposition[0], 10);
                    }
                }


                if (bgposition[1] === 'auto') {
                    topPos = left / image.width * image.height;
                } else if (bgposition[1].toString().indexOf("%") !== -1) {
                    percentage = (parseFloat(bgposition[1]) / 100);
                    topPos = bounds.height * percentage;
                    if (prop !== 'backgroundSize') {
                        topPos -= (backgroundSize || image).height * percentage;
                    }

                } else {
                    topPos = parseInt(bgposition[1], 10);
                }

                return [left, topPos];
            }

            _html2canvas.Util.BackgroundPosition = function (el, bounds, image, imageIndex, backgroundSize) {
                var result = backgroundBoundsFactory('backgroundPosition', el, bounds, image, imageIndex, backgroundSize);
                return {left: result[0], top: result[1]};
            };

            _html2canvas.Util.BackgroundSize = function (el, bounds, image, imageIndex) {
                var result = backgroundBoundsFactory('backgroundSize', el, bounds, image, imageIndex);
                return {width: result[0], height: result[1]};
            };

            _html2canvas.Util.Extend = function (options, defaults) {
                for (var key in options) {
                    if (options.hasOwnProperty(key)) {
                        defaults[key] = options[key];
                    }
                }
                return defaults;
            };


            /*
             * Derived from jQuery.contents()
             * Copyright 2010, John Resig
             * Dual licensed under the MIT or GPL Version 2 licenses.
             * http://jquery.org/license
             */
            _html2canvas.Util.Children = function (elem) {
                var children;
                try {
                    children = (elem.nodeName && elem.nodeName.toUpperCase() === "IFRAME") ? elem.contentDocument || elem.contentWindow.document : (function (array) {
                        var ret = [];
                        if (array !== null) {
                            (function (first, second) {
                                var i = first.length,
                                    j = 0;

                                if (typeof second.length === "number") {
                                    for (var l = second.length; j < l; j++) {
                                        first[i++] = second[j];
                                    }
                                } else {
                                    while (second[j] !== undefined) {
                                        first[i++] = second[j++];
                                    }
                                }

                                first.length = i;

                                return first;
                            })(ret, array);
                        }
                        return ret;
                    })(elem.childNodes);

                } catch (ex) {
                    _html2canvas.Util.log("html2canvas.Util.Children failed with exception: " + ex.message);
                    children = [];
                }
                return children;
            };

            _html2canvas.Util.isTransparent = function (backgroundColor) {
                return (backgroundColor === "transparent" || backgroundColor === "rgba(0, 0, 0, 0)");
            };
            _html2canvas.Util.Font = (function () {

                var fontData = {};

                return function (font, fontSize, doc) {
                    if (fontData[font + "-" + fontSize] !== undefined) {
                        return fontData[font + "-" + fontSize];
                    }

                    var container = doc.createElement('div'),
                        img = doc.createElement('img'),
                        span = doc.createElement('span'),
                        sampleText = 'Hidden Text',
                        baseline,
                        middle,
                        metricsObj;

                    container.style.visibility = "hidden";
                    container.style.fontFamily = font;
                    container.style.fontSize = fontSize;
                    container.style.margin = 0;
                    container.style.padding = 0;

                    doc.body.appendChild(container);

                    // http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever (handtinywhite.gif)
                    img.src = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=";
                    img.width = 1;
                    img.height = 1;

                    img.style.margin = 0;
                    img.style.padding = 0;
                    img.style.verticalAlign = "baseline";

                    span.style.fontFamily = font;
                    span.style.fontSize = fontSize;
                    span.style.margin = 0;
                    span.style.padding = 0;

                    span.appendChild(doc.createTextNode(sampleText));
                    container.appendChild(span);
                    container.appendChild(img);
                    baseline = (img.offsetTop - span.offsetTop) + 1;

                    container.removeChild(span);
                    container.appendChild(doc.createTextNode(sampleText));

                    container.style.lineHeight = "normal";
                    img.style.verticalAlign = "super";

                    middle = (img.offsetTop - container.offsetTop) + 1;
                    metricsObj = {
                        baseline: baseline,
                        lineWidth: 1,
                        middle: middle
                    };

                    fontData[font + "-" + fontSize] = metricsObj;

                    doc.body.removeChild(container);

                    return metricsObj;
                };
            })();

            (function () {
                var Util = _html2canvas.Util,
                    Generate = {};

                _html2canvas.Generate = Generate;

                var reGradients = [
                    /^(-webkit-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
                    /^(-o-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
                    /^(-webkit-gradient)\((linear|radial),\s((?:\d{1,3}%?)\s(?:\d{1,3}%?),\s(?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)\-]+)\)$/,
                    /^(-moz-linear-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)]+)\)$/,
                    /^(-webkit-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/,
                    /^(-moz-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s?([a-z\-]*)([\w\d\.\s,%\(\)]+)\)$/,
                    /^(-o-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/
                ];

                /*
                 * TODO: Add IE10 vendor prefix (-ms) support
                 * TODO: Add W3C gradient (linear-gradient) support
                 * TODO: Add old Webkit -webkit-gradient(radial, ...) support
                 * TODO: Maybe some RegExp optimizations are possible ;o)
                 */
                Generate.parseGradient = function (css, bounds) {
                    var gradient, i, len = reGradients.length, m1, stop, m2, m2Len, step, m3, tl, tr, br, bl;

                    for (i = 0; i < len; i += 1) {
                        m1 = css.match(reGradients[i]);
                        if (m1) {
                            break;
                        }
                    }

                    if (m1) {
                        switch (m1[1]) {
                            case '-webkit-linear-gradient':
                            case '-o-linear-gradient':

                                gradient = {
                                    type: 'linear',
                                    x0: null,
                                    y0: null,
                                    x1: null,
                                    y1: null,
                                    colorStops: []
                                };

                                // get coordinates
                                m2 = m1[2].match(/\w+/g);
                                if (m2) {
                                    m2Len = m2.length;
                                    for (i = 0; i < m2Len; i += 1) {
                                        switch (m2[i]) {
                                            case 'top':
                                                gradient.y0 = 0;
                                                gradient.y1 = bounds.height;
                                                break;

                                            case 'right':
                                                gradient.x0 = bounds.width;
                                                gradient.x1 = 0;
                                                break;

                                            case 'bottom':
                                                gradient.y0 = bounds.height;
                                                gradient.y1 = 0;
                                                break;

                                            case 'left':
                                                gradient.x0 = 0;
                                                gradient.x1 = bounds.width;
                                                break;
                                        }
                                    }
                                }
                                if (gradient.x0 === null && gradient.x1 === null) { // center
                                    gradient.x0 = gradient.x1 = bounds.width / 2;
                                }
                                if (gradient.y0 === null && gradient.y1 === null) { // center
                                    gradient.y0 = gradient.y1 = bounds.height / 2;
                                }

                                // get colors and stops
                                m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
                                if (m2) {
                                    m2Len = m2.length;
                                    step = 1 / Math.max(m2Len - 1, 1);
                                    for (i = 0; i < m2Len; i += 1) {
                                        m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                                        if (m3[2]) {
                                            stop = parseFloat(m3[2]);
                                            if (m3[3] === '%') {
                                                stop /= 100;
                                            } else { // px - stupid opera
                                                stop /= bounds.width;
                                            }
                                        } else {
                                            stop = i * step;
                                        }
                                        gradient.colorStops.push({
                                            color: m3[1],
                                            stop: stop
                                        });
                                    }
                                }
                                break;

                            case '-webkit-gradient':

                                gradient = {
                                    type: m1[2] === 'radial' ? 'circle' : m1[2], // TODO: Add radial gradient support for older mozilla definitions
                                    x0: 0,
                                    y0: 0,
                                    x1: 0,
                                    y1: 0,
                                    colorStops: []
                                };

                                // get coordinates
                                m2 = m1[3].match(/(\d{1,3})%?\s(\d{1,3})%?,\s(\d{1,3})%?\s(\d{1,3})%?/);
                                if (m2) {
                                    gradient.x0 = (m2[1] * bounds.width) / 100;
                                    gradient.y0 = (m2[2] * bounds.height) / 100;
                                    gradient.x1 = (m2[3] * bounds.width) / 100;
                                    gradient.y1 = (m2[4] * bounds.height) / 100;
                                }

                                // get colors and stops
                                m2 = m1[4].match(/((?:from|to|color-stop)\((?:[0-9\.]+,\s)?(?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)\))+/g);
                                if (m2) {
                                    m2Len = m2.length;
                                    for (i = 0; i < m2Len; i += 1) {
                                        m3 = m2[i].match(/(from|to|color-stop)\(([0-9\.]+)?(?:,\s)?((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\)/);
                                        stop = parseFloat(m3[2]);
                                        if (m3[1] === 'from') {
                                            stop = 0.0;
                                        }
                                        if (m3[1] === 'to') {
                                            stop = 1.0;
                                        }
                                        gradient.colorStops.push({
                                            color: m3[3],
                                            stop: stop
                                        });
                                    }
                                }
                                break;

                            case '-moz-linear-gradient':

                                gradient = {
                                    type: 'linear',
                                    x0: 0,
                                    y0: 0,
                                    x1: 0,
                                    y1: 0,
                                    colorStops: []
                                };

                                // get coordinates
                                m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);

                                // m2[1] == 0%   -> left
                                // m2[1] == 50%  -> center
                                // m2[1] == 100% -> right

                                // m2[2] == 0%   -> top
                                // m2[2] == 50%  -> center
                                // m2[2] == 100% -> bottom

                                if (m2) {
                                    gradient.x0 = (m2[1] * bounds.width) / 100;
                                    gradient.y0 = (m2[2] * bounds.height) / 100;
                                    gradient.x1 = bounds.width - gradient.x0;
                                    gradient.y1 = bounds.height - gradient.y0;
                                }

                                // get colors and stops
                                m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}%)?)+/g);
                                if (m2) {
                                    m2Len = m2.length;
                                    step = 1 / Math.max(m2Len - 1, 1);
                                    for (i = 0; i < m2Len; i += 1) {
                                        m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%)?/);
                                        if (m3[2]) {
                                            stop = parseFloat(m3[2]);
                                            if (m3[3]) { // percentage
                                                stop /= 100;
                                            }
                                        } else {
                                            stop = i * step;
                                        }
                                        gradient.colorStops.push({
                                            color: m3[1],
                                            stop: stop
                                        });
                                    }
                                }
                                break;

                            case '-webkit-radial-gradient':
                            case '-moz-radial-gradient':
                            case '-o-radial-gradient':

                                gradient = {
                                    type: 'circle',
                                    x0: 0,
                                    y0: 0,
                                    x1: bounds.width,
                                    y1: bounds.height,
                                    cx: 0,
                                    cy: 0,
                                    rx: 0,
                                    ry: 0,
                                    colorStops: []
                                };

                                // center
                                m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
                                if (m2) {
                                    gradient.cx = (m2[1] * bounds.width) / 100;
                                    gradient.cy = (m2[2] * bounds.height) / 100;
                                }

                                // size
                                m2 = m1[3].match(/\w+/);
                                m3 = m1[4].match(/[a-z\-]*/);
                                if (m2 && m3) {
                                    switch (m3[0]) {
                                        case 'farthest-corner':
                                        case 'cover': // is equivalent to farthest-corner
                                        case '': // mozilla removes "cover" from definition :(
                                            tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
                                            tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                                            br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                                            bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
                                            gradient.rx = gradient.ry = Math.max(tl, tr, br, bl);
                                            break;
                                        case 'closest-corner':
                                            tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
                                            tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                                            br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                                            bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
                                            gradient.rx = gradient.ry = Math.min(tl, tr, br, bl);
                                            break;
                                        case 'farthest-side':
                                            if (m2[0] === 'circle') {
                                                gradient.rx = gradient.ry = Math.max(
                                                    gradient.cx,
                                                    gradient.cy,
                                                    gradient.x1 - gradient.cx,
                                                    gradient.y1 - gradient.cy
                                                );
                                            } else { // ellipse

                                                gradient.type = m2[0];

                                                gradient.rx = Math.max(
                                                    gradient.cx,
                                                    gradient.x1 - gradient.cx
                                                );
                                                gradient.ry = Math.max(
                                                    gradient.cy,
                                                    gradient.y1 - gradient.cy
                                                );
                                            }
                                            break;
                                        case 'closest-side':
                                        case 'contain': // is equivalent to closest-side
                                            if (m2[0] === 'circle') {
                                                gradient.rx = gradient.ry = Math.min(
                                                    gradient.cx,
                                                    gradient.cy,
                                                    gradient.x1 - gradient.cx,
                                                    gradient.y1 - gradient.cy
                                                );
                                            } else { // ellipse

                                                gradient.type = m2[0];

                                                gradient.rx = Math.min(
                                                    gradient.cx,
                                                    gradient.x1 - gradient.cx
                                                );
                                                gradient.ry = Math.min(
                                                    gradient.cy,
                                                    gradient.y1 - gradient.cy
                                                );
                                            }
                                            break;

                                        // TODO: add support for "30px 40px" sizes (webkit only)
                                    }
                                }

                                // color stops
                                m2 = m1[5].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
                                if (m2) {
                                    m2Len = m2.length;
                                    step = 1 / Math.max(m2Len - 1, 1);
                                    for (i = 0; i < m2Len; i += 1) {
                                        m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                                        if (m3[2]) {
                                            stop = parseFloat(m3[2]);
                                            if (m3[3] === '%') {
                                                stop /= 100;
                                            } else { // px - stupid opera
                                                stop /= bounds.width;
                                            }
                                        } else {
                                            stop = i * step;
                                        }
                                        gradient.colorStops.push({
                                            color: m3[1],
                                            stop: stop
                                        });
                                    }
                                }
                                break;
                        }
                    }

                    return gradient;
                };

                function addScrollStops(grad) {
                    return function (colorStop) {
                        try {
                            grad.addColorStop(colorStop.stop, colorStop.color);
                        }
                        catch (e) {
                            Util.log(['failed to add color stop: ', e, '; tried to add: ', colorStop]);
                        }
                    };
                }

                Generate.Gradient = function (src, bounds) {
                    if (bounds.width === 0 || bounds.height === 0) {
                        return;
                    }

                    var canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d'),
                        gradient, grad;

                    canvas.width = bounds.width;
                    canvas.height = bounds.height;

                    // TODO: add support for multi defined background gradients
                    gradient = _html2canvas.Generate.parseGradient(src, bounds);

                    if (gradient) {
                        switch (gradient.type) {
                            case 'linear':
                                grad = ctx.createLinearGradient(gradient.x0, gradient.y0, gradient.x1, gradient.y1);
                                gradient.colorStops.forEach(addScrollStops(grad));
                                ctx.fillStyle = grad;
                                ctx.fillRect(0, 0, bounds.width, bounds.height);
                                break;

                            case 'circle':
                                grad = ctx.createRadialGradient(gradient.cx, gradient.cy, 0, gradient.cx, gradient.cy, gradient.rx);
                                gradient.colorStops.forEach(addScrollStops(grad));
                                ctx.fillStyle = grad;
                                ctx.fillRect(0, 0, bounds.width, bounds.height);
                                break;

                            case 'ellipse':
                                var canvasRadial = document.createElement('canvas'),
                                    ctxRadial = canvasRadial.getContext('2d'),
                                    ri = Math.max(gradient.rx, gradient.ry),
                                    di = ri * 2;

                                canvasRadial.width = canvasRadial.height = di;

                                grad = ctxRadial.createRadialGradient(gradient.rx, gradient.ry, 0, gradient.rx, gradient.ry, ri);
                                gradient.colorStops.forEach(addScrollStops(grad));

                                ctxRadial.fillStyle = grad;
                                ctxRadial.fillRect(0, 0, di, di);

                                ctx.fillStyle = gradient.colorStops[gradient.colorStops.length - 1].color;
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                ctx.drawImage(canvasRadial, gradient.cx - gradient.rx, gradient.cy - gradient.ry, 2 * gradient.rx, 2 * gradient.ry);
                                break;
                        }
                    }

                    return canvas;
                };

                Generate.ListAlpha = function (number) {
                    var tmp = "",
                        modulus;

                    do {
                        modulus = number % 26;
                        tmp = String.fromCharCode((modulus) + 64) + tmp;
                        number = number / 26;
                    } while ((number * 26) > 26);

                    return tmp;
                };

                Generate.ListRoman = function (number) {
                    var romanArray = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"],
                        decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
                        roman = "",
                        v,
                        len = romanArray.length;

                    if (number <= 0 || number >= 4000) {
                        return number;
                    }

                    for (v = 0; v < len; v += 1) {
                        while (number >= decimal[v]) {
                            number -= decimal[v];
                            roman += romanArray[v];
                        }
                    }

                    return roman;
                };
            })();
            function h2cRenderContext(width, height) {
                var storage = [];
                return {
                    storage: storage,
                    width: width,
                    height: height,
                    clip: function () {
                        storage.push({
                            type: "function",
                            name: "clip",
                            'arguments': arguments
                        });
                    },
                    translate: function () {
                        storage.push({
                            type: "function",
                            name: "translate",
                            'arguments': arguments
                        });
                    },
                    fill: function () {
                        storage.push({
                            type: "function",
                            name: "fill",
                            'arguments': arguments
                        });
                    },
                    save: function () {
                        storage.push({
                            type: "function",
                            name: "save",
                            'arguments': arguments
                        });
                    },
                    restore: function () {
                        storage.push({
                            type: "function",
                            name: "restore",
                            'arguments': arguments
                        });
                    },
                    fillRect: function () {
                        storage.push({
                            type: "function",
                            name: "fillRect",
                            'arguments': arguments
                        });
                    },
                    createPattern: function () {
                        storage.push({
                            type: "function",
                            name: "createPattern",
                            'arguments': arguments
                        });
                    },
                    drawShape: function () {

                        var shape = [];

                        storage.push({
                            type: "function",
                            name: "drawShape",
                            'arguments': shape
                        });

                        return {
                            moveTo: function () {
                                shape.push({
                                    name: "moveTo",
                                    'arguments': arguments
                                });
                            },
                            lineTo: function () {
                                shape.push({
                                    name: "lineTo",
                                    'arguments': arguments
                                });
                            },
                            arcTo: function () {
                                shape.push({
                                    name: "arcTo",
                                    'arguments': arguments
                                });
                            },
                            bezierCurveTo: function () {
                                shape.push({
                                    name: "bezierCurveTo",
                                    'arguments': arguments
                                });
                            },
                            quadraticCurveTo: function () {
                                shape.push({
                                    name: "quadraticCurveTo",
                                    'arguments': arguments
                                });
                            }
                        };

                    },
                    drawImage: function () {
                        storage.push({
                            type: "function",
                            name: "drawImage",
                            'arguments': arguments
                        });
                    },
                    fillText: function () {
                        storage.push({
                            type: "function",
                            name: "fillText",
                            'arguments': arguments
                        });
                    },
                    setVariable: function (variable, value) {
                        storage.push({
                            type: "variable",
                            name: variable,
                            'arguments': value
                        });
                        return value;
                    }
                };
            }

            _html2canvas.Parse = function (images, options) {
                window.scroll(0, 0);

                var element = (( options.elements === undefined ) ? document.body : options.elements[0]), // select body by default
                    numDraws = 0,
                    doc = element.ownerDocument,
                    Util = _html2canvas.Util,
                    support = Util.Support(options, doc),
                    ignoreElementsRegExp = new RegExp("(" + options.ignoreElements + ")"),
                    body = doc.body,
                    getCSS = Util.getCSS,
                    pseudoHide = "___html2canvas___pseudoelement",
                    hidePseudoElements = doc.createElement('style');

                hidePseudoElements.innerHTML = '.' + pseudoHide + '-before:before { content: "" !important; display: none !important; }' +
                '.' + pseudoHide + '-after:after { content: "" !important; display: none !important; }';

                body.appendChild(hidePseudoElements);

                images = images || {};

                function documentWidth() {
                    return Math.max(
                        Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
                        Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
                        Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
                    );
                }

                function documentHeight() {
                    return Math.max(
                        Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
                        Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
                        Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
                    );
                }

                function getCSSInt(element, attribute) {
                    var val = parseInt(getCSS(element, attribute), 10);
                    return (isNaN(val)) ? 0 : val; // borders in old IE are throwing 'medium' for demo.html
                }

                function renderRect(ctx, x, y, w, h, bgcolor) {
                    if (bgcolor !== "transparent") {
                        ctx.setVariable("fillStyle", bgcolor);
                        ctx.fillRect(x, y, w, h);
                        numDraws += 1;
                    }
                }

                function capitalize(m, p1, p2) {
                    if (m.length > 0) {
                        return p1 + p2.toUpperCase();
                    }
                }

                function textTransform(text, transform) {
                    switch (transform) {
                        case "lowercase":
                            return text.toLowerCase();
                        case "capitalize":
                            return text.replace(/(^|\s|:|-|\(|\))([a-z])/g, capitalize);
                        case "uppercase":
                            return text.toUpperCase();
                        default:
                            return text;
                    }
                }

                function noLetterSpacing(letter_spacing) {
                    return (/^(normal|none|0px)$/.test(letter_spacing));
                }

                function drawText(currentText, x, y, ctx) {
                    if (currentText !== null && Util.trimText(currentText).length > 0) {
                        ctx.fillText(currentText, x, y);
                        numDraws += 1;
                    }
                }

                function setTextVariables(ctx, el, text_decoration, color) {
                    var align = false,
                        bold = getCSS(el, "fontWeight"),
                        family = getCSS(el, "fontFamily"),
                        size = getCSS(el, "fontSize"),
                        shadows = Util.parseTextShadows(getCSS(el, "textShadow"));

                    switch (parseInt(bold, 10)) {
                        case 401:
                            bold = "bold";
                            break;
                        case 400:
                            bold = "normal";
                            break;
                    }

                    ctx.setVariable("fillStyle", color);
                    ctx.setVariable("font", [getCSS(el, "fontStyle"), getCSS(el, "fontVariant"), bold, size, family].join(" "));
                    ctx.setVariable("textAlign", (align) ? "right" : "left");

                    if (shadows.length) {
                        // TODO: support multiple text shadows
                        // apply the first text shadow
                        ctx.setVariable("shadowColor", shadows[0].color);
                        ctx.setVariable("shadowOffsetX", shadows[0].offsetX);
                        ctx.setVariable("shadowOffsetY", shadows[0].offsetY);
                        ctx.setVariable("shadowBlur", shadows[0].blur);
                    }

                    if (text_decoration !== "none") {
                        return Util.Font(family, size, doc);
                    }
                }

                function renderTextDecoration(ctx, text_decoration, bounds, metrics, color) {
                    switch (text_decoration) {
                        case "underline":
                            // Draws a line at the baseline of the font
                            // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size
                            renderRect(ctx, bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, color);
                            break;
                        case "overline":
                            renderRect(ctx, bounds.left, Math.round(bounds.top), bounds.width, 1, color);
                            break;
                        case "line-through":
                            // TODO try and find exact position for line-through
                            renderRect(ctx, bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, color);
                            break;
                    }
                }

                function getTextBounds(state, text, textDecoration, isLast, transform) {
                    var bounds;
                    if (support.rangeBounds && !transform) {
                        if (textDecoration !== "none" || Util.trimText(text).length !== 0) {
                            bounds = textRangeBounds(text, state.node, state.textOffset);
                        }
                        state.textOffset += text.length;
                    } else if (state.node && typeof state.node.nodeValue === "string") {
                        var newTextNode = (isLast) ? state.node.splitText(text.length) : null;
                        bounds = textWrapperBounds(state.node, transform);
                        state.node = newTextNode;
                    }
                    return bounds;
                }

                function textRangeBounds(text, textNode, textOffset) {
                    var range = doc.createRange();
                    range.setStart(textNode, textOffset);
                    range.setEnd(textNode, textOffset + text.length);
                    return range.getBoundingClientRect();
                }

                function textWrapperBounds(oldTextNode, transform) {
                    var parent = oldTextNode.parentNode,
                        wrapElement = doc.createElement('wrapper'),
                        backupText = oldTextNode.cloneNode(true);

                    wrapElement.appendChild(oldTextNode.cloneNode(true));
                    parent.replaceChild(wrapElement, oldTextNode);

                    var bounds = transform ? Util.OffsetBounds(wrapElement) : Util.Bounds(wrapElement);
                    parent.replaceChild(backupText, wrapElement);
                    return bounds;
                }

                function renderText(el, textNode, stack) {
                    var ctx = stack.ctx,
                        color = getCSS(el, "color"),
                        textDecoration = getCSS(el, "textDecoration"),
                        textAlign = getCSS(el, "textAlign"),
                        metrics,
                        textList,
                        state = {
                            node: textNode,
                            textOffset: 0
                        };

                    if (Util.trimText(textNode.nodeValue).length > 0) {
                        textNode.nodeValue = textTransform(textNode.nodeValue, getCSS(el, "textTransform"));
                        textAlign = textAlign.replace(["-webkit-auto"], ["auto"]);

                        textList = (!options.letterRendering && /^(left|right|justify|auto)$/.test(textAlign) && noLetterSpacing(getCSS(el, "letterSpacing"))) ?
                            textNode.nodeValue.split(/(\b| )/)
                            : textNode.nodeValue.split("");

                        metrics = setTextVariables(ctx, el, textDecoration, color);

                        if (options.chinese) {
                            textList.forEach(function (word, index) {
                                if (/.*[\u4E00-\u9FA5].*$/.test(word)) {
                                    word = word.split("");
                                    word.unshift(index, 1);
                                    textList.splice.apply(textList, word);
                                }
                            });
                        }

                        textList.forEach(function (text, index) {
                            if (text == undefined || text == "undefined") {
                                text = "";
                            }
                            var bounds = getTextBounds(state, text, textDecoration, (index < textList.length - 1), stack.transform.matrix);
                            if (bounds) {
                                drawText(text, bounds.left, bounds.bottom, ctx);
                                renderTextDecoration(ctx, textDecoration, bounds, metrics, color);
                            }
                        });
                    }
                }

                function listPosition(element, val) {
                    var boundElement = doc.createElement("boundelement"),
                        originalType,
                        bounds;

                    boundElement.style.display = "inline";

                    originalType = element.style.listStyleType;
                    element.style.listStyleType = "none";

                    boundElement.appendChild(doc.createTextNode(val));

                    element.insertBefore(boundElement, element.firstChild);

                    bounds = Util.Bounds(boundElement);
                    element.removeChild(boundElement);
                    element.style.listStyleType = originalType;
                    return bounds;
                }

                function elementIndex(el) {
                    var i = -1,
                        count = 1,
                        childs = el.parentNode.childNodes;

                    if (el.parentNode) {
                        while (childs[++i] !== el) {
                            if (childs[i].nodeType === 1) {
                                count++;
                            }
                        }
                        return count;
                    } else {
                        return -1;
                    }
                }

                function listItemText(element, type) {
                    var currentIndex = elementIndex(element), text;
                    switch (type) {
                        case "decimal":
                            text = currentIndex;
                            break;
                        case "decimal-leading-zero":
                            text = (currentIndex.toString().length === 1) ? currentIndex = "0" + currentIndex.toString() : currentIndex.toString();
                            break;
                        case "upper-roman":
                            text = _html2canvas.Generate.ListRoman(currentIndex);
                            break;
                        case "lower-roman":
                            text = _html2canvas.Generate.ListRoman(currentIndex).toLowerCase();
                            break;
                        case "lower-alpha":
                            text = _html2canvas.Generate.ListAlpha(currentIndex).toLowerCase();
                            break;
                        case "upper-alpha":
                            text = _html2canvas.Generate.ListAlpha(currentIndex);
                            break;
                    }

                    return text + ". ";
                }

                function renderListItem(element, stack, elBounds) {
                    var x,
                        text,
                        ctx = stack.ctx,
                        type = getCSS(element, "listStyleType"),
                        listBounds;

                    if (/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(type)) {
                        text = listItemText(element, type);
                        listBounds = listPosition(element, text);
                        setTextVariables(ctx, element, "none", getCSS(element, "color"));

                        if (getCSS(element, "listStylePosition") === "inside") {
                            ctx.setVariable("textAlign", "left");
                            x = elBounds.left;
                        } else {
                            return;
                        }

                        drawText(text, x, listBounds.bottom, ctx);
                    }
                }

                function loadImage(src) {
                    var img = images[src];
                    return (img && img.succeeded === true) ? img.img : false;
                }

                function clipBounds(src, dst) {
                    var x = Math.max(src.left, dst.left),
                        y = Math.max(src.top, dst.top),
                        x2 = Math.min((src.left + src.width), (dst.left + dst.width)),
                        y2 = Math.min((src.top + src.height), (dst.top + dst.height));

                    return {
                        left: x,
                        top: y,
                        width: x2 - x,
                        height: y2 - y
                    };
                }

                function setZ(element, stack, parentStack) {
                    var newContext,
                        isPositioned = stack.cssPosition !== 'static',
                        zIndex = isPositioned ? getCSS(element, 'zIndex') : 'auto',
                        opacity = getCSS(element, 'opacity'),
                        isFloated = getCSS(element, 'cssFloat') !== 'none';

                    // https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context
                    // When a new stacking context should be created:
                    // the root element (HTML),
                    // positioned (absolutely or relatively) with a z-index value other than "auto",
                    // elements with an opacity value less than 1. (See the specification for opacity),
                    // on mobile WebKit and Chrome 22+, position: fixed always creates a new stacking context, even when z-index is "auto" (See this post)

                    stack.zIndex = newContext = h2czContext(zIndex);
                    newContext.isPositioned = isPositioned;
                    newContext.isFloated = isFloated;
                    newContext.opacity = opacity;
                    newContext.ownStacking = (zIndex !== 'auto' || opacity < 1);

                    if (parentStack) {
                        parentStack.zIndex.children.push(stack);
                    }
                }

                function renderImage(ctx, element, image, bounds, borders) {

                    var paddingLeft = getCSSInt(element, 'paddingLeft'),
                        paddingTop = getCSSInt(element, 'paddingTop'),
                        paddingRight = getCSSInt(element, 'paddingRight'),
                        paddingBottom = getCSSInt(element, 'paddingBottom');

                    drawImage(
                        ctx,
                        image,
                        0, //sx
                        0, //sy
                        image.width, //sw
                        image.height, //sh
                        bounds.left + paddingLeft + borders[3].width, //dx
                        bounds.top + paddingTop + borders[0].width, // dy
                        bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight), //dw
                        bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom) //dh
                    );
                }

                function getBorderData(element) {
                    return ["Top", "Right", "Bottom", "Left"].map(function (side) {
                        return {
                            width: getCSSInt(element, 'border' + side + 'Width'),
                            color: getCSS(element, 'border' + side + 'Color')
                        };
                    });
                }

                function getBorderRadiusData(element) {
                    return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function (side) {
                        return getCSS(element, 'border' + side + 'Radius');
                    });
                }

                var getCurvePoints = (function (kappa) {

                    return function (x, y, r1, r2) {
                        var ox = (r1) * kappa, // control point offset horizontal
                            oy = (r2) * kappa, // control point offset vertical
                            xm = x + r1, // x-middle
                            ym = y + r2; // y-middle
                        return {
                            topLeft: bezierCurve({
                                x: x,
                                y: ym
                            }, {
                                x: x,
                                y: ym - oy
                            }, {
                                x: xm - ox,
                                y: y
                            }, {
                                x: xm,
                                y: y
                            }),
                            topRight: bezierCurve({
                                x: x,
                                y: y
                            }, {
                                x: x + ox,
                                y: y
                            }, {
                                x: xm,
                                y: ym - oy
                            }, {
                                x: xm,
                                y: ym
                            }),
                            bottomRight: bezierCurve({
                                x: xm,
                                y: y
                            }, {
                                x: xm,
                                y: y + oy
                            }, {
                                x: x + ox,
                                y: ym
                            }, {
                                x: x,
                                y: ym
                            }),
                            bottomLeft: bezierCurve({
                                x: xm,
                                y: ym
                            }, {
                                x: xm - ox,
                                y: ym
                            }, {
                                x: x,
                                y: y + oy
                            }, {
                                x: x,
                                y: y
                            })
                        };
                    };
                })(4 * ((Math.sqrt(2) - 1) / 3));

                function bezierCurve(start, startControl, endControl, end) {

                    var lerp = function (a, b, t) {
                        return {
                            x: a.x + (b.x - a.x) * t,
                            y: a.y + (b.y - a.y) * t
                        };
                    };

                    return {
                        start: start,
                        startControl: startControl,
                        endControl: endControl,
                        end: end,
                        subdivide: function (t) {
                            var ab = lerp(start, startControl, t),
                                bc = lerp(startControl, endControl, t),
                                cd = lerp(endControl, end, t),
                                abbc = lerp(ab, bc, t),
                                bccd = lerp(bc, cd, t),
                                dest = lerp(abbc, bccd, t);
                            return [bezierCurve(start, ab, abbc, dest), bezierCurve(dest, bccd, cd, end)];
                        },
                        curveTo: function (borderArgs) {
                            borderArgs.push(["bezierCurve", startControl.x, startControl.y, endControl.x, endControl.y, end.x, end.y]);
                        },
                        curveToReversed: function (borderArgs) {
                            borderArgs.push(["bezierCurve", endControl.x, endControl.y, startControl.x, startControl.y, start.x, start.y]);
                        }
                    };
                }

                function parseCorner(borderArgs, radius1, radius2, corner1, corner2, x, y) {
                    if (radius1[0] > 0 || radius1[1] > 0) {
                        borderArgs.push(["line", corner1[0].start.x, corner1[0].start.y]);
                        corner1[0].curveTo(borderArgs);
                        corner1[1].curveTo(borderArgs);
                    } else {
                        borderArgs.push(["line", x, y]);
                    }

                    if (radius2[0] > 0 || radius2[1] > 0) {
                        borderArgs.push(["line", corner2[0].start.x, corner2[0].start.y]);
                    }
                }

                function drawSide(borderData, radius1, radius2, outer1, inner1, outer2, inner2) {
                    var borderArgs = [];

                    if (radius1[0] > 0 || radius1[1] > 0) {
                        borderArgs.push(["line", outer1[1].start.x, outer1[1].start.y]);
                        outer1[1].curveTo(borderArgs);
                    } else {
                        borderArgs.push(["line", borderData.c1[0], borderData.c1[1]]);
                    }

                    if (radius2[0] > 0 || radius2[1] > 0) {
                        borderArgs.push(["line", outer2[0].start.x, outer2[0].start.y]);
                        outer2[0].curveTo(borderArgs);
                        borderArgs.push(["line", inner2[0].end.x, inner2[0].end.y]);
                        inner2[0].curveToReversed(borderArgs);
                    } else {
                        borderArgs.push(["line", borderData.c2[0], borderData.c2[1]]);
                        borderArgs.push(["line", borderData.c3[0], borderData.c3[1]]);
                    }

                    if (radius1[0] > 0 || radius1[1] > 0) {
                        borderArgs.push(["line", inner1[1].end.x, inner1[1].end.y]);
                        inner1[1].curveToReversed(borderArgs);
                    } else {
                        borderArgs.push(["line", borderData.c4[0], borderData.c4[1]]);
                    }

                    return borderArgs;
                }

                function calculateCurvePoints(bounds, borderRadius, borders) {

                    var x = bounds.left,
                        y = bounds.top,
                        width = bounds.width,
                        height = bounds.height,

                        tlh = borderRadius[0][0],
                        tlv = borderRadius[0][1],
                        trh = borderRadius[1][0],
                        trv = borderRadius[1][1],
                        brh = borderRadius[2][0],
                        brv = borderRadius[2][1],
                        blh = borderRadius[3][0],
                        blv = borderRadius[3][1],

                        topWidth = width - trh,
                        rightHeight = height - brv,
                        bottomWidth = width - brh,
                        leftHeight = height - blv;

                    return {
                        topLeftOuter: getCurvePoints(
                            x,
                            y,
                            tlh,
                            tlv
                        ).topLeft.subdivide(0.5),

                        topLeftInner: getCurvePoints(
                            x + borders[3].width,
                            y + borders[0].width,
                            Math.max(0, tlh - borders[3].width),
                            Math.max(0, tlv - borders[0].width)
                        ).topLeft.subdivide(0.5),

                        topRightOuter: getCurvePoints(
                            x + topWidth,
                            y,
                            trh,
                            trv
                        ).topRight.subdivide(0.5),

                        topRightInner: getCurvePoints(
                            x + Math.min(topWidth, width + borders[3].width),
                            y + borders[0].width,
                            (topWidth > width + borders[3].width) ? 0 : trh - borders[3].width,
                            trv - borders[0].width
                        ).topRight.subdivide(0.5),

                        bottomRightOuter: getCurvePoints(
                            x + bottomWidth,
                            y + rightHeight,
                            brh,
                            brv
                        ).bottomRight.subdivide(0.5),

                        bottomRightInner: getCurvePoints(
                            x + Math.min(bottomWidth, width + borders[3].width),
                            y + Math.min(rightHeight, height + borders[0].width),
                            Math.max(0, brh - borders[1].width),
                            Math.max(0, brv - borders[2].width)
                        ).bottomRight.subdivide(0.5),

                        bottomLeftOuter: getCurvePoints(
                            x,
                            y + leftHeight,
                            blh,
                            blv
                        ).bottomLeft.subdivide(0.5),

                        bottomLeftInner: getCurvePoints(
                            x + borders[3].width,
                            y + leftHeight,
                            Math.max(0, blh - borders[3].width),
                            Math.max(0, blv - borders[2].width)
                        ).bottomLeft.subdivide(0.5)
                    };
                }

                function getBorderClip(element, borderPoints, borders, radius, bounds) {
                    var backgroundClip = getCSS(element, 'backgroundClip'),
                        borderArgs = [];

                    switch (backgroundClip) {
                        case "content-box":
                        case "padding-box":
                            parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftInner, borderPoints.topRightInner, bounds.left + borders[3].width, bounds.top + borders[0].width);
                            parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightInner, borderPoints.bottomRightInner, bounds.left + bounds.width - borders[1].width, bounds.top + borders[0].width);
                            parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightInner, borderPoints.bottomLeftInner, bounds.left + bounds.width - borders[1].width, bounds.top + bounds.height - borders[2].width);
                            parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftInner, borderPoints.topLeftInner, bounds.left + borders[3].width, bounds.top + bounds.height - borders[2].width);
                            break;

                        default:
                            parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftOuter, borderPoints.topRightOuter, bounds.left, bounds.top);
                            parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightOuter, borderPoints.bottomRightOuter, bounds.left + bounds.width, bounds.top);
                            parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightOuter, borderPoints.bottomLeftOuter, bounds.left + bounds.width, bounds.top + bounds.height);
                            parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftOuter, borderPoints.topLeftOuter, bounds.left, bounds.top + bounds.height);
                            break;
                    }

                    return borderArgs;
                }

                function parseBorders(element, bounds, borders) {
                    var x = bounds.left,
                        y = bounds.top,
                        width = bounds.width,
                        height = bounds.height,
                        borderSide,
                        bx,
                        by,
                        bw,
                        bh,
                        borderArgs,
                    // http://www.w3.org/TR/css3-background/#the-border-radius
                        borderRadius = getBorderRadiusData(element),
                        borderPoints = calculateCurvePoints(bounds, borderRadius, borders),
                        borderData = {
                            clip: getBorderClip(element, borderPoints, borders, borderRadius, bounds),
                            borders: []
                        };

                    for (borderSide = 0; borderSide < 4; borderSide++) {

                        if (borders[borderSide].width > 0) {
                            bx = x;
                            by = y;
                            bw = width;
                            bh = height - (borders[2].width);

                            switch (borderSide) {
                                case 0:
                                    // top border
                                    bh = borders[0].width;

                                    borderArgs = drawSide({
                                            c1: [bx, by],
                                            c2: [bx + bw, by],
                                            c3: [bx + bw - borders[1].width, by + bh],
                                            c4: [bx + borders[3].width, by + bh]
                                        }, borderRadius[0], borderRadius[1],
                                        borderPoints.topLeftOuter, borderPoints.topLeftInner, borderPoints.topRightOuter, borderPoints.topRightInner);
                                    break;
                                case 1:
                                    // right border
                                    bx = x + width - (borders[1].width);
                                    bw = borders[1].width;

                                    borderArgs = drawSide({
                                            c1: [bx + bw, by],
                                            c2: [bx + bw, by + bh + borders[2].width],
                                            c3: [bx, by + bh],
                                            c4: [bx, by + borders[0].width]
                                        }, borderRadius[1], borderRadius[2],
                                        borderPoints.topRightOuter, borderPoints.topRightInner, borderPoints.bottomRightOuter, borderPoints.bottomRightInner);
                                    break;
                                case 2:
                                    // bottom border
                                    by = (by + height) - (borders[2].width);
                                    bh = borders[2].width;

                                    borderArgs = drawSide({
                                            c1: [bx + bw, by + bh],
                                            c2: [bx, by + bh],
                                            c3: [bx + borders[3].width, by],
                                            c4: [bx + bw - borders[3].width, by]
                                        }, borderRadius[2], borderRadius[3],
                                        borderPoints.bottomRightOuter, borderPoints.bottomRightInner, borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner);
                                    break;
                                case 3:
                                    // left border
                                    bw = borders[3].width;

                                    borderArgs = drawSide({
                                            c1: [bx, by + bh + borders[2].width],
                                            c2: [bx, by],
                                            c3: [bx + bw, by + borders[0].width],
                                            c4: [bx + bw, by + bh]
                                        }, borderRadius[3], borderRadius[0],
                                        borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner, borderPoints.topLeftOuter, borderPoints.topLeftInner);
                                    break;
                            }

                            borderData.borders.push({
                                args: borderArgs,
                                color: borders[borderSide].color
                            });

                        }
                    }

                    return borderData;
                }

                function createShape(ctx, args) {
                    var shape = ctx.drawShape();
                    args.forEach(function (border, index) {
                        shape[(index === 0) ? "moveTo" : border[0] + "To"].apply(null, border.slice(1));
                    });
                    return shape;
                }

                function renderBorders(ctx, borderArgs, color) {
                    if (color !== "transparent") {
                        ctx.setVariable("fillStyle", color);
                        createShape(ctx, borderArgs);
                        ctx.fill();
                        numDraws += 1;
                    }
                }

                function renderFormValue(el, bounds, stack) {

                    var valueWrap = doc.createElement('valuewrap'),
                        cssPropertyArray = ['lineHeight', 'textAlign', 'fontFamily', 'color', 'fontSize', 'paddingLeft', 'paddingTop', 'width', 'height', 'border', 'borderLeftWidth', 'borderTopWidth'],
                        textValue,
                        textNode;

                    cssPropertyArray.forEach(function (property) {
                        try {
                            valueWrap.style[property] = getCSS(el, property);
                        } catch (e) {
                            // Older IE has issues with "border"
                            Util.log("html2canvas: Parse: Exception caught in renderFormValue: " + e.message);
                        }
                    });

                    valueWrap.style.borderColor = "black";
                    valueWrap.style.borderStyle = "solid";
                    valueWrap.style.display = "block";
                    valueWrap.style.position = "absolute";

                    if (/^(submit|reset|button|text|password)$/.test(el.type) || el.nodeName === "SELECT") {
                        valueWrap.style.lineHeight = getCSS(el, "height");
                    }

                    valueWrap.style.top = bounds.top + "px";
                    valueWrap.style.left = bounds.left + "px";

                    textValue = (el.nodeName === "SELECT") ? (el.options[el.selectedIndex] || 0).text : el.value;
                    if (!textValue) {
                        textValue = el.placeholder;
                    }

                    textNode = doc.createTextNode(textValue);

                    valueWrap.appendChild(textNode);
                    body.appendChild(valueWrap);

                    renderText(el, textNode, stack);
                    body.removeChild(valueWrap);
                }

                function drawImage(ctx) {
                    ctx.drawImage.apply(ctx, Array.prototype.slice.call(arguments, 1));
                    numDraws += 1;
                }

                function getPseudoElement(el, which) {
                    var elStyle = window.getComputedStyle(el, which);
                    if (!elStyle || !elStyle.content || elStyle.content === "none" || elStyle.content === "-moz-alt-content" || elStyle.display === "none") {
                        return;
                    }
                    var content = elStyle.content + '',
                        first = content.substr(0, 1);
                    //strips quotes
                    if (first === content.substr(content.length - 1) && first.match(/'|"/)) {
                        content = content.substr(1, content.length - 2);
                    }

                    var isImage = content.substr(0, 3) === 'url',
                        elps = document.createElement(isImage ? 'img' : 'span');

                    elps.className = pseudoHide + "-before " + pseudoHide + "-after";

                    Object.keys(elStyle).filter(indexedProperty).forEach(function (prop) {
                        // Prevent assigning of read only CSS Rules, ex. length, parentRule
                        try {
                            elps.style[prop] = elStyle[prop];
                        } catch (e) {
                            Util.log(['Tried to assign readonly property ', prop, 'Error:', e]);
                        }
                    });

                    if (isImage) {
                        elps.src = Util.parseBackgroundImage(content)[0].args[0];
                    } else {
                        elps.innerHTML = content;
                    }
                    return elps;
                }

                function indexedProperty(property) {
                    return (isNaN(window.parseInt(property, 10)));
                }

                function injectPseudoElements(el, stack) {
                    var before = getPseudoElement(el, ':before'),
                        after = getPseudoElement(el, ':after');
                    if (!before && !after) {
                        return;
                    }

                    if (before) {
                        el.className += " " + pseudoHide + "-before";
                        el.parentNode.insertBefore(before, el);
                        parseElement(before, stack, true);
                        el.parentNode.removeChild(before);
                        el.className = el.className.replace(pseudoHide + "-before", "").trim();
                    }

                    if (after) {
                        el.className += " " + pseudoHide + "-after";
                        el.appendChild(after);
                        parseElement(after, stack, true);
                        el.removeChild(after);
                        el.className = el.className.replace(pseudoHide + "-after", "").trim();
                    }

                }

                function renderBackgroundRepeat(ctx, image, backgroundPosition, bounds) {
                    var offsetX = Math.round(bounds.left + backgroundPosition.left),
                        offsetY = Math.round(bounds.top + backgroundPosition.top);

                    ctx.createPattern(image);
                    ctx.translate(offsetX, offsetY);
                    ctx.fill();
                    ctx.translate(-offsetX, -offsetY);
                }

                function backgroundRepeatShape(ctx, image, backgroundPosition, bounds, left, top, width, height) {
                    var args = [];
                    args.push(["line", Math.round(left), Math.round(top)]);
                    args.push(["line", Math.round(left + width), Math.round(top)]);
                    args.push(["line", Math.round(left + width), Math.round(height + top)]);
                    args.push(["line", Math.round(left), Math.round(height + top)]);
                    createShape(ctx, args);
                    ctx.save();
                    ctx.clip();
                    renderBackgroundRepeat(ctx, image, backgroundPosition, bounds);
                    ctx.restore();
                }

                function renderBackgroundColor(ctx, backgroundBounds, bgcolor) {
                    renderRect(
                        ctx,
                        backgroundBounds.left,
                        backgroundBounds.top,
                        backgroundBounds.width,
                        backgroundBounds.height,
                        bgcolor
                    );
                }

                function renderBackgroundRepeating(el, bounds, ctx, image, imageIndex) {
                    var backgroundSize = Util.BackgroundSize(el, bounds, image, imageIndex),
                        backgroundPosition = Util.BackgroundPosition(el, bounds, image, imageIndex, backgroundSize),
                        backgroundRepeat = getCSS(el, "backgroundRepeat").split(",").map(Util.trimText);

                    image = resizeImage(image, backgroundSize);

                    backgroundRepeat = backgroundRepeat[imageIndex] || backgroundRepeat[0];

                    switch (backgroundRepeat) {
                        case "repeat-x":
                            backgroundRepeatShape(ctx, image, backgroundPosition, bounds,
                                bounds.left, bounds.top + backgroundPosition.top, 99999, image.height);
                            break;

                        case "repeat-y":
                            backgroundRepeatShape(ctx, image, backgroundPosition, bounds,
                                bounds.left + backgroundPosition.left, bounds.top, image.width, 99999);
                            break;

                        case "no-repeat":
                            backgroundRepeatShape(ctx, image, backgroundPosition, bounds,
                                bounds.left + backgroundPosition.left, bounds.top + backgroundPosition.top, image.width, image.height);
                            break;

                        default:
                            renderBackgroundRepeat(ctx, image, backgroundPosition, {
                                top: bounds.top,
                                left: bounds.left,
                                width: image.width,
                                height: image.height
                            });
                            break;
                    }
                }

                function renderBackgroundImage(element, bounds, ctx) {
                    var backgroundImage = getCSS(element, "backgroundImage"),
                        backgroundImages = Util.parseBackgroundImage(backgroundImage),
                        image,
                        imageIndex = backgroundImages.length;

                    while (imageIndex--) {
                        backgroundImage = backgroundImages[imageIndex];

                        if (!backgroundImage.args || backgroundImage.args.length === 0) {
                            continue;
                        }

                        var key = backgroundImage.method === 'url' ?
                            backgroundImage.args[0] :
                            backgroundImage.value;

                        image = loadImage(key);

                        // TODO add support for background-origin
                        if (image) {
                            renderBackgroundRepeating(element, bounds, ctx, image, imageIndex);
                        } else {
                            Util.log("html2canvas: Error loading background:", backgroundImage);
                        }
                    }
                }

                function resizeImage(image, bounds) {
                    if (image.width === bounds.width && image.height === bounds.height) {
                        return image;
                    }

                    var ctx, canvas = doc.createElement('canvas');
                    canvas.width = bounds.width;
                    canvas.height = bounds.height;
                    ctx = canvas.getContext("2d");
                    drawImage(ctx, image, 0, 0, image.width, image.height, 0, 0, bounds.width, bounds.height);
                    return canvas;
                }

                function setOpacity(ctx, element, parentStack) {
                    return ctx.setVariable("globalAlpha", getCSS(element, "opacity") * ((parentStack) ? parentStack.opacity : 1));
                }

                function removePx(str) {
                    return str.replace("px", "");
                }

                var transformRegExp = /(matrix)\((.+)\)/;

                function getTransform(element, parentStack) {
                    var transform = getCSS(element, "transform") || getCSS(element, "-webkit-transform") || getCSS(element, "-moz-transform") || getCSS(element, "-ms-transform") || getCSS(element, "-o-transform");
                    var transformOrigin = getCSS(element, "transform-origin") || getCSS(element, "-webkit-transform-origin") || getCSS(element, "-moz-transform-origin") || getCSS(element, "-ms-transform-origin") || getCSS(element, "-o-transform-origin") || "0px 0px";

                    transformOrigin = transformOrigin.split(" ").map(removePx).map(Util.asFloat);

                    var matrix;
                    if (transform && transform !== "none") {
                        var match = transform.match(transformRegExp);
                        if (match) {
                            switch (match[1]) {
                                case "matrix":
                                    matrix = match[2].split(",").map(Util.trimText).map(Util.asFloat);
                                    break;
                            }
                        }
                    }

                    return {
                        origin: transformOrigin,
                        matrix: matrix
                    };
                }

                function createStack(element, parentStack, bounds, transform) {
                    var ctx = h2cRenderContext((!parentStack) ? documentWidth() : bounds.width, (!parentStack) ? documentHeight() : bounds.height),
                        stack = {
                            ctx: ctx,
                            opacity: setOpacity(ctx, element, parentStack),
                            cssPosition: getCSS(element, "position"),
                            borders: getBorderData(element),
                            transform: transform,
                            clip: (parentStack && parentStack.clip) ? Util.Extend({}, parentStack.clip) : null
                        };

                    setZ(element, stack, parentStack);

                    // TODO correct overflow for absolute content residing under a static position
                    if (options.useOverflow === true && /(hidden|scroll|auto)/.test(getCSS(element, "overflow")) === true && /(BODY)/i.test(element.nodeName) === false) {
                        stack.clip = (stack.clip) ? clipBounds(stack.clip, bounds) : bounds;
                    }

                    return stack;
                }

                function getBackgroundBounds(borders, bounds, clip) {
                    var backgroundBounds = {
                        left: bounds.left + borders[3].width,
                        top: bounds.top + borders[0].width,
                        width: bounds.width - (borders[1].width + borders[3].width),
                        height: bounds.height - (borders[0].width + borders[2].width)
                    };

                    if (clip) {
                        backgroundBounds = clipBounds(backgroundBounds, clip);
                    }

                    return backgroundBounds;
                }

                function getBounds(element, transform) {
                    var bounds = (transform.matrix) ? Util.OffsetBounds(element) : Util.Bounds(element);
                    transform.origin[0] += bounds.left;
                    transform.origin[1] += bounds.top;
                    return bounds;
                }

                function renderElement(element, parentStack, pseudoElement, ignoreBackground) {
                    var transform = getTransform(element, parentStack),
                        bounds = getBounds(element, transform),
                        image,
                        stack = createStack(element, parentStack, bounds, transform),
                        borders = stack.borders,
                        ctx = stack.ctx,
                        backgroundBounds = getBackgroundBounds(borders, bounds, stack.clip),
                        borderData = parseBorders(element, bounds, borders),
                        backgroundColor = (ignoreElementsRegExp.test(element.nodeName)) ? "#efefef" : getCSS(element, "backgroundColor");


                    createShape(ctx, borderData.clip);

                    ctx.save();
                    ctx.clip();

                    if (backgroundBounds.height > 0 && backgroundBounds.width > 0 && !ignoreBackground) {
                        renderBackgroundColor(ctx, bounds, backgroundColor);
                        renderBackgroundImage(element, backgroundBounds, ctx);
                    } else if (ignoreBackground) {
                        stack.backgroundColor = backgroundColor;
                    }

                    ctx.restore();

                    borderData.borders.forEach(function (border) {
                        renderBorders(ctx, border.args, border.color);
                    });

                    if (!pseudoElement) {
                        injectPseudoElements(element, stack);
                    }

                    switch (element.nodeName) {
                        case "IMG":
                            if ((image = loadImage(element.getAttribute('src')))) {
                                renderImage(ctx, element, image, bounds, borders);
                            } else {
                                Util.log("html2canvas: Error loading <img>:" + element.getAttribute('src'));
                            }
                            break;
                        case "INPUT":
                            // TODO add all relevant type's, i.e. HTML5 new stuff
                            // todo add support for placeholder attribute for browsers which support it
                            if (/^(text|url|email|submit|button|reset)$/.test(element.type) && (element.value || element.placeholder || "").length > 0) {
                                renderFormValue(element, bounds, stack);
                            }
                            break;
                        case "TEXTAREA":
                            if ((element.value || element.placeholder || "").length > 0) {
                                renderFormValue(element, bounds, stack);
                            }
                            break;
                        case "SELECT":
                            if ((element.options || element.placeholder || "").length > 0) {
                                renderFormValue(element, bounds, stack);
                            }
                            break;
                        case "LI":
                            renderListItem(element, stack, backgroundBounds);
                            break;
                        case "CANVAS":
                            renderImage(ctx, element, element, bounds, borders);
                            break;
                    }

                    return stack;
                }

                function isElementVisible(element) {
                    return (getCSS(element, 'display') !== "none" && getCSS(element, 'visibility') !== "hidden" && !element.hasAttribute("data-html2canvas-ignore"));
                }

                function parseElement(element, stack, pseudoElement) {
                    if (isElementVisible(element)) {
                        stack = renderElement(element, stack, pseudoElement, false) || stack;
                        if (!ignoreElementsRegExp.test(element.nodeName)) {
                            parseChildren(element, stack, pseudoElement);
                        }
                    }
                }

                function parseChildren(element, stack, pseudoElement) {
                    Util.Children(element).forEach(function (node) {
                        if (node.nodeType === node.ELEMENT_NODE) {
                            parseElement(node, stack, pseudoElement);
                        } else if (node.nodeType === node.TEXT_NODE) {
                            renderText(element, node, stack);
                        }
                    });
                }

                function init() {
                    var background = getCSS(document.documentElement, "backgroundColor"),
                        transparentBackground = (Util.isTransparent(background) && element === document.body),
                        stack = renderElement(element, null, false, transparentBackground);
                    parseChildren(element, stack);

                    if (transparentBackground) {
                        background = stack.backgroundColor;
                    }

                    body.removeChild(hidePseudoElements);
                    return {
                        backgroundColor: background,
                        stack: stack
                    };
                }

                return init();
            };

            function h2czContext(zindex) {
                return {
                    zindex: zindex,
                    children: []
                };
            }

            _html2canvas.Preload = function (options) {

                var images = {
                        numLoaded: 0,   // also failed are counted here
                        numFailed: 0,
                        numTotal: 0,
                        cleanupDone: false
                    },
                    pageOrigin,
                    Util = _html2canvas.Util,
                    methods,
                    i,
                    count = 0,
                    element = options.elements[0] || document.body,
                    doc = element.ownerDocument,
                    domImages = element.getElementsByTagName('img'), // Fetch images of the present element only
                    imgLen = domImages.length,
                    link = doc.createElement("a"),
                    supportCORS = (function (img) {
                        return (img.crossOrigin !== undefined);
                    })(new Image()),
                    timeoutTimer;

                link.href = window.location.href;
                pageOrigin = link.protocol + link.host;

                function isSameOrigin(url) {
                    link.href = url;
                    link.href = link.href; // YES, BELIEVE IT OR NOT, that is required for IE9 - http://jsfiddle.net/niklasvh/2e48b/
                    var origin = link.protocol + link.host;
                    return (origin === pageOrigin);
                }

                function start() {
                    Util.log("html2canvas: start: images: " + images.numLoaded + " / " + images.numTotal + " (failed: " + images.numFailed + ")");
                    if (!images.firstRun && images.numLoaded >= images.numTotal) {
                        Util.log("Finished loading images: # " + images.numTotal + " (failed: " + images.numFailed + ")");

                        if (typeof options.complete === "function") {
                            options.complete(images);
                        }

                    }
                }

                // TODO modify proxy to serve images with CORS enabled, where available
                function proxyGetImage(url, img, imageObj) {
                    var callback_name,
                        scriptUrl = options.proxy,
                        script;

                    link.href = url;
                    url = link.href; // work around for pages with base href="" set - WARNING: this may change the url

                    callback_name = 'html2canvas_' + (count++);
                    imageObj.callbackname = callback_name;

                    if (scriptUrl.indexOf("?") > -1) {
                        scriptUrl += "&";
                    } else {
                        scriptUrl += "?";
                    }
                    scriptUrl += 'url=' + encodeURIComponent(url) + '&callback=' + callback_name;
                    script = doc.createElement("script");

                    window[callback_name] = function (a) {
                        if (a.substring(0, 6) === "error:") {
                            imageObj.succeeded = false;
                            images.numLoaded++;
                            images.numFailed++;
                            start();
                        } else {
                            setImageLoadHandlers(img, imageObj);
                            img.src = a;
                        }
                        window[callback_name] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
                        try {
                            delete window[callback_name];  // for all browser that support this
                        } catch (ex) {
                        }
                        script.parentNode.removeChild(script);
                        script = null;
                        delete imageObj.script;
                        delete imageObj.callbackname;
                    };

                    script.setAttribute("type", "text/javascript");
                    script.setAttribute("src", scriptUrl);
                    imageObj.script = script;
                    window.document.body.appendChild(script);

                }

                function loadPseudoElement(element, type) {
                    var style = window.getComputedStyle(element, type),
                        content = style.content;
                    if (content.substr(0, 3) === 'url') {
                        methods.loadImage(_html2canvas.Util.parseBackgroundImage(content)[0].args[0]);
                    }
                    loadBackgroundImages(style.backgroundImage, element);
                }

                function loadPseudoElementImages(element) {
                    loadPseudoElement(element, ":before");
                    loadPseudoElement(element, ":after");
                }

                function loadGradientImage(backgroundImage, bounds) {
                    var img = _html2canvas.Generate.Gradient(backgroundImage, bounds);

                    if (img !== undefined) {
                        images[backgroundImage] = {
                            img: img,
                            succeeded: true
                        };
                        images.numTotal++;
                        images.numLoaded++;
                        start();
                    }
                }

                function invalidBackgrounds(background_image) {
                    return (background_image && background_image.method && background_image.args && background_image.args.length > 0 );
                }

                function loadBackgroundImages(background_image, el) {
                    var bounds;

                    _html2canvas.Util.parseBackgroundImage(background_image).filter(invalidBackgrounds).forEach(function (background_image) {
                        if (background_image.method === 'url') {
                            methods.loadImage(background_image.args[0]);
                        } else if (background_image.method.match(/\-?gradient$/)) {
                            if (bounds === undefined) {
                                bounds = _html2canvas.Util.Bounds(el);
                            }
                            loadGradientImage(background_image.value, bounds);
                        }
                    });
                }

                function getImages(el) {
                    var elNodeType = false;

                    // Firefox fails with permission denied on pages with iframes
                    try {
                        Util.Children(el).forEach(getImages);
                    }
                    catch (e) {
                    }

                    try {
                        elNodeType = el.nodeType;
                    } catch (ex) {
                        elNodeType = false;
                        Util.log("html2canvas: failed to access some element's nodeType - Exception: " + ex.message);
                    }

                    if (elNodeType === 1 || elNodeType === undefined) {
                        loadPseudoElementImages(el);
                        try {
                            loadBackgroundImages(Util.getCSS(el, 'backgroundImage'), el);
                        } catch (e) {
                            Util.log("html2canvas: failed to get background-image - Exception: " + e.message);
                        }
                        loadBackgroundImages(el);
                    }
                }

                function setImageLoadHandlers(img, imageObj) {
                    img.onload = function () {
                        if (imageObj.timer !== undefined) {
                            // CORS succeeded
                            window.clearTimeout(imageObj.timer);
                        }

                        images.numLoaded++;
                        imageObj.succeeded = true;
                        img.onerror = img.onload = null;
                        start();
                    };
                    img.onerror = function () {
                        if (img.crossOrigin === "anonymous") {
                            // CORS failed
                            window.clearTimeout(imageObj.timer);

                            // let's try with proxy instead
                            if (options.proxy) {
                                var src = img.src;
                                img = new Image();
                                imageObj.img = img;
                                img.src = src;

                                proxyGetImage(img.src, img, imageObj);
                                return;
                            }
                        }

                        images.numLoaded++;
                        images.numFailed++;
                        imageObj.succeeded = false;
                        img.onerror = img.onload = null;
                        start();
                    };
                }

                methods = {
                    loadImage: function (src) {
                        var img, imageObj;
                        if (src && images[src] === undefined) {
                            img = new Image();
                            if (src.match(/data:image\/.*;base64,/i)) {
                                img.src = src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, '');
                                imageObj = images[src] = {
                                    img: img
                                };
                                images.numTotal++;
                                setImageLoadHandlers(img, imageObj);
                            } else if (isSameOrigin(src) || options.allowTaint === true) {
                                imageObj = images[src] = {
                                    img: img
                                };
                                images.numTotal++;
                                setImageLoadHandlers(img, imageObj);
                                img.src = src;
                            } else if (supportCORS && !options.allowTaint && options.useCORS) {
                                // attempt to load with CORS

                                img.crossOrigin = "anonymous";
                                imageObj = images[src] = {
                                    img: img
                                };
                                images.numTotal++;
                                setImageLoadHandlers(img, imageObj);
                                img.src = src;
                            } else if (options.proxy) {
                                imageObj = images[src] = {
                                    img: img
                                };
                                images.numTotal++;
                                proxyGetImage(src, img, imageObj);
                            }
                        }

                    },
                    cleanupDOM: function (cause) {
                        var img, src;
                        if (!images.cleanupDone) {
                            if (cause && typeof cause === "string") {
                                Util.log("html2canvas: Cleanup because: " + cause);
                            } else {
                                Util.log("html2canvas: Cleanup after timeout: " + options.timeout + " ms.");
                            }

                            for (src in images) {
                                if (images.hasOwnProperty(src)) {
                                    img = images[src];
                                    if (typeof img === "object" && img.callbackname && img.succeeded === undefined) {
                                        // cancel proxy image request
                                        window[img.callbackname] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
                                        try {
                                            delete window[img.callbackname];  // for all browser that support this
                                        } catch (ex) {
                                        }
                                        if (img.script && img.script.parentNode) {
                                            img.script.setAttribute("src", "about:blank");  // try to cancel running request
                                            img.script.parentNode.removeChild(img.script);
                                        }
                                        images.numLoaded++;
                                        images.numFailed++;
                                        Util.log("html2canvas: Cleaned up failed img: '" + src + "' Steps: " + images.numLoaded + " / " + images.numTotal);
                                    }
                                }
                            }

                            // cancel any pending requests
                            if (window.stop !== undefined) {
                                window.stop();
                            } else if (document.execCommand !== undefined) {
                                document.execCommand("Stop", false);
                            }
                            if (document.close !== undefined) {
                                document.close();
                            }
                            images.cleanupDone = true;
                            if (!(cause && typeof cause === "string")) {
                                start();
                            }
                        }
                    },

                    renderingDone: function () {
                        if (timeoutTimer) {
                            window.clearTimeout(timeoutTimer);
                        }
                    }
                };

                if (options.timeout > 0) {
                    timeoutTimer = window.setTimeout(methods.cleanupDOM, options.timeout);
                }

                Util.log('html2canvas: Preload starts: finding background-images');
                images.firstRun = true;

                getImages(element);

                Util.log('html2canvas: Preload: Finding images');
                // load <img> images
                for (i = 0; i < imgLen; i += 1) {
                    methods.loadImage(domImages[i].getAttribute("src"));
                }

                images.firstRun = false;
                Util.log('html2canvas: Preload: Done.');
                if (images.numTotal === images.numLoaded) {
                    start();
                }

                return methods;
            };

            _html2canvas.Renderer = function (parseQueue, options) {

                // http://www.w3.org/TR/CSS21/zindex.html
                function createRenderQueue(parseQueue) {
                    var queue = [],
                        rootContext;

                    rootContext = (function buildStackingContext(rootNode) {
                        var rootContext = {};

                        function insert(context, node, specialParent) {
                            var zi = (node.zIndex.zindex === 'auto') ? 0 : Number(node.zIndex.zindex),
                                contextForChildren = context, // the stacking context for children
                                isPositioned = node.zIndex.isPositioned,
                                isFloated = node.zIndex.isFloated,
                                stub = {node: node},
                                childrenDest = specialParent; // where children without z-index should be pushed into

                            if (node.zIndex.ownStacking) {
                                // '!' comes before numbers in sorted array
                                contextForChildren = stub.context = {'!': [{node: node, children: []}]};
                                childrenDest = undefined;
                            } else if (isPositioned || isFloated) {
                                childrenDest = stub.children = [];
                            }

                            if (zi === 0 && specialParent) {
                                specialParent.push(stub);
                            } else {
                                if (!context[zi]) {
                                    context[zi] = [];
                                }
                                context[zi].push(stub);
                            }

                            node.zIndex.children.forEach(function (childNode) {
                                insert(contextForChildren, childNode, childrenDest);
                            });
                        }

                        insert(rootContext, rootNode);
                        return rootContext;
                    })(parseQueue);

                    function sortZ(context) {
                        Object.keys(context).sort().forEach(function (zi) {
                            var nonPositioned = [],
                                floated = [],
                                positioned = [],
                                list = [];

                            // positioned after static
                            context[zi].forEach(function (v) {
                                if (v.node.zIndex.isPositioned || v.node.zIndex.opacity < 1) {
                                    // http://www.w3.org/TR/css3-color/#transparency
                                    // non-positioned element with opactiy < 1 should be stacked as if it were a positioned element with ‘z-index: 0’ and ‘opacity: 1’.
                                    positioned.push(v);
                                } else if (v.node.zIndex.isFloated) {
                                    floated.push(v);
                                } else {
                                    nonPositioned.push(v);
                                }
                            });

                            (function walk(arr) {
                                arr.forEach(function (v) {
                                    list.push(v);
                                    if (v.children) {
                                        walk(v.children);
                                    }
                                });
                            })(nonPositioned.concat(floated, positioned));

                            list.forEach(function (v) {
                                if (v.context) {
                                    sortZ(v.context);
                                } else {
                                    queue.push(v.node);
                                }
                            });
                        });
                    }

                    sortZ(rootContext);

                    return queue;
                }

                function getRenderer(rendererName) {
                    var renderer;

                    if (typeof options.renderer === "string" && _html2canvas.Renderer[rendererName] !== undefined) {
                        renderer = _html2canvas.Renderer[rendererName](options);
                    } else if (typeof rendererName === "function") {
                        renderer = rendererName(options);
                    } else {
                        throw new Error("Unknown renderer");
                    }

                    if (typeof renderer !== "function") {
                        throw new Error("Invalid renderer defined");
                    }
                    return renderer;
                }

                return getRenderer(options.renderer)(parseQueue, options, document, createRenderQueue(parseQueue.stack), _html2canvas);
            };

            _html2canvas.Util.Support = function (options, doc) {

                function supportSVGRendering() {
                    var img = new Image(),
                        canvas = doc.createElement("canvas"),
                        ctx = (canvas.getContext === undefined) ? false : canvas.getContext("2d");
                    if (ctx === false) {
                        return false;
                    }
                    canvas.width = canvas.height = 10;
                    img.src = [
                        "data:image/svg+xml,",
                        "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>",
                        "<foreignObject width='10' height='10'>",
                        "<div xmlns='http://www.w3.org/1999/xhtml' style='width:10;height:10;'>",
                        "sup",
                        "</div>",
                        "</foreignObject>",
                        "</svg>"
                    ].join("");
                    try {
                        ctx.drawImage(img, 0, 0);
                        canvas.toDataURL();
                    } catch (e) {
                        return false;
                    }
                    _html2canvas.Util.log('html2canvas: Parse: SVG powered rendering available');
                    return true;
                }

                // Test whether we can use ranges to measure bounding boxes
                // Opera doesn't provide valid bounds.height/bottom even though it supports the method.

                function supportRangeBounds() {
                    var r, testElement, rangeBounds, rangeHeight, support = false;

                    if (doc.createRange) {
                        r = doc.createRange();
                        if (r.getBoundingClientRect) {
                            testElement = doc.createElement('boundtest');
                            testElement.style.height = "123px";
                            testElement.style.display = "block";
                            doc.body.appendChild(testElement);

                            r.selectNode(testElement);
                            rangeBounds = r.getBoundingClientRect();
                            rangeHeight = rangeBounds.height;

                            if (rangeHeight === 123) {
                                support = true;
                            }
                            doc.body.removeChild(testElement);
                        }
                    }

                    return support;
                }

                return {
                    rangeBounds: supportRangeBounds(),
                    svgRendering: options.svgRendering && supportSVGRendering()
                };
            };
            window.html2canvas = function (elements, opts) {
                elements = (elements.length) ? elements : [elements];
                var queue,
                    canvas,
                    options = {
                        // general
                        logging: false,
                        elements: elements,
                        background: "#fff",

                        // preload options
                        proxy: null,
                        timeout: 0,    // no timeout
                        useCORS: false, // try to load images as CORS (where available), before falling back to proxy
                        allowTaint: false, // whether to allow images to taint the canvas, won't need proxy if set to true

                        // parse options
                        svgRendering: false, // use svg powered rendering where available (FF11+)
                        ignoreElements: "IFRAME|OBJECT|PARAM",
                        useOverflow: true,
                        letterRendering: false,
                        chinese: false,

                        // render options

                        width: null,
                        height: null,
                        taintTest: true, // do a taint test with all images before applying to canvas
                        renderer: "Canvas"
                    };

                options = _html2canvas.Util.Extend(opts, options);

                _html2canvas.logging = options.logging;
                options.complete = function (images) {

                    if (typeof options.onpreloaded === "function") {
                        if (options.onpreloaded(images) === false) {
                            return;
                        }
                    }
                    queue = _html2canvas.Parse(images, options);

                    if (typeof options.onparsed === "function") {
                        if (options.onparsed(queue) === false) {
                            return;
                        }
                    }

                    canvas = _html2canvas.Renderer(queue, options);

                    if (typeof options.onrendered === "function") {
                        options.onrendered(canvas);
                    }


                };

                // for pages without images, we still want this to be async, i.e. return methods before executing
                window.setTimeout(function () {
                    _html2canvas.Preload(options);
                }, 0);

                return {
                    render: function (queue, opts) {
                        return _html2canvas.Renderer(queue, _html2canvas.Util.Extend(opts, options));
                    },
                    parse: function (images, opts) {
                        return _html2canvas.Parse(images, _html2canvas.Util.Extend(opts, options));
                    },
                    preload: function (opts) {
                        return _html2canvas.Preload(_html2canvas.Util.Extend(opts, options));
                    },
                    log: _html2canvas.Util.log
                };
            };

            window.html2canvas.log = _html2canvas.Util.log; // for renderers
            window.html2canvas.Renderer = {
                Canvas: undefined // We are assuming this will be used
            };
            _html2canvas.Renderer.Canvas = function (options) {
                options = options || {};

                var doc = document,
                    safeImages = [],
                    testCanvas = document.createElement("canvas"),
                    testctx = testCanvas.getContext("2d"),
                    Util = _html2canvas.Util,
                    canvas = options.canvas || doc.createElement('canvas');

                function createShape(ctx, args) {
                    ctx.beginPath();
                    args.forEach(function (arg) {
                        ctx[arg.name].apply(ctx, arg['arguments']);
                    });
                    ctx.closePath();
                }

                function safeImage(item) {
                    if (safeImages.indexOf(item['arguments'][0].src) === -1) {
                        testctx.drawImage(item['arguments'][0], 0, 0);
                        try {
                            testctx.getImageData(0, 0, 1, 1);
                        } catch (e) {
                            testCanvas = doc.createElement("canvas");
                            testctx = testCanvas.getContext("2d");
                            return false;
                        }
                        safeImages.push(item['arguments'][0].src);
                    }
                    return true;
                }

                function renderItem(ctx, item) {
                    switch (item.type) {
                        case "variable":
                            ctx[item.name] = item['arguments'];
                            break;
                        case "function":
                            switch (item.name) {
                                case "createPattern":
                                    if (item['arguments'][0].width > 0 && item['arguments'][0].height > 0) {
                                        try {
                                            ctx.fillStyle = ctx.createPattern(item['arguments'][0], "repeat");
                                        }
                                        catch (e) {
                                            Util.log("html2canvas: Renderer: Error creating pattern", e.message);
                                        }
                                    }
                                    break;
                                case "drawShape":
                                    createShape(ctx, item['arguments']);
                                    break;
                                case "drawImage":
                                    if (item['arguments'][8] > 0 && item['arguments'][7] > 0) {
                                        if (!options.taintTest || (options.taintTest && safeImage(item))) {
                                            ctx.drawImage.apply(ctx, item['arguments']);
                                        }
                                    }
                                    break;
                                default:
                                    ctx[item.name].apply(ctx, item['arguments']);
                            }
                            break;
                    }
                }

                return function (parsedData, options, document, queue, _html2canvas) {
                    var ctx = canvas.getContext("2d"),
                        newCanvas,
                        bounds,
                        fstyle,
                        zStack = parsedData.stack;

                    canvas.width = canvas.style.width = options.width || zStack.ctx.width;
                    canvas.height = canvas.style.height = options.height || zStack.ctx.height;

                    fstyle = ctx.fillStyle;
                    ctx.fillStyle = (Util.isTransparent(zStack.backgroundColor) && options.background !== undefined) ? options.background : parsedData.backgroundColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = fstyle;

                    queue.forEach(function (storageContext) {
                        // set common settings for canvas
                        ctx.textBaseline = "bottom";
                        ctx.save();

                        if (storageContext.transform.matrix) {
                            ctx.translate(storageContext.transform.origin[0], storageContext.transform.origin[1]);
                            ctx.transform.apply(ctx, storageContext.transform.matrix);
                            ctx.translate(-storageContext.transform.origin[0], -storageContext.transform.origin[1]);
                        }

                        if (storageContext.clip) {
                            ctx.beginPath();
                            ctx.rect(storageContext.clip.left, storageContext.clip.top, storageContext.clip.width, storageContext.clip.height);
                            ctx.clip();
                        }

                        if (storageContext.ctx.storage) {
                            storageContext.ctx.storage.forEach(function (item) {
                                renderItem(ctx, item);
                            });
                        }

                        ctx.restore();
                    });

                    Util.log("html2canvas: Renderer: Canvas renderer done - returning canvas obj");

                    if (options.elements.length === 1) {
                        if (typeof options.elements[0] === "object" && options.elements[0].nodeName !== "BODY") {
                            // crop image to the bounds of selected (single) element
                            bounds = _html2canvas.Util.Bounds(options.elements[0]);
                            newCanvas = document.createElement('canvas');
                            newCanvas.width = Math.ceil(bounds.width);
                            newCanvas.height = Math.ceil(bounds.height);
                            ctx = newCanvas.getContext("2d");

                            ctx.drawImage(canvas, bounds.left, bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);
                            canvas = null;
                            return newCanvas;
                        }
                    }

                    return canvas;
                };
            };
        })(window,document);
        // var get_pic = function () {
        //     html2canvas(document.body, {
        //         proxy: bds.qa.ShortCut.base_url_path + "/getProxyImage.php",
        //         //proxy: "http://cq01-qa-bu-qa00.cq01.baidu.com:8663/getProxyImage.php",
        //         //allowTaint: true,
        //         //useCORS: false,
        //         //letterRendering:true,

        //         onrendered: function (canvas) {
        //             canvas.id = "fb_right_dialog_pagecanvas2";
        //             canvas.style.top = 0;
        //             canvas.style.left = 0;
        //             canvas.style.position = "absolute";
        //             document.body.appendChild(canvas);
        //             bds.qa.ShortCut.img_data = canvas.toDataURL("image/png");
        //             // var image = new Image();
        //             // var image = document.createElement('img');
        //             // image.src = canvas.toDataURL("image/png");
        //             // document.body.appendChild(image);
        //             // console.log(image);
        //             // return image;
        //         }
        //     });
        // };
        // get_pic()
        bds.qa.ShortCut.get_pic();
    },
    // 获取页面截图数据
    get_pic:function () {
        html2canvas(document.body, {
            proxy: bds.qa.ShortCut.base_url_path + "/getProxyImage.php",
            //proxy: "http://cq01-qa-bu-qa00.cq01.baidu.com:8663/getProxyImage.php",
            //allowTaint: true,
            //useCORS: false,
            //letterRendering:true,

            onrendered: function (canvas) {
                bds.qa.ShortCut.fbJQ("#fb_right_dialog_pagecanvas2").remove();
                canvas.id = "fb_right_dialog_pagecanvas2";
                canvas.style.top = 0;
                canvas.style.left = 0;
                // canvas.style['z-index'] = -1;
                // canvas.style.opacity = 0;
                canvas.style.position = "absolute";
                document.body.appendChild(canvas);
                // var canvas = document.getElementById("fb_right_dialog_canvas");
                bds.qa.ShortCut.img_data = canvas.toDataURL("image/png");
            }
        });
    }, 

    //区域截图的加载和画笔
    init_img_render:function(){
        bds.qa.ShortCut.send_img = true;

        var init_render = function () {
            var paint ={
                init: function () {
                    var has_render_canvas = function () {
                        var fb_right_dialog_canvas = document.getElementById("fb_right_dialog_canvas");
                        if (fb_right_dialog_canvas) {
                            bds.qa.ShortCut.fbJQ(fb_right_dialog_canvas).remove();
                        }
                        bds.qa.ShortCut.fbJQ("#fb_baidu_wizard").remove();

                        var cv = document.createElement("canvas");
                        //cv.width = bds.qa.ShortCut._getClientWidth();
                        var max_height = Math.max(
                            Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
                            Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
                            Math.max(document.body.clientHeight, document.documentElement.clientHeight)
                        );
                        var max_width = Math.max(
                            Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                            Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),
                            Math.max(document.body.clientWidth, document.documentElement.clientWidth)
                        );
                        cv.width  = max_width;
                        cv.height = max_height;
                        //cv.height = document.body.scrollHeight > window.screen.availHeight ? document.body.scrollHeight : window.screen.availHeight;
                        cv.style.top = 0;
                        cv.style.left = 0;
                        cv.style.position = "absolute";
                        cv.style.zIndex = "999989";
                        cv.id = "fb_right_dialog_canvas";
                        document.body.appendChild(cv);

                        paint.load();
                        paint.bind();

                        bds.qa.ShortCut.fbJQ("#fb_right_dialog_canvas").css("cursor", 'crosshair');
                    };
                    has_render_canvas();
                },
                load: function () {
                    this.x = [];
                    this.y = [];
                    this.clickDrag = [];
                    this.Rectangles = [];
                    this.rectangleNo = "";         //没有需要渲染的框框
                    this.lock = false;         //lock 表示锁住屏幕，进行画图操作，为true则可以进行显示操作
                    this.hasCover = false;     //是否拥有遮盖层效果

                    this.canvas = document.getElementById("fb_right_dialog_canvas");
//                    this.pageCanvas = document.getElementById("fb_right_dialog_pagecanvas") || document.getElementById("fb_right_dialog_pagecanvas2");
                    this.cxt = this.canvas.getContext('2d');
                    this.cxt.fillStyle = "rgba(85,85,85,0.5)";
                    this.cxt.fillRect(0, 0, document.body.clientWidth, document.body.scrollHeight > window.screen.availHeight ? document.body.scrollHeight : window.screen.availHeight);
                    this.cxt.globalCompositeOperation = "destination-out";
//                    this.w = this.pageCanvas.width;
//                    this.h = this.pageCanvas.height;
                    this.StartEvent = "mousedown";
                    this.MoveEvent = "mousemove";
                    this.EndEvent = "mouseup";
                },
                bind: function () {
                    var t = this;

                    var clear_all_jietu = function () {
                        bds.qa.ShortCut.fbJQ("#fb_right_dialog_canvas").remove();
                        bds.qa.ShortCut.fbJQ("#fb_right_dialog_pagecanvas").remove();
                        bds.qa.ShortCut.fbJQ("#fb_right_dialog_pagecanvas2").remove();
                        bds.qa.ShortCut.fbJQ(".fb_cancel_flag").remove();
                        bds.qa.ShortCut.fbJQ('#fb_jietu')[0].disabled = false;
                    };

                    bds.qa.ShortCut.fbJQ("#fb_right_canvas_save").click(function () {
                        if (bds.qa.ShortCut.send_img == true) {
                            var des_info = bds.qa.ShortCut.fbJQ("#fb_des_content").val();
                            var email = bds.qa.ShortCut.fbJQ("#feedback_email").val();
                            if (email == bds.qa.ShortCut.emailPlaceholder) {
                                email = "";
                            }
                            if (des_info == '' || des_info == bds.qa.ShortCut.issuePlaceholder) {
                                bds.qa.ShortCut.popwindow(bds.qa.ShortCut.contentRequiredTips, 200);
                                return false;
                            }
                            // 联系方式必填提示
                            if (email == '' && bds.qa.ShortCut.requiredEmail) {
                                bds.qa.ShortCut.popwindow(bds.qa.ShortCut.emailRequiredTips, 200);
                                return false;
                            }
                            bds.qa.ShortCut.sendCanvasData();
                        }
                    });

                    this.canvas['on' + t.StartEvent] = function (e) {
                        if (e.which === 3 && bds.qa.ShortCut.defaultCut) {
                            bds.qa.ShortCut.get_Snapshot();
                            var clear_timeout_status = "";
                            var check_snap = function () {
                                var has_snap = document.getElementById("fb_right_dialog_pagecanvas2");
                                if (!has_snap) {
                                    clear_timeout_status = setTimeout(check_snap, 1000);
                                } else {
                                    createImgView();
                                    window.clearTimeout(clear_timeout_status);
                                }
                            };
                            var createImgView = function () {
                                bds.qa.ShortCut.fbJQ('#fb_cut_img').remove();
                                var image = document.createElement('img');
                                image.id = 'fb_cut_img';
                                image.src = bds.qa.ShortCut.img_data;
                                image.style.top = "5%";
                                image.style.left = "5%";
                                image.style.width = "90%";
                                image.style.height = "90%";
                                image.style.position = "absolute";
                                image.style.zIndex = "999990";
                                document.body.appendChild(image);
                                bds.qa.ShortCut.fbJQ('#fb_cut_img').click(function(){
                                    bds.qa.ShortCut.fbJQ('#fb_cut_img').remove();
                                });
                                bds.qa.ShortCut.fbJQ('#fb_right_dialog_canvas').remove();
                                bds.qa.ShortCut.send_img = false;
                            };
                            check_snap();
                        }
                        else {
                            var touch = t.touch ? e.touches[0] : e;
                            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                            t.movePoint(touch.clientX - touch.target.offsetLeft, touch.clientY - touch.target.offsetTop + scrollTop);

                            //防止有模板层继续画的情况
                            if (t.hasCover) {
                                var rec_id = "#" + "fb_cancel_" + t.rectangleNo;
                                bds.qa.ShortCut.fbJQ(rec_id).remove();
                            }

                            t.lock = true;
                        }
                    };

                    this.canvas['on' + t.MoveEvent] = function (e) {
                        e = e ? e : window.event;
                        var touch = t.touch ? e.touches[0] : e;
                        var _x = touch.clientX - touch.target.offsetLeft;
                        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                        var _y = touch.clientY - touch.target.offsetTop + scrollTop;
                        if (t.lock) {  //进行canvas截图时间
                            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").hide();
                            t.movePoint(_x, _y, true);
                            t.drawRectangle();
                        } else {                                               //进行截图的鼠标经过展示
                            t.showRectangle(_x,_y,t);
                        }
                    };
                    this.canvas['on' + t.EndEvent] = function (e) {
                        // 获取展现小块的位置
                        bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").show();
                        t.lock = false;
                        t.Rectangles.push([t.x[0], t.y[0], t.x[t.x.length - 1] - t.x[0], t.y[t.y.length - 1] - t.y[0]]);
                        t.x = [];
                        t.y = [];
                        t.clickDrag = [];
                        t.drawRectangle();
                    };
                },

                //创建删除图标
                createCancel:function(ret_top ,ret_right,t){
                    var ret_cancel = document.createElement("div");
                    ret_cancel.id = "fb_cancel_"+ t.rectangleNo;
                    ret_cancel.className = "fb_cancel_flag";
                    //ret_cancel.style.background = "url("+bds.qa.ShortCut.base_url_path+"/Public/feedback/img/cancel.png)";
                    ret_cancel.style.top = parseInt(ret_top - 8) + "px";
                    ret_cancel.style.left = parseInt(ret_right - 8) + "px";        // canvas 绝对高度+ 鼠标点击相对高度 +框框宽度—8像素的宽度
                    //ret_cancel.style.width = "16px";
                    //ret_cancel.style.height = "16px";
                    //ret_cancel.style.position = "absolute";
                    //ret_cancel.style.zIndex = "999989";
                    //ret_cancel.style.cursor = "pointer";
                    bds.qa.ShortCut.fbJQ("body").append(ret_cancel);

                    bds.qa.ShortCut.fbJQ("#fb_cancel_"+t.rectangleNo).click(function(){
                        t.Rectangles[t.rectangleNo] = 0;
                        bds.qa.ShortCut.fbJQ("#fb_cancel_"+t.rectangleNo).remove();
                        t.hasCover = false;                                   //没有涂层
                        t.drawRectangle();
                    });
                },

                movePoint: function (x, y, dragging) {
                    this.x.push(x);
                    this.y.push(y);
                    this.clickDrag.push(y);
                },

                //鼠标经过展示图框函数
                showRectangle:function(_x, _y,t){
                    for(i = 0;i<this.Rectangles.length;i++){
                        //定位
                        var rectangle = t.hasCover?this.Rectangles[t.rectangleNo]:this.Rectangles[i];  //获取矩形
                        var top = rectangle[3] > 0 ? rectangle[1] : (rectangle[1] + rectangle[3]);         //顶部的距离
                        var bottom = rectangle[3] > 0 ? (rectangle[1] + rectangle[3]) : rectangle[1];      //底部高度
                        var left = rectangle[2] > 0 ? rectangle[0] : (rectangle[0] + rectangle[2]);        //左侧
                        var right = rectangle[2] > 0 ? (rectangle[0] + rectangle[2]) : rectangle[0];       //右侧

                        if (t.hasCover) {                //有渲染层的情况
                            var isOutRectangle = left > _x || _x >right || top > _y || _y > bottom;
                            if (isOutRectangle) {
                                //回复颜色
                                this.cxt.globalAlpha = 1;
                                this.cxt.globalCompositeOperation = "source-over";
                                this.cxt.strokeStyle = "#FF7F7D";
                                this.cxt.lineWidth = '5';
                                this.cxt.strokeRect(rectangle[0], rectangle[1], rectangle[2], rectangle[3]);

                                this.cxt.globalCompositeOperation = "destination-out";
                                this.cxt.fillStyle = "rgba(255,255,255,1)";
                                this.cxt.fillRect(rectangle[0], rectangle[1], rectangle[2], rectangle[3]);
                                t.hasCover = false;

                                //清除删除标记
                                var rec_id = "#" + "fb_cancel_" + t.rectangleNo;
                                bds.qa.ShortCut.fbJQ(rec_id).remove();
                            }
                        }else{                           //取消已经渲染的
                            var isInRectangle = left < _x && _x < right && top < _y && _y < bottom;
                            if (isInRectangle) {
                                //添加颜色
//                                this.cxt.clearRect(rectangle[0], rectangle[1], rectangle[2], rectangle[3]);
                                this.cxt.globalCompositeOperation = "source-over";
                                this.cxt.strokeStyle = "#FF7F7D";
                                this.cxt.lineWidth = '5';
                                this.cxt.strokeRect(rectangle[0], rectangle[1], rectangle[2], rectangle[3]);

                                this.cxt.globalCompositeOperation = "destination-out";
                                this.cxt.fillStyle = "rgba(255,255,255,1)";
                                this.cxt.fillRect(rectangle[0], rectangle[1], rectangle[2], rectangle[3]);
                                t.hasCover = true;
                                t.rectangleNo = i;

                                //添加标记
                                t.createCancel(top, right,t);
                                break;
                            }
                        }
                    }
                },

                //绘制图框函数
                drawRectangle: function () {
                    var width = this.x[this.x.length - 1] - this.x[0];
                    var height = this.y[this.y.length - 1] - this.y[0];
                    this.clear();
                    this.drawBackground();
                    var i = this.Rectangles.length;
                    this.cxt.globalAlpha = 1;
                    if (i) {
                        for (i = i - 1; i >= 0; i--) {
                            var rectangle = this.Rectangles[i];
                            var r_x = rectangle[0];
                            var r_y = rectangle[1];
                            var r_width = rectangle[2];
                            var r_height = rectangle[3];

                            this.cxt.globalCompositeOperation = "source-over";
                            this.cxt.strokeStyle = "#FF7F7D";
                            this.cxt.lineWidth = '5';
                            this.cxt.strokeRect(r_x, r_y, r_width, r_height);

                            this.cxt.globalCompositeOperation = "destination-out";
                            this.cxt.fillStyle = "rgba(255,255,255,1)";
                            this.cxt.fillRect(r_x, r_y, r_width, r_height);
                        }
                    }
                    this.cxt.globalCompositeOperation = "source-over";
                    this.cxt.strokeStyle = "#FF7F7D";
                    this.cxt.lineWidth = '5';
                    this.cxt.strokeRect(this.x[0], this.y[0], width, height);

                    this.cxt.globalCompositeOperation = "destination-out";
                    this.cxt.fillStyle = "rgba(255,255,255,1)";
                    this.cxt.fillRect(this.x[0], this.y[0], width, height);
                },

                clear: function () {
                    this.cxt.clearRect(0, 0, this.w, this.h);
                },

                removeNode: function (node) {
                    if (node && node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                },

                drawBackground:function(){
                    this.cxt.globalCompositeOperation = "copy";
                    this.cxt.fillStyle = "rgba(85,85,85,0.5)";
                    this.cxt.fillRect(0, 0, document.body.clientWidth, document.body.scrollHeight > window.screen.availHeight ? document.body.scrollHeight : window.screen.availHeight);
                    this.cxt.globalCompositeOperation = "destination-out";
                }
            };

            paint.init();
        };
        init_render();
    },

    _getNecData:function(){
        var email = bds.qa.ShortCut.fbJQ("#feedback_email").val();
        if (email == bds.qa.ShortCut.emailPlaceholder) {
            email = "";
        }

        var nec_data = {
            "appid":bds.qa.ShortCut.appid,
            "extend_ua":navigator.userAgent,
            "content":bds.qa.ShortCut.fbJQ("#fb_des_content").val(),
            "screenshot":bds.qa.ShortCut.img_data,
            "issuehtml":encodeURIComponent(bds.qa.ShortCut.fbJQ("html").html()),
            "email":email,
            "fb_documentcookie":document.cookie,
            "referer":encodeURIComponent(document.location.href),
            "product_type": bds.qa.ShortCut.fbJQ(".fb-checked").attr("value")==undefined?"":bds.qa.ShortCut.fbJQ(".fb-checked").attr("value")
        };

        return nec_data;
    },

    _getProData: function (pro_data) {
        bds.qa.ShortCut.pro_data = pro_data;
    },

    //canvas数据的传输
    sendCanvasData: function (callback) {
        //形式上隐藏弹出框和成功
        var necData = bds.qa.ShortCut._getNecData();
        bds.qa.ShortCut.sendDataResult(true);
        bds.qa.ShortCut.defaultCut?bds.qa.ShortCut.get_Snapshot():"";

        var clear_timeout_status = "";
        var check_snap = function () {
            var has_snap = document.getElementById("fb_right_dialog_pagecanvas2");

            if (!has_snap) {
                clear_timeout_status = setTimeout(check_snap, 1000);
            } else {
                necData.screenshot = bds.qa.ShortCut.img_data;
                send_data();
                window.clearTimeout(clear_timeout_status);
            }
        };

        var send_data = function () {
            var proData = bds.qa.ShortCut.pro_data;

            var shujufasong = bds.qa.ShortCut.fbJQ("#shujufasongzhong");
            if (!shujufasong) {
                bds.qa.ShortCut.fbJQ(".fb-action").append('<div id="shujufasongzhong" style="color:grey;text-align:left;">数据发送中...</div>');
            }

            var feedbackIframe = document.createElement("iframe");
            var frameID = "fb_qa_feedback_frame_id";
            bds.qa.ShortCut.fbJQ("#fb_qa_feedback_frame_id").remove();
            document.body.appendChild(feedbackIframe);
            feedbackIframe.style.display = "none";
            feedbackIframe.contentWindow.name = frameID;

            var postData = bds.qa.ShortCut.fbJQ.extend(necData, proData);
            // var postURL = bds.qa.ShortCut.base_url_path + "/?m=Client&a=postMsg";
            // bds.qa.ShortCut.fbJQ.post(postURL, urlParams, function (data) {
            //     data = eval("(" + data + ")");
            //     alert(data);
            // });

            var feedbackForm = document.createElement("form");
            feedbackForm.enctype = "application/x-www-form-urlencoded";
            feedbackForm.target = frameID;
            //feedbackForm.action = bds.qa.ShortCut.base_url_path + "/index.php/feedback/zx/getData";
            //        feedbackForm.action = "http://f3.baidu.com/index.php/feedback/zx/getData";
            feedbackForm.action = bds.qa.ShortCut.base_url_path + "/?m=Client&a=postMsg";
            feedbackForm.method = "POST";

            // var input = document.createElement("input");
            // input.type = "hidden";
            // input.name = "necData";
            // input.value = JSON.stringify(necData);
            // feedbackForm.appendChild(input);

            for (var key in postData) {
                var value = postData[key];
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                feedbackForm.appendChild(input);
            }

            // var input = document.createElement("input");
            // input.type = "hidden";
            // input.name = "proData";
            // input.value = JSON.stringify(proData);
            // feedbackForm.appendChild(input);

            document.body.appendChild(feedbackForm);
            feedbackForm.submit();



            feedbackIframe.onload = function () {
                bds.qa.ShortCut._isFunc(bds.qa.ShortCut.submitOkFunc) ? bds.qa.ShortCut.submitOkFunc() : "";

                bds.qa.ShortCut.fbJQ(feedbackIframe).remove();
                bds.qa.ShortCut.fbJQ(feedbackForm).remove();
                bds.qa.ShortCut._removeAllElement();
            }
        };

        bds.qa.ShortCut.defaultCut?check_snap():send_data();
    },

    //上传的数据传输
    postCrossDomainDataForm: function (callback) {
        var necData = bds.qa.ShortCut._getNecData();
        var proData = bds.qa.ShortCut.pro_data;
        var postData = bds.qa.ShortCut.fbJQ.extend(necData, proData);

        var feedbackIframe = document.createElement("iframe");
        var frameID = "fb_qa_feedback_frame_id";
        bds.qa.ShortCut.fbJQ("#fb_qa_feedback_frame_id").remove();
        document.body.appendChild(feedbackIframe);
        feedbackIframe.style.display = "none";
        feedbackIframe.contentWindow.name = frameID;

        var feedbackForm = document.getElementById("fb_right_post_form");
        if (!feedbackForm) {
            return;
        }

        feedbackForm.enctype = "multipart/form-data";
        feedbackForm.target = frameID;
        feedbackForm.method = "POST";

        for (var key in postData) {
            var value = postData[key];
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value;
            feedbackForm.appendChild(input);
        }
        // var input = document.createElement("input");
        // input.type = "hidden";
        // input.name = "necData";
        // input.value = JSON.stringify(necData);
        // feedbackForm.appendChild(input);

        // var input = document.createElement("input");
        // input.type = "hidden";
        // input.name = "proData";
        // input.value = JSON.stringify(proData);
        // feedbackForm.appendChild(input);

        feedbackForm.submit();
        bds.qa.ShortCut.sendDataResult(true);
        bds.qa.ShortCut._removeAllElement();
        feedbackIframe.onload = function () {
            bds.qa.ShortCut._isFunc(bds.qa.ShortCut.submitOkFunc) ? bds.qa.ShortCut.submitOkFunc() : "";
            bds.qa.ShortCut.fbJQ(feedbackIframe).remove();
            bds.qa.ShortCut.fbJQ(feedbackForm).remove();
            bds.qa.ShortCut._removeAllElement();
        }
    },

    //发送成功的回调函数。
    sendDataResult: function (status) {
        bds.qa.ShortCut.popwindowEnd();
        return true;
    },

    //判定是否是函数
    _isFunc:function(testFunc){
        return typeof testFunc == 'function';
    },

    //兼容 https
    _disposeHttps: function (options) {
        var needUp = bds && bds.util && bds.util.domain&& bds.util.domain.get;
        if (needUp) {
            bds.qa.ShortCut.base_url_path = bds.util.domain.get("http://ufosdk.baidu.com");
        }

        //兼容其他产品线的自定义https函数
        if (!options) {
            options = bds.qa.ShortCut.default_options;
        }
        this.customHttpsFunc = options.customHttpsFunc != undefined ? options.customHttpsFunc : bds.qa.ShortCut.default_options.customHttpsFunc;
        bds.qa.ShortCut._isFunc(bds.qa.ShortCut.customHttpsFunc)?bds.qa.ShortCut.customHttpsFunc():"";
    },

    //加载日志记录
    imgLog: function (src) {
        var n = "imglog__" + (new Date()).getTime(),
            c = window[n] = new Image();
        c.onload = (c.onerror = function () {
            window[n] = null;
        });
        c.src = src; //LOG统计地址
        c = null; //释放变量c，避免产生内存泄漏的可能
    },

    //测试图片类型
    checkImage: function (str) {
        var s = str.lastIndexOf(".");
        var name = str.substring(s + 1).toUpperCase();
        return !(name != "JPG" && name != "GIF" && name != "PNG" && name != "JPEG");
    },

    //是否ie
    _isIE: function () {
        var isIE = (document.all) ? true : false;
        return isIE;
    },

    //ie6
    _isIE6: function () {
        var isIE = (document.all) ? true : false;
        var isIE6 = isIE && !window.XMLHttpRequest;
        return isIE6;
    },

    //ie7
    _isIE7: function () {
        var browser = navigator.appName
        var b_version = navigator.appVersion
        var version = b_version.split(";");
        if(version.length<=1){
            return false;
        }
        var trim_Version = version[1].replace(/[ ]/g, "");

        return browser == "Microsoft Internet Explorer" && trim_Version == "MSIE7.0";
    },


    //判定浏览器函数，是否可以进行canvas渲染
    _identifyBrowser: function () {
        if (window.ActiveXObject)
            return false;
        try {
            var _canvas = document.createElement('canvas').getContext('2d');
            _canvas = null;
            return true;
        } catch (e) {
            return false;
        }
    },

    //校验图片
    _checkFileType: function (self_targ) {
        var file_str = self_targ.value;
        var check = bds.qa.ShortCut.checkImage(file_str);
        if (check) {
            var s = self_targ.value.lastIndexOf("\\");
            document.getElementById('fb_shangchuan_txt').innerHTML = self_targ.value.substring(s + 1);
        } else {
            bds.qa.ShortCut.popwindow("请上传PNG,JPEG,JPG,GIF等图片文件", 100);
            //bds.qa.ShortCut.fbJQ("#fb_shangchuan").val("");
            var f = bds.qa.ShortCut.fbJQ('#fb_shangchuan');
            f.after(f.clone().val(''));
            f.remove();
            bds.qa.ShortCut.fbJQ(".fb_shangchuan_txt").html("");
            return false;
        }
    },

     //弹框
    hidwindow: function () {
        bds.qa.ShortCut.fbJQ("#fb_popwindow").slideUp(500);
        var remove = function () {
            bds.qa.ShortCut.fbJQ("#fb_popwindow").remove();
        };
        setTimeout(remove, 1000);
    },

    //移除所有的创建元素
    _removeAllElement: function () {
        bds.qa.ShortCut.fbJQ("#ShortCut_wizard").remove();
        bds.qa.ShortCut.fbJQ("#fb_base_wizard_canvas").remove();
        bds.qa.ShortCut.fbJQ("#fb_baidu_wizard").remove();
        bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").remove();
        bds.qa.ShortCut.fbJQ("#fb_right_post_form").remove();
        bds.qa.ShortCut.fbJQ("#fb_popwindow").remove();
        bds.qa.ShortCut.fbJQ("#fb_right_dialog_canvas").remove();
        bds.qa.ShortCut.fbJQ("#fb_right_dialog_pagecanvas").remove();
        bds.qa.ShortCut.fbJQ("#fb_right_dialog_pagecanvas2").remove();
        bds.qa.ShortCut.fbJQ(".fb_cancel_flag").remove();
        bds.qa.ShortCut.fbJQ('#fb_cut_img').remove();
        bds.qa.ShortCut.is_feedbacking = false;
        bds.qa.ShortCut.send_img = false;
    },

    //隐藏弹框
    hidwindowEnd: function () {
        if (bds.qa.ShortCut.skinStyle == "pad") {
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("display","none");
            bds.qa.ShortCut.fbJQ("#ShortCut_wizard").css("display","none");
            bds.qa.ShortCut.fbJQ("#fb_base_wizard_canvas").css("display","none");
            bds.qa.ShortCut.fbJQ("#fb_baidu_wizard").css("display","none");
            bds.qa.ShortCut.fbJQ("#fb_right_post_form").css("display","none");
            bds.qa.ShortCut.fbJQ("#fb_popwindow").css("display","none");
            bds.qa.ShortCut.fbJQ("#fb_right_dialog_canvas").css("display","none");
            bds.qa.ShortCut.fbJQ("#fb_right_dialog_pagecanvas").css("display","none");
            bds.qa.ShortCut.fbJQ("#fb_right_dialog_pagecanvas2").css("display","none");
            bds.qa.ShortCut.fbJQ(".fb_cancel_flag").css("display","none");
            bds.qa.ShortCut.fbJQ("#fb_cut_img").css("display","none");
        } else {
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").fadeOut(500);
            bds.qa.ShortCut.fbJQ("#ShortCut_wizard").fadeOut(500);
            bds.qa.ShortCut.fbJQ("#fb_base_wizard_canvas").fadeOut(500);
            bds.qa.ShortCut.fbJQ("#fb_baidu_wizard").fadeOut(500);
            bds.qa.ShortCut.fbJQ("#fb_right_post_form").fadeOut(500);
            bds.qa.ShortCut.fbJQ("#fb_popwindow").fadeOut(500);
            bds.qa.ShortCut.fbJQ("#fb_right_dialog_canvas").fadeOut(500);
            bds.qa.ShortCut.fbJQ("#fb_right_dialog_pagecanvas").fadeOut(500);
            bds.qa.ShortCut.fbJQ("#fb_right_dialog_pagecanvas2").fadeOut(500);
            bds.qa.ShortCut.fbJQ(".fb_cancel_flag").fadeOut(500);
            bds.qa.ShortCut.fbJQ("#fb_cut_img").fadeOut(500);
        }
    },

    //弹出框
    popwindow: function (str, status) {
        var fb_pop_tips = document.getElementById("fb_pop_tips");
        if (!fb_pop_tips) {
            bds.qa.ShortCut.fbJQ(".fb-action").append("<div id='fb_pop_tips' style='height:25px;line-height:20px; padding-top: 3px;'><span style='color:red;'>" + str + "</span></div>");
        }

        //处理定位不同提交按钮的位置的不同
        if (bds.qa.ShortCut.showPosition == "center" || bds.qa.ShortCut.showPosition == "top") {
            bds.qa.ShortCut.fbJQ("#fb_pop_tips").css("text-align", "center")
        }

        bds.qa.ShortCut.fbJQ("#fb_pop_tips").fadeOut(3500);
        var remove = function () {
            bds.qa.ShortCut.fbJQ("#fb_pop_tips").remove();
        };
        setTimeout(remove, 4000);
    },

    //结束弹框
    popwindowEnd: function () {
        document.getElementById("fb_qa_feedback_body").style.height = "auto";
        bds.qa.ShortCut.fbJQ(".fb-action").css("height", "auto");
        bds.qa.ShortCut.fbJQ(".fb-action").css("width", bds.qa.ShortCut.fbJQ("#fb_qa_feedback_body").width() +"px");
        bds.qa.ShortCut.fbJQ("#fb_dialog_header").css("margin-top", "0px");
        bds.qa.ShortCut.fbJQ("#fb_dialog_header").css("bottom", "inherit");
        bds.qa.ShortCut.fbJQ(".fb-footer").remove();
        bds.qa.ShortCut.fbJQ(".fb-guide").remove();
        bds.qa.ShortCut.fbJQ(".fb-action").css({"margin-left": "0px", "text-align": "center"});
        bds.qa.ShortCut.fbJQ(".fb-action").html('<div class="fb-finished" >'+bds.qa.ShortCut.okStyle+'<div>');
        setTimeout(bds.qa.ShortCut.hidwindowEnd, 2500);
    },

    //获取蒙版层的位置
    _getWizardPosition: function () {
        //兼容ie6下面的高度问题,遮盖层 遮盖到最大高度
		bds.qa.ShortCut.fbJQ(".fb-baidu-wizard").css("height",parseInt(Math.max(document.body.scrollHeight, document.documentElement.clientHeight, document.body.clientHeight))+"px");
		bds.qa.ShortCut.fbJQ(".fb-baidu-wizard").css("width", this.win_width + "px");
    },

    //获取弹出框的位置
    _getDialogPosition: function () {
        var _height = bds.qa.ShortCut._getClientHeight() - bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").height();
        if (_height < 0) {
            _height = 0;
        }

        var _width = bds.qa.ShortCut._getClientWidth() - bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").width();
        if (_width < 0) {
            _width = 0;
        }

        //用于定义显示的位置
        if (bds.qa.ShortCut.showPosition == "right") {
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("right", "5px");
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("bottom", "5px");
        } else if (bds.qa.ShortCut.showPosition == "center") {
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("top", parseInt(_height / 2) + "px");
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("left", parseInt(_width / 2) + "px");
        } else if (bds.qa.ShortCut.showPosition == "top") {
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("top", "15px");
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("left", parseInt(_width / 2) + "px");
        } else if (bds.qa.ShortCut.showPosition == "custom") {
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("top", this.dialogPosition.top?this.dialogPosition.top:"5px");
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("left", this.dialogPosition.left?this.dialogPosition.left:"5px");
        } else if (bds.qa.ShortCut.showPosition == "bottom_right") {
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("right", this.dialogPosition.right?this.dialogPosition.right:"5px");
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("bottom", this.dialogPosition.bottom?this.dialogPosition.bottom:"5px");
        } else if (bds.qa.ShortCut.showPosition == "bottom_left") {
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("left", this.dialogPosition.left?this.dialogPosition.left:"5px");
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("bottom", this.dialogPosition.bottom?this.dialogPosition.bottom:"5px");
        }
        bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("position", "fixed");
    },

    _isUpperIos6: function () {
        if ((navigator.userAgent.match(/iPad/i) ||navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i))) {
            // 判断系统版本号是否大于 5
            return Boolean(navigator.userAgent.match(/OS [6-9]_\d[_\d]* like Mac OS X/i));
        } else {
            return false;
        }
    },

    _getCss: function () {
        (function () {
            if (!document.getElementById("fb_css")) {
                var cssName =bds.qa.ShortCut._getCssName();
                var s = document.createElement('link');
                s.type = 'text/css';
                s.rel = 'stylesheet';
                s.id = 'fb_css';
                s.media = 'screen';
                s.href =bds.qa.ShortCut.base_url_path + '/Public/feedback/css/'+cssName;
               // s.href ='http://cp01-rdqa-dev401.cp01.baidu.com:8765/Public/feedback/css/fb_flat_0.3.css';

                var head = document.getElementsByTagName("head")[0];
                head.appendChild(s);
            }
        })();
    },

    //自动化去css名称
    _getCssName: function () {
        var css_name = "";
        css_name = css_name + "fb_" + bds.qa.ShortCut.skinStyle + "_0.3.css";
        return css_name;
    },

    //整体进行图片的预加载
    _getImg:function(){
        var imgLoad = function (url) {
            var img = new Image();
            img.src = url;
            if (img.complete) {
            } else {
                img.onload = function () {
                    img.onload = null;
                };
            }
        };

        //todo 最终合成一张图
        //imgLoad(bds.qa.ShortCut.base_url_path + '/Public/feedback/img/cancel.png');
        //imgLoad(bds.qa.ShortCut.base_url_path + '/Public/feedback/img/'+bds.qa.ShortCut.cutImg);
        //imgLoad(bds.qa.ShortCut.base_url_path + '/Public/feedback/img/'+bds.qa.ShortCut.upImg);
        //imgLoad(bds.qa.ShortCut.base_url_path + '/Public/feedback/img/fb_ok.png');
        //imgLoad(bds.qa.ShortCut.base_url_path + '/Public/feedback/img/fb_mouse.png');
    },


    //页面重新绘制
    _repaint:function(){
        bds.qa.ShortCut._getWizardPosition();
        bds.qa.ShortCut._getDialogPosition();
    },

     //获取屏幕高度
    _getClientHeight: function () {
        var client_height = 0;
        if (document.documentElement && document.documentElement.clientHeight) {
            client_height = document.documentElement.clientHeight;
        } else if (document.body) {
            client_height = document.body.clientHeight;
        }

        return parseInt(client_height);
    },

    //获取屏幕宽度
    _getClientWidth: function () {
        var client_width = 0;
        if (document.documentElement && document.documentElement.clientWidth) {
            client_width = document.documentElement.clientWidth;
        }
        else if (document.body) {
            client_width = document.body.clientWidth;
        }

        return parseInt(client_width);
    },

    //定位窗体的位置
    _fixedPage: function () {
        bds.qa.ShortCut._getDialogPosition();
        //居中和靠上模式下，进行弹出框居中
        if (bds.qa.ShortCut.showPosition == "center" || bds.qa.ShortCut.showPosition == "top") {
            bds.qa.ShortCut.fbJQ(".fb-footer").css("text-align", "center")
        }

        //ie6下修改高度
        if(bds.qa.ShortCut._isIE6()){
            bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("position", "absolute");
            if (bds.qa.ShortCut.showPosition == "right" || bds.qa.ShortCut.showPosition == "bottom_left" || bds.qa.ShortCut.showPosition == "bottom_right") {
                bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").css("top", parseInt(document.documentElement.clientHeight + document.documentElement.scrollTop - bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").height() - 5) + "px");
            }
        }

        bds.qa.ShortCut.fbJQ("#fb_baidu_right_dialog").slideDown("slow");
    },

    getPerfData: function () {
        var getAndSendPerfData = function () {
            var perfDataJson = {};
            var timeInfo = {};
            var memInfo = {};
            var navInfo = {};

            // timing数据分析和获取

            // 包括卸载前个页面和请求资源缓存的所有时间，@notice该tab页打开时间,有可能没有load结束的js脚本
            timeInfo._navKeepTime = new Date() - performance.timing.navigationStart || 0;

            // 端到端的时间，真正的加载时间
            timeInfo._pageTime = performance.timing.loadEventEnd == 0 ? performance.timing.domComplete : performance.timing.loadEventEnd - performance.timing.navigationStart || 0;

            // 从开始到三次握手结束
            timeInfo._prePareTime = performance.timing.requestStart - performance.timing.navigationStart || 0;

            // dns 查找耗费的时间（检查长连接）
            timeInfo._dnsTime = performance.timing.domainLookupEnd - performance.timing.domainLookupStart || 0;

            // 重定向耗费时间
            timeInfo._redirTime = performance.timing.redirectEnd - performance.timing.redirectStart || 0;

            // tcp连接耗费时间
            timeInfo._tcpTime = performance.timing.connectEnd - performance.timing.connectStart || 0;

            // 检查资源时间，catch时间
            timeInfo._cacheTime = performance.timing.domainLookupStart - performance.timing.fetchStart || 0;

            // https ssl握手时间
            timeInfo._sslTime = performance.timing.connectEnd - performance.timing.secureConnectionStart || 0;


            // 真正可以把控的资源时间，因为dns，tcp，这个主要包括请求资源和渲染
            timeInfo._realTime = performance.timing.loadEventEnd == 0 ? performance.timing.domComplete : performance.timing.loadEventEnd - performance.timing.requestStart || 0;

            // 传输资源时间，从开始请求到结束传输,这个获取和加载本质上实在并行运行的
            timeInfo._dataTime = performance.timing.responseEnd - performance.timing.requestStart || 0;

            // request time
            timeInfo._requestTime = performance.timing.responseStart - performance.timing.requestStart || 0;

            // 传输资源时间，从接收第一个资源开始,到接受结束
            timeInfo._responseTime = performance.timing.responseEnd - performance.timing.responseStart || 0;

            // 渲染时间
            timeInfo.renderTime = performance.timing.domComplete - performance.timing.domLoading || 0;

            // 统一各tab消除和新加的时间,如果没有则是开始缓存的时间
            timeInfo._clearTime = performance.timing.unloadEventEnd - performance.timing.unloadEventStart || 0;

            // dom 开始到解析的时间,真正dom树的构造时间
            timeInfo._domTreeTime = performance.timing.domInteractive - performance.timing.domLoading || 0;

            // 非dom脚本加载时间
            timeInfo._JSTime = performance.timing.domComplete - performance.timing.domContentLoadedEventStart || 0;

            // loaded 之后加载脚本时间
            timeInfo._loadedJSTime = performance.timing.loadEventEnd - performance.timing.loadEventStart || 0;

            // dom加载完成时间，包括加载dom和加载脚本 （dom loading-> dom interactive ->dom content ->dom complete）
            timeInfo._domTime = performance.timing.domComplete - performance.timing.domLoading || 0;


            // nav数据分析和获取
            // 用户浏览器内存信息
            if (performance.memory != undefined) {
                memInfo._jsHeapSize = performance.memory.jsHeapSizeLimit;
                memInfo._totalJSSize = performance.memory.totalJSHeapSize;
                memInfo._usedJSSize = performance.memory.usedJSHeapSize;
            }

            // 来源信息 例如fankui 就是3次
            navInfo._redirectCount = performance.navigation.redirectCount;
            //  0 单击连接或者url输入或者提交表单；1重载，刷新；2浏览器记录，forward back等变成方式；255其他
            navInfo._type = performance.navigation.type;

            navInfo._navUA = navigator.userAgent;
            navInfo.url = encodeURIComponent(window.location.href);

            perfDataJson.timeInfo = timeInfo;
            perfDataJson.memInfo = memInfo;
            perfDataJson.navInfo = navInfo;

            // json打包发送
            bds.qa.ShortCut.fbJQ.ajax({
                data: {perfDataJson: JSON.stringify(perfDataJson)},
                dataType: 'jsonp',
                jsonp: 'jsonp_callback',
                url: bds.qa.ShortCut.base_url_path + '/?m=Client&a=pushPerfData',
                success: function () {
                }
            });

        };

        var checkNeedSend = function () {
            if (!bds.qa.ShortCut._identifyBrowser()) {
                return false;
            }

            //切割地址，需要发送的则传输数据
            var needSend = [
                "opendata.baidu.com",
                "caifu.baidu.com",
                "iwan.baidu.com",
                "xueshu.baidu.com",
                "news.baidu.com",
                "shangmao.baidu.com",
                "tupu.baidu.com",
                "123.baidu.com",
                "zhannei.baidu.com",
                "vip.baidu.com",
            ];
            var baseurl = window.location.href.split("://")[1].split("/")[0];

            return needSend.indexOf(baseurl) != -1;
        };

        //校验是否需要发送数据，需要的话就发送
        checkNeedSend() ? getAndSendPerfData() : "";
    },

    default_options: {
        appid: 0,
        entrance_id: 0,

        plugintitle: '意见反馈&nbsp;',
		myFeedbackHtml: '<font style="font-size:13px;color:#2d9ef8;line-height:13px;">|&nbsp;<a style="font-size:13px;color:#2d9ef8;line-height:13px;text-decoration:underline;" href="https://ufo.baidu.com/listen/history?type=history#/history" target="_blank">我的反馈</a></font>',
        issueTips: '反馈内容',
        issuePlaceholder: "欢迎提出您在使用过程中遇到的问题或宝贵建议（400字以内），感谢您对百度的支持。",
        emailPlaceholder: "请留下您的联系方式，以便我们及时回复您。",
        guide: '<span>有任何问题请联系fankui@baidu.com</span>',
        cutFileTips: "点我，可以上传图片哦~",
        cutCanvasTips: '&nbsp;点我，可以在当前页面截图哦~&nbsp;',
        emailTips: "联系方式",
        commitContent: "提交反馈",
        typeTips: "您遇到的问题类型",
        dangerContentTips:"(*必填)",    // 若为空则非必填
        dangerTypeTips:"(*必选)",
        contentRequiredTips:"请填写反馈描述",
        emailRequiredTips:"请填写联系方式",
        submitOkTips:"您的意见我们已经收到，谢谢！",

        //okStyle:"",
        requiredEmail:false,
        needMyFeedback:false,
        needIssueTips: true,
        needIssue: true,
        needCut: true,
        needEmail: true,
        needGuide: false,
        needType:false,                 //是否需要定制类型
        needDrag:true,                 //是否需要定制类型
        typeArray: {},                  //需要定制的类型，

        defaultCut:true,

        customHttpsFunc:"",             //用户自定义的兼容https函数
        submitOkFunc:"",             //用户自定义的兼容https函数
        showPosition: 'right',     // right ,center ,top 三种样式可供选择。
        onlyUpFile: false,

        //cutImg:"jietu.png",                 //上传和截图的图标样式定制
        //upImg:"upload.png",

        skinStyle:"flat"          //增加插件的换肤功能，现在支持 flat(扁平化即现在大搜的样式），ori(传统的样式)，pad（平板样式)
    }
};

