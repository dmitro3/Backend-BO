const { 
    getAllExHis,
    getAllExHisTrash,
    deleteExHisById,
    walletTrans,
    getExChangeUser
} = require("./ex.service")

const config = require("./../../config")
const { verify } = require("jsonwebtoken")

module.exports = {

    getAllExHis: (req, res) => {

        getAllExHis((err, results) => {
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

    getAllExHisTrash: (req, res) => {

        getAllExHisTrash((err, results) => {
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

    deleteExHisById: (req, res) => {
        const data = req.body;
        deleteExHisById(data, (err, results) => {
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
  
    walletTrans: (req, res) => {
        const body = req.body;
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if(err){
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            }else{
                
                body['email'] = decoded.result.email
                body['nick'] = decoded.result.nick_name

                walletTrans(body, (err, results) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                    if(!results){
                        return res.json({
                            success: 0,
                            message: "Faile to send user"
                        })
                    }
                    return res.json({
                        success: 1,
                        message: "Send success"
                    })
                })
            }
        })
    },

    getExChangeUser: (req, res) => {
        const body = req.body;
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if(err){
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            }else{
                
                body['email'] = decoded.result.email
                body['nick'] = decoded.result.nick_name
                
                getExChangeUser(body, (err, results) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                    return res.json({
                        success: 1,
                        count: results.count,
                        data: results
                    })
                })
               
            }
        })
    },

}