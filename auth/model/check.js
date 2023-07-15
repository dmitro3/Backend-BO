const db = require("../../database")

function formatPrice(value, minimum) {
    var formatter = new Intl.NumberFormat('en-US', {
        //style: 'currency',
        //currency: '',
        minimumFractionDigits: minimum
    });
    return formatter.format(value);
}

module.exports = async function(bot, id, text) {

    let getDL = text.split("check ");
    let tentk  = getDL[1];

    if(!!tentk){
        bot.sendMessage(id, `=======🔔ĐANG KIỂM TRA <i>${tentk}</i>🔔========`, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});

        let kq = await new Promise((res, rej) => {
            db.query(
                `SELECT pricePlay, priceWin, priceLose FROM users WHERE nick_name = ?`, 
                [
                    tentk
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

                let tc = kq[0].pricePlay; // tổng số thu nhập
                let tw = kq[0].priceWin; // tổng số phí
                let pl = kq[0].priceLose; // tổng thu nhập thực

                let email = await new Promise((res, rej) => {
                    db.query(
                        `SELECT email FROM users WHERE nick_name = ?`, 
                        [
                            tentk
                        ],(error, result, fields) => {
                            let e = result[0].email;
                            res(e);
                        }
                    )
                })
    
                let PlayToday = await new Promise((res, rej) => {
                    // win //SELECT COUNT(email) AS slBET FROM bet_history WHERE email = ? AND type_account = ? AND status = ? AND amount_win > 0
                    db.query(
                        `SELECT COUNT(email) AS slBET, SUM(amount_win) AS tsWin, SUM(amount_lose) AS tsLose FROM bet_history WHERE email = ? AND type_account = ? AND status = ? AND created_at = CURDATE()`, 
                        [
                            email,
                            1,
                            1
                        ],(error, result, fields) => {
                            //let play = result[0].slBET;

                            res(result[0]);
                        }
                    )
                });

                bot.sendMessage(id, `
                =======🔔DOANH THU <i>${tentk}</i>🔔========
                Tổng số tiền CHƠI: 💴<b>${formatPrice(tc, 2)} $</b>  
                Tổng số tiền THẮNG: 💴<b>${formatPrice(tw, 2)} $</b>
                Tổng số tiền THUA: 💴<b>${formatPrice(pl, 2)} $</b>
                LỜI: 💴<b>${formatPrice(tw - pl, 2)} $</b>
                Số lần hôm nay đã chơi: 🕹<b>${PlayToday.slBET}</b>
                Hôm nay THẮNG: 💴<b>${formatPrice(PlayToday.tsWin, 2)} $</b>
                Hôm nay THUA: 💴<b>${formatPrice(PlayToday.tsLose, 2)} $</b>
                Hôm nay LỜI: 💴<b>${formatPrice(PlayToday.tsWin - PlayToday.tsLose, 2)} $</b>
                `, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});
               
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
        ARES-CHECK check tênngườidùng
        `, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});
    }
}