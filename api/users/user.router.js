const {
  createUser,
  getUserById,
  getAllUser,
  checkUserEmail,
  updateUserById,
  updateUserMoneyById,
  updateUserPasswordByEmail,
  deleteUserById,
  loginUser,
  getAdminByAdminUsername,
  verifiedAccount,
  getListAgency,
  viewMemberAgency,
  createUserAccount,
  forgotPassAccount,
  resendConfirmationAccount,
  updateUserPasswordByEmailClient,
  updateUserPasswordByEmailClient2,
  activeUser,
  getInfoUser,
  updateInfoVerify,
  activeGoogle2FA,
  unActiveGoogle2FA,
  createGoogle2FA,
  reloadMoneyDemo,
  listHisBO,
  LiveToUsdt,
  UsdtToLive,
  WithDrawalNoiBo,
  WithDrawalERC,
  WithDrawalBSC,
  BalanceWallet,
  DepositToWallet,
  DepositRequest,
  UserBuyVIP,
  getNguoiGioiThieu,
  getBoStatistics,
  getListHisOrder,
  getListHisOrderDate,
  getListHisTradeWallet,
  getListHisTradeWalletPage,
  getListHisTradeWalletHH,
  getListHisTradeWalletHHPage,
  getListHisTradeWalletWGD,
  getListHisTradeWalletWGDPage,
  getComDetails,
  getComDetailsPage,
  getComDetailsDate,
  getAgencySearchLevel,
  getAgencySearchName,
  loginG2FA,
  sendCodeG2FA,
  getListAnalytics,
  WithDrawalPaypalNB,
  WithDrawalPaypalAc,
  addMoneyMember,
  changeAccType,
  changPassAd,
  getListF1F7,
  getListCmsHis,
  getListNotifi,
  updateListNotifi,
  getAddressToDeposit,
} = require("./user.controller");
const router = require("express");
const app = router();
const { checkToken } = require("../../auth/token_validation");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const db = require("./../../database");

const EVMImpl = require("../../cryptoCurrencies/evmImpl");
const Cryptor = require("../../cryptoCurrencies/crypto");
const BitcoinImpl = require("../../cryptoCurrencies/bitcoinImpl");
const evmImml = new EVMImpl("eth-testnet");
const crypto = new Cryptor(false);
const bitcoinImpl = new BitcoinImpl(false);

app.post("/updateWallet", (req, res) => {
  console.log("test thoi phai vut day nhe khong la bo me day");
  const { email } = req.body;
  if (!email)
    return res.json({
      success: 0,
      message: "no email",
    });
  const bitcoinWallet = bitcoinImpl.createWallet();
  const evmNativeWallet = evmImml.createWallet();
  const evmErc20Wallet = evmImml.createWallet();

  const btcAddress = bitcoinWallet.address;
  const evmNativeAddress = evmNativeWallet.address;
  const evmErc20Address = evmErc20Wallet.address;
  if (
    !bitcoinWallet.privateKey ||
    !evmNativeWallet.privateKey ||
    !evmErc20Wallet.privateKey ||
    !btcAddress ||
    !evmNativeAddress ||
    !evmErc20Address
  ) {
    return res.json({
      success: 0,
      message: "update wallet caught error",
    });
  }

  const encryptedBitCoinWallet = crypto.encryptByPublicKey(bitcoinWallet);
  const encryptedEvmNativeWallet = crypto.encryptByPublicKey(evmNativeWallet);
  const encryptedEvmERC20Wallet = crypto.encryptByPublicKey(evmErc20Wallet);

  db.query(
    `update users set crypted_evm_native_wallet = ?, crypted_evm_erc20_wallet = ?, crypted_btc_wallet = ?, 
    evm_native_address = ?, evm_erc20_address = ?, btc_address = ?,
    updated_at=now() where email = ?`,
    [
      encryptedEvmNativeWallet,
      encryptedEvmERC20Wallet,
      encryptedBitCoinWallet,
      evmNativeAddress,
      evmErc20Address,
      btcAddress,
      email,
    ],
    (error, results, fields) => {
      if (error)
        return res.json({
          success: 0,
          message: "update wallet caught error",
        });
      return res.json({
        success: 1,
        message: "update user wallet success",
        data: {
          bitcoinWallet,
          evmNativeWallet,
          evmErc20Wallet,
        },
      });
    }
  );
});

app.get("/getAddressToDeposit", getAddressToDeposit);
// trigger tại LogRegForGet.vue
// tạo bản ghi mới trong bảng users sau đó gửi email active đến email user /login?a=jsonWebToken
app.post("/createAccount", createUserAccount);

// trigger tại LogRegForGet.vue
// gửi email 1 đường link cho user để user đổi pass phía client có thể tự cho param vào đường link này và đổi pass bất cứ user nào
app.post("/forgot-password", forgotPassAccount);

// trigger tại LogRegForGet.vue
// gửi mail đường link active đến cho user /login?a=jsonWebToken
app.post("/resend-confirmation-email", resendConfirmationAccount);

// trigger tại LogRegForGet.vue
// đổi pass mà không có rào cản gì chỉ cần email là được có thể trigger = postman hoặc dùng client với đường link /reset-password?e=
app.patch("/change-password", updateUserPasswordByEmailClient);

// trigger tại HoSoUser.vue
// đổi pass user với pass cũ và secure_code
app.patch("/change-password-is", updateUserPasswordByEmailClient2);

// trigger tại AccountAllMemberlist.vue Tạo tài khoản => DataViewSidebar.Vue phía admin và HoSoUser.vue => HoSoSetting.vue (user ko có chỗ trigger)
// tạo user marketing có đủ 2 account live và demo với trạng thái active được client truyền vào
app.post("/create", checkToken, createUser);

// trigger tại AccountAllMemberlist.vue Tạo tài khoản => DataViewSidebar.Vue phía admin và HoSoUser.vue => HoSoSetting.vue (user ko có chỗ trigger)
// update user dựa trên id email nick_name first_name last_name vip_user level_vip password
app.patch("/updateUser", checkToken, updateUserById);

// trigger tại AccountAllMemberlist.vue /account/list-all-account và AccountVerifyList.vue /account/list-verify-account
// lấy tất cả thông tin user có vẻ khá phức tạp phải check kỹ phía admin client
app.get("/getAllUser", checkToken, getAllUser);

// không thấy phía client dùng cả admin lẫn user
app.get("/getID/:id", checkToken, getUserById);

// kiểm tra email đã tồn tại chưa
app.get("/checkEmail/:email", checkToken, checkUserEmail);

// đổi pass user bằng pass cũ
app.patch("/updatePassword", checkToken, updateUserPasswordByEmail);

// trigger tại AccountAllMemberList.vue Tạo tài khoản => DataViewSidebar.Vue phía admin và HoSoUser.vue => HoSoSetting.vue (user ko có chỗ trigger)
// update số dư của btc, eth, usdt, vnd của user và thêm bản ghi add_money_history
// app.patch("/updateMoney", checkToken, updateUserMoneyById);

// trigger tại AccountAgencyList.vue AccountAllMemberList.vue đều là phía admin
// chuyển trạng thái active của user thành 0 và deleted_at = now()
app.delete("/deleteUserById/:id", checkToken, deleteUserById);

// trigger khi user follow đường link active ở email update user đặt active = 1 và tạo conde_secure,
// tạo 2 account live và demo cho user này với u_id của account được tạo ngẫu nhiên
app.post("/activeUser", activeUser);

// trigger tại LogRegForGet.vue
// check xem user có active không nếu có thì tạo token gửi cho khách
app.post("/login", loginUser);

// trigger tại src/views/pages/login/loginJWT.vue
// lấy user admin (manage_supers == 1) kiểm tra nếu password chuẩn thì tạo token gửi admin
app.post("/AdminSingIn", getAdminByAdminUsername);

// trigger tại AccountVerifyList.vue path account/list-verify-account phía admin
// update verified status dựa trên user id
app.post("/verifiedUser", checkToken, verifiedAccount);

// trigger tại AccountAgencyList.vue path account/list-agency-account phía admin để liệt kê danh sách agency
// get ds đại lý vip_user = 1
app.get("/getAgency", checkToken, getListAgency);

// trigger tại AccountAgencyList.vue path account/list-agency-account
// lấy ra những người có upline_id là ref_code của agency đấy chỉ lấy được tầng 1
app.get("/viewTotalMAgency/:id", checkToken, viewMemberAgency);

// trigger tại TradeMain.vue, khi đã có token chuyển thẳng vào app lấy thông tin user và update vào getData
// trigger tại LogRegForGet.vue lấy thông tin user và update vào getData,
// trigger tại src/views/trading/Index.vue khi connect với socket sẽ lấy thông tin user và update vào getData
// lấy thông tin user và account dựa trên email cực kỳ phức tạp cần phải chú ý
app.get("/info", checkToken, getInfoUser);

// trigger tại DashboardAnalytics.vue phía admin
// lấy 15 dữ liệu tổng hợp tại 4 bảng users, trade_history, bet_history, commission_history
app.get("/analytics", checkToken, getListAnalytics);

// trigger tại HoSoUser.vue => HoSoSetting.vue
// update user dựa trên email: first_name,last_name, country, so_cmnd, verified = 2 update khi user gửi passport lên cho hệ thống
app.post("/update-info", checkToken, updateInfoVerify);

// trigger tại HoSoUser => GoogleAuth => src/pages/trade/slidebar/2FAGoogle.vue
// create qr code and secret.base32 và gửi cho user
app.get("/create-gg2fa", checkToken, createGoogle2FA);

// trigger tại HoSoUser => GoogleAuth => src/pages/trade/slidebar/2FAGoogle.vue
// dựa trên đoạn mã qr đã tạo cho user lúc đầu validate mã 2fa rồi update mã secret_2fa = qr vào db
// bỏ code_secure(code dùng 1 lần) đi và update secret_2fa
app.post("/update-gg2fa", checkToken, activeGoogle2FA);

// trigger tại HoSoUser => GoogleAuth => src/pages/trade/slidebar/2FAGoogle.vue
// lấy mã qr được lưu trong DB của user validate với mã 2fa rồi xoá secrete_2fa trong DBV đi
app.post("/disable-gg2fa", checkToken, unActiveGoogle2FA);

// trigger tại src/views/trading/Wallet.vue src/pages/trade/navbar/components/Profile.vue
// update account balance của tài khoải demo
app.put("/demo", checkToken, reloadMoneyDemo);

// trigger tại HisOrderBet.vue, TradeMain/VerticalNavMenu/ListMenu/HisOrderBet
// lấy dữ liệu bet_history của 2 account live và demo của user dựa trên email
app.get("/listbo", checkToken, listHisBO);

// trigger tại src/pages/trade/navbar/components/Profile.vue TradeMain/BarVertical_BarHorizontal/Profile
// giảm blance trong account và tăng money_usdt trong users và in vào trade_history
// app.post("/live-to-usdt", checkToken, LiveToUsdt);

// trigger tại src/pages/trade/navbar/components/Profile.vue TradeMain/BarVertical_BarHorizontal/Profile
// giảm money_usdt trong users và tăng balance trong acount và in vào trade_history
// app.post("/usdt-to-live", checkToken, UsdtToLive);

// trigger tại src/views/trading/Wallet/NapRutTien nó là 1 cái popup chỉ có chiều rút ko có nạp
// trừ money_usdt users gửi cộng money_usdt users nhận insert bản ghi trade_history gửi thông bảo telegram
// app.post("/withdrawal", checkToken, WithDrawalNoiBo);

// trigger tại src/views/trading/Wallet/NapRutTien nó là 1 cái popup chỉ có chiều rút ko có nạp
// trừ money_usdt user gửi và cộng money_usdt user nhận in vào trade_history và phải thực hiện chuyển tiền ERC20 ở đâu đó
// app.post("/withdrawal-erc", checkToken, WithDrawalERC);

// trigger tại src/views/trading/Wallet/NapRutTien nó là 1 cái popup chỉ có chiều rút ko có nạp
// trừ money_usdt user lưu vào lịch sử trade_history và phải thực hiện chuyển tiền BSC20 ở đâu đó
// app.post("/withdrawal-bsc", checkToken, WithDrawalBSC);

// trigger tại src/views/trading/Wallet/NapRutTien nó là 1 cái popup chỉ có chiều rút ko có nạp
// nếu số dư money_paypal đủ thì trừ money_paypal người gửi và thêm money_paypal người nhận vứt đi
// app.post("/paypal/withdrawal", checkToken, WithDrawalPaypalNB);

// trigger tại src/views/trading/Wallet/NapRutTien nó là 1 cái popup chỉ có chiều rút ko có nạp
// trừ số dư money_paypal của người gửi thêm bản ghi trade_history và chờ duyệt và gửi money_paypal ở đâu đó trong hệ thống
// app.post("/paypal/withdrawal-acc", checkToken, WithDrawalPaypalAc);

// trigger tại Wallet(trigger khi created) Exchange(trigger khi mount) NapRutTien(trigger khi mount) Profile(trigger khi được mở popup nạp nhanh)
// lấy money_usdt, money_eth, money_btc, money_paypal từ user bằng email
// app.get("/balance-wallet", checkToken, BalanceWallet);

// trigger tại TradeMain/BarVertical_BarHorizontal/Profile
// giảm money_usdt của user đi  và tăng balance của account live lên tạo bản ghi trade_history mới
// app.post("/usdt-wallet", checkToken, DepositToWallet);

// trigger tại src/views/trading/Wallet
// tạo bản ghi trade_history về user nạp tiền và chờ duyệt
app.post("/deposit", checkToken, DepositRequest);

// cái này ko được trigger có 1 api tương tự ben trade_history xử lý cái này
app.post("/accept-deposit", checkToken, DepositRequest);

// trigger tại user/affiliate/general Affiliate.vue
// trừ tiền mua vip set vip cho user chia tiền hoa hồng cho tối đa 7 tầng người giới thiệu của user
// app.post("/buy-vip", checkToken, UserBuyVIP);

// trigger tại history/data-list/list-deposit-view TradeHistory.vue
// lấy các thông số thắng thua từ bet_history và account để xem
app.get("/bo-statistics", checkToken, getBoStatistics);

// trigger tại user/trade/history TradeHistory.vue
// lấy 20 thông tin bet_history gần nhất của 1 account
app.get("/history-order", checkToken, getListHisOrder);

// trigger tại user/trade/history TradeHistory.vue
// lấy thông tin bet_history trong 1 khoảng thời gian nhất định
app.post("/history-order-date", checkToken, getListHisOrderDate);

// trigger tại src/views/trading/Wallet.vue
// lấy thông tin trade_history liên quan đến user
app.get("/history-wallet", checkToken, getListHisTradeWallet);

// trigger tại src/views/trading/Wallet.vue
// lấy thông tin trade_history liên quan đến user theo kiểu phân trang
app.get("/history-wallet/:page", checkToken, getListHisTradeWalletPage);

// trigger tại src/views/trading/Wallet.vue
// lấy thông tin commission_history của user dựa trên ref_code
app.get("/history-wallet-co", checkToken, getListHisTradeWalletHH);

// trigger tại src/views/trading/Wallet.vue
// lấy thông tin commision_history của user dựa trên ref_code theo kiểu phân trang
app.get("/history-wallet-co/:page", checkToken, getListHisTradeWalletHHPage);

// trigger tại src/views/trading/Wallet.vue
// lấy thông tin chuyển tiền từ ví(money_usdt) => account live(balance) và từ account live => ví
app.get("/history-wallet-trade", checkToken, getListHisTradeWalletWGD);

// trigger tại src/views/trading/Wallet.vue
// lấy thông tin chuyển tiền từ ví(money_usdt) => account live(balance) và từ account live => ví có phân trang
app.get(
  "/history-wallet-trade/:page",
  checkToken,
  getListHisTradeWalletWGDPage
);

// trigger tại user/affiliate/general Affiliate.vue phía user
// lấy nhiều thông tin về đại lý cấp dưới cần để ý kỹ phía client nó ghép api thế nào
app.get("/presenter", checkToken, getNguoiGioiThieu);

// trigger tại user/affiliate/general Affiliate.vue
// lấy thanhtoan(tổng tiền chiết khấu) soluongGD(tổng số lượng giao dịch) sonhaGD(tổng số nhà giao dịch)
app.get("/commission-details", checkToken, getComDetails);

// trigger tại user/affiliate/general Affiliate.vue phần trigger đã được comment
// lấy thanhtoan(tổng tiền chiết khấu) soluongGD(tổng số lượng giao dịch) sonhaGD(tổng số nhà giao dịch) theo kiểu phân trang
app.get("/commission-details/:page", checkToken, getComDetailsPage);

// trigger tại user/affiliate/general Affiliate.vue phần trigger đã được comment
// dựa theo ngày lấy hanhtoan(tổng tiền chiết khấu), klgd, soluongGD(tổng số lượng giao dịch), doanhso
app.post("/commission-details-date", checkToken, getComDetailsDate);

// trigger tại user/affiliate/general Affiliate.vue phần trigger đã được comment
// lấy danh sách cấp dưới có dạng {cap1 = [{level_vip, pricePlay AS tklgd, ref_code, upline_id, nick_name}...], cap2...}
app.post("/agency-search-lv", checkToken, getAgencySearchLevel);

// trigger tại user/affiliate/general Affiliate.vue phần trigger đã được comment
// lấy đái lý cấp 1 với cái tên gần giống cái tên client gửi lên
app.post("/agency-search-name", checkToken, getAgencySearchName);

// có lẽ là trừ tiền các ví 1 cách thủ công xong cộng lại balance cho account của tài khoản đấy
// trigger tại portal/tool/data-tool/add-money bỏ phía admin đi và xoá api này
// app.post("/addMoneyMember", checkToken, addMoneyMember);

// Trigger tại LogRegForGet.vue
// luồng trên client như sau khi user trigger ("/login", loginUser) nếu isG2FA == 1 => user sẽ phải trigger cái này xong mới được đưa vào màn chính
// xác minh mã 2fa bằng mã qr của user sau nếu hợp lệ thì lấy data trả cho user
app.post("/login-2fa", loginG2FA);

// tạo code_secure mới update vào DB rồi gửi mail cho khách
app.get("/code-2fa", checkToken, sendCodeG2FA);

// trigger tại account/list-all-account AccountAllMemberList
// chuyển trạng thái marketing của users
app.post("/changeAcc", checkToken, changeAccType);

// trigger tại src/layouts/components/navbar/components/ProfileDropDown.vue tại admin
// đổi pass cho admin
app.post("/changPassAd", checkToken, changPassAd);

// trigger tại account/list-all-account AccountAllMemberList
// lấy thông tin cấp 1 trong các khoảng thời gian khác nhau và lấy thông tin 7 tần còn lại
app.post("/getListF1F7", checkToken, getListF1F7);

// không trigger
// lấy hết từ commission_history cho 1 user cụ thể
app.post("/getListCmsHis", checkToken, getListCmsHis);

// trigger tại TradeMain/BarHorizontal/Profile/NotifiDropDown.vue
// lấy hết notification gửi lên cho user
app.post("/getListNotifi", checkToken, getListNotifi);

// trigger tại TradeMain/BarHorizontal/Profile/NotifiDropDown.vue
// update trạng thái đã xem khi user ấn vào thông báo
app.post("/updateListNotifi", checkToken, updateListNotifi);

module.exports = app;

// analytics sửa lại tạm bỏ query này SELECT COUNT(id) as nNDK, SUM(money_paypal) as tsTNPAYPAL, SUM(money_eth) as tsTNETH, SUM(money_btc) as tsTNBTC, SUM(money_usdt) as tsTNUSD, SUM(money_vn) as tsTNVN FROM users WHERE active = 1 AND marketing = 0

// addMoneyMember portal/tool/data-tool/add-money // đã bỏ
// updateMoney trigger tại AccountAllMemberList.vue Tạo tài khoản => DataViewSidebar.Vue phía admin // đã bỏ
// balance-wallet trigger tại Wallet(trigger khi created) Exchange(trigger khi mount) NapRutTien(trigger khi mount) Profile(trigger khi được mở popup nạp nhanh) // đã bỏ
// WithDrawalPaypalAc trigger tại src/views/trading/Wallet/NapRutTien // đã bỏ
// WithDrawalPaypalNB trigger tại src/views/trading/Wallet/NapRutTien // đã bỏ
// buy-vip trigger tại user/affiliate/general Affiliate.vue đã bỏ
// usdt-wallet(checkMoneyUser) trigger tại TradeMain/BarVertical_BarHorizontal/Profile, Wallet
// usdt-to-live, live-to-usdt trigger tại TradeMain/BarVertical_BarHorizontal/Profile, Wallet
// withdrawal, withdrawal-erc, withdrawal-bsc trigger tại src/views/trading/Wallet/NapRutTien
