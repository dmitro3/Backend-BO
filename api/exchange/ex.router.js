const { 
    getAllExHis,
    getAllExHisTrash,
    deleteExHisById,
    walletTrans,
    getExChangeUser
}  = require("./ex.controller");
const router = require("express");
const app = router();
const { checkToken } = require("../../auth/token_validation");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});



app.get("/historyEx", checkToken, getAllExHis);

app.get("/historyExTrash", checkToken, getAllExHisTrash);

app.patch("/deleteEx", checkToken, deleteExHisById);

app.post("/trans", checkToken, walletTrans)

app.get("/hisUser", checkToken, getExChangeUser)


module.exports = app;