(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-675226cb"],{"0873":function(t,e,s){},"1f8b":function(t,e,s){t.exports=s.p+"img/login.d814adb7.png"},"20a7":function(t,e,s){"use strict";s.r(e);var r=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"h-screen flex w-full bg-img vx-row no-gutter items-center justify-center",attrs:{id:"page-login"}},[r("div",{staticClass:"vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4"},[r("vx-card",[r("div",{staticClass:"full-page-bg-color",attrs:{slot:"no-body"},slot:"no-body"},[r("div",{staticClass:"vx-row no-gutter justify-center items-center"},[r("div",{staticClass:"vx-col hidden lg:block lg:w-1/2"},[r("img",{staticClass:"mx-auto",attrs:{src:s("1f8b"),alt:"login"}})]),r("div",{staticClass:"vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg"},[r("div",{staticClass:"px-8 pt-8 login-tabs-container"},[r("div",{staticClass:"vx-card__title mb-4"},[r("h4",{staticClass:"mb-4"},[t._v("Đăng nhập")]),r("p",[t._v("Xin chào, làm ơn hãy đăng nhập.")])]),r("vs-tabs",[r("vs-tab",{attrs:{label:"Hệ thống"}},[r("login-jwt")],1)],1)],1)])])])])],1)])},n=[],a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("vs-input",{directives:[{name:"validate",rawName:"v-validate",value:"required|username|min:3",expression:"'required|username|min:3'"}],staticClass:"w-full",attrs:{"data-vv-validate-on":"blur",name:"text","icon-no-border":"",icon:"icon icon-user","icon-pack":"feather","label-placeholder":"Tài khoản"},model:{value:t.username,callback:function(e){t.username=e},expression:"username"}}),s("span",{staticClass:"text-danger text-sm"},[t._v(t._s(t.errors.first("username")))]),s("vs-input",{directives:[{name:"validate",rawName:"v-validate",value:"required|min:6|max:10",expression:"'required|min:6|max:10'"}],staticClass:"w-full mt-6",attrs:{"data-vv-validate-on":"blur",type:"password",name:"password","icon-no-border":"",icon:"icon icon-lock","icon-pack":"feather","label-placeholder":"Mật khẩu"},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}}),s("span",{staticClass:"text-danger text-sm"},[t._v(t._s(t.errors.first("password")))]),s("div",{staticClass:"flex flex-wrap justify-between my-5"},[s("vs-checkbox",{staticClass:"mb-3",model:{value:t.checkbox_remember_me,callback:function(e){t.checkbox_remember_me=e},expression:"checkbox_remember_me"}},[t._v("Ghi nhớ")])],1),s("div",{staticClass:"flex flex-wrap justify-between mb-3"},[s("vs-button",{attrs:{disabled:!t.validateForm},on:{click:t.loginJWT}},[t._v("Đăng nhập")])],1)],1)},i=[],o=(s("96cf"),s("3b8d")),u=s("c5b9"),c={data:function(){return{username:"",password:"",checkbox_remember_me:!1}},computed:{validateForm:function(){return""!=this.username&&""!=this.password}},methods:{loginJWT:function(){var t=Object(o["a"])(regeneratorRuntime.mark((function t(){var e,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return this.$vs.loading(),e={username:this.username,password:this.password},t.next=4,u["a"].loginAdmin(e);case 4:s=t.sent,this.$vs.loading.close(),s.data.success?(localStorage.setItem("token",s.data.token),this.$store.dispatch("setToken",s.data.token),this.$router.push("/analytics").catch((function(){}))):this.$vs.notify({title:"Error",text:s.data.message,iconPack:"feather",icon:"icon-alert-circle",color:"danger"});case 7:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}()}},p=c,l=s("2877"),d=Object(l["a"])(p,a,i,!1,null,null,null),g=d.exports,f={components:{LoginJwt:g}},h=f,m=(s("9ab6"),Object(l["a"])(h,r,n,!1,null,null,null));e["default"]=m.exports},"8f8a":function(t){t.exports=JSON.parse('{"BASE_URL":"https://192.168.1.48/","BASE_URL_SOCKET":"wss://192.168.1.48:2096","BASE_URL_SOCKET_SYS":"wss://192.168.1.48:2087","BASE_URL_SOCKET_NAP":"wss://192.168.1.48:2083"}')},"9ab6":function(t,e,s){"use strict";s("0873")},c5b9:function(t,e,s){"use strict";var r,n=s("bd86"),a=s("bc3a"),i=s.n(a),o=s("8f8a"),u=function(){return i.a.create({baseURL:"".concat(o.BASE_URL),headers:{Authorization:"Sky ".concat(localStorage.getItem("tokenUser"))}})},c=function(){return i.a.create({baseURL:"".concat(o.BASE_URL),headers:{Authorization:"Sky ".concat(localStorage.getItem("token"))}})};e["a"]=(r={loginUser:function(t){return u().post("api/users/login",t)},getTokenActive:function(t){return u().post("api/users/activeUser",t)},registerUser:function(t){return u().post("api/users/createAccount",t)},forgotPassUser:function(t){return u().post("api/users/forgot-password",t)},resendConfirUser:function(t){return u().post("api/users/resend-confirmation-email",t)},changePassword:function(t){return u().patch("api/users/change-password",t)},changePassword2:function(t){return u().patch("api/users/change-password-is",t)},getInfoUser:function(){return u().get("api/users/info")},updateXacMinhTK:function(t){return u().post("api/users/update-info",t)},activeGG2FA:function(t){return u().post("api/users/update-gg2fa",t)},unActiveGG2FA:function(t){return u().post("api/users/disable-gg2fa",t)},sendGG2FA:function(){return u().get("api/users/code-2fa")},createGG2FA:function(){return u().get("api/users/create-gg2fa")},loginGG2FA:function(t){return u().post("api/users/login-2fa",t)},reloadMoneyDemo:function(){return u().put("api/users/demo")},getListHitoryOrder:function(){return u().get("api/users/listbo")},sendMoneyLiveToUsdt:function(t){return u().post("api/users/live-to-usdt",t)},sendMoneyUsdtToLive:function(t){return u().post("api/users/usdt-to-live",t)},withdrawalUserNoiBo:function(t){return u().post("api/users/withdrawal",t)},withdrawalUsdtERC:function(t){return u().post("api/users/withdrawal-erc",t)},withdrawalUsdtBSC:function(t){return u().post("api/users/withdrawal-bsc",t)},withdrawalPaypalNoiBo:function(t){return u().post("api/users/paypal/withdrawal",t)},withdrawalPaypalAccount:function(t){return u().post("api/users/paypal/withdrawal-acc",t)},getBalanceWallet:function(){return u().get("api/users/balance-wallet")},depositWallet:function(t){return u().post("api/users/usdt-wallet",t)},depositRequest:function(t){return u().post("api/users/deposit",t)},UserBuyVip:function(){return u().post("api/users/buy-vip")},getNguoiGioiThieu:function(){return u().get("api/users/presenter")},getThongTinLoiNhuan:function(){return u().get("api/users/bo-statistics")},getListHisOrder:function(){return u().get("api/users/history-order")},getSeachListOrder:function(t){return u().post("api/users/history-order-date",t)},getListHisTradeWallet:function(){return u().get("api/users/history-wallet")},getListHisTradeWalletNumber:function(t){return u().get("api/users/history-wallet/"+t)},getListHisTradeWalletHH:function(){return u().get("api/users/history-wallet-co")},getListHisTradeWalletHHNumber:function(t){return u().get("api/users/history-wallet-co/"+t)},getListHisTradeWalletWGD:function(){return u().get("api/users/history-wallet-trade")},getListHisTradeWalletWGDNumber:function(t){return u().get("api/users/history-wallet-trade/"+t)},chiTietLoiNhuanHoaHong:function(){return u().get("api/users/commission-details")},chiTietLoiNhuanHoaHongPage:function(t){return u().get("api/users/commission-details/"+t)},getSeachListChiTietHH:function(t){return u().post("api/users/commission-details-date",t)},getSeachListLvAgency:function(t){return u().post("api/users/agency-search-lv",t)},getSeachListNameAgency:function(t){return u().post("api/users/agency-search-name",t)},depositPaypal:function(t){return u().get("api/paypal/pay?a="+t.a+"&n="+t.n)},getAddressCoin:function(t){return u().get("api/wallet/"+t+"/address")},transWallet:function(t){return u().post("api/exs/trans",t)},getSetupWallet:function(){return u().get("api/setup/wallet")},getExChangeUser:function(){return u().get("api/exs/hisUser")},getStatusServer:function(){return u().get("status")},checkGiaoDich:function(t){return u().post("api/user/balance/trans/check",t)},getListNotifi:function(t){return u().post("api/users/getListNotifi",t)},updateListNotifi:function(t){return u().post("api/users/updateListNotifi",t)},getRevenueNap:function(){return c().get("api/trades/getRevenueNap")},getRevenueRut:function(){return c().get("api/trades/getRevenueRut")},getRevenueTrans:function(){return c().get("api/trades/getRevenueTrans")},getShowDT:function(t){return c().post("api/trades/getShowDT",t)},changeAccMarketing:function(t){return c().post("api/users/changeAcc",t)},changePassAdmin:function(t){return c().post("api/users/changPassAd",t)},createUser:function(t){return c().post("api/users/create",t)},register:function(t){return c().post("api/users/register",t)},loginAdmin:function(t){return c().post("api/users/AdminSingIn",t)},checkEmail:function(t){return c().get("api/users/checkEmail/"+t)},getAllMember:function(){return c().get("api/users/getAllUser")},updateMember:function(t){return c().patch("api/users/updateUser",t)},updatePriceMember:function(t){return c().patch("api/users/updateMoney",t)},deleteMember:function(t){return c().delete("api/users/deleteUserById/"+t)},verifiedUser:function(t){return c().post("api/users/verifiedUser",t)},getListAgency:function(){return c().get("api/users/getAgency")},viewMemberAgency:function(t){return c().get("api/users/viewTotalMAgency/"+t)},addMoneyMember:function(t){return c().post("api/users/addMoneyMember",t)},getRateCommission:function(){return c().get("api/setup/getRateCommission")},saveRateCommission:function(t){return c().post("api/setup/saveRateCommission",t)}},Object(n["a"])(r,"saveRateCommission",(function(t){return c().post("api/setup/saveRateCommission",t)})),Object(n["a"])(r,"getAddMoneyListHistory",(function(){return c().get("api/trades/historyAllAddMoney")})),Object(n["a"])(r,"getTotalAddMoney",(function(){return c().get("api/trades/totalAddMoney")})),Object(n["a"])(r,"getTradeListHistory",(function(){return c().get("api/trades/historyAll")})),Object(n["a"])(r,"gethistoryAllTrash",(function(){return c().get("api/trades/historyAllTrash")})),Object(n["a"])(r,"deleteTrashByID",(function(t){return c().patch("api/trades/deleteTradeHisById",t)})),Object(n["a"])(r,"acceptDepositById",(function(t){return c().post("api/trades/accept-deposit",t)})),Object(n["a"])(r,"getDepositListHistory",(function(){return c().get("api/trades/hisDepositAll")})),Object(n["a"])(r,"getDepositAllTrash",(function(){return c().get("api/trades/hisDepositAllTrash")})),Object(n["a"])(r,"getWithdrawalListHistory",(function(){return c().get("api/trades/hisWithDrawalAll")})),Object(n["a"])(r,"doneWithDrawalByID",(function(t){return c().post("api/trades/doneWithdrawal",t)})),Object(n["a"])(r,"doneRefuseWithDrawalByID",(function(t){return c().post("api/trades/doneRefuseWithdrawal",t)})),Object(n["a"])(r,"getListF1F7",(function(t){return c().post("api/users/getListF1F7",t)})),Object(n["a"])(r,"getLisCommissionSearch",(function(t){return c().post("api/users/getListCmsHis",t)})),Object(n["a"])(r,"getAnalytics",(function(){return c().get("api/users/analytics")})),Object(n["a"])(r,"getBetsListHistory",(function(){return c().get("api/bets/historyBet")})),Object(n["a"])(r,"getBetsListHisTrash",(function(){return c().get("api/bets/hisBetTrash")})),Object(n["a"])(r,"deleteBetsTrash",(function(t){return c().patch("api/bets/deleteBet",t)})),Object(n["a"])(r,"getExListHistory",(function(){return c().get("api/exs/historyEx")})),Object(n["a"])(r,"getExListHisTrash",(function(){return c().get("api/exs/historyExTrash")})),Object(n["a"])(r,"deleteExTrash",(function(t){return c().patch("api/exs/deleteEx",t)})),Object(n["a"])(r,"uploadAvatar",(function(t){return u().post("api/auth/avatar",t)})),Object(n["a"])(r,"uploadPassportFront",(function(t){return u().post("api/auth/passport/front",t)})),Object(n["a"])(r,"uploadPassportBack",(function(t){return u().post("api/auth/passport/back",t)})),r)}}]);