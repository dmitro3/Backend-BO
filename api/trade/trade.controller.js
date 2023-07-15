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