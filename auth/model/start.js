const db = require("../../database");

module.exports = function(bot, id) {
	db.query(
		`SELECT email FROM telegram WHERE form = ?`, 
		[
			id
		],(error, result, fields) => {
			if(void 0 !== result && result.length > 0){
				let e = result[0].email;
				let opts = {
					parse_mode: 'HTML',
					reply_markup: {
						// trong bảng chat
						keyboard: [
							[
								{"text": "ACTIVE"}, 
								{"text": "CODE2FA"}
							]
						],
						resize_keyboard: true,
					}
				};

				bot.sendMessage(id, `✍️*HƯỚNG DẪN*✍️\n\n-ACTIVE: Để kích hoạt tài khoản vừa đăng ký.\n-CODE2FA: Nhận ngay mã xác thực 2FA.\n-CHANGEPASS: Thay đổi mật khẩu cho Email: <b>${e}</b>\n Ví dụ: CHANGEPASS passnew nhaplaipassnew\n\n<i>Mọi thông tin của bạn sẽ được bảo mật!</i>`, opts);
				bot = null;
				id = null;
			}else{
				let opts = {
					parse_mode: 'HTML',
					reply_markup: {
						// trong bảng chat
						inline_keyboard: [
							[
								{"text": "HƯỚNG DẪN", "callback_data": "huongdan", "url" : "https://www.youtube.com/results?search_query=idefibo"},
							]
						],
						// keyboard: [
						// 	[{text: 'CHIA SẺ SỐ ĐIỆN THOẠI', request_contact: true}],
						// ],
						//resize_keyboard: true,
					}
				};
				
				bot.sendMessage(id, '*IDEFIBO* \n\nĐây là lần đầu tiên bạn sử dụng App. Vui lòng nhập: dangky email sau đó nhấp GỬI!\nVí dụ: dangky abc123@gmail.com\n\n<i>Không được cùng cấp email của bạn cho người lạ!</i>\n\nChú ý chữ cái <b>dangky</b> không được viết HOA, Hoa', opts);
				//bot.on('callback_query', function onCallbackQuery(callbackQuery) {
				  // increment counter when everytime the button is pressed
				  //console.log(callbackQuery)
				  //const action = callbackQuery.data;
				
				  
				//});
				bot = null;
				id = null;
				
			}
		}
	)

}
