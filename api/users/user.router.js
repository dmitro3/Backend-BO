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
    updateListNotifi
}  = require("./user.controller");
const router = require("express");
const app = router();
const { checkToken } = require("../../auth/token_validation");
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


app.post("/createAccount", createUserAccount);

app.post("/forgot-password", forgotPassAccount);

app.post("/resend-confirmation-email", resendConfirmationAccount);

app.patch('/change-password', updateUserPasswordByEmailClient);

app.patch('/change-password-is', updateUserPasswordByEmailClient2);

app.post("/create", checkToken, createUser);

app.get('/getAllUser', checkToken, getAllUser);

app.get('/getID/:id', checkToken, getUserById);

app.get('/checkEmail/:email', checkToken, checkUserEmail);


app.patch('/updateUser', checkToken, updateUserById);

app.patch('/updatePassword', checkToken, updateUserPasswordByEmail);

app.patch('/updateMoney', checkToken, updateUserMoneyById);

app.delete('/deleteUserById/:id', checkToken, deleteUserById);


app.post("/activeUser", activeUser);

app.post("/login", loginUser);

app.post("/AdminSingIn", getAdminByAdminUsername);

app.post('/verifiedUser', checkToken, verifiedAccount);


app.get('/getAgency', checkToken, getListAgency);

app.get('/viewTotalMAgency/:id', checkToken, viewMemberAgency)

app.get('/info', checkToken, getInfoUser)

app.get('/analytics', checkToken, getListAnalytics)


app.post('/update-info', checkToken, updateInfoVerify);

app.post('/update-gg2fa', checkToken, activeGoogle2FA);

app.post('/disable-gg2fa', checkToken, unActiveGoogle2FA);

app.get('/create-gg2fa', checkToken, createGoogle2FA);

app.put('/demo', checkToken, reloadMoneyDemo);

app.get('/listbo', checkToken, listHisBO);

app.post('/live-to-usdt', checkToken, LiveToUsdt);

app.post('/usdt-to-live', checkToken, UsdtToLive);

app.post('/withdrawal', checkToken, WithDrawalNoiBo);

app.post('/withdrawal-erc', checkToken, WithDrawalERC);

app.post('/withdrawal-bsc', checkToken, WithDrawalBSC);

app.post('/paypal/withdrawal', checkToken, WithDrawalPaypalNB);

app.post('/paypal/withdrawal-acc', checkToken, WithDrawalPaypalAc);


app.get('/balance-wallet', checkToken, BalanceWallet);

app.post('/usdt-wallet', checkToken, DepositToWallet);

// JunoDev
app.post('/deposit', checkToken, DepositRequest);
app.post('/accept-deposit', checkToken, DepositRequest);


app.post('/buy-vip', checkToken, UserBuyVIP);


app.get('/bo-statistics', checkToken, getBoStatistics);


app.get('/history-order', checkToken, getListHisOrder);

app.post('/history-order-date', checkToken, getListHisOrderDate);


app.get('/history-wallet', checkToken, getListHisTradeWallet);

app.get('/history-wallet/:page', checkToken, getListHisTradeWalletPage);

app.get('/history-wallet-co', checkToken, getListHisTradeWalletHH);

app.get('/history-wallet-co/:page', checkToken, getListHisTradeWalletHHPage);


app.get('/history-wallet-trade', checkToken, getListHisTradeWalletWGD);

app.get('/history-wallet-trade/:page', checkToken, getListHisTradeWalletWGDPage);


app.get('/presenter', checkToken, getNguoiGioiThieu);

app.get('/commission-details', checkToken, getComDetails);

app.get('/commission-details/:page', checkToken, getComDetailsPage);

app.post('/commission-details-date', checkToken, getComDetailsDate);

app.post('/agency-search-lv', checkToken, getAgencySearchLevel);

app.post('/agency-search-name', checkToken, getAgencySearchName);

app.post('/addMoneyMember', checkToken, addMoneyMember);

app.post('/login-2fa', loginG2FA);

app.get('/code-2fa', checkToken , sendCodeG2FA);

app.post("/changeAcc", checkToken, changeAccType);

app.post("/changPassAd", checkToken, changPassAd);

app.post("/getListF1F7", checkToken, getListF1F7);

app.post("/getListCmsHis", checkToken, getListCmsHis);

app.post("/getListNotifi", checkToken, getListNotifi);

app.post("/updateListNotifi", checkToken, updateListNotifi);

module.exports = app;