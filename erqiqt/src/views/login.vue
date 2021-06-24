<template>
  <div>
      
    <div>
      <div id="head">
        <div class="mod-header">
          <a href="javascript:;"
            ><img src="static/picture/logo.gif" alt="logo"
          /></a>
        </div>
      </div>
      <div id="nav">
        <div class="nav-2">
          <div class="mod-nav clearfix">
            <h1 class="page-type-notab"></h1>
          </div>
        </div>
      </div>
      <div id="content" style="display: block;">
        <div class="clearfix login-container">
        <div class="login-form">
        <div class="login-wrapper">
        <div id="login" class="tang-pass-login animation" style="display: block; visibility: visible; opacity: 1;"><form id="TANGRAM__PSP_3__form" class="pass-form pass-form-normal" method="POST" autocomplete="off"><p class="pass-form-logo">用户名密码登录</p><p id="TANGRAM__PSP_3__errorWrapper" class="pass-generalErrorWrapper"><span id="TANGRAM__PSP_3__error" class="pass-generalError pass-generalError-error"></span></p><p id="TANGRAM__PSP_3__MakeTextWrapper" class="pass-make-text" style="display:none;"></p><p id="TANGRAM__PSP_3__hiddenFields" style="display:none"><input type="hidden" id="TANGRAM__PSP_3__codeString" name="codeString" value=""><input type="hidden" id="TANGRAM__PSP_3__safeFlag" name="safeFlag" value="0"><input type="hidden" id="TANGRAM__PSP_3__u" name="u" value="https://passport.baidu.com/"><input type="hidden" id="TANGRAM__PSP_3__isPhone" name="isPhone" value="false"><input type="hidden" id="TANGRAM__PSP_3__detect" name="detect" value="1"><input type="hidden" id="TANGRAM__PSP_3__gid" name="gid" value="87C8E84-6415-4D11-9460-FDF40E913C7E"><input type="hidden" id="TANGRAM__PSP_3__staticPage" name="staticPage" value="file:///static/passpc-account/html/v3Jump.html"><input type="hidden" id="TANGRAM__PSP_3__quick_user" name="quick_user" value="0"><input type="hidden" id="TANGRAM__PSP_3__logintype" name="logintype" value="basicLogin"><input type="hidden" id="TANGRAM__PSP_3__logLoginType" name="logLoginType" value="pc_loginBasic"><input type="hidden" id="TANGRAM__PSP_3__subpro" name="subpro" value=""><input type="hidden" id="TANGRAM__PSP_3__idc" name="idc" value=""><input type="hidden" id="TANGRAM__PSP_3__loginMerge" name="loginMerge" value="true"><input type="hidden" id="TANGRAM__PSP_3__mkey" name="mkey" value=""></p><p id="TANGRAM__PSP_3__userNameWrapper" class="pass-form-item pass-form-item-userName" style="display:block"><input type="text" style="display:none;"><input id="TANGRAM__PSP_3__userName" type="text" name="userName" class="pass-text-input pass-text-input-userName" autocomplete="off" value="" placeholder="请输入"><span id="TANGRAM__PSP_3__userName_clearbtn" class="pass-clearbtn pass-clearbtn-userName" style="display:none;"></span><span id="TANGRAM__PSP_3__userNameTip" class="pass-item-tip pass-item-tip-userName" style="display:none"><span id="TANGRAM__PSP_3__userNameTipText" class="pass-item-tiptext pass-item-tiptext-userName"></span></span></p><p id="TANGRAM__PSP_3__passwordWrapper" class="pass-form-item pass-form-item-password" style="display:block;"><input type="password" style="display: none;"><input id="TANGRAM__PSP_3__password" type="password" name="password" class="pass-text-input pass-text-input-password" autocomplete="off" value="" placeholder="密码"><span id="TANGRAM__PSP_3__password_clearbtn" class="pass-clearbtn pass-clearbtn-password" style="display:none;"></span><span id="TANGRAM__PSP_3__passwordTip" class="pass-item-tip pass-item-tip-password" style="display:none"><span id="TANGRAM__PSP_3__passwordTipText" class="pass-item-tiptext pass-item-tiptext-password"></span></span></p><p id="TANGRAM__PSP_3__verifyCodeImgWrapper" class="pass-form-item pass-form-item-verifyCode" style="display:none"><input id="TANGRAM__PSP_3__verifyCode" type="text" name="verifyCode" class="pass-text-input pass-text-input-verifyCode" maxlength="6" placeholder="验证码" autocomplete="off"><span id="TANGRAM__PSP_3__verifyCode_clearbtn" class="pass-clearbtn pass-clearbtn-verifyCode" style="display:none;"></span><span id="TANGRAM__PSP_3__verifyCodeImgParent" class="pass-verifyCodeImgParent"><img id="TANGRAM__PSP_3__verifyCodeImg" class="pass-verifyCode" src="http://ppui-static-pc.cdn.bcebos.com/passApi/img/small_blank.gif"></span><a id="TANGRAM__PSP_3__verifyCodeChange" href="#" class="pass-change-verifyCode">换一张</a><span id="TANGRAM__PSP_3__verifyCodeError" class="pass-error pass-error-verifyCode"></span><span id="TANGRAM__PSP_3__verifyCodeTip" class="pass-tip pass-tip-verifyCode"></span><span id="TANGRAM__PSP_3__verifyCodeSuccess" class="pass-success pass-success-verifyCode"></span></p><p id="TANGRAM__PSP_3__memberPassWrapper" class="pass-form-item pass-form-item-memberPass memberPass-hidden"><input id="TANGRAM__PSP_3__memberPass" type="checkbox" name="memberPass" class="pass-checkbox-input pass-checkbox-memberPass" checked="checked"><label for="TANGRAM__PSP_3__memberPass" id="TANGRAM__PSP_3__memberPassLabel" class="">下次自动登录</label></p><p id="TANGRAM__PSP_3__submitWrapper" class="pass-form-item pass-form-item-submit"><input id="TANGRAM__PSP_3__submit" type="submit" value="登录" @click="submit()" class="pass-button pass-button-submit"><a class="pass-fgtpwd pass-link" href="https://passport.baidu.com/?getpassindex&amp;tt=1623921819546&amp;gid=87C8E84-6415-4D11-9460-FDF40E913C7E&amp;tpl=pp&amp;u=https%3A%2F%2Fpassport.baidu.com%2F" target="_blank">忘记密码？</a></p></form></div>
        <div id="TANGRAM__PSP_3__qrcode" class="clearfix tang-pass-qrcode tang-pass-login animation" style="display: none; visibility: hidden; opacity: 1;"><div class="tang-pass-qrcode-content" id="TANGRAM__PSP_3__qrcodeContent"><div class="tang-pass-qrcode-init"><div class="Qrcode-status-con tang-pass-qrcode-imgWrapper" id="TANGRAM__PSP_3__QrcodeMain" style="display: block; visibility: visible; opacity: 1; margin-left: 39px;"><img class="tang-pass-qrcode-img" src="file://passport.baidu.com/v2/api/qrcode?sign=v1_30da4483c02f65509e1851bb59fa3&amp;lp=pc&amp;qrloginfrom=pc"><p class="Qrcode-status-animation Qrcode-status-guideAnim" id="TANGRAM__PSP_3__QrcodeAnimation"></p></div><div class="Qrcode-status-con Qrcode-status-success" id="TANGRAM__PSP_3__QrcodeSuccess" style="display: none;"><p class="Qrcode-status-icon"></p><p>扫描成功</p><p class="Qrcode-status-msg">请在手机端确认登录</p></div><div class="Qrcode-status-con Qrcode-status-error" id="TANGRAM__PSP_3__QrcodeError" style="display: none;"><p class="Qrcode-status-icon"></p><p>网络连接失败</p><p class="Qrcode-refresh-btn" id="TANGRAM__PSP_3__QrcodeErrorfreshBtn">点击刷新</p></div><div class="Qrcode-status-con Qrcode-status-refresh" id="TANGRAM__PSP_3__QrcodeRefresh" style="display: none;"><p class="Qrcode-status-icon"></p><p class="refresh-title refresh-timeout">二维码已失效</p><p class="refresh-title refresh-loadout">二维码加载失败</p><p class="Qrcode-refresh-btn" id="TANGRAM__PSP_3__QrcodeRefreshBtn">点击刷新</p></div></div></div><ul class="tang-pass-qrcode-ullist"><li class="tang-pass-qrcode-list"><span class="tang-pass-qrcode-list-aq"></span><span>安全</span></li><li class="tang-pass-qrcode-list"><span class="tang-pass-qrcode-list-gx"></span><span>高效</span></li><li class="tang-pass-qrcode-list"><span class="tang-pass-qrcode-list-bj"></span><span>便捷</span></li></ul></div><div class="tang-pass-footerBar"><a class="pass-reglink pass-link" href="https://passport.baidu.com/v2/?reg&amp;tt=1623921819546&amp;overseas=&amp;gid=87C8E84-6415-4D11-9460-FDF40E913C7E&amp;tpl=pp&amp;u=https%3A%2F%2Fpassport.baidu.com%2F" target="_blank">立即注册</a></div></div>
        </div>
      <div id="foot">
        <div class="mod-footer">
          <div class="copy-box">2021&nbsp;&copy;Baidu</div>
        </div>
      </div>
    </div>
    <!-- <script type="text/javascript" src="static/js/uni_wrapper.js"></script>
    <script type="text/javascript" src="static/js/core.js"></script>
    <script type="text/javascript" src="static/js/ui.js"></script>
    <script type="text/javascript" src="static/js/wrapper.js"></script>
    <script nonce="ZKjDbLywGBibabw6">
      function getVal(e) {
        var t = document.getElementById(e).value;
        return t;
      }
      var jsU = getVal("jsU"),
        jsProduct = getVal("jsProduct"),
        jsIdc = getVal("jsIdc"),
        jsSubpro = getVal("jsSubpro"),
        jsNorealU = getVal("jsNorealU"),
        jsAuthsiteAct = getVal("jsAuthsiteAct"),
        jsOverseas = getVal("jsOverseas"),
        jsSms = getVal("jsSms"),
        jsUserPwdLogin = getVal("jsUserPwdLogin"),
        _config = {
          u: jsU,
          product: jsProduct,
          idc: jsIdc,
          subpro: jsSubpro,
          noreal_u: jsNorealU,
          staticpage:
            document.location.protocol +
            "//" +
            document.location.host +
            "/static/passpc-account/html/v3Jump.html",
          authsiteLogin: ["qzone", "tsina", "weixin"],
          authsiteCfgLogin: { act: jsAuthsiteAct, display: "popup" },
          sms: jsSms,
          overseas: jsOverseas,
          qrcode: !0,
          qrcode_animation: 1,
        };
      document.charset &&
        -1 == document.charset.toLowerCase().indexOf("utf") &&
        navigator.userAgent.indexOf("MSIE") > 0 &&
        (location.href =
          location.href +
          (location.href.indexOf("?") > -1 ? "&nocache=1" : "?nocache=1"));
      var _accountValue = document.getElementById("jsAccountValue").value,
        current_city = document.getElementById("jsCurrentCity").value;
    </script>
    <script
      type="text/javascript"
      src="static/js/boot_login_1e30d1a.js"
    ></script>
    <script type="text/javascript" nonce="ZKjDbLywGBibabw6">
      _hmt.push(["_setAutoPageview", false]);
      (function () {
        try {
          var tjstr = location.search,
            tjarr2 = [],
            tjresult = "";
          if (tjstr) {
            var tjarr = tjstr.slice(1).split("&");
            for (var i = 0, len = tjarr.length; i < len; i++) {
              var query = tjarr[i].split("=")[0];
              if (query != "t" && query != "_t") {
                tjarr2.push(tjarr[i]);
              }
            }
          }
          tjresult =
            location.pathname +
            (tjarr2.length > 0 ? "?" + tjarr2.join("&") : "");
        } catch (e) {
          var tjresult = location.pathname;
        }
        _hmt.push(["_trackPageview", tjresult]);
      })();
      var _bdhmProtocol =
        "https:" == document.location.protocol ? " https://" : " http://";
      document.write(
        unescape(
          "%3Cscript src='" +
            _bdhmProtocol +
            "hm.baidu.com/h.js%3F90056b3f84f90da57dc0f40150f005d5' type='text/javascript'%3E%3C/script%3E"
        )
      );
    </script>
    <script src="static/js/moonshad.js"></script>
    <script type="text/javascript" nonce="ZKjDbLywGBibabw6">
      window.wpo.tti = new Date() * 1;
    </script> -->
  
  </div>
  </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scope src="../../public/static/css/boot_login_7f3c94c.css">
</style>
<style scope src="../../public/static/css/base.css"></style>