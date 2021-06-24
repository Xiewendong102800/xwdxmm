<!--
 * @Author: your name
 * @Date: 2021-06-23 18:40:45
 * @LastEditTime: 2021-06-23 20:00:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \erqiqt\erqiqt\src\views\zhuce.vue
-->
<template>
  <div>
      <div id="wrapper" class="">
      <div id="head"></div>
      <div id="nav"></div>
      <div id="content">
        <div class="mod-new-reg-bg">
          <img src="static/picture/reg_bg_min.jpg" />
        </div>
        <div class="mod-new-reg-wrapper">
          <div class="mod-new-reg-logo">
            <img src="static/picture/baidu.png" />
          </div>
          <div class="mod-new-reg-text">
            <h3>用科技</h3>
            <p>让复杂的世界更简单</p>
          </div>
          <div class="mod-new-reg-footer">
            <span class="mod-new-reg-help">
              <a
                class="mode-new-reg-help-text"
                href="javascript:;"
                target="_blank"
              >
                帮助中心
              </a>
              <span class="mod-new-reg-line"></span>
              <a class="mod-new-reg-service" href="javascript:;"></a>
            </span>
            <span class="mod-new-reg-copyright">2021&nbsp;&copy;Baidu</span>
          </div>
        </div>
        <div class="mod-reg clearfix mod-reg- mod-new-reg-content">
          <div class="new-reg-guide-login">
            <h3>欢迎注册</h3>
            <p>已有帐号？ <router-link to="login">登录</router-link></p>
          </div>
          <div class="reg-content" id="reg_content"></div>
        </div>
        <div class="reg-content tang-pass-reg" id="reg_content">
            <form autocomplete="off" id="TANGRAM__PSP_4__form" class="new-reg-v5" method="POST">
                <p id="TANGRAM__PSP_4__hiddenFields" style="display:none">
                    <input type="hidden" id="TANGRAM__PSP_4__retu" name="retu" value="">
                    <input type="hidden" id="TANGRAM__PSP_4__u" name="u" value="">
                    <input type="hidden" id="TANGRAM__PSP_4__quick_user" name="quick_user" value="0">
                    <input type="hidden" id="TANGRAM__PSP_4__regMerge" name="regMerge" value="false">
                    <input type="hidden" id="TANGRAM__PSP_4__suggestIndex" name="suggestIndex" value="">
                    <input type="hidden" id="TANGRAM__PSP_4__suggestType" name="suggestType" value="">
                    <input type="hidden" id="TANGRAM__PSP_4__codeString" name="codeString" value="">
                    <input type="hidden" id="TANGRAM__PSP_4__vcodesign" name="vcodesign" value="">
                    <input type="hidden" id="TANGRAM__PSP_4__vcodestr" name="vcodestr" value="">
                    <input type="hidden" id="TANGRAM__PSP_4__gid" name="gid" value="C0C0DA6-C993-4859-8337-2574EBACD01C">
                    <input type="hidden" id="TANGRAM__PSP_4__app" name="app" value="">
                    <input type="hidden" id="TANGRAM__PSP_4__staticPage" name="staticPage" value="https://passport.baidu.com/static/passpc-account/html/v3Jump.html">
                    <input type="hidden" id="TANGRAM__PSP_4__selectedSuggestName" name="selectedSuggestName" value="">
                    <input type="hidden" id="TANGRAM__PSP_4__isLowpwdCheck" name="isLowpwdCheck" value="undefined">
                    <input type="hidden" id="TANGRAM__PSP_4__logRegType" name="logRegType" value="pc_regBasic">
                    <input type="hidden" id="TANGRAM__PSP_4__isexchangeable" name="isexchangeable" value="1">
                    <input type="hidden" id="TANGRAM__PSP_4__exchange" name="exchange" value="0">
                    <input type="hidden" id="TANGRAM__PSP_4__subpro" name="subpro" value="">
                    <input type="hidden" name="sloc" value="" id="TANGRAM__PSP_4__sloc">
                </p>
                <input type="hidden" node-type="_username" id="_username" name="_username" value="">
                <input type="hidden" node-type="_regpass" id="_regpass" name="_regpass" value="">
                <input type="hidden" node-type="_rsakey" id="_rsakey" name="_rsakey" value="">
                <input type="hidden" node-type="_regfrom" id="_regfrom" name="_regfrom" value="reg">
                <p id="TANGRAM__PSP_4__userNameWrapper" class="pass-form-item pass-form-item-userName" style="display:">
                    <label for="TANGRAM__PSP_4__userName" id="TANGRAM__PSP_4__userNameLabel" class="pass-label pass-label-userName">用户名</label>
                    <input type="text" style="display:none;">
                    <input id="TANGRAM__PSP_4__userName" type="text" name="userName" class="pass-text-input pass-text-input-userName" autocomplete="off" value="" placeholder="请设置用户名">
                    <span id="TANGRAM__PSP_4__userName_clearbtn" class="pass-clearbtn pass-clearbtn-userName" style="display: none; visibility: hidden;"></span>
                    <span id="TANGRAM__PSP_4__userNameError" class="pass-item-error pass-item-error-userName" style="display: none;"></span>
                    <span id="TANGRAM__PSP_4__userNameSucc" class="pass-item-succ pass-item-succ-userName" style="display:none;"></span>
                    <span id="TANGRAM__PSP_4__userNameTip" class="pass-item-tip pass-item-tip-userName" style="display: none;">
                    <span id="TANGRAM__PSP_4__userNameTipText" class="pass-item-tiptext pass-item-tiptext-userName">设置后不可更改，中英文均可，最长14个英文或7个汉字</span>
                    </span>
                </p>
                <p id="TANGRAM__PSP_4__phoneWrapper" class="pass-form-item pass-form-item-phone" style="display:">
                    <label for="TANGRAM__PSP_4__phone" id="TANGRAM__PSP_4__phoneLabel" class="pass-label pass-label-phone">手机号</label>
                    <input type="text" style="display:none;">
                    <input id="TANGRAM__PSP_4__phone" type="text" name="phone" class="pass-text-input pass-text-input-phone" maxlength="11" autocomplete="off" value="" placeholder="可用于登录和找回密码">
                    <span id="TANGRAM__PSP_4__phone_clearbtn" class="pass-clearbtn pass-clearbtn-phone" style="display: none; visibility: hidden;"></span>
                    <span id="TANGRAM__PSP_4__phoneError" class="pass-item-error pass-item-error-phone" style="display: none;">请您输入手机号</span>
                    <span id="TANGRAM__PSP_4__phoneSucc" class="pass-item-succ pass-item-succ-phone" style="display:none;"></span>
                    <span id="TANGRAM__PSP_4__phoneTip" class="pass-item-tip pass-item-tip-phone" style="display:none">
                        <span id="TANGRAM__PSP_4__phoneTipText" class="pass-item-tiptext pass-item-tiptext-phone">请输入中国大陆手机号,其他用户不可见</span>
                    </span>
                    <span class="pass-item-placeholder" id="TANGRAM__PSP_4__Placeholder" style="display: inline;"></span>
                </p>
                <input type="password" name="password" style="display:none">
                <p id="TANGRAM__PSP_4__passwordWrapper" class="pass-form-item pass-form-item-password" style="display:;">
                     <label for="TANGRAM__PSP_4__phone" id="TANGRAM__PSP_4__phoneLabel" class="pass-label pass-label-phone">密&nbsp;&nbsp;&nbsp;&nbsp;码</label>
                    <input type="password" style="display: none;">
                    <input id="TANGRAM__PSP_4__password" type="password" name="password" class="pass-text-input pass-text-input-password" autocomplete="off" value="" placeholder="请设置登录密码">
                    <span id="TANGRAM__PSP_4__password_clearbtn" class="pass-clearbtn pass-clearbtn-password" style="display:none;"></span>
                    <span id="TANGRAM__PSP_4__passwordError" class="pass-item-error pass-item-error-password" style="display: none;">
                        <span class="pwd-strength nopwd"><span class="pwd-strength-sum">
                            <em class="pwd-strength-bg">&nbsp;</em>
                            <em class="pwd-strength-sco">&nbsp;</em>
                            <span class="pwd-strength-title"></span>
                            </span>
                            <span class="pwd-strength-detail">请输入密码</span></span>
                        </span>
                        <span id="TANGRAM__PSP_4__passwordSucc" class="pass-item-succ pass-item-succ-password" style="display:none;"></span>
                        <span id="TANGRAM__PSP_4__passwordTip" class="pass-item-tip pass-item-tip-password" style="display:none">
                            <span id="TANGRAM__PSP_4__passwordTipText" class="pass-item-tiptext pass-item-tiptext-password">
                                <div class="pwd-checklist-wrapper">
                                    <span class="pwd-checklist-arrow">
                                        <em class="arrowa">◆</em>
                                        <em class="arrowb">◆</em>
                                    </span>
                                    <ul id="TANGRAM__PSP_4__pwdChecklist" class="pwd-checklist">
                                        <li id="TANGRAM__PSP_4__pwd_checklist_len" data-rule="len" class="pwd-checklist-item">长度为8~14个字符</li>
                                        <li id="TANGRAM__PSP_4__pwd_checklist_cha" data-rule="cha" class="pwd-checklist-item">字母/数字以及标点符号至少包含2种</li>
                                        <li id="TANGRAM__PSP_4__pwd_checklist_spa" data-rule="spa" class="pwd-checklist-item">不允许有空格、中文</li>
                                    </ul>
                                    </div></span></span>
                                    <span class="change-password-type" id="TANGRAM__PSP_4__changePwdType" style="display:none;"></span>
                                    <span class="new-password-tip" id="TANGRAM__PSP_4__newPwdTip"></span>
                                    </p>
                                    <p id="TANGRAM__PSP_4__verifyCodeSendWrapper" class="pass-form-item pass-form-item-verifyCodeSend">
                                        
                                        
                                        <span id="TANGRAM__PSP_4__verifyCodeError" class="pass-item-error pass-item-error-verifyCodeSend" style="display: none;"></span>
                                        <span id="TANGRAM__PSP_4__verifyCodeSendTip" class="pass-item-tip pass-item-tip-verifyCodeSend" style="display: none;"></span></p>
                                        <p id="TANGRAM__PSP_4__errorWrapper" class="pass-generalErrorWrapper">
                                            </p>
                                            <p id="TANGRAM__PSP_4__submitWrapper" class="pass-form-item pass-form-item-submit pass-form-item-submit-v5">
                                                <input value="注册" class="pass-button pass-button-submit"
                                                style="color:#000" disabled="" @click="submit()"></p>
                                                <p id="TANGRAM__PSP_4__isAgreeWrapper" class="pass-form-item pass-form-item-isAgree">
                                                    <input name="isAgree" id="TANGRAM__PSP_4__isAgree" type="checkbox" class="pass-checkbox-input pass-checkbox-isAgree" autocomplete="off">
                                                    <label for="TANGRAM__PSP_4__isAgree"></label>
                                                    <a target="_blank" href="http://passport.baidu.com/static/passpc-account/html/protocal.html">《百度用户协议》</a>及<a target="_blank" href="http://privacy.baidu.com/detail?id=288">《百度隐私权保护声明》</a>
                                                    <a><span id="TANGRAM__PSP_4__isAgreeError" class="pass-item-error pass-item-error-isAgree"></span></a></p></form></div>
        <input type="text" value="" id="jsProduct" />
        <input type="text" value="" id="jsU" />
        <input type="text" value="" id="jsColor" />
        <input type="text" value="" id="jsSubpro" />
        <input type="text" value="" id="jsNorealU" />
        <input type="text" value="" id="jsRetu" />
        <input type="text" value="" id="jsnoUsername" />
        <input type="text" value="" id="jsdefaultAccount" />
        <input type="text" value="" id="isSchoolReg" />
        <input type="text" value="" id="hasAuthsite" />
        
      </div>
      <div id="foot"></div>
    </div>
  </div>
</template>

<script>

export default {
     
}
</script>

<style scpoed src="../../public/static/css/base.css">


</style>



