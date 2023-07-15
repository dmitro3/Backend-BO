const db = require("../../database");

function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * 
        charactersLength)));
   }
   return result.join('');
}

module.exports = function(bot, id) {
		// kiểm tra email
		let opts = {
			parse_mode: 'HTML',
			reply_markup: {
				remove_keyboard: true,
			}
		};
		db.query(
			`SELECT email FROM telegram WHERE form = ?`, 
			[
				id
			],(error, result, fields) => {

				if(void 0 !== result && result.length > 0){ // tồn tại email
					let email = result[0].email;
					let c = makeid(4);
					db.query(
						`UPDATE users SET code_secure = ? WHERE email = ?`, 
						[
							c,
							email
						],(error, result, fields) => {
							
							bot.sendMessage(id, `*IDEFIBO* \n\nMã xác nhận 2FA của bạn là: <b>${c}</b>`, opts);
							bot = null;
							id = null;
						})
					
				}else{
					bot.sendMessage(id, `*IDEFIBO* \n\nBạn chưa đăng ký BOT!`, opts);
					bot = null;
					id = null;
				}
			})
	

}
