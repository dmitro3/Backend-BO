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


// trigger tại history/data-list/list-bet-view ListHisBet
// SELECT * FROM bet_history WHERE status = 1 ORDER BY id DESC LIMIT 1000
app.get("/historyBet", checkToken, getAllBetHis);

// trigger tại history/data-list/list-bet-view ListHisBet
// SELECT * FROM bet_history WHERE status = 0 ORDER BY id desc
app.get("/hisBetTrash", checkToken, getAllBetHisTrash);

// trigger tại history/data-list/list-bet-view ListHisBet
// UPDATE bet_history SET status = ? WHERE id = ?
app.patch("/deleteBet", checkToken, deleteBetHisById);



module.exports = app;