const { 
    getAllBetHis,
    getAllBetHisTrash,
    deleteBetHisById
} = require("./bet.service")

const config = require("./../../config")


module.exports = {

    getAllBetHis: (req, res) => {

        getAllBetHis((err, results) => {
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

    getAllBetHisTrash: (req, res) => {

        getAllBetHisTrash((err, results) => {
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

    deleteBetHisById: (req, res) => {
        const data = req.body;
        deleteBetHisById(data, (err, results) => {
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

}