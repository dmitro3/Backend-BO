(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7733b7fa"],{"2e58":function(t,e,s){"use strict";s.r(e);var r=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"data-list-container",attrs:{id:"list-history-deposit"}},[s("vs-prompt",{staticClass:"export-options",attrs:{title:"Export To Excel","accept-text":"Export",active:t.activePrompt},on:{cancle:t.clearFields,accept:t.exportToExcel,close:t.clearFields,"update:active":function(e){t.activePrompt=e}}},[s("vs-input",{staticClass:"w-full",attrs:{placeholder:"Enter File Name.."},model:{value:t.fileName,callback:function(e){t.fileName=e},expression:"fileName"}}),s("v-select",{staticClass:"my-4",attrs:{options:t.formats},model:{value:t.selectedFormat,callback:function(e){t.selectedFormat=e},expression:"selectedFormat"}}),s("div",{staticClass:"flex"},[s("span",{staticClass:"mr-4"},[t._v("Cell Auto Width:")]),s("vs-switch",{model:{value:t.cellAutoWidth,callback:function(e){t.cellAutoWidth=e},expression:"cellAutoWidth"}},[t._v("Cell Auto Width")])],1)],1),s("div",{staticClass:"vs-con-loading__container",attrs:{id:"loading-corners"}},[s("div",{staticClass:"mb-2"},[s("p",[s("span",{staticClass:"mr-4",staticStyle:{color:"#00ffad"}},[t._v("Tổng tiền đã thêm USDT: "),s("b",[t._v(t._s(t.formatPrice(t.tUSD,2)))])]),s("span",{staticClass:"mr-4",staticStyle:{color:"#00ffad"}},[t._v("Tổng tiền đã thêm BTC: "),s("b",[t._v(t._s(t.formatPrice(t.tBTC,2)))])]),s("span",{staticClass:"mr-4",staticStyle:{color:"#00ffad"}},[t._v("Tổng tiền đã thêm ETH: "),s("b",[t._v(t._s(t.formatPrice(t.tETH,2)))])]),s("span",{staticClass:"mr-4",staticStyle:{color:"#00ffad"}},[t._v("Tổng tiền đã thêm PAYPAL: "),s("b",[t._v(t._s(t.formatPrice(t.tPAYPAL,2)))])]),s("span",{staticClass:"mr-4",staticStyle:{color:"#00ffad"}},[t._v("Tổng tiền đã thêm VN: "),s("b",[t._v(t._s(t.formatPrice(t.tVN,2)))])])])]),s("vs-table",{ref:"table",attrs:{multiple:"",pagination:"","max-items":t.itemsPerPage,search:"",data:t.products},scopedSlots:t._u([{key:"default",fn:function(e){var r=e.data;return[s("tbody",t._l(r,(function(e,r){return s("vs-tr",{key:r,attrs:{data:e}},[s("vs-td",[s("p",{staticClass:"de-name font-medium truncate"},[t._v(t._s(e.email)),s("br"),t._v("Nick: "+t._s(e.nick_name))])]),s("vs-td",[s("p",{staticClass:"de-name font-medium truncate"},[e.type?s("span",[t._v("Marketing")]):s("span",[t._v("Thường")])])]),s("vs-td",[s("p",{staticClass:"de-amount"},[t._v("USDT: "+t._s(t.formatPrice(e.price_USDT,2))),s("br")]),s("p",{staticClass:"de-amount"},[t._v("ETH: "+t._s(t.formatPrice(e.price_ETH,4))),s("br")]),s("p",{staticClass:"de-amount"},[t._v("BTC: "+t._s(t.formatPrice(e.price_BTC,6))),s("br")]),s("p",{staticClass:"de-amount"},[t._v("Paypal: "+t._s(t.formatPrice(e.price_PAYPAL,2))),s("br")]),s("p",{staticClass:"de-amount"},[t._v("VN: "+t._s(t.formatPrice(e.price_VN,0))),s("br")])]),s("vs-td",[s("p",{staticClass:"de-create"},[t._v(t._s(t.formatDate(e.created_at)))])])],1)})),1)]}}]),model:{value:t.selectedUser,callback:function(e){t.selectedUser=e},expression:"selectedUser"}},[s("div",{staticClass:"flex flex-wrap-reverse items-center flex-grow justify-between",attrs:{slot:"header"},slot:"header"},[s("div",{staticClass:"flex flex-wrap-reverse items-center data-list-btn-container"},[s("vs-dropdown",{staticClass:"dd-actions cursor-pointer mr-4 mb-4",attrs:{"vs-trigger-click":""}},[s("div",{staticClass:"p-4 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-center text-lg font-medium w-32 w-full"},[s("span",{staticClass:"mr-2"},[t._v("Tác vụ")]),s("feather-icon",{attrs:{icon:"ChevronDownIcon",svgClasses:"h-4 w-4"}})],1),s("vs-dropdown-menu",[s("vs-dropdown-item",[t.showDeleteMultiBt?s("span",{staticClass:"flex items-center",on:{click:t.deleteMultiple}},[s("feather-icon",{staticClass:"mr-2",attrs:{icon:"TrashIcon",svgClasses:"h-4 w-4"}}),s("span",[t._v("Xóa")])],1):t._e()]),s("vs-dropdown-item",[s("span",{staticClass:"flex items-center",on:{click:function(e){t.activePrompt=!0}}},[s("feather-icon",{staticClass:"mr-2",attrs:{icon:"FileIcon",svgClasses:"h-4 w-4"}}),s("span",[t._v("In")])],1)])],1)],1),s("div",{staticClass:"btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-danger border border-solid border-danger",on:{click:function(e){return e.stopPropagation(),t.trashDataDeposit.apply(null,arguments)}}},[s("feather-icon",{attrs:{icon:"TrashIcon",svgClasses:"h-4 w-4"}}),s("span",{staticClass:"ml-2 text-base text-danger"},[t._v("Thùng rác")])],1),s("div",{staticClass:"btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-success border border-solid border-success",on:{click:t.reloadList}},[s("feather-icon",{attrs:{icon:"ArrowLeftIcon",svgClasses:"h-4 w-4"}}),s("span",{staticClass:"ml-2 text-base text-sucess"},[t._v("Trở về")])],1)],1),s("vs-dropdown",{staticClass:"cursor-pointer mb-4 mr-4 items-per-page-handler",attrs:{"vs-trigger-click":""}},[s("div",{staticClass:"p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"},[s("span",{staticClass:"mr-2"},[t._v(t._s(t.currentPage*t.itemsPerPage-(t.itemsPerPage-1))+" - "+t._s(t.products.length-t.currentPage*t.itemsPerPage>0?t.currentPage*t.itemsPerPage:t.products.length)+" of "+t._s(t.queriedItems))]),s("feather-icon",{attrs:{icon:"ChevronDownIcon",svgClasses:"h-4 w-4"}})],1),s("vs-dropdown-menu",[s("vs-dropdown-item",{on:{click:function(e){t.itemsPerPage=4}}},[s("span",[t._v("4")])]),s("vs-dropdown-item",{on:{click:function(e){t.itemsPerPage=10}}},[s("span",[t._v("10")])]),s("vs-dropdown-item",{on:{click:function(e){t.itemsPerPage=15}}},[s("span",[t._v("15")])]),s("vs-dropdown-item",{on:{click:function(e){t.itemsPerPage=20}}},[s("span",[t._v("20")])])],1)],1)],1),s("template",{slot:"thead"},[s("vs-th",{attrs:{"sort-key":"account"}},[t._v("Tài khoản")]),s("vs-th",{attrs:{"sort-key":"type"}},[t._v("Loại")]),s("vs-th",{attrs:{"sort-key":"amount"}},[t._v("Số tiền")]),s("vs-th",{attrs:{"sort-key":"datecreate"}},[t._v("Thời gian")])],1)],2)],1)],1)},a=[],n=s("4a7a"),i=s.n(n),o=s("c5b9"),c=s("c1df"),u=s.n(c),l=s("2b0e"),d={components:{vSelect:i.a},data:function(){return{showDeleteMultiBt:!0,activePrompt:!1,selectedUser:[],fileName:"",formats:["xlsx","csv","txt"],cellAutoWidth:!0,selectedFormat:"xlsx",headerTitle:["Tài khoản","Loại","Số Tiền","Ngày Nạp"],headerVal:["account","type","amount","datecreate"],productsFake:[],itemsPerPage:10,isMounted:!1,tUSD:0,tETH:0,tBTC:0,tPAYPAL:0,tVN:0}},computed:{currentPage:function(){return this.isMounted?this.$refs.table.currentx:0},products:function(){return this.productsFake},queriedItems:function(){return this.$refs.table?this.$refs.table.queriedResults.length:this.productsFake.length}},methods:{deleteMultiple:function(){var t=this,e=localStorage.getItem("token");if(this.$store.dispatch("setToken",e),0==this.selectedUser.length)return this.$vs.notify({text:"Hãy chọn đối tượng cần xóa",color:"warning",iconPack:"feather",icon:"icon-check"});for(var s=this.selectedUser.length-1;s>=0;s--){var r=this.selectedUser[s]["id"],a={id:r,val:1};o["a"].deleteTrashByID(a).then((function(e){e.data.success||(localStorage.removeItem("token"),t.$router.push("/pages/login").catch((function(){})))})),l["default"].delete(this.productsFake,s)}return this.selectedUser=[],this.$vs.notify({text:"Đã xóa thành công",color:"success",iconPack:"feather",icon:"icon-check"})},deleteDeposit:function(t,e,s){var r=this,a=localStorage.getItem("token");this.$store.dispatch("setToken",a);var n={id:t,val:s};o["a"].deleteTrashByID(n).then((function(t){if(t.data.success)return l["default"].delete(r.productsFake,e),r.popupDeleteActive=!1,r.$vs.notify({text:"Đã xóa thành công",color:"success",iconPack:"feather",icon:"icon-check"});localStorage.removeItem("token"),r.$router.push("/pages/login").catch((function(){}))}))},trashDataDeposit:function(){var t=this;this.showDeleteMultiBt=!1;var e=localStorage.getItem("token");this.$store.dispatch("setToken",e),o["a"].getDepositAllTrash().then((function(e){e.data.success?t.productsFake=e.data.data:(localStorage.removeItem("token"),t.$router.push("/pages/login").catch((function(){})))}))},getOrderStatusColor:function(t){return 0==t?"warning":1==t?"success":"warning"},getOrderStatusColorText:function(t){return 0==t?"Đang xử lý":1==t?"Hoàn thành":"Đang xử lý"},getIconType:function(t){var e=t.toUpperCase();return e},formatDate:function(t){if(t)return u()(String(t)).format("MM/DD/YYYY hh:mm:ss")},formatPrice:function(t,e){void 0===t&&(t=0);var s=new Intl.NumberFormat("en-US",{minimumFractionDigits:e});return s.format(t)},getAmountDecimal:function(t,e){var s="$",r=t.toUpperCase(),a=2;"BTC"==r&&(a=6),"ETH"==r&&(a=4),"USDT"==r&&(a=2),"VN"==r&&(a=0);var n=new Intl.NumberFormat("en-US",{minimumFractionDigits:a});return s+n.format(e)},toggleDataSidebar:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.addNewDataSidebar=t},exportToExcel:function(){var t=this;if(0==this.selectedUser.length)return this.$vs.notify({title:"Xuất dữ liệu",text:"Vui lòng chọn nội dung để hoàn thành",color:"danger",iconPack:"feather",icon:"icon-heart"});Promise.all([s.e("chunk-2a72a530"),s.e("chunk-478e35a7")]).then(s.bind(null,"4bf8d")).then((function(e){var s=t.selectedUser,r=t.formatJson(t.headerVal,s);e.export_json_to_excel({header:t.headerTitle,data:r,filename:t.fileName,autoWidth:t.cellAutoWidth,bookType:t.selectedFormat}),t.clearFields()}))},formatJson:function(t,e){return e.map((function(e){return t.map((function(t){return e[t]}))}))},clearFields:function(){this.fileName="",this.cellAutoWidth=!0,this.selectedFormat="xlsx"},openLoadingInDiv:function(){this.$vs.loading({container:"#loading-corners",type:"corners",scale:.6})},reloadList:function(){var t=this;this.showDeleteMultiBt=!0;var e=localStorage.getItem("token");this.$store.dispatch("setToken",e),o["a"].getAddMoneyListHistory().then((function(e){t.$vs.loading.close("#loading-corners > .con-vs-loading"),4==e.data.success?(localStorage.removeItem("token"),t.$router.push("/pages/login").catch((function(){}))):t.productsFake=e.data.data}))},getTotalAddMoney:function(){var t=this;o["a"].getTotalAddMoney().then((function(e){var s=e.data;1==s.success&&(t.tUSD=s.data.tUSD,t.tETH=s.data.tETH,t.tBTC=s.data.tBTC,t.tPAYPAL=s.data.tPAYPAL,t.tVN=s.data.tVN)}))}},created:function(){this.reloadList(),this.getTotalAddMoney()},mounted:function(){this.isMounted=!0,this.openLoadingInDiv()}},p=d,f=(s("e2eb"),s("2877")),g=Object(f["a"])(p,r,a,!1,null,null,null);e["default"]=g.exports},"562f":function(t,e,s){},"8f8a":function(t){t.exports=JSON.parse('{"BASE_URL":"https://192.168.1.48:3000/","BASE_URL_SOCKET":"wss://192.168.1.48:2096","BASE_URL_SOCKET_SYS":"wss://192.168.1.48:2087","BASE_URL_SOCKET_NAP":"wss://192.168.1.48:2083"}')},c5b9:function(t,e,s){"use strict";var r=s("bc3a"),a=s.n(r),n=s("8f8a"),i=function(){return a.a.create({baseURL:"".concat(n.BASE_URL),headers:{Authorization:"Sky ".concat(localStorage.getItem("tokenUser"))}})},o=function(){return a.a.create({baseURL:"".concat(n.BASE_URL),headers:{Authorization:"Sky ".concat(localStorage.getItem("token"))}})};e["a"]={loginUser:function(t){return i().post("api/users/login",t)},getTokenActive:function(t){return i().post("api/users/activeUser",t)},registerUser:function(t){return i().post("api/users/createAccount",t)},forgotPassUser:function(t){return i().post("api/users/forgot-password",t)},resendConfirUser:function(t){return i().post("api/users/resend-confirmation-email",t)},changePassword:function(t){return i().patch("api/users/change-password",t)},changePassword2:function(t){return i().patch("api/users/change-password-is",t)},getInfoUser:function(){return i().get("api/users/info")},updateXacMinhTK:function(t){return i().post("api/users/update-info",t)},activeGG2FA:function(t){return i().post("api/users/update-gg2fa",t)},unActiveGG2FA:function(t){return i().post("api/users/disable-gg2fa",t)},sendGG2FA:function(){return i().get("api/users/code-2fa")},createGG2FA:function(){return i().get("api/users/create-gg2fa")},loginGG2FA:function(t){return i().post("api/users/login-2fa",t)},reloadMoneyDemo:function(){return i().put("api/users/demo")},getListHitoryOrder:function(){return i().get("api/users/listbo")},sendMoneyLiveToUsdt:function(t){return i().post("api/users/live-to-usdt",t)},sendMoneyUsdtToLive:function(t){return i().post("api/users/usdt-to-live",t)},withdrawalUserNoiBo:function(t){return i().post("api/users/withdrawal",t)},withdrawalUsdtERC:function(t){return i().post("api/users/withdrawal-erc",t)},withdrawalUsdtBSC:function(t){return i().post("api/users/withdrawal-bsc",t)},withdrawalPaypalNoiBo:function(t){return i().post("api/users/paypal/withdrawal",t)},withdrawalPaypalAccount:function(t){return i().post("api/users/paypal/withdrawal-acc",t)},getBalanceWallet:function(){return i().get("api/users/balance-wallet")},depositWallet:function(t){return i().post("api/users/usdt-wallet",t)},depositRequest:function(t){return i().post("api/users/deposit",t)},UserBuyVip:function(){return i().post("api/users/buy-vip")},getNguoiGioiThieu:function(){return i().get("api/users/presenter")},getThongTinLoiNhuan:function(){return i().get("api/users/bo-statistics")},getListHisOrder:function(){return i().get("api/users/history-order")},getSeachListOrder:function(t){return i().post("api/users/history-order-date",t)},getListHisTradeWallet:function(){return i().get("api/users/history-wallet")},getListHisTradeWalletNumber:function(t){return i().get("api/users/history-wallet/"+t)},getListHisTradeWalletHH:function(){return i().get("api/users/history-wallet-co")},getListHisTradeWalletHHNumber:function(t){return i().get("api/users/history-wallet-co/"+t)},getListHisTradeWalletWGD:function(){return i().get("api/users/history-wallet-trade")},getListHisTradeWalletWGDNumber:function(t){return i().get("api/users/history-wallet-trade/"+t)},chiTietLoiNhuanHoaHong:function(){return i().get("api/users/commission-details")},chiTietLoiNhuanHoaHongPage:function(t){return i().get("api/users/commission-details/"+t)},getSeachListChiTietHH:function(t){return i().post("api/users/commission-details-date",t)},getSeachListLvAgency:function(t){return i().post("api/users/agency-search-lv",t)},getSeachListNameAgency:function(t){return i().post("api/users/agency-search-name",t)},depositPaypal:function(t){return i().get("api/paypal/pay?a="+t.a+"&n="+t.n)},getAddressCoin:function(t){return i().get("api/wallet/"+t+"/address")},transWallet:function(t){return i().post("api/exs/trans",t)},getSetupWallet:function(){return i().get("api/setup/wallet")},getExChangeUser:function(){return i().get("api/exs/hisUser")},getStatusServer:function(){return i().get("status")},checkGiaoDich:function(t){return i().post("api/user/balance/trans/check",t)},getListNotifi:function(t){return i().post("api/users/getListNotifi",t)},updateListNotifi:function(t){return i().post("api/users/updateListNotifi",t)},getRevenueNap:function(){return o().get("api/trades/getRevenueNap")},getRevenueRut:function(){return o().get("api/trades/getRevenueRut")},getRevenueTrans:function(){return o().get("api/trades/getRevenueTrans")},getShowDT:function(t){return o().post("api/trades/getShowDT",t)},changeAccMarketing:function(t){return o().post("api/users/changeAcc",t)},changePassAdmin:function(t){return o().post("api/users/changPassAd",t)},createUser:function(t){return o().post("api/users/create",t)},register:function(t){return o().post("api/users/register",t)},loginAdmin:function(t){return o().post("api/users/AdminSingIn",t)},checkEmail:function(t){return o().get("api/users/checkEmail/"+t)},getAllMember:function(){return o().get("api/users/getAllUser")},updateMember:function(t){return o().patch("api/users/updateUser",t)},updatePriceMember:function(t){return o().patch("api/users/updateMoney",t)},deleteMember:function(t){return o().delete("api/users/deleteUserById/"+t)},verifiedUser:function(t){return o().post("api/users/verifiedUser",t)},getListAgency:function(){return o().get("api/users/getAgency")},viewMemberAgency:function(t){return o().get("api/users/viewTotalMAgency/"+t)},addMoneyMember:function(t){return o().post("api/users/addMoneyMember",t)},getRateCommission:function(){return o().get("api/setup/getRateCommission")},saveRateCommission:function(t){return o().post("api/setup/saveRateCommission",t)},getAddMoneyListHistory:function(){return o().get("api/trades/historyAllAddMoney")},getTotalAddMoney:function(){return o().get("api/trades/totalAddMoney")},getTradeListHistory:function(){return o().get("api/trades/historyAll")},gethistoryAllTrash:function(){return o().get("api/trades/historyAllTrash")},deleteTrashByID:function(t){return o().patch("api/trades/deleteTradeHisById",t)},acceptDepositById:function(t){return o().post("api/trades/accept-deposit",t)},getDepositListHistory:function(){return o().get("api/trades/hisDepositAll")},getDepositAllTrash:function(){return o().get("api/trades/hisDepositAllTrash")},getWithdrawalListHistory:function(){return o().get("api/trades/hisWithDrawalAll")},doneWithDrawalByID:function(t){return o().post("api/trades/doneWithdrawal",t)},doneRefuseWithDrawalByID:function(t){return o().post("api/trades/doneRefuseWithdrawal",t)},getListF1F7:function(t){return o().post("api/users/getListF1F7",t)},getLisCommissionSearch:function(t){return o().post("api/users/getListCmsHis",t)},getAnalytics:function(){return o().get("api/users/analytics")},getBetsListHistory:function(){return o().get("api/bets/historyBet")},getBetsListHisTrash:function(){return o().get("api/bets/hisBetTrash")},deleteBetsTrash:function(t){return o().patch("api/bets/deleteBet",t)},getExListHistory:function(){return o().get("api/exs/historyEx")},getExListHisTrash:function(){return o().get("api/exs/historyExTrash")},deleteExTrash:function(t){return o().patch("api/exs/deleteEx",t)},uploadAvatar:function(t){return i().post("api/auth/avatar",t)},uploadPassportFront:function(t){return i().post("api/auth/passport/front",t)},uploadPassportBack:function(t){return i().post("api/auth/passport/back",t)}}},e2eb:function(t,e,s){"use strict";s("562f")}}]);