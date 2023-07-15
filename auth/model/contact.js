let helpers = require('../../helpers');
const db = require("../../database");

module.exports = function(bot, id, contact) {
	let phoneCrack = helpers.phoneCrack(contact);
	if (phoneCrack) {
		db.query(
			`SELECT phone FROM telegram WHERE phone = ?`, 
			[
				phoneCrack.phone
			],(error, result, fields) => {
				if(result.length){ // tồn tại

				}else{
					// insert phone
					db.query(`INSERT INTO telegram (form, phone)
                         values(?,?)`,
					[
						id,
						phoneCrack.phone
					])

					bot.sendMessage(id, `✍️Chúc mừng bạn đã thêm số điện thoại thành công! Tiếp tục vui lòng đăng ký thêm email bằng cách: `, opts);
					bot = null;
					id = null;
				}
			})
	}
}
