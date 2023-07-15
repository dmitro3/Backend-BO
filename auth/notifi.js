var db = require("../database");
const moment = require('moment-timezone');
const cors = require('cors');
const express = require('express');
const app = express();
const WebSocket = require('ws');
const config = require('../config.js');
const Helper = require("../helpers");
const { v1: uuidv1 } = require('uuid');

app.use(cors());

var httpServer = null;

if(!config.USE_SSL){
    httpServer = require('http').createServer(app);
}else{
	let options = Helper.ssl;
    httpServer = require('https').createServer(options, app);
}


const wss = new WebSocket.Server(
    { 
        server: httpServer, 
        //port: 80 
    }
)

httpServer.listen(config.PORT_NOTIFY);
console.log('Server Notify run port: '+config.PORT_NOTIFY);

class PlayerData {
    constructor(id, uid) {
        this.id = id
        this.uid = uid
    }
}
const ARES_USERS = {};

wss.on('connection', function(ws){

    ws.on('message', d => {
        var data = JSON.parse(d);
        let obj = data.data;

        if(data.type === 'accountDetail'){
            let player = new PlayerData(uuidv1(), 0);
            player.ws = ws;
            player.email = obj.email;
            ARES_USERS[player.id] = player;

        }
    });

    ws.on('close', message => {
        for(let obj in ARES_USERS) {
           if(ARES_USERS[obj].ws == ws) {
                delete ARES_USERS[obj];
                break;
           }
        }
    });
})

function formatPrice(value, minimum) {
    var formatter = new Intl.NumberFormat('en-US', {
        //style: 'currency',
        //currency: '',
        minimumFractionDigits: minimum
    });
    return formatter.format(value);
}

setInterval(() => {
	var dateToday = moment().format('HH:mm:ss'); //07h sáng
	if(dateToday == "07:00:00"){
		SEND_COMMISSION_USER();
	}
}, 1000); // 24h 86400*1000

async function SEND_COMMISSION_USER() { // tổng kết hoa hồng mỗi ngày
   
    let data = await new Promise((res, rej) => {
        db.query(
            `SELECT email FROM users WHERE pending_commission > 0`, 
            [],
            (error, results, fields) => {
                res(results);
            })
    })
   
    for(let i = 0; i < data.length; i++){
        let email = data[i].email;
        await new Promise((res, rej) => {
            db.query(
                `SELECT SUM(pending_commission) AS totalCM 
                FROM commission_history WHERE email = ? AND DATE(created_at) = DATE(NOW() - INTERVAL 1 DAY);`, 
                [
                    email
                ],
                (error, result, fields) => {
        
                        let dt2 = moment().tz("Asia/Ho_Chi_Minh");
                        let cach1ngay = dt2.subtract(1,'days').format("YYYY-MM-DD");
                        let noidung = `Tổng Hoa hồng Giao dịch ngày ${cach1ngay} tổng giá trị <b>${formatPrice(result[0].totalCM, 2)} USDT</b>`
                        let title = 'Bạn đã nhận Hoa hồng Giao dịch';
                    
						SEND_THONG_BAO(type, email, email, title, noidung);
						res();
                })
        });
    }
}

function SEND_THONG_BAO(type, cuem, email, title, content) {
    for(let obj in ARES_USERS) {
        let em = ARES_USERS[obj].email;
        if(em === email){
            let ws = ARES_USERS[obj].ws;
            ws.send(JSON.stringify({type: 'notifiSms', title: title, content: content}));
        }
    }
    SAVE_LOG_NOTIFI(type, cuem, email, title, content);
}

function SAVE_LOG_NOTIFI(type, cue, email, title, content) {
    db.query(`INSERT INTO notifi (cu_email, email, content, title, type, created_at)
    VALUES (?,?,?,?,?,now())`,
    [
        cue,
        email,
        content,
        title,
		type
    ], (error, results, fields) => { })
}



module.exports = {
    SEND_THONG_BAO: SEND_THONG_BAO,
}


