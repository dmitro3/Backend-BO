const db = require("./../../database");


module.exports = {

    getUSDTAddress: (nick, callback)  => {
        db.query(
            `select address_USDT from users where nick_name = ?`,
            [
                nick
            ], (error, results, fields) => {
                if(error){
                    return callback(error);
                 }
                 return callback(null, results[0].address_USDT)
            }
        )
    },

    getBTCAddress: (nick, callback)  => {
        db.query(
            `select address_BTC from users where nick_name = ?`,
            [
                nick
            ], (error, results, fields) => {
                if(error){
                    return callback(error);
                 }
                 return callback(null, results[0].address_BTC)
            }
        )
    },

    getETHAddress: (nick, callback)  => {
        db.query(
            `select address_USDT from users where nick_name = ?`,
            [
                nick
            ], (error, results, fields) => {
                if(error){
                    return callback(error);
                 }
                 return callback(null, results[0].address_USDT)
            }
        )
    },
    

    
}