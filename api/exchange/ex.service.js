const db = require("./../../database");

module.exports = {

    getAllExHis: callback => {
        db.query(
            `select * from exchange_history where delete_status = 0 order by id desc `,
            [], (error, results, fields) => {
                if(error){
                    return callback(error);
                 }
                 return callback(null, results)
            }
        )
    },

    getAllExHisTrash: callback => {
        db.query(
            `select * from exchange_history where delete_status = 1 order by id desc `,
            [], (error, results, fields) => {
                if(error){
                    return callback(error);
                 }
                 return callback(null, results)
            }
        )
    },
    

    deleteExHisById: (data, callback) => {
        db.query(
            `update exchange_history set delete_status= ? where id = ?`,
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

    walletTrans: (data, callback) => {
  
        let amount = data.a  // số tiền cần chuyển
        let nick = data.nick // nick cần chuyển
        let email = data.email // email
        let type_s = data.t_s.toLowerCase()
        let type_r = data.t_r.toLowerCase()


        if(type_s == '' || type_r == '') return callback(error);

        //
        let receive = amount
        let sqlq = `update users set money_${type_s} = money_${type_s} - ?, money_${type_r} = money_${type_r} + ? where nick_name = ?`

        db.query(sqlq,
            [  
                amount,
                receive,
                nick
            ], (error, results, fields) => {
                if(error){
                    return callback(error);
                 }
                //==== IN vào lịch sử

                db.query(`insert into exchange_history (email, nick_name, from_e, to_e, send, receive, status, created_at)
                values(?,?,?,?,?,?,?,now())`,
                    [
                        email,
                        nick,
                        type_s,
                        type_r,
                        amount,
                        receive,
                        1
                    ])

                return callback(null, results)
            }
        )
    },

    
    getExChangeUser: (data, callback) => {

        db.query(
            `SELECT nick_name, from_e, to_e, send, receive, created_at FROM exchange_history WHERE nick_name = ? AND status = 1 ORDER BY id DESC LIMIT 10`,
            [
                data.nick
            ], (error, results, fields) => {
                if(error){
                    return callback(error);
                 }
                 // tổng reco 
                db.query(
                    `SELECT COUNT(from_e) AS totalCount FROM exchange_history WHERE nick_name = ? AND status = 1`, 
                    [
                        data.nick,
                    ],
                    (error, result, fields) => {
                        if(error){
                            return callback(error);
                        }

                        results['count'] = result[0].totalCount
                        return callback(null, results)
                    })
            }
        )
    },
}