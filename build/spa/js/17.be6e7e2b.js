(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[17],{"6aaf":function(a,e,o){"use strict";o.r(e);var n=function(){var a=this,e=a.$createElement,o=a._self._c||e;return o("BlockchainPage",{ref:"blockchain",scopedSlots:a._u([{key:"login",fn:function(){return[o("q-dialog",{model:{value:a.walletDialogShow,callback:function(e){a.walletDialogShow=e},expression:"walletDialogShow"}},[o("BlockchainWalletCard",{ref:"wallet"})],1)]},proxy:!0}])})},l=[],t={name:"Blockchain",data(){return{walletDialogShow:!1}},beforeRouteEnter(a,e,o){a.params.action?o((e=>e.handleAction(a.params.action,a.params.action_args))):o()},methods:{async handleAction(a,e){if("transfer"===a){if(console.log("args",e),await new Promise((a=>{if(!this.$refs.blockchain.loading)return void a();const e=this.$watch("$refs.blockchain.loading",(o=>{console.log(o),o||(e(),a())}),{immediate:!0})})),!this.$blockchain.$store.account.account)return;this.walletDialogShow=!0,this.$nextTick((()=>{this.$refs.wallet.handleActionTransfer(e)}))}else console.warn("Invalid action:",a)}}},i=t,c=o("2877"),r=o("24e8"),s=o("eebe"),h=o.n(s),w=Object(c["a"])(i,n,l,!1,null,null,null);e["default"]=w.exports;h()(w,"components",{QDialog:r["a"]})}}]);