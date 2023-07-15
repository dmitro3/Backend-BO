const db = require("./../../database");


module.exports = {

    getAllBetHis: callback => {
        db.query(
            `SELECT * FROM bet_history WHERE status = 1 ORDER BY id DESC LIMIT 1000`,
            [], (error, results, fields) => {
                if(error){
                    return callback(error);
                 }
                 return callback(null, results)
            }
        )
    },

    getAllBetHisTrash: callback => {
        db.query(
            `SELECT * FROM bet_history WHERE status = 0 ORDER BY id desc `,
            [], (error, results, fields) => {
                if(error){
                    return callback(error);
                 }
                 return callback(null, results)
            }
        )
    },
    

    deleteBetHisById: (data, callback) => {
        db.query(
            `UPDATE bet_history SET status = ? WHERE id = ?`,
            [   data.val,
                data.id
            ], (error, results, fields) => {
                if(error){
                    return callback(error);
                 }
                 return callback(null, results)
            }
        )
    },
 
}