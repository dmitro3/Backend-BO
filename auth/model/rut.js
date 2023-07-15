const db = require("../../database");
const axios = require('axios');
const config = require('../../config');

// function formatPrice(value, minimum) {
//     var formatter = new Intl.NumberFormat('en-US', {
//         //style: 'currency',
//         //currency: '',
//         minimumFractionDigits: minimum
//     });
//     return formatter.format(value);
// }

module.exports = async function(bot, id, text) {

    let getDL = text.split("rut ");
    let tentk  = getDL[1];

    if(!!tentk){
        bot.sendMessage(id, `=======🔔ĐANG THỰC HIỆN RÚT CHO MÃ <i>${tentk}</i>🔔========`, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});

        let kq = await new Promise((res, rej) => {
            db.query(
                `SELECT amount, to_u, network FROM trade_history WHERE type_key = ? AND id = ? AND status = ?`, 
                [
                    'rt', // rút tiền
                    tentk,
                    0
                ],(error, results, fields) => {
                    if(error){
                        bot.sendMessage(id, `Lỗi truy vấn dữ liệu`, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});
                        res(null)
                    }
                    res(results);
                })
        })

        
        
        //console.log(kq.length);
        if(kq != null){
            if(kq.length > 0){

                let obj = {
                    id: tentk,
                    val: 1,
                    amount: kq[0].amount,
                    address: kq[0].to_u,
                    network: kq[0].network
                }
        
                axios.post(config.DOMAIN + '/api/trades/doneWithdrawalTele', obj)
                .then((res) => {
                    let d = res.data;
                    if(d.success == 1){
                        bot.sendMessage(id, `
                        =======🔔ĐÃ THỰC HIỆN RÚT CHO MÃ <i>${tentk}</i>🔔========
                        🤝🤝🤝🤝ĐỢI KẾT QUẢ🤝🤝🤝🤝
                        `, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});
                    }else if(d.success == 10){
                        bot.sendMessage(id, `
                        =======🔔RÚT CHO MÃ <i>${tentk}</i>🔔========
                        🤝🤝🤝🤝Tài khoản chưa được xác minh🤝🤝🤝🤝
                        `, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});
                    }else{
                        bot.sendMessage(id, `${d.msg}`, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});
                    }
                    
                })
               
            }else{
                bot.sendMessage(id, `
                =======🔔DOANH THU <i>${tentk}</i>🔔========
                Không tồn tại trong hệ thống
                `, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});
            }

        }

    }else{
        bot.sendMessage(id, `
        =======🔔HMMM🔔========
        ARES-ACCPET rut mãcode
        `, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});
    }
}