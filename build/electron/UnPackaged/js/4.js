(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{"19bf":function(t,e,a){"use strict";a("d226")},"29ed":function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-page",{staticClass:"flex"},[a("q-scroll-area",{staticStyle:{"min-height":"100%","min-width":"100%"}},[a("optional-information"),a("verification-fields",{attrs:{loading:t.loading},on:{setLoading:t.setLoading}}),a("security")],1)],1)},i=[],n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("setting-fragment",{attrs:{label:t.$t("account_personal_information")}},[a("q-form",{staticClass:"account-setting__information",on:{submit:function(e){return t.$refs.submitButton.handleButton(e)},reset:t.fetchUser}},[t._l(t.form.items,(function(e,o,i){return["input"===e.type?a("amplify-input",t._b({key:o,style:{marginBottom:"4px",width:"100%",minWidth:"280px"},attrs:{value:e.model,label:t.$t(e.bound.label),readonly:t.changing},on:{input:function(a){t.edited=!0,e.model=a}}},"amplify-input",e.bound,!1)):"select"===e.type?a("amplify-select",t._b({key:o,style:{marginBottom:i===t.form.length-1?"4px":"24px",width:"100%",minWidth:"280px"},attrs:{value:e.model,readonly:t.changing,align:""},on:{input:function(a){t.edited=!0,e.model=a}}},"amplify-select",e.bound,!1)):t._e()]})),a("div",{directives:[{name:"show",rawName:"v-show",value:t.edited,expression:"edited"}],staticClass:"optional-container"},[a("alphabiz-button",{ref:"submitButton",staticStyle:{"min-width":"128px"},attrs:{label:t.$t("account_submit"),type:"submit","on-click":t.handleSubmit,color:"primary"},model:{value:t.changing,callback:function(e){t.changing=e},expression:"changing"}}),a("alphabiz-button",{staticStyle:{"min-width":"128px"},attrs:{label:t.$t("account_reset"),type:"reset"},model:{value:t.changing,callback:function(e){t.changing=e},expression:"changing"}})],1)],2)],1)},s=[],r=a("48f4"),l=a("ed08"),c=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:["setting-fragment"].concat(t.fragClz)},[a("div",{class:["setting-fragment__label"].concat(t.fragLabelClz)},[t._v(t._s(t.label))]),a("div",{class:["setting-fragment__content"].concat(t.fragContentClz)},[t._t("default")],2)])},u=[],d={name:"SettingFragment",props:{label:String},data(){return{fragClz:[],fragLabelClz:["non-selectable","text-general"],fragContentClz:[]}}},m=d,h=(a("19bf"),a("2877")),p=Object(h["a"])(m,c,u,!1,null,null,null),f=p.exports,_=a("0d11"),b={name:"OptionalInformation",components:{SettingFragment:f},data(){return{changing:!1,form:null,edited:!1}},created(){this.form=new _["a"](this),this.fetchUser()},methods:{fetchUser(){this.form.updateModel(Object(l["deepClone"])(this.$store.getters.accountUserOptionalInfo))},async handleSubmit(){try{await r["a"].changeAttributes(this.form.formData),r["b"].showPositive("changed"),this.edited=!1}catch(t){r["b"].showNegative(t.message)}}},watch:{"$store.getters.accountUserOptionalInfo"(){this.fetchUser()}}},g=b,v=(a("5be0"),a("0378")),w=a("eebe"),y=a.n(w),$=Object(h["a"])(g,n,s,!1,null,null,null),D=$.exports;y()($,"components",{QForm:v["a"]});var k=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("setting-fragment",{attrs:{label:t.$t("account_contact_information")}},[a("div",{staticClass:"account-setting__verification"},[a("q-list",{staticClass:"account-setting__verification-container",attrs:{bordered:"",separator:""}},t._l(t.items,(function(e,o){return a("q-item",{directives:[{name:"ripple",rawName:"v-ripple",value:!t.loading,expression:"!loading"}],key:o,attrs:{clickable:!t.loading,readonly:t.loading},on:{click:e.handleClick}},[a("q-item-section",{attrs:{avatar:""}},[a("q-icon",{staticStyle:{opacity:"0.7"},attrs:{name:e.icon}})],1),a("q-item-section",[a("q-item-label",[t._v(t._s(e.title))]),a("q-item-label",{attrs:{caption:""}},[t._v(t._s(e.field||t.$t("account_not_set")))])],1),a("q-item-section",{attrs:{side:""}},[e.field&&e.verifiedLabel?a("q-badge",{attrs:{color:e.color,label:e.verifiedLabel}}):t._e()],1),a("q-tooltip",{attrs:{anchor:"center middle",self:"center middle","transition-show":"scale","transition-hide":"scale"}},[t._v("\n          "+t._s(e.verifiedLabel?t.$t("account_change"):t.$t("account_setting"))+"\n        ")])],1)})),1)],1),t.dialogData?a("amplify-dialog",{attrs:{title:t.dialogData.title,"on-submit":t.dialogData.onSubmit},scopedSlots:t._u([{key:"default",fn:function(e){var o=e.disable;return t._l(t.dialogData.form.items,(function(e,i){return a("amplify-input",t._b({key:i,staticStyle:{width:"309px"},attrs:{label:t.$t(e.bound.label),readonly:o},model:{value:e.model,callback:function(a){t.$set(e,"model",a)},expression:"item.model"}},"amplify-input",e.bound,!1))}))}}],null,!1,1359966940),model:{value:t.showDialog,callback:function(e){t.showDialog=e},expression:"showDialog"}}):t._e()],1)},C=[],S=(a("ddb0"),a("5319"),a("ac0b")),x=a("8349");class N extends S["a"]{constructor(){super({phoneNumber:new S["b"](["86","","CN"],{type:"tel",icon:"phone",label:"account_phone_number",rules:S["e"].PhoneNumber})})}setDefault(t){var e;const a=null!==(e=x["c"][t])&&void 0!==e?e:x["c"]["en-us"],[o,i]=a.phones[0].split("-"),n=this.items.phoneNumber;return n.updateModel([o,n.value[1],i]),this}}var q={name:"VerificationFields",components:{SettingFragment:f},props:{loading:Boolean},data(){return{dialogData:null,showDialog:!1,dialogVM:{show:!1,step:0,title:"title",tip:"tip"},handleSubmit:()=>null,formVM:null,waiting:!1}},computed:{items(){const t=t=>t?"positive":"negative",e=t=>this.$t(t?"account_verified":"account_unverified"),a={title:this.$t("account_email"),icon:"email",field:this.$store.state.account.email,color:t(this.$store.state.account.emailVerified),verifiedLabel:e(this.$store.state.account.emailVerified),handleClick:this.handleClickEmail},o={title:this.$t("account_phone_number"),icon:"phone",field:this.$store.state.account.phoneNumber,color:t(this.$store.state.account.phoneNumberVerified),verifiedLabel:e(this.$store.state.account.phoneNumberVerified),handleClick:this.handleClickPhoneNumber};return[a,o]}},methods:{handleClickEmail(){if(this.$store.state.account.identities.length>0)return void r["b"].showNegative("error_can_not_change_email_before_unbound_social_account");if("NOMFA"!==this.$store.state.account.preferredMFA)return void r["b"].showNegative("can_not_change_email_phone_with_mfa_enabled");if(!this.$store.state.account.phoneNumberVerified)return void r["b"].showNegative("can_not_change_email");const t=()=>{const t={title:this.$t("account_change_email"),form:new S["a"]({code:new S["b"]("",{type:"text",icon:"shield",label:"account_verification_code",rules:S["e"].VerificationCode})}),onSubmit:this.handleEmailSubmit};return t},e=()=>{const e={title:this.$t("account_change_email"),form:new S["a"]({email:new S["b"]("",{type:"email",icon:"email",label:"account_email"})}),onSubmit:async()=>{const e=await this.handleEmailSend();e&&(this.dialogData=t())}};return this.$store.state.account.email&&!this.$store.state.account.emailVerified&&e.form.updateModel({email:this.$store.state.account.email}),e};this.dialogData=e(),this.showDialog=!0},async handleEmailSend(){const t=this.dialogData.form.formData;if(t.email===this.$store.state.account.email&&this.$store.state.account.emailVerified)r["b"].showNegative("error_same_email");else try{return await r["a"].changeEmailSend(t.email),!0}catch({message:e}){r["b"].showNegative(e)}},async handleEmailSubmit(){const t=this.dialogData.form.formData;try{return await r["a"].changeEmailSubmit(t.code),r["b"].showPositive("changed"),!0}catch({message:e}){r["b"].showNegative(e)}},handleClickPhoneNumber(){if("NOMFA"!==this.$store.state.account.preferredMFA)return void r["b"].showNegative("can_not_change_email_phone_with_mfa_enabled");if(!this.$store.state.account.emailVerified)return void r["b"].showNegative("can_not_change_phone");const t=()=>{const t={title:this.$t("account_change_phone_number"),form:new S["a"]({code:new S["b"]("",{type:"text",icon:"shield",label:"account_verification_code",rules:S["e"].VerificationCode})}),onSubmit:this.handlePhoneNumberSubmit};return t},e=()=>{const e={title:this.$t("account_change_phone_number"),form:(new N).setDefault(this.$q.lang.getLocale().toLowerCase()),onSubmit:async()=>{const e=await this.handlePhoneNumberSend();e&&(this.dialogData=t())}};if(this.$store.state.account.phoneNumber&&!this.$store.state.account.phoneNumberVerified){const t=this.$store.state.account.phoneNumberCountryCode;let a=this.$store.state.account.phoneNumber;const o=x["a"][t].phones.map((e=>e.replace("-"+t,""))).find((t=>a.startsWith("+"+t)));a=a.substr(o.length+1),console.log([o,a,t]),e.form.updateModel({phoneNumber:[o,a,t]})}return e};this.dialogData=e(),this.showDialog=!0},async handlePhoneNumberSend(){const t=this.dialogData.form.formData,e="+"+t.phoneNumber[0]+t.phoneNumber[1],a=t.phoneNumber[2];if(e===this.$store.state.account.phoneNumber&&this.$store.state.account.phoneNumberVerified)r["b"].showNegative("error_same_phone");else try{return await r["a"].changePhoneNumberSend({phoneNumber:e,phoneNumberCountryCode:a}),!0}catch({message:o}){r["b"].showNegative(o)}},async handlePhoneNumberSubmit(){const t=this.dialogData.form.formData;try{return await r["a"].changePhoneNumberSubmit(t.code),r["b"].showPositive("changed"),!0}catch({message:e}){r["b"].showNegative(e)}}}},M=q,F=(a("a565"),a("1c1c")),O=a("66e5"),A=a("4074"),T=a("0016"),P=a("0170"),I=a("58a81"),E=a("05c0"),L=a("714f"),V=Object(h["a"])(M,k,C,!1,null,"4efb036c",null),Q=V.exports;y()(V,"components",{QList:F["a"],QItem:O["a"],QItemSection:A["a"],QIcon:T["a"],QItemLabel:P["a"],QBadge:I["a"],QTooltip:E["a"]}),y()(V,"directives",{Ripple:L["a"]});var j=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("setting-fragment",{attrs:{label:t.$t("account_security")}},[a("div",{staticClass:"account-setting__security"},[a("security-change-password"),a("security-m-f-a"),a("security-delete-account")],1)])},R=[],z=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("alphabiz-button",{attrs:{label:t.$t("account_change_password")},on:{click:function(){return t.showDialog=!0}}},[a("amplify-dialog",{attrs:{"max-width":"309px",title:t.$t("account_change_password"),"on-submit":t.changePassword,"on-clear":function(){return t.form.clearData()}},scopedSlots:t._u([{key:"default",fn:function(e){var o=e.disable;return t._l(t.form.items,(function(e,i){return a("amplify-input",t._b({key:i,attrs:{label:t.$t(e.bound.label),readonly:o},model:{value:e.model,callback:function(a){t.$set(e,"model",a)},expression:"item.model"}},"amplify-input",e.bound,!1))}))}}]),model:{value:t.showDialog,callback:function(e){t.showDialog=e},expression:"showDialog"}})],1)},B=[];class U extends S["a"]{constructor(){super();const t=this;this.items={currentPassword:new S["b"]("",{type:"password",label:"account_current_password",required:!0}),newPassword:new S["b"]("",{type:"password",label:"account_new_password",required:!0,rules:S["e"].Password}),reEnterPassword:new S["b"]("",{type:"password",label:"account_re_enter_new_password",required:!0,rules:[t.reEnterValidator.bind(t)]})}}reEnterValidator(t){return t===this.items.newPassword.value||"account_password_not_equal"}}var W={name:"SecurityChangePassword",data(){return{showDialog:!1,form:new U}},methods:{async changePassword(){const{currentPassword:t,newPassword:e}=this.form.formData;try{return await r["a"].changePassword(t,e),r["b"].showPositive("password_has_been_reset"),!0}catch(a){const t="Incorrect username or password."===a.message?"incorrect_original_password":a.message;return r["b"].showNegative(t),!1}}}},G=W,J=Object(h["a"])(G,z,B,!1,null,null,null),K=J.exports,H=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("alphabiz-button",{attrs:{label:t.$t("account_set_mfa_type")},on:{click:t.handleClick}},[a("amplify-dialog",{attrs:{"max-width":"309px",title:t.$t("account_set_mfa_type"),"on-submit":t.setMfaType,"on-clear":function(){return t.mfaType=t.$store.state.account.preferredMFA}},scopedSlots:t._u([{key:"description",fn:function(){return[a("div",[t._v(t._s(t.$t("account_tip_config_mfa")))]),a("div",{staticClass:"q-pt-sm q-gutter-xs"},[t.mfaTypeOptions[0].disable?a("div",{staticClass:"normal-grey rounded-borders q-pa-md"},[t._v(t._s(t.$t("account_tip_can_not_enable_totp_mfa"))+"\n        ")]):t._e(),t.mfaTypeOptions[1].disable?a("div",{staticClass:"normal-grey rounded-borders q-pa-md"},[t._v(t._s(t.$t("account_tip_can_not_enable_sms_mfa"))+"\n        ")]):t._e()])]},proxy:!0},{key:"default",fn:function(e){var o=e.disable;return[a("q-option-group",{attrs:{type:"radio",disable:o,options:t.mfaTypeOptions},model:{value:t.mfaType,callback:function(e){t.mfaType=e},expression:"mfaType"}})]}}]),model:{value:t.showSetMfaTypeDialog,callback:function(e){t.showSetMfaTypeDialog=e},expression:"showSetMfaTypeDialog"}}),a("amplify-dialog",{attrs:{"max-width":"309px",title:t.$t("account_disable_mfa"),"on-submit":t.setNoMfa,"on-clear":t.onNoMfaClear},scopedSlots:t._u([{key:"description",fn:function(){return["SMS_MFA"===t.$store.state.account.preferredMFA?a("div",[t._v("\n        "+t._s(t.$t("account_phone_sent_tip"))+"\n        "),a("div",{staticClass:"inline-block normal-grey q-py-xs q-px-md rounded-borders"},[t._v("\n          "+t._s(t.$store.state.account.phoneNumber)+"\n        ")])]):a("div",[t._v(t._s(t.$t("account_tip_verify_totp")))])]},proxy:!0},{key:"default",fn:function(e){var o=e.disable;return["SMS_MFA"===t.$store.state.account.preferredMFA?t._l(t.smsForm.items,(function(e,i){return a("amplify-input",t._b({key:i,staticStyle:{"margin-bottom":"-20px"},attrs:{required:"",label:t.$t(e.bound.label),readonly:o},model:{value:e.model,callback:function(a){t.$set(e,"model",a)},expression:"item.model"}},"amplify-input",e.bound,!1))})):t._l(t.totpForm.items,(function(e,i){return a("amplify-input",t._b({key:i,staticStyle:{"margin-bottom":"-20px"},attrs:{required:"",label:t.$t(e.bound.label),readonly:o},model:{value:e.model,callback:function(a){t.$set(e,"model",a)},expression:"item.model"}},"amplify-input",e.bound,!1))}))]}}]),model:{value:t.showNoMfaDialog,callback:function(e){t.showNoMfaDialog=e},expression:"showNoMfaDialog"}}),a("amplify-dialog",{attrs:{"max-width":"309px",title:t.$t("account_sms_mfa"),"on-submit":t.setSmsMfa,"on-clear":t.onSmsClear},scopedSlots:t._u([{key:"description",fn:function(){return[t._v("\n      "+t._s(t.$t("account_phone_sent_tip"))+"\n      "),a("div",{staticClass:"inline-block normal-grey q-py-xs q-px-md rounded-borders"},[t._v("\n        "+t._s(t.$store.state.account.phoneNumber)+"\n      ")])]},proxy:!0},{key:"default",fn:function(e){var o=e.disable;return t._l(t.smsForm.items,(function(e,i){return a("amplify-input",t._b({key:i,attrs:{required:"",label:t.$t(e.bound.label),readonly:o},model:{value:e.model,callback:function(a){t.$set(e,"model",a)},expression:"item.model"}},"amplify-input",e.bound,!1))}))}}]),model:{value:t.showSmsDialog,callback:function(e){t.showSmsDialog=e},expression:"showSmsDialog"}}),a("amplify-dialog",{attrs:{"max-width":"309px",title:t.$t("account_totp_mfa"),"on-submit":t.setTotpMfa,"on-clear":t.onTotpClear},scopedSlots:t._u([{key:"description",fn:function(){return[a("ol",{staticClass:"q-ma-none q-pl-md"},[a("li",{directives:[{name:"show",rawName:"v-show",value:""!==t.totpSecretCode,expression:"totpSecretCode!==''"}]},[t._v(t._s(t.$t("account_tip_setup_totp")))]),a("li",[t._v(t._s(t.$t("account_tip_verify_totp")))])])]},proxy:!0},{key:"default",fn:function(e){var o=e.disable;return[a("div",{directives:[{name:"show",rawName:"v-show",value:""!==t.totpSecretCode,expression:"totpSecretCode!==''"}],staticClass:"q-mb-md"},[a("div",{staticClass:"qrcode q-mx-auto",on:{click:t.copyCode}},[a("canvas",{ref:"qrcode",staticClass:"full-width full-height"}),a("div",[t._v(t._s(t.$t("account_copy_code")))])])]),t._l(t.totpForm.items,(function(e,i){return a("amplify-input",t._b({key:i,staticStyle:{"margin-bottom":"-20px"},attrs:{required:"",label:t.$t(e.bound.label),readonly:o},model:{value:e.model,callback:function(a){t.$set(e,"model",a)},expression:"item.model"}},"amplify-input",e.bound,!1))})),a("p",{directives:[{name:"show",rawName:"v-show",value:""===t.totpSecretCode,expression:"totpSecretCode===''"}],staticClass:"q-mt-lg q-mb-none"},[t._v(t._s(t.$t("account_no_totp"))+"\n        "),a("a",{staticClass:"text-primary cursor-pointer hover-underline",attrs:{disable:o},on:{click:t.setupTotp}},[t._v("\n          "+t._s(t.$t("account_setup_totp"))+"\n        ")])])]}}]),model:{value:t.showTotpDialog,callback:function(e){t.showTotpDialog=e},expression:"showTotpDialog"}})],1)},X=[],Y=a("d055"),Z=a.n(Y),tt=a("5723"),et={name:"SecurityMFA",data(){return{mfaType:this.$store.state.account.preferredMFA,showSetMfaTypeDialog:!1,showNoMfaDialog:!1,showSmsDialog:!1,showTotpDialog:!1,smsForm:new S["a"]({code:new S["b"]("",{icon:"shield",label:"account_verification_code"})}),totpForm:new S["a"]({code:new S["b"]("",{icon:"shield",label:"account_totp"})}),totpSecretCode:""}},computed:{mfaTypeOptions(){const t=!this.$store.state.account.email||!this.$store.state.account.phoneNumber||!this.$store.state.account.emailVerified||!this.$store.state.account.phoneNumberVerified,e=t;return[{label:this.$t("account_totp_mfa"),value:"SOFTWARE_TOKEN_MFA",disable:e},{label:`${this.$t("account_sms_mfa")} (${this.$t("account_not_recommend")})`,value:"SMS_MFA",disable:t},{label:this.$t("account_disable_mfa"),value:"NOMFA"}]}},methods:{handleClick(){const t=!this.$store.state.account.email||!this.$store.state.account.phoneNumber||!this.$store.state.account.emailVerified||!this.$store.state.account.phoneNumberVerified;t?r["b"].showNegative("error_can_not_enable_mfa"):this.showSetMfaTypeDialog=!0},onNoMfaClear(){this.onTotpClear(),this.onSmsClear()},onSmsClear(){this.smsForm.clearData()},onTotpClear(){this.totpSecretCode="",this.totpForm.clearData()},async setMfaType(){if(this.mfaType===this.$store.state.account.preferredMFA)return!0;try{"NOMFA"===this.mfaType?("SMS_MFA"===this.$store.state.account.preferredMFA&&await Object(tt["t"])("phone_number"),this.showNoMfaDialog=!0):"SMS_MFA"===this.mfaType?(await Object(tt["t"])("phone_number"),this.showSmsDialog=!0):"SOFTWARE_TOKEN_MFA"===this.mfaType&&(this.showTotpDialog=!0)}catch({message:t}){r["b"].showNegative(t)}},async setNoMfa(){try{return"SMS_MFA"===this.$store.state.account.preferredMFA?await Object(tt["v"])("phone_number",this.smsForm.formData.code):await Object(tt["r"])(this.totpForm.formData.code),await r["a"].setMfaType(this.mfaType),r["b"].showPositive("changed"),!0}catch({message:t}){r["b"].showNegative(t)}},async setSmsMfa(){try{return await Object(tt["v"])("phone_number",this.smsForm.formData.code),await r["a"].setMfaType(this.mfaType),r["b"].showPositive("changed"),!0}catch({message:t}){r["b"].showNegative(t)}},async setTotpMfa(){try{return await Object(tt["r"])(this.totpForm.formData.code),await r["a"].setMfaType(this.mfaType),r["b"].showPositive("changed"),!0}catch({message:t}){r["b"].showNegative(t)}},async setupTotp(){this.totpSecretCode=await Object(tt["q"])(),this.$nextTick(this.renderQRCode)},async copyCode(){await navigator.clipboard.writeText(this.totpSecretCode),r["b"].showPositive("clipboard_with_code")},renderQRCode(){if(!this.totpSecretCode)return;const t=this.$refs.qrcode;if(!t)return;let e="Alphabiz Account Services",a=this.$store.state.account.emailVerified?this.$store.state.account.email:e;e=encodeURIComponent(e),a=encodeURIComponent(a).replace(".","%2E");const o=encodeURIComponent(this.totpSecretCode),i=`otpauth://totp/${e}:${a}?secret=${o}&issuer=${e}`;Z.a.toCanvas(t,i,(t=>{if(t)throw t}))}}},at=et,ot=(a("48b8"),a("9f0a")),it=Object(h["a"])(at,H,X,!1,null,"122bbe4a",null),nt=it.exports;y()(it,"components",{QOptionGroup:ot["a"]});var st=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("alphabiz-button",{staticClass:"text-red",attrs:{label:t.$t("account_delete_account")},on:{click:function(){return t.showDialog=!0}}},[a("amplify-dialog",{attrs:{"max-width":"309px",title:t.$t("account_delete_account"),"on-submit":t.deleteAccount},scopedSlots:t._u([{key:"description",fn:function(){return[t._v("\n      "+t._s(t.$t("account_tip_confirm_delete_account"))+"\n    ")]},proxy:!0},{key:"default",fn:function(e){var o=e.disable;return t._l(t.form.items,(function(e,i){return a("amplify-input",t._b({key:i,attrs:{label:t.$t(e.bound.label),readonly:o},model:{value:e.model,callback:function(a){t.$set(e,"model",a)},expression:"item.model"}},"amplify-input",e.bound,!1))}))}}]),model:{value:t.showDialog,callback:function(e){t.showDialog=e},expression:"showDialog"}})],1)},rt=[],lt={name:"SecurityDeleteAccount",data(){return{showDialog:!1,form:new S["a"]({password:new S["b"]("",{icon:"lock",label:"account_password",type:"password",required:!0})})}},methods:{async deleteAccount(){const{password:t}=this.form.formData;try{return await r["a"].deleteUser(t),r["b"].showPositive("deleted"),this.$router.push("/"),this.$amplify.showSignedOutDialog(),!0}catch({message:e}){return r["b"].showNegative(e),!1}}}},ct=lt,ut=Object(h["a"])(ct,st,rt,!1,null,null,null),dt=ut.exports,mt={name:"Security",components:{SettingFragment:f,SecurityChangePassword:K,SecurityMFA:nt,SecurityDeleteAccount:dt}},ht=mt,pt=(a("b5ce"),Object(h["a"])(ht,j,R,!1,null,"5dd25a88",null)),ft=pt.exports,_t=function(){var t=this,e=t.$createElement,a=t._self._c||e;return this.$store.state.account.invitationCode&&this.$store.state.account.invitationCode.length>0?a("setting-fragment",{attrs:{label:t.$t("account_invitation")}},[a("div",{staticClass:"account-setting__invitation"},[a("q-list",{staticClass:"account-setting__invitation-code-container",attrs:{bordered:"",separator:""}},[t._l(t.code,(function(e,o){return[a("q-item",{directives:[{name:"ripple",rawName:"v-ripple",value:!t.loading&&2!==e.state,expression:"!loading && item.state!==2"}],key:o,staticClass:"account-setting__invitation-code-item q-px-lg",attrs:{readonly:t.loading,clickable:!t.loading&&2!==e.state},on:{click:function(){return t.handleCodeClick(e)}}},[a("q-item-section",[a("q-item-label",{staticClass:"text-weight-bold",attrs:{overline:""}},[t._v(t._s(e.code))]),1===e.state?a("q-item-label",{attrs:{caption:""}},[t._v(t._s(e.phone))]):t._e(),1===e.state?a("q-item-label",{attrs:{caption:""}},[t._v(t._s(e.email))]):t._e()],1),a("q-item-section",{attrs:{side:""}},[a("q-badge",{attrs:{color:["positive","blue","general"][e.state],"text-color":["positive","white","general"][e.state],label:t.$t(["account_available","account_invited","account_used"][e.state])}})],1)],1)]}))],2)],1),a("amplify-dialog",{attrs:{title:t.$t("account_invitation"),"on-submit":t.handleInvite,"on-clear":t.handleClear},scopedSlots:t._u([{key:"description",fn:function(){return[a("div",{staticClass:"q-pb-md",staticStyle:{"max-width":"284px"}},[t._v("\n        "+t._s(t.$t("account_invitation_code_dialog_tip"))),a("span",{staticClass:"text-weight-bold"},[a("div",{staticClass:"target-code-field inline-block q-py-xs rounded-borders"},[t._v("  "+t._s(t.targetCode)+"  ")])])])]},proxy:!0},{key:"default",fn:function(e){var o=e.disable;return t._l(t.form.items,(function(e,i){return a("amplify-input",t._b({key:i,staticStyle:{width:"309px"},attrs:{label:t.$t(e.bound.label),readonly:o},model:{value:e.model,callback:function(a){t.$set(e,"model",a)},expression:"item.model"}},"amplify-input",e.bound,!1))}))}}],null,!1,3947596930),model:{value:t.showDialog,callback:function(e){t.showDialog=e},expression:"showDialog"}})],1):t._e()},bt=[];class gt{constructor(t){this.code=t.invitation_code,this.state=t.invitation_state,this.date=new Date(t.production_date).toISOString(),this.phone=t.contact_phone,this.email=t.contact_email}}class vt extends S["a"]{constructor(){super({contact_email:new S["b"]("",{type:"email",icon:"email",label:"account_email"}),contact_phone:new S["b"](["86","","CN"],{type:"tel",icon:"phone",label:"account_phone_number",rules:S["e"].PhoneNumber})})}setDefault(t){var e;const a=null!==(e=x["c"][t])&&void 0!==e?e:x["c"]["en-us"],[o,i]=a.phones[0].split("-"),n=this.items.contact_phone;return n.updateModel([o,n.value[1],i]),this}}var wt={name:"Invitation",components:{SettingFragment:f},props:{loading:Boolean},data(){return{showDialog:!1,targetCode:"",form:(new vt).setDefault(this.$q.lang.getLocale().toLowerCase()),resolveCallback:null}},computed:{code(){const t=this.$store.state.account.invitationCode;return t?t.map((t=>new gt(t))):[]}},methods:{invite(){return new Promise(((t,e)=>{const a=this.code.find((t=>0===t.state));a?(this.targetCode=a.code,this.showDialog=!0,this.resolveCallback=()=>{t()}):e("invitation_no_code")}))},handleCodeClick(t){this.loading||(1===t.state?navigator.clipboard.writeText(t.code).then((()=>r["b"].showPositive("clipboard_with_invitation_code"))):(this.targetCode=t.code,this.showDialog=!0))},async handleInvite(){const t=this.form.formData;t.code=this.targetCode;const e=t.contact_email,a=t.contact_phone[1]?`+${t.contact_phone[0]}${t.contact_phone[1]}`:null;if(console.log(a,e,!!a||!!e),a||e)try{return await r["a"].inviteCode(t.code,e,a),r["b"].showPositive("invitation_code_sent"),!0}catch({message:o}){r["b"].showNegative(o)}else r["b"].showNegative("invitation_channel_required")},handleClear(){this.form.clearData().setDefault(this.$q.lang.getLocale().toLowerCase()),this.resolveCallback&&this.resolveCallback()}}},yt=wt,$t=(a("aae2"),Object(h["a"])(yt,_t,bt,!1,null,"1bfcda2a",null)),Dt=$t.exports;y()($t,"components",{QList:F["a"],QItem:O["a"],QItemSection:A["a"],QItemLabel:P["a"],QBadge:I["a"]}),y()($t,"directives",{Ripple:L["a"]});var kt=function(){var t=this,e=this,a=e.$createElement,o=e._self._c||a;return o("setting-fragment",{attrs:{label:"OAuth"}},[o("div",{staticClass:"account-setting__oauth-manager"},[o("q-list",{staticClass:"account-setting__oauth-manager-container",attrs:{bordered:"",separator:""}},e._l(e.oauthItems,(function(t){return o("q-item",{key:t.providerName},[o("q-item-section",{attrs:{top:"",avatar:""}},[o("q-item-label",{staticClass:"q-mt-sm"},[e._v(e._s(t.providerName))])],1),o("q-item-section",[o("q-item-label",{attrs:{caption:""}},[e._v(e._s(t.caption))])],1),o("q-item-section",{attrs:{top:"",side:""}},[t.linked?o("div",[o("q-btn",{attrs:{size:"12px",flat:"",round:"",icon:"delete"},on:{click:t.deleteFn}})],1):o("div",[o("q-btn",{attrs:{size:"12px",flat:"",round:"",icon:"add"},on:{click:t.addFn}})],1)])],1)})),1)],1),e.oauthDialogData?o("amplify-dialog",{attrs:{title:e.oauthDialogData.title,"on-submit":e.oauthDialogData.onSubmit,"on-clear":function(){return t.oauthDialogData=null}},model:{value:e.showOAuthDialog,callback:function(t){e.showOAuthDialog=t},expression:"showOAuthDialog"}},[o("div",[e._v(e._s(e.oauthDialogData.description))])]):e._e()],1)},Ct=[],St=(a("e01a"),a("a79d"),a("bf82")),xt={name:"OAuthManager",components:{SettingFragment:f},props:{loading:Boolean},data(){return{oauthProviders:["Facebook","Google","Github"],showOAuthDialog:!1,oauthDialogData:null}},computed:{oauthItems(){const t=this.oauthProviders.reduce(((t,e)=>{const a=()=>this.handleAddClick(e);return t[e]={linked:!1,providerName:e,caption:"none",addFn:a},t}),{});if(this.$store.state.account.identities){const e=this.$store.state.account.identities.reduce(((t,e)=>{const a=()=>this.handleDeleteClick(e.providerName);return t[e.providerName]={linked:!0,providerName:e.providerName,caption:e.userId,deleteFn:a},t}),{});return{...t,...e}}return t}},methods:{async handleDeleteClick(t){this.oauthDialogData={title:this.$t("account_unlink_your_social_account"),description:this.$t("account_tip_confirm_unlink",{provider:t}),onSubmit:()=>this.unlink(t)},this.showOAuthDialog=!0},async handleAddClick(t){this.$store.state.account.email&&this.$store.state.account.emailVerified?(this.oauthDialogData={title:this.$t("account_link_your_social_account"),description:this.$t("account_tip_confirm_link",{provider:t}),linkResult:null,onSubmit:()=>this.link(t)},this.showOAuthDialog=!0):r["b"].showNegative("error_can_not_link_before_email_verified")},async link(t){return this.oauthDialogData.description=this.$t("account_tip_linking"),await St["a"].launchOAuth("signedIn",{provider:t}),this.oauthDialogData.linkResult=null,await this.waitForLinkResult(),!0},async waitForLinkResult(){let t;await new Promise((e=>{t=setInterval((()=>{null===this.oauthDialogData.linkResult||e()}),1e3)})).finally((()=>{t&&clearInterval(t)}))},async handleLinkResult(t){t.verify&&t.verify(this.$store.state.account.email),t.error?r["b"].showNegative(t.error):(await r["a"].redirectToIndex(),r["b"].showPositive("linked")),this.oauthDialogData.linkResult=t},async unlink(t){try{this.oauthDialogData.description=this.$t("account_tip_unlinking"),await r["a"].unlinkOAuth(t),r["b"].showPositive("unlinked")}catch(e){r["b"].showNegative(e.message)}return!0}}},Nt=xt,qt=(a("2d0e"),a("9c40")),Mt=Object(h["a"])(Nt,kt,Ct,!1,null,null,null),Ft=Mt.exports;y()(Mt,"components",{QList:F["a"],QItem:O["a"],QItemSection:A["a"],QItemLabel:P["a"],QBtn:qt["a"]});var Ot={name:"AccountSettings.vue",components:{OptionalInformation:D,VerificationFields:Q,OAuthManager:Ft,Security:ft,Invitation:Dt},data(){return{loading:!1}},mounted(){this.$route.query.call&&this.invite()},watch:{"$route.query.call"(t){t&&this.invite()}},methods:{setLoading(t){this.loading=t},invite(){if(this.loading)return;const t=this.$refs.invitation;t.invite().then((()=>{this.$router.push({path:this.$route.path,query:{}})}))}}},At=Ot,Tt=(a("a404"),a("9989")),Pt=a("4983"),It=Object(h["a"])(At,o,i,!1,null,null,null);e["default"]=It.exports;y()(It,"components",{QPage:Tt["a"],QScrollArea:Pt["a"]})},"2d0e":function(t,e,a){"use strict";a("ec18")},"464b":function(t,e,a){},"48b8":function(t,e,a){"use strict";a("ed49")},"5be0":function(t,e,a){"use strict";a("80d5")},7606:function(t,e,a){},"80d5":function(t,e,a){},"88a7":function(t,e,a){},"9cb0":function(t,e,a){},a404:function(t,e,a){"use strict";a("464b")},a565:function(t,e,a){"use strict";a("9cb0")},aae2:function(t,e,a){"use strict";a("88a7")},b5ce:function(t,e,a){"use strict";a("7606")},d226:function(t,e,a){},ec18:function(t,e,a){},ed49:function(t,e,a){}}]);