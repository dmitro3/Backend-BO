(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-743cfdc0"],{"210b":function(t,e,a){t.exports=a.p+"img/paypal-mini.4a147115.png"},4174:function(t,e,a){t.exports=a.p+"img/ic_vnd.0640db05.png"},4965:function(t,e,a){"use strict";a("b7a5")},"8f8a":function(t){t.exports=JSON.parse('{"BASE_URL":"https://192.168.1.48/","BASE_URL_SOCKET":"wss://192.168.1.48:2096","BASE_URL_SOCKET_SYS":"wss://192.168.1.48:2087","BASE_URL_SOCKET_NAP":"wss://192.168.1.48:2083"}')},9987:function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("vs-sidebar",{staticClass:"add-new-data-sidebar items-no-padding",attrs:{"click-not-close":"","position-right":"",parent:"body","default-index":"1",color:"primary",spacer:""},model:{value:t.isSidebarActiveLocal,callback:function(e){t.isSidebarActiveLocal=e},expression:"isSidebarActiveLocal"}},[a("div",{staticClass:"mt-6 flex items-center justify-between px-6"},["addMoney"==t.dataType?a("h4",[t._v("CỘNG TIỀN TÀI KHOẢN")]):a("h4",[t._v(t._s(0===Object.entries(this.data).length?"THÊM MỚI":"CẬP NHẬT")+" TÀI KHOẢN")]),a("feather-icon",{staticClass:"cursor-pointer",attrs:{icon:"XIcon"},on:{click:function(e){e.stopPropagation(),t.isSidebarActiveLocal=!1}}})],1),a("vs-divider",{staticClass:"mb-0"}),"addMoney"!=t.dataType?a("VuePerfectScrollbar",{key:t.$vs.rtl,staticClass:"scroll-area--data-list-add-new",staticStyle:{height:"calc(var(--vh, 1vh) * 100 - 16px - 45px - 10px)"},attrs:{settings:t.settings}},[a("div",{staticClass:"p-6"},[t.dataImg?[a("div",{staticClass:"img-container w-64 mx-auto flex items-center justify-center"},[a("img",{attrs:{src:t.dm+"api/auth/me/photo/"+t.dataImg,width:"100",alt:"img"}})])]:t._e(),a("vs-input",{directives:[{name:"validate",rawName:"v-validate",value:"required|email|min:6|max:200",expression:"'required|email|min:6|max:200'"}],staticClass:"mt-5 w-full",attrs:{label:"Hộp thư",type:"email",name:"item-email"},model:{value:t.dataEmail,callback:function(e){t.dataEmail=e},expression:"dataEmail"}}),a("span",{directives:[{name:"show",rawName:"v-show",value:t.errors.has("item-email"),expression:"errors.has('item-email')"}],staticClass:"text-danger text-sm"},[t._v(t._s(t.errors.first("item-email")))]),a("vs-input",{directives:[{name:"validate",rawName:"v-validate",value:"required|min:6|max:20",expression:"'required|min:6|max:20'"}],staticClass:"mt-5 w-full",attrs:{label:"Biệt danh",name:"item-nick"},model:{value:t.dataNick,callback:function(e){t.dataNick=e},expression:"dataNick"}}),a("span",{directives:[{name:"show",rawName:"v-show",value:t.errors.has("item-nick"),expression:"errors.has('item-nick')"}],staticClass:"text-danger text-sm"},[t._v(t._s(t.errors.first("item-nick")))]),a("vs-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"mt-5 w-full",attrs:{label:"Họ",name:"item-first_name"},model:{value:t.dataFirstName,callback:function(e){t.dataFirstName=e},expression:"dataFirstName"}}),a("span",{directives:[{name:"show",rawName:"v-show",value:t.errors.has("item-first_name"),expression:"errors.has('item-first_name')"}],staticClass:"text-danger text-sm"},[t._v(t._s(t.errors.first("item-first_name")))]),a("vs-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"mt-5 w-full",attrs:{label:"Tên",name:"item-last_name"},model:{value:t.dataLastName,callback:function(e){t.dataLastName=e},expression:"dataLastName"}}),a("span",{directives:[{name:"show",rawName:"v-show",value:t.errors.has("item-last_name"),expression:"errors.has('item-last_name')"}],staticClass:"text-danger text-sm"},[t._v(t._s(t.errors.first("item-last_name")))]),a("vs-input",{directives:[{name:"validate",rawName:"v-validate",value:"min:6|max:16",expression:"'min:6|max:16'"}],ref:"password",staticClass:"mt-5 w-full",attrs:{type:"password","data-vv-validate-on":"blur",name:"password",label:"Mật khẩu"},model:{value:t.dataPassword,callback:function(e){t.dataPassword=e},expression:"dataPassword"}}),1==t.superUser?[a("p",{staticClass:"mt-2"},[t._v("Bạn không thể sử Quyền của chính bạn")])]:[a("vs-select",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"mt-5 w-full",attrs:{label:"Quyền",name:"item-category"},model:{value:t.dataPermission,callback:function(e){t.dataPermission=e},expression:"dataPermission"}},t._l(t.category_choices,(function(t){return a("vs-select-item",{key:t.value,attrs:{value:t.value,text:t.text}})})),1),a("span",{directives:[{name:"show",rawName:"v-show",value:t.errors.has("item-category"),expression:"errors.has('item-category')"}],staticClass:"text-danger text-sm"},[t._v(t._s(t.errors.first("item-category")))]),t.dataPermission?a("vs-select",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"mt-5 w-full",attrs:{label:"Cấp",name:"item-category"},model:{value:t.isLevelVIP,callback:function(e){t.isLevelVIP=e},expression:"isLevelVIP"}},t._l(t.category_level,(function(t){return a("vs-select-item",{key:t.value,attrs:{value:t.value,text:t.text}})})),1):t._e()],a("div",{staticClass:"flex flex-wrap items-center p-6",attrs:{slot:"footer"},slot:"footer"},[a("vs-button",{staticClass:"mr-6",attrs:{disabled:!t.isFormValid},on:{click:t.submitDataUpdateUser}},[t._v("Gửi")]),a("vs-button",{attrs:{type:"border",color:"danger"},on:{click:function(e){t.isSidebarActiveLocal=!1}}},[t._v("Hủy")])],1)],2)]):a("VuePerfectScrollbar",{key:t.$vs.rtl,staticClass:"scroll-area--data-list-add-new",staticStyle:{height:"calc(var(--vh, 1vh) * 100 - 16px - 45px - 10px)"},attrs:{settings:t.settings}},[a("div",{staticClass:"p-6"},[a("span",{staticClass:"mb-10"},[t._v("\n          "+t._s(t.dataEmail)+"\n        ")]),a("vs-input",{directives:[{name:"validate",rawName:"v-validate",value:{required:!0,regex:/\d+(\.\d+)?$/},expression:"{ required: true, regex: /\\d+(\\.\\d+)?$/ }"}],staticClass:"mt-5 w-full",attrs:{label:"Ví VNĐ","icon-pack":"feather",icon:"icon-dollar-sign",name:"item-wallet_vn"},model:{value:t.addDataMoneyVN,callback:function(e){t.addDataMoneyVN=e},expression:"addDataMoneyVN"}}),a("span",{directives:[{name:"show",rawName:"v-show",value:t.errors.has("item-wallet_vn"),expression:"errors.has('item-wallet_vn')"}],staticClass:"text-danger text-sm"},[t._v(t._s(t.errors.first("item-wallet_vn")))]),a("vs-input",{directives:[{name:"validate",rawName:"v-validate",value:{required:!0,regex:/\d+(\.\d+)?$/},expression:"{ required: true, regex: /\\d+(\\.\\d+)?$/ }"}],staticClass:"mt-5 w-full",attrs:{label:"Ví BTC","icon-pack":"feather",icon:"icon-dollar-sign"},model:{value:t.addDataMoneyBTC,callback:function(e){t.addDataMoneyBTC=e},expression:"addDataMoneyBTC"}}),a("vs-input",{directives:[{name:"validate",rawName:"v-validate",value:{required:!0,regex:/\d+(\.\d+)?$/},expression:"{ required: true, regex: /\\d+(\\.\\d+)?$/ }"}],staticClass:"mt-5 w-full",attrs:{label:"Ví ETH","icon-pack":"feather",icon:"icon-dollar-sign"},model:{value:t.addDataMoneyETH,callback:function(e){t.addDataMoneyETH=e},expression:"addDataMoneyETH"}}),a("vs-input",{directives:[{name:"validate",rawName:"v-validate",value:{required:!0,regex:/\d+(\.\d+)?$/},expression:"{ required: true, regex: /\\d+(\\.\\d+)?$/ }"}],staticClass:"mt-5 w-full",attrs:{label:"Ví USDT","icon-pack":"feather",icon:"icon-dollar-sign"},model:{value:t.addDataMoneyUSDT,callback:function(e){t.addDataMoneyUSDT=e},expression:"addDataMoneyUSDT"}}),a("div",{staticClass:"flex flex-wrap items-center p-6",attrs:{slot:"footer"},slot:"footer"},[a("vs-button",{staticClass:"mr-6",attrs:{disabled:!t.isFormValid},on:{click:t.submitDataUpdateMoney}},[t._v("Gửi")]),a("vs-button",{attrs:{type:"border",color:"danger"},on:{click:function(e){t.isSidebarActiveLocal=!1}}},[t._v("Hủy")])],1)],1)])],1)},i=[],r=(a("ac6a"),a("ffc1"),a("9d63")),n=a.n(r),o=a("c5b9"),c=a("8f8a"),u={props:{isSidebarActive:{type:Boolean,required:!0},data:{type:Object,default:function(){}}},watch:{isSidebarActive:function(t){if(t)if(0===Object.entries(this.data).length)this.initValues(),this.$validator.reset();else{var e=JSON.parse(JSON.stringify(this.data)),a=e.email,s=e.id,i=e.nick_name,r=e.first_name,n=e.last_name,o=e.money_vn,c=e.money_btc,u=e.money_eth,d=e.money_usdt,l=e.profile_image,p=e.type,m=e.vip_user,h=e.super_user,f=e.level_vip;this.dataId=s,this.dataEmail=a,this.dataNick=i,this.dataFirstName=r,this.dataLastName=n,this.dataMoneyVN=o,this.dataMoneyBTC=this.formatPrice(c,6),this.dataMoneyETH=this.formatPrice(u,4),this.dataMoneyUSDT=this.formatPrice(d,2),this.dataImg=l,this.dataPassword="",this.dataPermission=m,this.superUser=h,this.dataType=p,this.addDataMoneyVN=0,this.addDataMoneyBTC=this.formatPrice(0,6),this.addDataMoneyETH=this.formatPrice(0,4),this.addDataMoneyUSDT=this.formatPrice(0,2),this.isLevelVIP=f,this.initValues()}}},data:function(){return{dm:c.BASE_URL,superUser:0,dataId:null,dataEmail:"",dataNick:"",dataFirstName:"",dataLastName:"",dataMoneyVN:0,dataMoneyBTC:0,dataMoneyETH:0,dataMoneyUSDT:0,dataImg:null,dataPassword:"",dataPermission:0,dataType:null,addDataMoneyVN:0,addDataMoneyBTC:0,addDataMoneyETH:0,addDataMoneyUSDT:0,category_choices:[{text:"Đại lý ( VIP )",value:1},{text:"Thành viên",value:0}],category_level:[{text:"Cấp 0",value:0},{text:"Cấp 1",value:1},{text:"Cấp 2",value:2},{text:"Cấp 3",value:3},{text:"Cấp 4",value:4},{text:"Cấp 5",value:5},{text:"Cấp 6",value:6},{text:"Cấp 7",value:7}],isLevelVIP:0,settings:{maxScrollbarLength:60,wheelSpeed:.6}}},computed:{isSidebarActiveLocal:{get:function(){return this.isSidebarActive},set:function(t){t||this.$emit("closeSidebar")}},isFormValid:function(){return"addMoney"!=this.dataType?!this.errors.any()&&this.dataEmail&&this.dataNick&&this.dataFirstName&&this.dataLastName:this.addDataMoneyVN>=0&&this.addDataMoneyBTC>=0&&this.addDataMoneyETH>=0&&this.addDataMoneyUSDT>=0}},methods:{formatPrice:function(t,e){var a=new Intl.NumberFormat("en-US",{minimumFractionDigits:e});return a.format(t)},initValues:function(){this.data.id||(this.dataId=null,this.dataEmail="",this.dataNick="",this.dataFirstName="",this.dataLastName="",this.dataMoneyVN=0,this.dataMoneyBTC=0,this.dataMoneyETH=0,this.dataMoneyUSDT=0,this.superUser=0,this.dataImg=null,this.dataPassword="",this.dataPermission=0,this.dataType=null,this.addDataMoneyVN=0,this.addDataMoneyBTC=0,this.addDataMoneyETH=0,this.addDataMoneyUSDT=0)},submitDataUpdateMoney:function(){var t=this,e={id:this.dataId,nick_name:this.dataNick,email:this.dataEmail,type:1,money_paypal:0,money_btc:this.addDataMoneyBTC,money_eth:this.addDataMoneyETH,money_usdt:this.addDataMoneyUSDT,money_vn:this.addDataMoneyVN};o["a"].updatePriceMember(e).then((function(e){return e.data.success?t.$vs.notify({text:"Đã cộng tiền thành công cho "+t.dataNick,color:"success",iconPack:"feather",icon:"icon-check"}):e.data.l?t.$vs.notify({text:e.data.message,color:"danger",iconPack:"feather",icon:"icon-alert-circle"}):t.$vs.notify({text:"Thời gian đăng nhập đã hết, vui lòng đăng nhập lại để sử dụng",color:"danger",iconPack:"feather",icon:"icon-alert-circle"})}))},submitDataUpdateUser:function(){var t=this;this.$validator.validateAll().then((function(e){if(e){var a={id:t.dataId,nick_name:t.dataNick,first_name:t.dataFirstName,last_name:t.dataLastName,email:t.dataEmail,vip_user:t.dataPermission,level_vip:t.isLevelVIP,active:1};""!=t.dataPassword&&(a.password=t.dataPassword),0==Object.entries(t.data).length?o["a"].checkEmail(t.dataEmail).then((function(e){if(e.data.success)return t.$vs.notify({text:"Email này đã tồn tại",color:"danger",iconPack:"feather",icon:"icon-alert-circle"});o["a"].createUser(a).then((function(e){return e.data.success?t.$vs.notify({title:t.dataEmail,text:"Bạn đã tạo thành công",color:"success",iconPack:"feather",icon:"icon-check"}):t.$vs.notify({text:e.data.message,color:"danger",iconPack:"feather",icon:"icon-alert-circle"})}))})):o["a"].updateMember(a).then((function(e){return e.data.success?t.$vs.notify({text:"Đã cập nhập thông tin thành công cho "+t.dataNick,color:"success",iconPack:"feather",icon:"icon-check"}):t.$vs.notify({text:e.data.message,color:"danger",iconPack:"feather",icon:"icon-alert-circle"})}))}}))},updateCurrImg:function(t){var e=this;if(t.target.files&&t.target.files[0]){var a=new FileReader;a.onload=function(t){e.dataImg=t.target.result},a.readAsDataURL(t.target.files[0])}}},components:{VuePerfectScrollbar:n.a}},d=u,l=(a("4965"),a("2877")),p=Object(l["a"])(d,s,i,!1,null,"1571c1a9",null);e["a"]=p.exports},b7a5:function(t,e,a){},c5b9:function(t,e,a){"use strict";var s,i=a("bd86"),r=a("bc3a"),n=a.n(r),o=a("8f8a"),c=function(){return n.a.create({baseURL:"".concat(o.BASE_URL),headers:{Authorization:"Sky ".concat(localStorage.getItem("tokenUser"))}})},u=function(){return n.a.create({baseURL:"".concat(o.BASE_URL),headers:{Authorization:"Sky ".concat(localStorage.getItem("token"))}})};e["a"]=(s={loginUser:function(t){return c().post("api/users/login",t)},getTokenActive:function(t){return c().post("api/users/activeUser",t)},registerUser:function(t){return c().post("api/users/createAccount",t)},forgotPassUser:function(t){return c().post("api/users/forgot-password",t)},resendConfirUser:function(t){return c().post("api/users/resend-confirmation-email",t)},changePassword:function(t){return c().patch("api/users/change-password",t)},changePassword2:function(t){return c().patch("api/users/change-password-is",t)},getInfoUser:function(){return c().get("api/users/info")},updateXacMinhTK:function(t){return c().post("api/users/update-info",t)},activeGG2FA:function(t){return c().post("api/users/update-gg2fa",t)},unActiveGG2FA:function(t){return c().post("api/users/disable-gg2fa",t)},sendGG2FA:function(){return c().get("api/users/code-2fa")},createGG2FA:function(){return c().get("api/users/create-gg2fa")},loginGG2FA:function(t){return c().post("api/users/login-2fa",t)},reloadMoneyDemo:function(){return c().put("api/users/demo")},getListHitoryOrder:function(){return c().get("api/users/listbo")},sendMoneyLiveToUsdt:function(t){return c().post("api/users/live-to-usdt",t)},sendMoneyUsdtToLive:function(t){return c().post("api/users/usdt-to-live",t)},withdrawalUserNoiBo:function(t){return c().post("api/users/withdrawal",t)},withdrawalUsdtERC:function(t){return c().post("api/users/withdrawal-erc",t)},withdrawalUsdtBSC:function(t){return c().post("api/users/withdrawal-bsc",t)},withdrawalPaypalNoiBo:function(t){return c().post("api/users/paypal/withdrawal",t)},withdrawalPaypalAccount:function(t){return c().post("api/users/paypal/withdrawal-acc",t)},getBalanceWallet:function(){return c().get("api/users/balance-wallet")},depositWallet:function(t){return c().post("api/users/usdt-wallet",t)},depositRequest:function(t){return c().post("api/users/deposit",t)},UserBuyVip:function(){return c().post("api/users/buy-vip")},getNguoiGioiThieu:function(){return c().get("api/users/presenter")},getThongTinLoiNhuan:function(){return c().get("api/users/bo-statistics")},getListHisOrder:function(){return c().get("api/users/history-order")},getSeachListOrder:function(t){return c().post("api/users/history-order-date",t)},getListHisTradeWallet:function(){return c().get("api/users/history-wallet")},getListHisTradeWalletNumber:function(t){return c().get("api/users/history-wallet/"+t)},getListHisTradeWalletHH:function(){return c().get("api/users/history-wallet-co")},getListHisTradeWalletHHNumber:function(t){return c().get("api/users/history-wallet-co/"+t)},getListHisTradeWalletWGD:function(){return c().get("api/users/history-wallet-trade")},getListHisTradeWalletWGDNumber:function(t){return c().get("api/users/history-wallet-trade/"+t)},chiTietLoiNhuanHoaHong:function(){return c().get("api/users/commission-details")},chiTietLoiNhuanHoaHongPage:function(t){return c().get("api/users/commission-details/"+t)},getSeachListChiTietHH:function(t){return c().post("api/users/commission-details-date",t)},getSeachListLvAgency:function(t){return c().post("api/users/agency-search-lv",t)},getSeachListNameAgency:function(t){return c().post("api/users/agency-search-name",t)},depositPaypal:function(t){return c().get("api/paypal/pay?a="+t.a+"&n="+t.n)},getAddressCoin:function(t){return c().get("api/wallet/"+t+"/address")},transWallet:function(t){return c().post("api/exs/trans",t)},getSetupWallet:function(){return c().get("api/setup/wallet")},getExChangeUser:function(){return c().get("api/exs/hisUser")},getStatusServer:function(){return c().get("status")},checkGiaoDich:function(t){return c().post("api/user/balance/trans/check",t)},getListNotifi:function(t){return c().post("api/users/getListNotifi",t)},updateListNotifi:function(t){return c().post("api/users/updateListNotifi",t)},getRevenueNap:function(){return u().get("api/trades/getRevenueNap")},getRevenueRut:function(){return u().get("api/trades/getRevenueRut")},getRevenueTrans:function(){return u().get("api/trades/getRevenueTrans")},getShowDT:function(t){return u().post("api/trades/getShowDT",t)},changeAccMarketing:function(t){return u().post("api/users/changeAcc",t)},changePassAdmin:function(t){return u().post("api/users/changPassAd",t)},createUser:function(t){return u().post("api/users/create",t)},register:function(t){return u().post("api/users/register",t)},loginAdmin:function(t){return u().post("api/users/AdminSingIn",t)},checkEmail:function(t){return u().get("api/users/checkEmail/"+t)},getAllMember:function(){return u().get("api/users/getAllUser")},updateMember:function(t){return u().patch("api/users/updateUser",t)},updatePriceMember:function(t){return u().patch("api/users/updateMoney",t)},deleteMember:function(t){return u().delete("api/users/deleteUserById/"+t)},verifiedUser:function(t){return u().post("api/users/verifiedUser",t)},getListAgency:function(){return u().get("api/users/getAgency")},viewMemberAgency:function(t){return u().get("api/users/viewTotalMAgency/"+t)},addMoneyMember:function(t){return u().post("api/users/addMoneyMember",t)},getRateCommission:function(){return u().get("api/setup/getRateCommission")},saveRateCommission:function(t){return u().post("api/setup/saveRateCommission",t)}},Object(i["a"])(s,"saveRateCommission",(function(t){return u().post("api/setup/saveRateCommission",t)})),Object(i["a"])(s,"getAddMoneyListHistory",(function(){return u().get("api/trades/historyAllAddMoney")})),Object(i["a"])(s,"getTotalAddMoney",(function(){return u().get("api/trades/totalAddMoney")})),Object(i["a"])(s,"getTradeListHistory",(function(){return u().get("api/trades/historyAll")})),Object(i["a"])(s,"gethistoryAllTrash",(function(){return u().get("api/trades/historyAllTrash")})),Object(i["a"])(s,"deleteTrashByID",(function(t){return u().patch("api/trades/deleteTradeHisById",t)})),Object(i["a"])(s,"acceptDepositById",(function(t){return u().post("api/trades/accept-deposit",t)})),Object(i["a"])(s,"getDepositListHistory",(function(){return u().get("api/trades/hisDepositAll")})),Object(i["a"])(s,"getDepositAllTrash",(function(){return u().get("api/trades/hisDepositAllTrash")})),Object(i["a"])(s,"getWithdrawalListHistory",(function(){return u().get("api/trades/hisWithDrawalAll")})),Object(i["a"])(s,"doneWithDrawalByID",(function(t){return u().post("api/trades/doneWithdrawal",t)})),Object(i["a"])(s,"doneRefuseWithDrawalByID",(function(t){return u().post("api/trades/doneRefuseWithdrawal",t)})),Object(i["a"])(s,"getListF1F7",(function(t){return u().post("api/users/getListF1F7",t)})),Object(i["a"])(s,"getLisCommissionSearch",(function(t){return u().post("api/users/getListCmsHis",t)})),Object(i["a"])(s,"getAnalytics",(function(){return u().get("api/users/analytics")})),Object(i["a"])(s,"getBetsListHistory",(function(){return u().get("api/bets/historyBet")})),Object(i["a"])(s,"getBetsListHisTrash",(function(){return u().get("api/bets/hisBetTrash")})),Object(i["a"])(s,"deleteBetsTrash",(function(t){return u().patch("api/bets/deleteBet",t)})),Object(i["a"])(s,"getExListHistory",(function(){return u().get("api/exs/historyEx")})),Object(i["a"])(s,"getExListHisTrash",(function(){return u().get("api/exs/historyExTrash")})),Object(i["a"])(s,"deleteExTrash",(function(t){return u().patch("api/exs/deleteEx",t)})),Object(i["a"])(s,"uploadAvatar",(function(t){return c().post("api/auth/avatar",t)})),Object(i["a"])(s,"uploadPassportFront",(function(t){return c().post("api/auth/passport/front",t)})),Object(i["a"])(s,"uploadPassportBack",(function(t){return c().post("api/auth/passport/back",t)})),s)}}]);