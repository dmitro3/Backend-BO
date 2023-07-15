const paypal = require('paypal-rest-sdk')
const config = require('../../config')
const cors = require('cors')
const express = require('express')
const db = require("../../database");
const fs = require('fs')
const Tele = require("../telegram_notify")

const fileSys = config.PATH_SYS_CONFIG


const app = express()

app.set('view engine', 'ejs')

app.use(cors());

paypal.configure({
    'mode': config.PAYPAL_MODE, //sandbox or live
    'client_id': config.PAYPAL_CLIENT_ID,
    'client_secret': config.PAYPAL_CLIENT_SECRET
})

// app.get('/test', function (req, res) {
//     let title = config.TITLE_SITE
//     let header = "Bạn đã nạp thành công"
//     res.render('success_paypal', { 
//         title: title,
//         header: header,
//         price: 20,
//     });
// })


app.get('/success', function (req, res) {
    const payerId = req.query.PayerID
    const paymentId = req.query.paymentId
    

    const execute_payment_json = {
        "payer_id": payerId,
        // "transactions": [{
        //     "amount": {
        //         "currency": "USD",
        //         "total": money
        //     }
        // }]
    };

    
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            //console.log(error.response);
            res.json({er: 0, mess: 'Thất bại'});
        } else {
            //console.log(JSON.stringify(payment));

            // add vào lịch sử
            const token = 'EC-' + payment.cart

            let info = payerId + '|' + paymentId + '|' + token

            let nick = payment.transactions[0].item_list.items[0].sku
            
            let amount = payment.transactions[0].item_list.items[0].price

            let FEE = payment.transactions[0].related_resources[0].sale.transaction_fee.value // phí thuế chiếc khấu
            // kiểm tra tồn tại hay chưa 

            db.query(
                `select paypal_order_id from trade_history where paypal_order_id = ?`,
                [
                    paymentId
                ], (error, results, fields) => {
                    if(error){
                        return callback(error);
                     }
                    
                    if(!results[0]){
                        
                        // update
                        db.query(
                            `UPDATE users SET money_paypal = money_paypal + ? WHERE nick_name = ?`,
                            [
                                amount,
                                nick,
                            ], (error, results, fields) => {
                                if(error){
                                    return error;
                                }
                                let Sys = fs.readFileSync(fileSys)
                                let dataSys = JSON.parse(Sys)
                                if(dataSys.activeWithdraSendTelegram){
                                    Tele.sendMess(`Biệt danh: <b>${nick}</b>\n
                                    Vừa nạp: <b>$${amount}</b>. Phí: <b>$${FEE}</b>\n
                                    Hệ thống nhận: <b>${amount - FEE}</b>`)
                                } 
                            }
                        )

                        // insert

                        db.query(`INSERT INTO trade_history (pay_fee, paypal_order_id, from_u, to_u, paypal, type_key, type, currency, amount, note, status, created_at)
                        values(?,?,?,?,?,?,?,?,?,?,?,now())`,
                        [
                            FEE,
                            paymentId,
                            nick,
                            nick,
                            info,
                            'nt', // Nạp tiền
                            'Nạp tiền (Nội bộ)',
                            'usdt',
                            amount,
                            '',
                            1
                        ])
                    }
                }
            )
            let title = config.TITLE_SITE
            let header = "Bạn đã nạp thành công"
            res.render('success_paypal', { 
                title: title,
                header: header,
                price: amount,
            });
            //res.json({er: 0, mess: 'Thành công'});
        }
    })
})

app.get('/cancel', function (req, res) {
    let title = config.TITLE_SITE
    let header = "Bạn đã hủy nạp"
    res.render('success_paypal', { 
        title: title,
        header: header,
        price: 0,
    });
})


app.get('/pay', function (req, res) {

    const amount = req.query.a
    const nick = req.query.n
    var numberRegex = /^[]?\d+(\.\d+)?([eE][]?\d+)?$/;

    if(!numberRegex.test(amount)) {
        return res.json({
            success: 0
        })
    }

    if(!amount || amount == '' && !nick || nick == ''){
        return res.json({
            success: 0
        })
    }

    var newPayment = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": config.DOMAIN+"/api/paypal/success",
            "cancel_url": config.DOMAIN+"/api/paypal/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Item BO",
                    "sku": nick,
                    "price": amount,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": amount
            },
            "description": "This is the payment description."
        }]
    }

    paypal.payment.create(newPayment, (error, payment) => {
        if (error) {
            console.log(error)
        } else {
            //console.log("Create Payment Response");
            //console.log(payment);
            for(let i = 0; i < payment.links.length; i++){
                if(payment.links[i].rel === 'approval_url'){
                    //console.log(payment.links[i].href)
                    //res.redirect(payment.links[i].href)
                    res.json({
                        success: 1,
                        link: payment.links[i].href
                    })
                }
            }
        }
    })
    
})


module.exports = app;

