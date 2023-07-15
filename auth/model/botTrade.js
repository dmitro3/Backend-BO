const Tele = require("../../auth/telegram_notify");
const moment = require('moment-timezone');
let guess = 'buy', guessWIN = 0, guessLOSE= 0;

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

module.exports = {
	
	SEND_BOT_DU_BAO(){
		let rd = getRandomInt(2);
		let kq = 'TĂNG ⬆️';
		if(rd){
			kq = 'TĂNG ⬆️';
			guess = 'buy';
		}else {
			kq = 'GIẢM 🔻';
			guess = 'sell';
		}
		Tele.sendMessBOTTrade(`🏆 Bot dự báo: Phiên sắp tới, ${kq}!`);
			
	},

	SEND_TUONG_TAC(){
		Tele.sendMessBOTTrade(`🛎 Thông báo!\n⏱ Chúng ta có 1 phút tương tác.\nHãy thảo luận với đội nhóm để cùng phát triển nào!`);
	},

	SEND_BOT_SECOND(s){
		if(s > 0){
			Tele.sendMessBOTTrade(`🔰 Hãy đặt lệnh. Còn ${s}s`);
		}else{
			Tele.sendMessBOTTrade(`⌛️ Chờ kết quả...`);
		}
		
	},

	SEND_RESULT(kq){
		let time = moment().format('HH:mm:ss'); 
		let textKQ = '';
		
		if(guess == kq){

			guessWIN++;
			guessLOSE = 0;

			if(kq == 'buy'){
				textKQ = 'TĂNG ⬆️';
			}else{
				textKQ = 'GIẢM 🔻';
			}

			Tele.sendMessBOTTrade(`💬 Lượt vừa xong (${time}): ${textKQ}!.`);

			if(guessWIN > 1){
				Tele.sendMessBOTTrade(`💬 Kết quả: CHIẾN THẮNG liên tục ${guessWIN} phiên.\nMETANEX bot hoàn toàn miễn phí`);
			}else if(guessWIN == 1){
				Tele.sendMessBOTTrade(`💬 Kết quả: CHIẾN THẮNG ${guessWIN} phiên.\nMETANEX bot hoàn toàn miễn phí`);
			}

		}else{

			guessWIN = 0;
			guessLOSE++;

			if(kq == 'buy'){
				textKQ = 'TĂNG ⬆️';
			}else{
				textKQ = 'GIẢM 🔻';
			}

			Tele.sendMessBOTTrade(`💬 Lượt vừa xong (${time}): ${textKQ}!.`);

			if(guessLOSE > 1){
				Tele.sendMessBOTTrade(`💬 Kết quả: THUA liên tục ${guessLOSE} phiên.\nMETANEX bot hoàn toàn miễn phí`);
			}else if(guessLOSE == 1){
				Tele.sendMessBOTTrade(`💬 Kết quả: THUA ${guessLOSE} phiên.\nMETANEX bot hoàn toàn miễn phí`);
			}
		}
		
	}

}
