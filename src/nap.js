const config = require("./../config.js");
const Helper = require("../helpers");
const { v1: uuidv1 } = require("uuid");
const express = require("express");
const app = express();
const WebSocket = require("ws");

const { GET_LIST_USER_ONLINE } = require("./../api/BSC-BEP-20");

const cors = require("cors");
// Để bỏ cái này chỉ cần ngắt kết nối socket phía user đến cái này là xong check ở tradechina/src/views/trading/Wallet.vue
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

var httpServer = null;

if (!config.USE_SSL) {
  httpServer = require("http").createServer(app);
} else {
  let options = Helper.ssl;
  httpServer = require("https").createServer(options, app);
}

const wss = new WebSocket.Server({
  server: httpServer,
  //port: 80
});

httpServer.listen(config.PORT_NAP);

console.log('Server nap start port: ', config.PORT_NAP, 'không có tác dụng gì cần bỏ nốt ở tradechina/src/views/trading/Wallet.vue')

class PlayerData {
  constructor(id) {
    this.id = id;
  }
}
const users = {}; // có dạng thế này {player.id: {id, email, ws}...}
// mỗi lần user online sẽ gửi email user đến server và cập nhật vào users users này sẽ liên tục được cập nhật vào LIST_USER_ONLINE ở BSC-BEP-20.js
// tại BSC-BEP-20.js mỗi 25 giây sẽ lấy hết tất cả user đang online và chạy hàm SCAN_BEP20_LOADING({nick_name, address_USDT, privateKey_USDT}, ws)
// Mỗi user online sẽ trải qua quá trình sau: 
// đầu tiên từ thông tin của user lấy số dư ví usdt của user (ví này là ví hệ thống tạo cho user)
// tiếp theo lấy số dư bnb nếu số dư bnb nếu số dư bnb < 0.0021 bnb thì chuyển bnb cho user để user chuyển usdt, còn không thì tiếp tục chuyển usdt.
// chuyển toàn bộ số dư usdt trong ví user vào ví của mình và UPDATE users SET money_usdt = money_usdt + ? where nick_name = ?
// INSERT INTO trade_history (from_u, to_u, type_key, type, network, currency, amount, real_amount, pay_fee, note, status, created_at) values(?,?,?,?,?,?,?,?,?,?,?,now())

/* Tóm lại cái này có chức năng chuyển usdt từ ví user vào ví của mình. Ví user ở đây là ví được hệ thống tạo ra chứ không phải ví user đăng ký với sàn */
wss.on("connection", function (ws) {
  ws.on("message", (d) => {
    let data = JSON.parse(d);
    if (data.type === "accountDetail") {
      let obj = data.data;
      let player = new PlayerData(uuidv1(), 0);
      player.ws = ws;
      player.email = obj.email;
      users[player.id] = player;
      GET_LIST_USER_ONLINE(users);
    }
  });

  ws.on("close", (message) => {
    for (let obj in users) {
      if (users[obj].ws == ws) {
        delete users[obj];
        GET_LIST_USER_ONLINE(users);
        break;
      }
    }
  });
});
