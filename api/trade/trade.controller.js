const { 
    getAllTradeHis,
    getAllTradeHisTrash,
    deleteTradeHisById,
    getAllDepositHis,
    getAllDepositHisTrash,
    getAllWithDrawalHis,
    doneWithdrawal,
    getRevenueNap,
    getRevenueRut,
    getRevenueTrans,
    getShowDT,
    historyAllAddMoney,
    totalAddMoney,
    doneRefuseWithdrawal,
    acceptDepositById
} = require("./trade.service")

const config = require("./../../config")


module.exports = {
    // lấy hết lịch giao dịch mọi thứ khác nạp tiền (!= nt,!= nn)
    getAllTradeHis: (req, res) => {

        getAllTradeHis((err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })

    },
    // lấy hết lịch giao dịch mọi thứ khác nạp tiền (!= nt,!= nn)) đã bị delete
    getAllTradeHisTrash: (req, res) => {

        getAllTradeHisTrash((err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })

    },
    // lấy hết từ add_money_history
    historyAllAddMoney: (req, res) => {

        historyAllAddMoney((err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })

    },
    // update delete_status by id 
    deleteTradeHisById: (req, res) => {
        const data = req.body;
        deleteTradeHisById(data, (err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                message: "Delete success"
            })
        })
    },

    acceptDeposit: (req, res) => {
        const data = req.body;
        acceptDepositById(data, (err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                message: "Accept success"
            })
        })
    },
    // lấy mọi giao dịch nạp tiền (nt, nn)
    getAllDepositHis: (req, res) => {

        getAllDepositHis((err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })

    },
    // lấy giao dịch nạp tiền đã bị xoá (nt, nn, delete_status = 1)
    getAllDepositHisTrash: (req, res) => {

        getAllDepositHisTrash((err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })

    },
    // lấy lịch sử rút tiền (rt)
    getAllWithDrawalHis: (req, res) => {

        getAllWithDrawalHis((err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    // update status của trade_history 
    doneWithdrawal: (req, res) => {
        const data = req.body;
        doneWithdrawal(data, (err, results) => {
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success: 0
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
           
    },

    // update status của trade_history thành 2 = từ chối, cộng lại số tiền vào ví money_usdt cho user 
    doneRefuseWithdrawal: (req, res) => {
        const data = req.body;
        doneRefuseWithdrawal(data, (err, results) => {
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success: 0
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
           
    },
    // lấy SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB những cái đã hoàn thành và thuộc mạng bep20 và loại nạp tiền
    getRevenueNap: (req, res) => {

        getRevenueNap((err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })

    },
    // lấy SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB những cái đã hoàn thành và thuộc mạng bep20 và loại rút tiền
    getRevenueRut: (req, res) => {

        getRevenueRut((err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })

    },

    getRevenueTrans: (req, res) => {

        getRevenueTrans((err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })

    },
    // lấy sum ở các bảng trade_history, bet_historym, commission_history
    getShowDT: (req, res) => {
        const data = req.body;
        getShowDT(data, (err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })

    },
    // SELECT SUM(price_USDT) AS tUSD, SUM(price_ETH) AS tETH, SUM(price_BTC) AS tBTC, SUM(price_PAYPAL) AS tPAYPAL, SUM(price_VN) AS tVN FROM add_money_history
    totalAddMoney: (req, res) => {

        totalAddMoney((err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })

    },
}