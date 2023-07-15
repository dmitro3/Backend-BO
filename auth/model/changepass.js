const db = require("../../database");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

module.exports = function(bot, id, mess) {
		let getDL = mess.split("CHANGEPASS ");
		let PASS = getDL[1].split(" ");
		let passNew  = PASS[0];
		let repassNew  = PASS[1];

		// kiểm tra email
		let opts = {
			parse_mode: 'HTML',
			reply_markup: {
				remove_keyboard: true,
			}
		};

		if(!passNew){
			bot.sendMessage(id, `*IDEFIBO* \n\nCú pháp: CHANGEPASS passmoi nhaplaipassmoi\nVí dụ: CHANGEPASS 123 123`, opts);
			bot = null;
			id = null;
			return;

		}

		if(!repassNew){
			bot.sendMessage(id, `*IDEFIBO* \n\nCú pháp: CHANGEPASS passmoi nhaplaipassmoi\nVí dụ: CHANGEPASS 123 123`, opts);
			bot = null;
			id = null;

			return;
		}

		if(passNew != repassNew){
			bot.sendMessage(id, `*IDEFIBO* \n\nMật khẩu bạn nhập không khớp!`, opts);
			bot = null;
			id = null;
		}else{
			db.query(
				`SELECT email FROM telegram WHERE form = ?`, 
				[
					id
				],(error, result, fields) => {
	
					if(void 0 !== result && result.length > 0){ // tồn tại email
						let email = result[0].email;
						const salt = genSaltSync(10);
						let newpass = hashSync(passNew, salt);
	
						db.query(
							`UPDATE users SET password = ? WHERE email = ?`, 
							[
								newpass,
								email
							],(error, result, fields) => {
								
								bot.sendMessage(id, `*IDEFIBO* \n\nBạn đã thay đổi mật khẩu thành công là: <b>${repassNew}</b>`, opts);
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

	

}
