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

function creatAccountUser(email){
    // db.query(
    //     `SELECT email FROM account WHERE email = ?`,
    //     [data.email], (error, results, fields) => {
    //         if(error){
    //             return callback(error);
    //          }
    //         if(!!results[0]) return;

            // tạo tài khoản demo
            db.query(
                `insert into account (email, type, u_id, created_at)
                    values(?,0,?,now())`, 
                    [
                        email,
                        makeid(10)
                    ]
            );
            // tạo tài khoản thật
            db.query(
                `insert into account (email, type, u_id, created_at)
                    values(?,1,?,now())`, 
                    [
                        email,
                        makeid(10)
                    ]
            );
    //    }
   // )
}

module.exports = function(bot, id) {
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
					db.query(
						`SELECT active FROM users WHERE email = ? AND active = ?`, 
						[
							email,
							1
						],(error, result, fields) => {
							if(void 0 !== result && result.length > 0){
								bot.sendMessage(id, `*IDEFIBO* \n\nTài khoản của bạn đã kích hoạt rồi!`, opts);
								bot = null;
								id = null;
							}else{
								db.query(
								`UPDATE users SET active = 1 WHERE email = ?`, 
								[
									email
								],(error, result, fields) => {
									
									creatAccountUser(email);

									bot.sendMessage(id, `*IDEFIBO* \n\nBạn đã kích hoạt thành công email: <b>${email}</b>.\nBây giờ bạn có thể đăng nhập tại IDEFIBO`, opts);
									bot = null;
									id = null;
								})
							}
						})
				}else{
					bot.sendMessage(id, `*IDEFIBO* \n\nBạn chưa đăng ký BOT!`, opts);
					bot = null;
					id = null;
				}
			})
	

}
