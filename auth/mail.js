const nodeMailer = require('nodemailer')
// Những thông tin dưới đây các bạn có thể ném nó vào biến môi trường env nhé.

let listemail = [
	'contact.beetrade@gmail.com', 'contact.beetrade@gmail.com'
];

// Vì để demo nên mình để các biến const ở đây.
const adminEmail = 'contact.beetrade@gmail.com'
const adminPassword = 'tgftcfnjpbxpzsmp'
// Mình sử dụng host của google - gmail
const mailHost = 'smtp.gmail.com'
// 587 là một cổng tiêu chuẩn và phổ biến trong giao thức SMTP
const mailPort = 587; //587 //25
const sendMail = (to, subject, htmlContent) => {
  let rd = Math.floor(Math.random() * 2);
  // Khởi tạo một thằng transporter object sử dụng chuẩn giao thức truyền tải SMTP với các thông tin cấu hình ở trên.
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: mailHost,
    port: mailPort,
    secure: true, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  })
  const options = {
    from: `BeeTrade <${listemail[rd]}>`, // địa chỉ admin email bạn dùng để gửi
    to: to, // địa chỉ gửi đến
    subject: subject, // Tiêu đề của mail
    html: htmlContent // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
  }
  // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
  return transporter.sendMail(options)
}
module.exports = {
  sendMail
}