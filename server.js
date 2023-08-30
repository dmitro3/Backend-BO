const TelegramBot = require('node-telegram-bot-api')
const config = require('./config.js');

const TelegramAll = new TelegramBot(config.TELEGRAM_TOKEN, {polling: true})
TelegramAll.set

global['ARESTele'] = TelegramAll;

// ưu tiên hàng đầu

// chú ý ít hơn
require('./auth/mess'); // chưa chắc chắn lắm nhưng hình như là lắng nghe message xong gửi tin nhắn qua telegram  // có liên quan đến DB
require('./auth/sys_settings'); // update file stSys.json mấy cái kiểu như giá coin... // check bảo mật

// 2 cái này chắc chắn 100% bỏ ko cần chú ý
require('./src/nap'); // chuyển usdt từ ví user vào ví chính của hệ thống (ví user ở đây cũng là ví được hệ thống tạo ra) // đã bỏ phía server cần bỏ nốt phía client 
// require('./auth/notifi');  // chưa chắc lắm nhưng hình như là gửi thông báo nhận hoa hồng giao dịch cho bọn đại lý // đã bỏ hoàn toàn 

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "1";
process.on('uncaughtException', function (exception) {
	console.log(exception);
});