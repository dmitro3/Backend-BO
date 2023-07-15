const db = require("../../database")

function formatPrice(value, minimum) {
    var formatter = new Intl.NumberFormat('en-US', {
        //style: 'currency',
        //currency: '',
        minimumFractionDigits: minimum
    });
    return formatter.format(value);
}

module.exports = function(bot, id, text) {

    let getDL = text.split("dt ");
    let tentk  = getDL[1];

    if(!!tentk){
        db.query(
            `SELECT pricePlay, priceWin, priceLose FROM users WHERE nick_name = ?`, 
            [
                tentk
            ],(error, results, fields) => {
                if(error){
                    bot.sendMessage(id, `Lỗi truy vấn dữ liệu`, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});
                    return
                }
                if(results.length > 0){
                    let tc = results[0].pricePlay; // tổng số thu nhập
                    let tw = results[0].priceWin; // tổng số phí
                    let pl = results[0].priceLose; // tổng thu nhập thực
                   
                    bot.sendMessage(id, `
                    =======🔔DOANH THU <i>${tentk}</i>🔔========
                    Tổng số tiền CHƠI: 💴<b>${formatPrice(tc, 2)}</b>  
                    Tổng số tiền THẮNG: 💴<b>${formatPrice(tw, 2)}</b>
                    Tổng số tiền THUA: 💴<b>${formatPrice(pl, 2)}</b>
                    LỜI: 💴<b>${formatPrice(tw - pl, 2)}</b>
                    `, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});
                }else{
                    bot.sendMessage(id, `
                    =======🔔DOANH THU <i>${tentk}</i>🔔========
                    Không tồn tại trong hệ thống
                    `, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});
                }
            })
    }else{
        db.query(
            `SELECT SUM(amount) as tsTNUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) as FeeBNB FROM trade_history WHERE type_key = ? AND status = 1`,
            [
                'nt'
            ], (error, results, fields) => {
                
                if(error){
                    bot.sendMessage(id, `Lỗi truy vấn dữ liệu`, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});
                    return
                }

                let tsTNUSD = results[0].tsTNUSD; // tổng số thu nhập
                let feeBNB = results[0].FeeBNB; // tổng số phí
                let tsTNBNB = results[0].dtBNB; // tổng số phí
                let tsWin = 0, tsLose = 0, tsHHong = 0;

                let qr2 = `SELECT SUM(amount_win) AS tsWin, SUM(amount_lose) AS tsLose FROM bet_history WHERE status = 1 AND marketing = ? AND type_account = ?`;
                let qr3 = `SELECT SUM(pending_commission) AS tsHHong FROM commission_history WHERE marketing = ? AND type = ?`;

                db.query(qr2,
                    [
                        0,
						1 // tài khoản thực
                    ], (error, results, fields) => {
                        if(results.length > 0){
                            tsWin = results[0].tsWin;
                            tsLose = results[0].tsLose;
                        }

                        db.query(qr3,
                            [
                                0,
                                'klgd',
                            ], (error, results, fields) => {
                                if(results.length > 0){
                                    tsHHong = results[0].tsHHong;
                                }

                                bot.sendMessage(id, `
                                =======🔔DOANH THU🔔========
                                Tổng số USDT nạp: 💴<b>${formatPrice(tsTNUSD, 4)}</b>  
                                Tổng số USDT nhận: 💴<b>${formatPrice(tsTNBNB, 4)}</b>
                                Tổng số phí BNB: 💴<b>${formatPrice(feeBNB, 4)}</b>
                                Tổng giao dịch sàn THẮNG: 💴<b>${formatPrice(tsLose, 4)}</b>
                                Tổng giao dịch sàn THUA: 💴<b>${formatPrice(tsWin, 4)}</b>
                                Tổng giao dịch HOA HỒNG: 💴<b>${formatPrice(tsHHong, 4)}</b>
                                === Hệ thống lãi USDT: 💴<b>${formatPrice(tsLose - tsWin - tsHHong, 4)}</b>
                                `, {parse_mode:'HTML', reply_markup:{remove_keyboard:true}});
                                
                            }
                        )
    
                    }
                )
            }
        )
    }
}