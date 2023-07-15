const TelegramBot = require('node-telegram-bot-api')
const config = require('./config.js');

const TelegramAll = new TelegramBot(config.TELEGRAM_TOKEN, {polling: true})
TelegramAll.set

global['ARESTele'] = TelegramAll;

require('./src/app'); 
require('./games/trade'); 
require('./auth/sys_settings');
require('./auth/mess'); 
require('./src/nap'); 
//require('./api/autoNapCoin');
require('./auth/notifi'); 

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "1";
process.on('uncaughtException', function (exception) {
	console.log(exception);
});