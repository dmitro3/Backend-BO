const { 
    getAllBetHis,
    getAllBetHisTrash,
    deleteBetHisById
}  = require("./bet.controller");
const router = require("express");
const app = router();
const { checkToken } = require("../../auth/token_validation");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});



app.get("/historyBet", checkToken, getAllBetHis);

app.get("/hisBetTrash", checkToken, getAllBetHisTrash);

app.patch("/deleteBet", checkToken, deleteBetHisById);



module.exports = app;