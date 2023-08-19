const express = require("express");
const app = express();
const config = require("./../config.js");
//const msg = require('./../msg')
const apiBinace = require("node-binance-api");
const Binance = require("binance-api-node").default;

const toFixed = require("tofixed");
const axios = require("axios");
const WebSocket = require("ws");
//const fs = require('fs')
const { v1: uuidv1 } = require("uuid");
const cors = require("cors");
const { updatePriceWinLose } = require("./../api/trans_user");

const Tele = require("../auth/telegram_notify");
const Helper = require("../helpers");

const BOT_TRADE = require("../auth/model/botTrade");

const fileSys = config.PATH_SYS_CONFIG;
const fileCommission = config.PATH_SYS_COMMISSION;

var {
  getPriceUser,
  updateBalanceUser,
  updatePersonalTrading,
  checkF0Commission,
  updateAmountRateCommission,
  updateAmountWin,
  updateAmountLose,
  insertBetOrder,
  getMaretingAcc,
  listF0With7Level,
} = require("./../games/service.trade");

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

// use https

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

httpServer.listen(config.PORT_TRADE);

var instance = new apiBinace().options({
  APIKEY: config.BINANCE_APIKEY,
  APISECRET: config.BINANCE_APISECRET,
  useServerTime: true, // Nếu bạn gặp lỗi dấu thời gian, hãy đồng bộ hóa với thời gian máy chủ khi khởi động
  test: false, // Nếu bạn muốn sử dụng chế độ test
});

// length = 120, {date, open, high, low, close, volume} update in getListStartGame + 120, PUSH_STATIC_2 PUSH_STATIC (shift and push)
var LIST_GET_DATA = [],
  // {date, open, high, low, close, volume, candleClose, type} update {} in playRealTimeSpot update close_check in XU_LY_VOLUM update time in countdowngame push itself to LIST_GET_DATA
  // push itself to LIST_GET_DATA when SO_GIAY_DEM_NGUOC == 0
  jsonData = [],
  SO_GIAY_DEM_NGUOC = config.SO_GIAY_DEM_NGUOC,
  ANTI_BET = false, // allow bet when order status and vice versa when waiting
  ORDER_OR_WATTING = "order", // check
  timeGet = new Date().getTime(); // check
var rateNhaThuong = config.RATE_NHA_THUONG; // tỉ lệ nhận thưởng là 95% cho mỗi lần thắng
var SEVER_GET = "BTC/USDT",
  BET_MAX = config.BET_MAX; // maybe this is bet_min
// [ upline_id_liveOrDemo (from account): '10||buy||1||dungdq3@gmail.com||0||QEE8HOZ6YM' ]
// update when user make a bet, thông tin sẽ được sử dụng để HandlingBuySell2 sau khi xử lý xong sẽ lưu vào BTC_USER_BUY_BACK và clear đi
// đồng thời được sử dụng để xulyInVaoHisBeCau gửi Data này cho admin
var BTC_USER_BUY = [],
  BTC_USER_SELL = [],
  AMOUNT_USER_BUY = [], // [ upline_id_liveOrDemo (from account): 10 ] update when user make a bet and clear when start new order session
  AMOUNT_USER_SELL = []; // [ upline_id_liveOrDemo (from account): 10 ] update when user make a bet and clear when start new order session
// after a session finished update to PRICE_LIVE, sometime use to update total_bet_amount_in_session
var PRICE_BUY_LIVE_BACKUP = 0,
  PRICE_SELL_LIVE_BACKUP = 0,
  // total_bet_amount update in BetBuy add betAmount each time. send socket for user first time connect,
  // in XU_LY_VOLUME use to update PRICE_LIVE_BACKUP and totalBuy_Sell if s < rdSe (6s-15s) happen every second
  // when change status from order to waiting send these info to admin and send tele PRICE_BUY_LIVE - PRICE_MAKETING_BUY
  // when change status from waiting to order use to update PRICE_LIVE_BACKUP then update to 0, if bot == true then send to client PRICE_LIVE + random number
  PRICE_BUY_LIVE = 0,
  PRICE_SELL_LIVE = 0,
  // this is the same as above but just for demo account
  PRICE_BUY_DEMO = 0,
  PRICE_SELL_DEMO = 0;
var totalPTBuy = 0, // phần trăm buy
  totalPTSell = 0, // phần trăm sell
  session = 1000000, // after 1 session plus 1 otherwise only for reference after first session it would trigger this PUSH_STATIC
  // amount win or lose of account which is marketing == 1, update in HandlingBuySell2 plus or minus amount win to variable
  AMOUNT_MARKETING_LOSE = 0,
  AMOUNT_MARKETING_WIN = 0,
  // total_bet_amount_in_mkt increase if account was mkt in BetBuy and BetSell reset when a session finished. it's not affect the amount bet of real user
  PRICE_MAKETING_BUY = 0,
  PRICE_MAKETING_SELL = 0;
var BUY = [], // number of times buy win
  SELL = [], // number of times sell win
  STATIC = [], // total number of times sell or buy win
  getLoadStaticGue = {}, // { Moving: { b: 0, s: 0, m: 0 }, Oscillators: { b: 0, s: 0, m: 0 }, Summary: { b: 0, s: 0, m: 0 }};
  tCountDown, // the interval of main app
  // after every session BTC_USER_BUY_SELL will be clear so we use this BTC_USER_BUY_BACK to handle commision distribution
  BTC_USER_BUY_BACK = [],
  BTC_USER_SELL_BACK = [];
let AMOUNT_MAX_BREAK_BRIDGE = 400, // if difference between total_buy_bet and total_sell_bet is over than this one system will interventing the result of session
  AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE = -30, // if profit is negative more than this one system will interventing the result and make less win
  // just reference eventually jsonData.close and jsonData.open will use to be send to users
  CLOSE_CHECK = 0,
  OPEN_CHECK = 0;
var DATA_GL = require("./editBet");

class PlayerData {
  constructor(id, uid) {
    this.id = id;
    this.uid = uid;
  }
}
const users = {};

console.log(
  `- SV ${SEVER_GET} ${
    config.IS_PLAY_SPOT ? "SPOT" : "FUTERES"
  } START \n- Server trade started port: ${config.PORT_TRADE}.`
);

wss.on("connection", function (ws) {
  /*  mỗi lần vào sẽ gửi: 
  +) danh sách dữ liệu 120 cây nến phút của BTC có dạng thế này {date, open, high, low, close, volume}
  +) jsonTransVolum gồm tổng số tiền cược của Buy và Sell phần trăm số tiền cược của Buy và Sell
  +) staticShow gồm phiênth số lần Buy win số lần Sell win tổng số lần Buy và Sell win sắp xếp theo thứ tự 
  +) getLoadStaticGue mấy cái không quan trọng 
  */
  ws.send(JSON.stringify({ type: "getListDauTien", data: LIST_GET_DATA }));

  //get trans volum
  let totalBuy = 0,
    totalSell = 0;
  totalBuy = PRICE_BUY_LIVE;
  totalSell = PRICE_SELL_LIVE;

  let jsonTransVolum = {
    nbuy: totalBuy,
    nsell: totalSell,
    ptbuy: Number(totalPTBuy), // phần trăm buy
    ptsell: Number(totalPTSell), // phần trăm sell
  };
  ws.send(JSON.stringify({ type: "transVolum", data: jsonTransVolum }));

  let countBUY = BUY.length;
  let countSELL = SELL.length;

  let staticShow = {
    ss: session,
    cbuy: countBUY,
    csell: countSELL,
    static: STATIC,
  };

  if (Object.keys(getLoadStaticGue).length === 0) {
    getLoadStaticGue = {
      Moving: { b: 0, s: 0, m: 0 },
      Oscillators: { b: 0, s: 0, m: 0 },
      Summary: { b: 0, s: 0, m: 0 },
    };
  }

  ws.send(
    JSON.stringify({ type: "static", data: staticShow, load: getLoadStaticGue })
  );
  /* khi user gửi accountDetail lên sẽ lưu thông tin vào object users có dạng như sau {id, uid, ws, email}  */
  /* khi user gửi getListData lên thì cái này nó bỏ mẹ rồi */
  /* khi admin gửi editGL lên sẽ sửa DATA_GL quyết định xem phe nào thắng và khi nào thì bẻ cầu 
  ví dụ: quỹ bị âm hoặc số tiền chênh lệch giữa 2 phe đạt đến 1 mức mà phe ít sẽ thắng */
  /* khi user gửi lệnh bet lên sẽ trigger BetBuy hoặc BetSell */
  ws.on("message", (d) => {
    var data = JSON.parse(d);
    //info
    if (data.type === "accountDetail") {
      let obj = data.data;
      if (void 0 === obj.email) {
        let mess = {
          type: "reloadAccount",
          mess: "Không lấy được email!",
          style: "danger",
        };
        ws.send(JSON.stringify({ type: "mess", data: mess }));
        return;
      }
      // xóa user và thêm nếu có kết nối lại ( để lêu lại log xử lý kết quả )
      for (let l in users) {
        if (users[l].email == obj.email) {
          //console.log(t+ ": " + users[l].email);
          // send có tài khoản đăng nhập ở nơi khác
          let ws = users[l].ws;
          let mess = {
            type: "disAccount",
            mess: "Tài khoản của bạn đang được đăng nhập ở nơi khác!",
            style: "danger",
          };
          ws.send(JSON.stringify({ type: "mess", data: mess }));
          break;
        }
      }
      let player = new PlayerData(uuidv1(), 0);
      player.ws = ws;
      player.uid = obj.uid;
      player.email = obj.email;
      users[player.id] = player;

      for (let obj in users) {
        let uid = users[obj].uid;
        // tìm UID của ADMIN rồi gửi
        if (uid == "ADMIN_BO") {
          //console.log(uid);
          let ws = users[obj].ws;
          ws.send(
            JSON.stringify({
              type: "getTruck",
              data: DATA_GL,
              min_am_go: AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE,
              max_amount_be: AMOUNT_MAX_BREAK_BRIDGE,
            })
          );
        }
      }
    }

    if (data.type === "getListData") { // bỏ
      ws.send(JSON.stringify({ type: "getListDauTien", data: LIST_GET_DATA }));
      ws.send(
        JSON.stringify({
          type: "static",
          data: staticShow,
          load: getLoadStaticGue,
        })
      );
    }

    // chỉnh sửa trò chơi
    if (data.type === "editGL") {
      let obj = data.data;

      if (obj.type == "BTC_BUY") {
        BTC_SET_BUY_WIN();
      }
      if (obj.type == "BTC_SELL") {
        BTC_SET_SELL_WIN();
      }
      if (obj.type == "BTC_LESS") {
        BTC_LESS_WIN();
      }
      if (obj.type == "BTC_OFF") {
        BTC_TOOL_OFF();
      }
      if (obj.type == "BOT") {
        DATA_GL.BOT = DATA_GL.BOT ? false : true;
      }
      if (obj.type == "BOT_GO_TIEN") {
        DATA_GL.PRICE_FUND_ON_OFF = DATA_GL.PRICE_FUND_ON_OFF ? false : true;
      }
      if (obj.type == "GO_TIEN_OFF") {
        DATA_GL.LESS_WIN = false;
        Tele.sendMessBet(
          `🔔 ADMIN <i>OFF</i> GỠ TIỀN\n🖲Hệ thống LỜI/LỖ hiện tại 💴: <i>${DATA_GL.PRICE_FUND_PROFITS}</i>👉Bây giờ LỜI/LỖ sẽ là: <i>0</i>`
        );
        DATA_GL.PRICE_FUND_PROFITS = 0;
      }
      if (obj.type == "WRITE_AMOUNT_MAX_BREAK_BRIDGE") {
        AMOUNT_MAX_BREAK_BRIDGE = Number(obj.AMOUNT);
        Tele.sendMessBet(
          `🔔 ADMIN vừa đặt lại mốc BẺ 💴: <i>${obj.AMOUNT}</i>`
        );
      }
      if (obj.type == "WRITE_AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE") {
        AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE = Number(obj.AMOUNT);
        Tele.sendMessBet(
          `🔔 ADMIN vừa đặt lại mốc GỠ 💴: <i>${obj.AMOUNT}</i>`
        );
      }
    }

    // kết thúc

    if (data.type === "bet") {
      let obj = data.data;
      if (obj.type === "buy") {
        BetBUY(ws, obj);
      } else {
        BetSELL(ws, obj);
      }
    }
  });
  /* khi user thoát socket sẽ xoá thông tin user đó ra khỏi object users */
  ws.on("close", (message) => {
    // chạy lệnh xóa id nếu user bị mất kết nối
    for (let obj in users) {
      if (users[obj].ws == ws) {
        delete users[obj];
        break;
      }
    }
  });
});
/* khởi động chương trình lấy 120 cây nến từ biannce và update vào LIST_GET_DATA [{date, open, high, low, close, volume}...]  => chạy countDownGame */
getListStartGame();

function getListStartGame() {
  axios
    .get(
      `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=120`
    )
    .then((data) => {
      const getData = data.data;
      getData.map((d) => {
        let t = Math.round(d[0]),
          o = parseFloat(d[1]),
          h = parseFloat(d[2]),
          l = parseFloat(d[3]),
          c = parseFloat(d[4]),
          v = parseFloat(d[5]).toFixed(2);
        let getS = {
          date: new Date(t - 30000).getTime(),
          open: o,
          high: h,
          low: l,
          close: c,
          volume: parseFloat(v),
        };
        LIST_GET_DATA.push(getS);
      });

      countDownGame();
    });
}

let maintenance = false;

// kích hoạt kiểm tra bảo trì hết chưa
function AccpetIsBaoTri() {
  clearInterval(tCountDown);
  let oc = setInterval(() => {
    if (!maintenance) {
      clearInterval(oc);
      let msg = "Bảo trì đã xong.";
      Tele.sendMessBet(msg);
      (LIST_GET_DATA = []),
        (jsonData = []),
        (SO_GIAY_DEM_NGUOC = config.SO_GIAY_DEM_NGUOC),
        (ANTI_BET = false),
        (ORDER_OR_WATTING = "order");
      STATIC = [];
      BUY = [];
      SELL = [];
      getLoadStaticGue = {};
      getListStartGame();
      countDownGame();
    }
  }, 1000);
}

checkBaoTriBinance();
/* mỗi 25 giây check api binance xem có hoạt động không nếu không hoạt động thì tắt app và check liên tục khi nào hoạt động trở lại thì mở lại app */
function checkBaoTriBinance() {
  setInterval(() => {
    axios
      .get("https://api.binance.com/sapi/v1/system/status")
      .then((data) => {
        const getData = data.data;
        let dataSys = Helper.getConfig(fileSys);
        if (getData.status) { // status == 1 mean maintenance
          // bảo trì
          dataSys.maintenance = maintenance = true; // bảo trì
          let msg =
            "Binance sẽ thực hiện nâng cấp hệ thống theo lịch trình. Quý khách trade coin vui lòng để ý để chủ động trong gd hoặc rút tiền.";
          dataSys.maintenanceContent = msg;

          Tele.sendMessBet(msg);
          Helper.setConfig(fileSys, dataSys);
          AccpetIsBaoTri();
          let obj = { type: "bet", mess: msg, style: "danger" };
          wss.clients.forEach(function each(client) {
            client.send(JSON.stringify({ type: "mess", data: obj }));
          });
        } else { // status == 0 mean normal
          dataSys.maintenance = maintenance = false;
          Helper.setConfig(fileSys, dataSys);
          //let json = JSON.stringify(dataSys)
          //fs.writeFile(fileSys, json, 'utf8', (err) => {})
        }
      })
      .catch((error) => {});
  }, 25000);
}

function XU_LY_SEND_BOT_DU_DOAN(s) {
  if (ORDER_OR_WATTING === "order") {
    if (s === 29) {
      BOT_TRADE.SEND_TUONG_TAC();
    }

    if (s == 25) {
      BOT_TRADE.SEND_BOT_DU_BAO();
    }

    if (s === 15 || s < 3) {
      BOT_TRADE.SEND_BOT_SECOND(s);
    }
  }
}
/* chương trình chính của App thực thi theo từng giây mỗi lần thực thi SO_GIAY_DEM_NGUOC sẽ trừ đi 1. Nội dung thực thi:
+) playRealTimeSpot => XU_LY_VOLUM (lấy nến tiếp theo và can thiệp kết quả)
+) jsonData["candleClose"] = SO_GIAY_DEM_NGUOC; jsonData["type"] = ORDER_OR_WATTING;
+) XU_LY_SEND_BOT_DU_DOAN ko quan trọng 
+) khi kết thúc thời gian đếm ngược 
-) BOTAOClear clearInterval(startBotAo)
-) khi kết thúc phiên thì 
.) startBotAo để tăng số lượng cược lên và gửi đến user
.) xuLyChartKetThuc1Phien => khi kết thúc 1 phiên reset lại dữ liệu quét các lệnh của khách khách update mysql trả hoa hồng cho các cấp trên của từng lệnh bet
-) khi kết thúc đặt cược thì
.) xulyInVaoHisBeCau => gửi thông tin cho admin xem có nên bẻ cầu hay không
.) if session !== 1000000 PUSH_STATIC gửo thông tin cho admin là phe nào thắng để admin quyết định có nên bẻ cầu hay không.

*/
function countDownGame() {
  const SO_GIAY_MAC_DINH = SO_GIAY_DEM_NGUOC;

  tCountDown = setInterval(() => {
    --SO_GIAY_DEM_NGUOC;
    playRealTimeSpot(SO_GIAY_DEM_NGUOC); // cái này update cái jsonData jsonData.close và quyết định buy hay sell win
    // playRealTimeFutures(SO_GIAY_DEM_NGUOC);

    var s = 0;
    if (SO_GIAY_DEM_NGUOC < 10) {
      s = "0" + SO_GIAY_DEM_NGUOC;
    } else {
      s = SO_GIAY_DEM_NGUOC;
    }

    jsonData["candleClose"] = s;
    jsonData["type"] = ORDER_OR_WATTING;

    // XỬ LÝ SEND DỰ ĐOÁN TELEGRAM
    XU_LY_SEND_BOT_DU_DOAN(SO_GIAY_DEM_NGUOC);

    if (SO_GIAY_DEM_NGUOC === 0) {
      // trở về giây cũ
      SO_GIAY_DEM_NGUOC = SO_GIAY_MAC_DINH + 1;

      // đổi lại trạng thái

      ORDER_OR_WATTING = ORDER_OR_WATTING === "order" ? "watting" : "order";

      // đủ 100 item thì clear
      if (STATIC.length > 99) {
        for (let i = 0; i < 20; i++) {
          BUY.shift();
          SELL.shift();
          STATIC.shift();
        }
      }

      // clear BOT ảo
      BOTAOClear();

      if (ORDER_OR_WATTING === "order") {
        // xử lý BUY anh SELL khi kết thúc Watting
        xuLyChartKetThuc1Phien(jsonData);
        if (DATA_GL.BOT) {
          BOTAOStart();
        }

        ANTI_BET = false; // cho dat cuoc
      } else {
        ANTI_BET = true; // khong cho dat cuoc
        // gửi danh sách vào ADMIN
        xulyInVaoHisBeCau();

        SEND_MESS_THONG_BAO_CHENH_LECH();

        if (session !== 1000000) PUSH_STATIC(jsonData);
      }
    }

    // chuyển tất cả dữ liệu ra ngoài client
    if (!maintenance) {
      wss.clients.forEach(function each(client) {
        client.send(JSON.stringify({ type: "allData", data: jsonData }));
      });
    }
  }, 1000);
}

function SEND_MESS_THONG_BAO_CHENH_LECH() {
  let totalBuy = PRICE_BUY_LIVE - PRICE_MAKETING_BUY;
  let totalSell = PRICE_SELL_LIVE - PRICE_MAKETING_SELL;

  if (totalBuy > 0 || totalSell > 0) {
    Tele.sendMessBetAmount(
      `✍️Phiên: 💸<b>${session}</b>\n✍️Cửa BUY: 💸<b>${totalBuy}</b>\n✍️Cửa SELL: 💸<b>${totalSell}</b>`
    );
  }
}

let o = 0;

/*  mỗi giây sẽ lấy ra 500 cây nến rồi lấy cây nến gần nhất và thực hiện update dữ liệu
dữ liệu lấy theo cây nến mới nhất trong 500 cây nến này trừ giá mở cửa và thời gian, 
nếu thời gian đếm ngược là 0 sẽ set thời gian cho cây nến,
giá mở cửa sẽ lấy theo giá đóng cửa của cây nến mới nhất trong 120 cây nến vừa lấy lúc khởi tạo game 
giá high phải lớn hơn open và close , low phải nhỏ hơn open và close nếu s < 30 thì update jsonData
=> call XU_LY_VOLUME
*/
function playRealTimeSpot(s) {
  if (s == 0) {
    timeGet = new Date().getTime();
  }

  instance.candlesticks("BTCUSDT", "1m", (error, ticks) => {
    // có 500 cây nến mỗi cây cách nhau 1 phút
    if (error == null) {
      let last_tick = ticks[ticks.length - 1];
      let [time, open, high, low, close, volume] = last_tick;
      let t = timeGet;
      if (s == 30 || o == 0) {
        o = parseFloat(parseFloat(open).toFixed(2));
      }

      let h = parseFloat(parseFloat(high).toFixed(2)),
        l = parseFloat(parseFloat(low).toFixed(2)),
        c = parseFloat(parseFloat(close).toFixed(2)),
        v = parseFloat(parseFloat(volume).toFixed(2));
      // kiểm tra bảo trì hệ thống

      // kết thúc kiểm tra
      // ======================================

      if (maintenance) return;

      // CHỈNH SỬA THÔNG SỐ GIÁ

      //=========================================
      let lastClose = LIST_GET_DATA[LIST_GET_DATA.length - 1].close;
      //let tC = lastClose - o;

      // định giá open chuyển nến ( đều nến )
      //o = (tC + o + (Math.random() * 1.5)).toFixed(2)
      o = parseFloat(lastClose);

      // giá hight phải lớn hơn open + close , low phải nhỏ hơn open + close

      if (h < o) {
        h = o + parseFloat((Math.random() * 5).toFixed(2));
      }
      if (h < c) {
        h = c + parseFloat((Math.random() * 5).toFixed(2));
      }

      if (l > o) {
        l = o - parseFloat((Math.random() * 5).toFixed(2));
      }
      if (l > c) {
        l = c - parseFloat((Math.random() * 5).toFixed(2));
      }

      // ======================================

      // KẾT THÚC CHỈNH SỬA THÔNG SỐ GIÁ

      //=========================================

      if (s < 30) {
        jsonData = { date: t, open: o, high: h, low: l, close: c, volume: v };
      }
      XU_LY_VOLUM(s, jsonData);
    }
  });
}

let rdSe = 7, // 5 - 14 giây
  rdSe2 = 26; // 20 - 25 giây
/* trigger XU_LY_VOLUME nếu waiting và thời gian đếm ngược < 5-14 && != 0 hoặc nếu đang order và thời gian đếm ngược > 20-25 || == 0 else PRICE_BUY_LIVE_BACKUP = PRICE_SELL_LIVE_BACKUP = 0
  uodate OPEN_CHECK and CLOSE_CHECK dựa trên jDATA(jsonData truyền vào từ playRealTimeSpot)
  nếu thời gian đếm ngược < 5 - 14 giây total_bet_amount = PRICE_BUY_LIVE_BACKUP = PRICE_BUY_LIVE
  nếu thời gian đếm ngược > 20 - 25 giây total_bet_amount = PRICE_BUY_LIVE_BACKUP là giá PRICE_BUY_LIVE ở phiên trước
  total_bet_amount - PRICE_MAKETING(số tiền đặt cược không phải của khách hàng)
  Nếu Buy win điều chỉnh cho CLOSE_CHECK và jsonData.close > OPEN_CHECK
  Nếu Sell win điều chỉnh cho CLOSE_CHECK và jsonData.close < OPEN_CHECK
  Nếu less win check xem số tiền total_bet_amount của buy hay sell cái nào nhỏ hơn sẽ điều chỉnh jsonData.close để phía ít hơn sẽ thắng
  Nếu chênh lệch giữa buy và sell lớn hơn AMOUNT_MAX_BREAK_BRIDGE thì sẽ điều chỉnh jsonData.close để phía ít hơn thắng
 */
function XU_LY_VOLUM(s, jDATA) {
  if (
    (ORDER_OR_WATTING === "watting" &&
      s < rdSe &&
      ORDER_OR_WATTING === "watting" &&
      s != 0) ||
    (ORDER_OR_WATTING === "order" && s > rdSe2) ||
    (ORDER_OR_WATTING === "order" && s == 0)
  ) {
    CLOSE_CHECK = jDATA.close;
    OPEN_CHECK = jDATA.open;

    let totalBuy = 0;
    let totalSell = 0;

    if (s < rdSe) {
      totalBuy = PRICE_BUY_LIVE_BACKUP = PRICE_BUY_LIVE;
      totalSell = PRICE_SELL_LIVE_BACKUP = PRICE_SELL_LIVE;
    }
    if (s > rdSe2) {
      totalBuy = PRICE_BUY_LIVE_BACKUP;
      totalSell = PRICE_SELL_LIVE_BACKUP;
    }

    totalBuy -= PRICE_MAKETING_BUY;
    totalSell -= PRICE_MAKETING_SELL;

    if (DATA_GL.BTC.BUY) {
      if (CLOSE_CHECK < OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) {
        let tl = OPEN_CHECK - CLOSE_CHECK;
        CLOSE_CHECK = CLOSE_CHECK + tl + Math.random() * 3;
      } else {
        let rd = Math.floor(Math.random() * 6);
        if (rd % 2) {
          CLOSE_CHECK = CLOSE_CHECK + Math.random() * 3;
        } else {
          //CLOSE_CHECK += (Math.random() * 3);
        }
      }
      jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));
    } else if (DATA_GL.BTC.SELL) {
      if (CLOSE_CHECK > OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) {
        let tl = CLOSE_CHECK - OPEN_CHECK;
        CLOSE_CHECK = CLOSE_CHECK - tl - Math.random() * 3;
      } else {
        let rd = Math.floor(Math.random() * 6);
        if (rd % 2) {
          CLOSE_CHECK = CLOSE_CHECK - Math.random() * 3;
        } else {
          //CLOSE_CHECK += (Math.random() * 3);
        }
      }
      jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));
    } else if (DATA_GL.LESS_WIN) {
      // ít là ăn
      if (totalBuy < totalSell) {
        // BUY sẽ thắng ( CLOSE > OPEN )
        if (CLOSE_CHECK < OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) {
          let tl = OPEN_CHECK - CLOSE_CHECK;
          CLOSE_CHECK = CLOSE_CHECK + tl + Math.random() * 4;
        } else {
          let rd = Math.floor(Math.random() * 6);
          if (rd % 2) {
            CLOSE_CHECK = CLOSE_CHECK + Math.random() * 3;
          } else {
            //CLOSE_CHECK += (Math.random() * 3);
          }
        }
        jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));
      } else if (totalBuy > totalSell) {
        // SELL sẽ thắng ( CLOSE < OPEN ) // if(totalBuy > totalSell)
        if (CLOSE_CHECK > OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) {
          let tl = CLOSE_CHECK - OPEN_CHECK;
          CLOSE_CHECK = CLOSE_CHECK - tl - Math.random() * 4;
        } else {
          let rd = Math.floor(Math.random() * 6);
          if (rd % 2) {
            CLOSE_CHECK = CLOSE_CHECK - Math.random() * 3;
          } else {
            //CLOSE_CHECK += (Math.random() * 3);
          }
        }
        jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));
      }
    } else {
      let totalBuyAv = totalBuy - totalSell;
      let totalSellAv = totalSell - totalBuy;

      let rdn = AMOUNT_MAX_BREAK_BRIDGE;

      if (totalBuyAv > rdn) {
        // SELL sẽ thắng bắc buộc phải  ( CLOSE < OPEN )
        if (CLOSE_CHECK > OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) {
          let tl = CLOSE_CHECK - OPEN_CHECK;
          CLOSE_CHECK = CLOSE_CHECK - tl - Math.random() * 4;
        } else {
          let rd = Math.floor(Math.random() * 6);
          if (rd % 2) {
            CLOSE_CHECK = CLOSE_CHECK - Math.random() * 3;
          } else {
            //CLOSE_CHECK += (Math.random() * 3);
          }
        }
        jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));
      } else if (totalSellAv > rdn) {
        // BUY sẽ thắng bắc buộc phải ( CLOSE > OPEN )
        if (CLOSE_CHECK < OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) {
          // nếu close nhỏ hơn

          let tl = OPEN_CHECK - CLOSE_CHECK;
          CLOSE_CHECK = CLOSE_CHECK + tl + Math.random() * 4;
        } else {
          let rd = Math.floor(Math.random() * 6);
          if (rd % 2) {
            CLOSE_CHECK = CLOSE_CHECK + Math.random() * 3;
          } else {
            //CLOSE_CHECK += (Math.random() * 3);
          }
        }
        jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));
      }
    }
    /**
     * Ít là ăn
     */
  } else {
    PRICE_BUY_LIVE_BACKUP = PRICE_SELL_LIVE_BACKUP = 0;
    //CHECK_XU_LY_VOL = false;
    //CLOSE_CHECK = 0;
    //OPEN_CHECK = 0;
  }
}
/*
đặt lại giá PRICE_LIVE_BACKUP (total_bet_amount của users) PRICE_MAKETING = 0 tăng thêm session make rdSe rdSe2 random => PUSH_STATIC_2
*/
function xuLyChartKetThuc1Phien(data) {
  if (maintenance) return; // bảo trì , dừng

  PRICE_BUY_LIVE_BACKUP = PRICE_BUY_LIVE;
  PRICE_SELL_LIVE_BACKUP = PRICE_SELL_LIVE;

  PRICE_MAKETING_BUY = 0;
  PRICE_MAKETING_SELL = 0;

  /**
   * Ít là ăn
   */

  session++;

  //}

  rdSe = Math.floor(Math.random() * 10) + 5; // 0 - 14 giây
  rdSe2 = Math.floor(Math.random() * 6) + 20; // 20 - 25 giây

  PUSH_STATIC_2(data);

  // Xử lý kết quả
}

function PUSH_STATIC(data) {
  let title;

  if (data.close > data.open) {
    // BUY
    title = "buy";
    BUY.push(title);
  } else {
    // SELL
    title = "sell";
    SELL.push(title);
  }

  if (LIST_GET_DATA.length >= 120) {
    LIST_GET_DATA.shift();
  }
  LIST_GET_DATA.push(data);

  STATIC.push(title);

  writeStatic();
}
/* update số lần Buy hoặc Sell thắng và Static(cả Buy lẫn Sell) update cây nến mới nhất vào LIST_GET_DATA
=> writeStatic gửi Buy Sell Static và mấy cái oslicator cho users
=> HandlingBuySell2
*/
function PUSH_STATIC_2(data) {
  let title;

  if (data.close > data.open) {
    // BUY
    title = "buy";
    BUY.push(title);
  } else {
    // SELL
    title = "sell";
    SELL.push(title);
  }

  BOT_TRADE.SEND_RESULT(title);

  if (LIST_GET_DATA.length >= 120) {
    LIST_GET_DATA.shift();
  }
  LIST_GET_DATA.push(data);

  STATIC.push(title);

  writeStatic();

  HandlingBuySell2(title);
}

function XU_LY_QUY_BOT(PRICE_WIN, PRICE_LOSE) {
  // total_win_amount and total_lose_amount in session
  // Không mở chức năng
  if (!DATA_GL.PRICE_FUND_ON_OFF) return;

  let price_win = PRICE_WIN - AMOUNT_MARKETING_WIN; // đây là số tiền hệ thống trả người thắng
  let price_lose = PRICE_LOSE - AMOUNT_MARKETING_LOSE; // đây là số tiền hệ thống nhận từ người thua
  let total = price_lose - price_win; // số dư lời
  // thêm vào bộ nhớ số tiền tiền lời / lỗ

  let sss = session;
  DATA_GL.PRICE_FUND_PROFITS += total;
  //console.log(DATA_GL.PRICE_FUND_PROFITS);

  if (DATA_GL.PRICE_FUND_PROFITS < AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE) {
    // âm tiền hệ thống lỗ
    // bật chức năng bên ít win
    //console.log(DATA_GL.PRICE_FUND_PROFITS);
    BTC_LESS_WIN();
    Tele.sendMessBet(
      `🔍Phiên hiện tại: <b>${sss--}</b> 💴: <i>${total}</i>\n🖲Hệ thống LỖ 💴: <i>${
        DATA_GL.PRICE_FUND_PROFITS
      }</i>\n🕹Gỡ tiền: <i>ON</i>`
    );
  } else if (DATA_GL.PRICE_FUND_PROFITS < 0) {
    Tele.sendMessBet(
      `🔍Phiên hiện tại: <b>${sss--}</b> 💴: <i>${total}</i>\n🖲Hệ thống đang LỖ 💴: <i>${
        DATA_GL.PRICE_FUND_PROFITS
      }</i>🗣Sắp bẻ cầu`
    );
  } else if (DATA_GL.PRICE_FUND_PROFITS > 0) {
    BTC_TOOL_OFF();
    Tele.sendMessBet(
      `🔍Phiên hiện tại: <b>${sss--}</b> 💴: <i>${total}</i>\n🖲Hệ thống LỜI 💴: <i>${
        DATA_GL.PRICE_FUND_PROFITS
      }</i>\n🕹Gỡ tiền: <i>OFF</i>`
    );
    DATA_GL.PRICE_FUND_PROFITS = 0;
  }
  // thoát BOT nếu là acc marketing chơi
  if (
    (AMOUNT_MARKETING_WIN > 0 || AMOUNT_MARKETING_LOSE > 0) &&
    DATA_GL.PRICE_FUND_PROFITS == 0
  ) {
    BTC_TOOL_OFF();
  }

  //console.log(DATA_GL);

  AMOUNT_MARKETING_WIN = AMOUNT_MARKETING_LOSE = 0;
  // // kiểm tra tích quỹ đã đủ chưa
  // // quỷ tiếp theo bé hơn quỹ mặc định nhập
  // if(DATA_GL.PRICE_FUND_NEXT < DATA_GL.PRICE_FUND_DEFAULT){
  //     // tích % tổng lời ra đưa vào quỹ ( mặc địch cho cược tự nhiên )
  //     let FUND = total / 100 * DATA_GL.PRICE_FUND_RATE;
  //     DATA_GL.PRICE_FUND_NEXT += FUND;
  // } else if(DATA_GL.PRICE_FUND_NEXT >= DATA_GL.PRICE_FUND_DEFAULT){

  // }
}

function BTC_TOOL_OFF() {
  DATA_GL.BTC.BUY = false;
  DATA_GL.BTC.SELL = false;
  DATA_GL.LESS_WIN = false;
}

function BTC_SET_BUY_WIN() {
  DATA_GL.BTC.BUY = true;
  DATA_GL.BTC.SELL = false;
  DATA_GL.LESS_WIN = false;
}

function BTC_SET_SELL_WIN() {
  DATA_GL.BTC.BUY = false;
  DATA_GL.BTC.SELL = true;
  DATA_GL.LESS_WIN = false;
}

function BTC_LESS_WIN() {
  DATA_GL.BTC.BUY = false;
  DATA_GL.BTC.SELL = false;
  DATA_GL.LESS_WIN = true;
}

//========================= XỬ LÝ ĐẶT CƯỢC
/* 
update PRICE_BUY_SELL_LIVE(total_bet_amount_live in session), PRICE_BUY_SELL_DEMO(total_bet_amount_demo in session),
AMOUNT_USER_BUY_SELL(amount of each user bet), PRICE_MAKETING_BUY_SELL(total_bet_amount_mkt), BTC_USER_BUY_SELL(bet info of all users in session)
*/
function BetBUY(ws, data) {
  if (ANTI_BET) {
    let obj = { type: "bet", mess: "Vui lòng đợi phiên sau!", style: "danger" };
    ws.send(JSON.stringify({ type: "mess", data: obj }));
    return;
  }

  //let idPlayer = data.idPlayer;

  let uid = data.uid;
  let typeAccount = data.typeAccount;
  let action = data.type;
  let betAmount = Number(data.betAmount);

  let accMarketing = data.mkt;

  for (let obj in users) {
    if (users[obj].ws == ws) {
      users[obj].uid = uid; // thay đổi id nếu change account
    }
  }

  var numberRegex = /^[]?\d+(\.\d+)?([eE][]?\d+)?$/;

  if (numberRegex.test(betAmount)) {
    // số tiền đc phép đặt cược
    if (betAmount < BET_MAX) {
      let obj = {
        type: "bet",
        mess: "Số tiền không được nhở hơn " + BET_MAX,
        style: "danger",
      };
      ws.send(JSON.stringify({ type: "mess", data: obj }));
      return;
    }

    getMaretingAcc(data.email, (err, result) => {
      accMarketing = result.marketing;

      // kết thúc
      getPriceUser(data, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        if (!result) {
          return;
        }

        if (result.balance >= betAmount) {
          if (typeAccount == 1) {
            PRICE_BUY_LIVE += betAmount;
            //PRICE_BUY_LIVE.push(betAmount);
            updatePersonalTrading(data, (err, result) => {});
          } else {
            PRICE_BUY_DEMO += betAmount;
            //PRICE_BUY_DEMO.push(betAmount);
          }

          if (void 0 === AMOUNT_USER_BUY[`${uid}`])
            AMOUNT_USER_BUY[`${uid}`] = 0;

          if (typeAccount == 1 && accMarketing == 1) {
            PRICE_MAKETING_BUY += betAmount;
          }

          AMOUNT_USER_BUY[`${uid}`] += betAmount;
          BTC_USER_BUY[`${uid}`] =
            AMOUNT_USER_BUY[`${uid}`] +
            "||" +
            action +
            "||" +
            typeAccount +
            "||" +
            data.email +
            "||" +
            accMarketing +
            "||" +
            uid;

          updateBalanceUser(data, (err, result) => {
            ws.send(JSON.stringify({ type: "checkBet", data: "ok" }));
          });
        } else if (result.balance < betAmount) {
          let obj = { type: "bet", mess: "Số dư không đủ!", style: "danger" };
          ws.send(JSON.stringify({ type: "mess", data: obj }));
        }
      });
    });
  }
}

function BetSELL(ws, data) {
  if (ANTI_BET) {
    let obj = { type: "bet", mess: "Vui lòng đợi phiên sau!", style: "danger" };
    ws.send(JSON.stringify({ type: "mess", data: obj }));
    return;
  }

  let uid = data.uid;
  let typeAccount = data.typeAccount;
  let action = data.type;
  let betAmount = Number(data.betAmount);

  let accMarketing = data.mkt;

  for (let obj in users) {
    if (users[obj].ws == ws) {
      users[obj].uid = uid; // thay đổi id nếu change account
    }
  }

  var numberRegex = /^[]?\d+(\.\d+)?([eE][]?\d+)?$/;

  if (numberRegex.test(betAmount)) {
    // số tiền đc phép đặt cược
    if (betAmount < BET_MAX) {
      let obj = {
        type: "bet",
        mess: "Số tiền không được nhở hơn " + BET_MAX,
        style: "danger",
      };
      ws.send(JSON.stringify({ type: "mess", data: obj }));
      return;
    }
    getMaretingAcc(data.email, (err, result) => {
      accMarketing = result.marketing;

      // kết thúc
      getPriceUser(data, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        if (!result) {
          return;
        }
        if (result.balance >= betAmount) {
          if (typeAccount == 1) {
            //PRICE_SELL_LIVE.push(betAmount);
            PRICE_SELL_LIVE += betAmount;
            updatePersonalTrading(data, (err, result) => {});
          } else {
            //PRICE_SELL_DEMO.push(betAmount);
            PRICE_SELL_DEMO += betAmount;
          }

          if (void 0 === AMOUNT_USER_SELL[`${uid}`])
            AMOUNT_USER_SELL[`${uid}`] = 0;

          if (typeAccount == 1 && accMarketing == 1) {
            PRICE_MAKETING_SELL += betAmount;
          }

          // nếu tồn tại acc marketing

          AMOUNT_USER_SELL[`${uid}`] += betAmount;
          BTC_USER_SELL[`${uid}`] =
            AMOUNT_USER_SELL[`${uid}`] +
            "||" +
            action +
            "||" +
            typeAccount +
            "||" +
            data.email +
            "||" +
            accMarketing +
            "||" +
            uid;
          //console.log('MKT BET SELL: ' + accMarketing);
          updateBalanceUser(data, (err, result) => {
            ws.send(JSON.stringify({ type: "checkBet", data: "ok" }));
          });
        } else if (result.balance < betAmount) {
          let obj = { type: "bet", mess: "Số dư không đủ!", style: "danger" };
          ws.send(JSON.stringify({ type: "mess", data: obj }));
        }
      });
    });
  }
}

//========================= KẾT THÚC XỬ LÝ ĐẶT CƯỢC

function xulyInVaoHisBeCau() {
  const DATA_LIST_BE_CAU = [];

  for (let key in BTC_USER_BUY) {
    let uID = key;
    let moneyAndActionBuy = BTC_USER_BUY[uID];
    let moneyAndAction = moneyAndActionBuy.split("||");
    let money = moneyAndAction[0];
    let action = moneyAndAction[1];
    let typeAcc = moneyAndAction[2];
    let email = moneyAndAction[3];
    let mkt = moneyAndAction[4];
    if (typeAcc == 1) {
      let obj = {
        e: email,
        uid: uID,
        sv: SEVER_GET,
        bet: action,
        amount: money,
        mkt: mkt,
      };
      DATA_LIST_BE_CAU.push(obj);
    }
  }

  for (let key in BTC_USER_SELL) {
    let uID = key;
    let moneyAndActionSell = BTC_USER_SELL[uID];
    let moneyAndAction = moneyAndActionSell.split("||");
    let money = moneyAndAction[0];
    let action = moneyAndAction[1];
    let typeAcc = moneyAndAction[2];
    let email = moneyAndAction[3];
    let mkt = moneyAndAction[4];
    if (typeAcc == 1) {
      let obj = {
        e: email,
        uid: uID,
        sv: SEVER_GET,
        bet: action,
        amount: money,
        mkt: mkt,
      };
      DATA_LIST_BE_CAU.push(obj);
    }
  }

  if (DATA_LIST_BE_CAU.length != 0) {
    for (let obj in users) {
      let uid = users[obj].uid;
      // tìm UID của ADMIN rồi gửi

      if (uid == "ADMIN_BO") {
        //console.log(uid);
        let ws = users[obj].ws;
        //let totalPriceBUY = void 0 === eval(PRICE_BUY_LIVE.join('+')) ? 0 : eval(PRICE_BUY_LIVE.join('+'));
        //let totalPriceSELL = void 0 === eval(PRICE_SELL_LIVE.join('+')) ? 0 : eval(PRICE_SELL_LIVE.join('+'));
        let totalPriceBUY = PRICE_BUY_LIVE;
        let totalPriceSELL = PRICE_SELL_LIVE;

        ws.send(
          JSON.stringify({
            type: "truck",
            data: DATA_LIST_BE_CAU,
            price_buy: totalPriceBUY * 1,
            price_sell: totalPriceSELL * 1,
            mktBUY: PRICE_MAKETING_BUY * 1,
            mktSELL: PRICE_MAKETING_SELL * 1,
          })
        );
      }
    }
  }
}

function writeStatic() {
  let countBUY = BUY.length;
  let countSELL = SELL.length;

  //Moving
  let MovBUY = Math.floor(Math.random() * 16);
  let MovSELL = Math.floor(Math.random() * 16);
  let MovNeutral = Math.floor(Math.random() * 7);
  if (MovBUY === MovSELL) {
    MovSELL = Math.floor(Math.random() * 5);
  }

  //Oscillators
  let OscBUY = Math.floor(Math.random() * 16);
  let OscSELL = Math.floor(Math.random() * 16);
  let OscNeutral = Math.floor(Math.random() * 7);
  if (OscBUY === OscSELL) {
    OscSELL = Math.floor(Math.random() * 5);
  }

  //Summary
  let SumBUY = MovBUY + OscBUY;
  let SumSELL = MovSELL + OscSELL;
  let SumNeutral = MovNeutral + OscNeutral;

  getLoadStaticGue = {
    Moving: { b: MovBUY, s: MovSELL, m: MovNeutral },
    Oscillators: { b: OscBUY, s: OscSELL, m: OscNeutral },
    Summary: { b: SumBUY, s: SumSELL, m: SumNeutral },
  };
  let obj = { ss: session, cbuy: countBUY, csell: countSELL, static: STATIC };

  wss.clients.forEach(function each(client) {
    client.send(
      JSON.stringify({ type: "static", data: obj, load: getLoadStaticGue })
    );
  });
}
/* 
quét BTC_USER_BUY và BTC_USER_SELL kiểm tra các lệnh đặt cược của khách 
nếu khách thắng 
+) updatePriceWinLose => update mysql user amount bet win and amount bet lose
+) TOTAL_WIN_PRICE(total of user win amount) AMOUNT_MARKETING_WIN(total of user mkt win amount) += amountShow (95% bet_amount)
+) updateAmountWin => update mysql account balance and win amount
+) SaveHistory => bet_history INSERT INTO bet_history (email, id_account, type_account, buy_sell, currency, amount_win, amount_lose, amount_bet, open, close, session, marketing, created_at)
nếu khách thua
+) updatePriceWinLose => update mysql user amount bet win and amount bet lose
+) TOTAL_LOSE_PRICE(total of user lose amount) AMOUNT_MARKETING_LOSE(total of user mkt lose amount) TOTAL_LOSE_PRICE += money_bet; AMOUNT_MARKETING_LOSE += money_bet;
+) updateAmountLose => update mysql account lose amount
+) SaveHistory => bet_history INSERT INTO bet_history (email, id_account, type_account, buy_sell, currency, amount_win, amount_lose, amount_bet, open, close, session, marketing, created_at)
clear BTC_USER_BUY_SELL(information of user bet), AMOUNT_USER_BUY_SELL(not important), PRICE_BUY_SELL_LIVE(total_bet_amount of session for live) PRICE_BUY_SELL_DEMO(total_bet_amount of session for demo)
keep BTC_USER_BUY_SELL_BACK store value of BTC_USER_BUY_SELL for handle commision 
XU_LY_QUY_BOT => kiểm tra hệ thống lời lỗ thế nào để tự động bẻ cầu không quá aggresive 
HandlingCommissionBUYSELL => trả hoa hồng cho 7 cấp trên của mỗi user đã đặt cược dựa trên danh sách BTC_USER_BUY_SELL_BACK
*/
async function HandlingBuySell2(title) {
  var TOTAL_WIN_PRICE = 0, // total of win amount in session
    TOTAL_LOSE_PRICE = 0; // total of lose amount in session

  let countUser = Object.keys(users).length;
  // [ upline_id_liveOrDemo (from account): '10||buy||1||dungdq3@gmail.com||0||QEE8HOZ6YM' ]
  for (let obj in BTC_USER_BUY) {
    let moneyAndActionBuy = BTC_USER_BUY[obj];
    let moneyAndAction = moneyAndActionBuy.split("||");
    let money = moneyAndAction[0];
    let action = moneyAndAction[1];
    let type = moneyAndAction[2];
    let email = moneyAndAction[3];
    let accMarketingBuy = moneyAndAction[4];
    let uid = moneyAndAction[5];
    let ws = "";

    await new Promise((res, rej) => {
      let o = 0;
      for (let av in users) {
        o++;
        if (users[av].email == email) {
          ws = users[av].ws;
          res();
        }
        if (o === countUser) res();
      }
    });

    if (action === title) {
      // đây là thắng của BUY
      let amount = (money / 100) * rateNhaThuong; // Money của BUY

      let amountShow = Number(amount); // 95% tiền cược
      let addMo = amountShow + Number(money); // 195% tiềng cược

      let obj = {
        balance: addMo,
        win: amountShow,
        upID: uid,
        email: email,
      };

      if (type == 1) {
        updatePriceWinLose(obj, "w");
        TOTAL_WIN_PRICE += amountShow;
      }

      if (type == 1 && accMarketingBuy == 1) {
        AMOUNT_MARKETING_WIN += amountShow;
      }

      updateAmountWin(obj, (err, result) => {});

      let obj2 = {
        type: "kq",
        data: { kq: "win", money: addMo },
      };

      //console.log('XU LY BUY WIN: ' + accMarketingBuy);
      if (ws !== "") ws.send(JSON.stringify(obj2));

      // Lưu vào lịch sử
      SaveHistory(
        "win",
        uid,
        type,
        action,
        SEVER_GET,
        amountShow,
        money,
        email,
        accMarketingBuy
      );
    } else if (action !== title) {
      let obj = {
        lose: Number(money),
        upID: uid,
        email: email,
      };
      updateAmountLose(obj, (err, result) => {});

      if (type == 1) {
        updatePriceWinLose(obj, "l");
        TOTAL_LOSE_PRICE += obj.lose;
      }
      if (type == 1 && accMarketingBuy == 1) {
        AMOUNT_MARKETING_LOSE += obj.lose;
      }

      let obj2 = {
        type: "kq",
        data: { kq: "lose", money: Number(money) },
      };

      if (ws !== "") ws.send(JSON.stringify(obj2));

      // Lưu vào lịch sử
      SaveHistory(
        "lose",
        uid,
        type,
        action,
        SEVER_GET,
        money,
        money,
        email,
        accMarketingBuy
      );
    }
  }

  for (let obj in BTC_USER_SELL) {
    let moneyAndActionSell = BTC_USER_SELL[obj];
    let moneyAndAction = moneyAndActionSell.split("||");
    let money2 = moneyAndAction[0];
    let action2 = moneyAndAction[1];
    let type2 = moneyAndAction[2];
    let email2 = moneyAndAction[3];
    let accMarketingSell = moneyAndAction[4];
    let uid = moneyAndAction[5];
    let ws = "";

    await new Promise((res, rej) => {
      let o = 0;

      for (let av in users) {
        o++;
        if (users[av].email == email2) {
          ws = users[av].ws;
          res();
        }
        if (o === countUser) res();
      }
    });

    if (action2 === title) {
      // đây là thắng của SELL
      let amount = (money2 / 100) * rateNhaThuong; // Money của BUY

      let amountShow = Number(amount); // là tổng số tiền nhận được
      let addMo = amountShow + Number(money2);

      let obj = {
        balance: addMo,
        win: amountShow,
        upID: uid,
        email: email2,
      };

      if (type2 == 1) {
        TOTAL_WIN_PRICE += amountShow;
        updatePriceWinLose(obj, "w");
      }
      if (type2 == 1 && accMarketingSell == 1) {
        AMOUNT_MARKETING_WIN += amountShow;
      }

      updateAmountWin(obj, (err, result) => {});

      let obj2 = {
        type: "kq",
        data: { kq: "win", money: addMo },
      };

      if (ws !== "") ws.send(JSON.stringify(obj2));

      //console.log('XU LY SELL WIN: ' + accMarketingSell);

      // Lưu vào lịch sử
      SaveHistory(
        "win",
        uid,
        type2,
        action2,
        SEVER_GET,
        amountShow,
        money2,
        email2,
        accMarketingSell
      );
    } else if (action2 !== title) {
      let obj = {
        lose: Number(money2),
        upID: uid,
        email: email2,
      };
      updateAmountLose(obj, (err, result) => {});

      if (type2 == 1) {
        TOTAL_LOSE_PRICE += obj.lose;
        updatePriceWinLose(obj, "l");
      }

      if (type2 == 1 && accMarketingSell == 1) {
        AMOUNT_MARKETING_LOSE += obj.lose;
      }

      let obj2 = {
        type: "kq",
        data: { kq: "lose", money: Number(money2) },
      };

      //console.log('XU LY SELL LOSE: ' + accMarketingSell);

      if (ws !== "") ws.send(JSON.stringify(obj2));

      // Lưu vào lịch sử
      SaveHistory(
        "lose",
        uid,
        type2,
        action2,
        SEVER_GET,
        money2,
        money2,
        email2,
        accMarketingSell
      );
    }
  }

  BTC_USER_BUY_BACK = BTC_USER_BUY;
  BTC_USER_SELL_BACK = BTC_USER_SELL;

  BTC_USER_BUY = [];
  BTC_USER_SELL = [];

  AMOUNT_USER_BUY = [];
  AMOUNT_USER_SELL = [];

  PRICE_BUY_LIVE = 0;
  PRICE_SELL_LIVE = 0;

  PRICE_BUY_DEMO = 0;
  PRICE_SELL_DEMO = 0;

  XU_LY_QUY_BOT(TOTAL_WIN_PRICE, TOTAL_LOSE_PRICE);
  //money, uid, type, email, marketing
  HandlingCommissionBUY();
  HandlingCommissionSELL();
}

// Xử lý thưởng hoa hồng khi đặt cược
/* 
lấy thông tin của người dùng đã đặt cược trong phiên lấy upline_id ref_code
nếu có upline_id thì lấy thông tin 7 người cấp trên của mình và dựa trên hoa hồng từng cấp bắt đầu thực hiện các câu lệnh update insert vào mysql
thực hiện trả thưởng cho 7 cấp trên của người đã bet như sau 
UPDATE users SET money_usdt = money_usdt + ?, pending_commission = pending_commission + ?, commission_update = now() WHERE ref_code = ?
INSERT INTO commission_history (email, from_upid, ref_id, upline_id, pending_commission, personal_trading_volume, type, marketing, session, created_at) 
*/

async function HandlingCommissionBUY() {
  // cái này mỗi lần user nó buy nó lấy 7 thằng trên user để nó trả commmision
  // lấy thông tin systeam hoa hồng
  let lsComm = Helper.getConfig(fileCommission);

  let UpId = ""; // lấy mã ref ( nếu có )
  let RefFN = ""; // ref của chính mình
  //let email = ''; // email của chính mình
  var levelVip = 1;

  let obj = {
    penCom: 0, // rate hoa hồng
    upID: 0,
    refID: 0, // ID ref của mình
    email: "", // email chính mình
    fromID: 0, // là mã ID account LIVE
    volum: 0, // số tiền đặt cược
  };

  for (let xl in BTC_USER_BUY_BACK) {
    let moneyAndActionBuy = BTC_USER_BUY_BACK[xl];
    let moneyAndAction = moneyAndActionBuy.split("||");
    let money = moneyAndAction[0];
    //let action = moneyAndAction[1];
    let type = moneyAndAction[2];
    let email = moneyAndAction[3];
    let accMarketingBuy = moneyAndAction[4];
    let uid = moneyAndAction[5];

    if (type == 1) {
      await new Promise((res, rej) => {
        checkF0Commission(email, (err, results) => {
          // lấy thông tin của mình

          if (results.length) {
            // level_vip, ref_code, upline_id, nick_name
            // nếu tồn tại
            UpId = results[0].upline_id; // lấy mã ref ( nếu có )
            RefFN = results[0].ref_code; // ref của chính mình
          }
          res();
        });
      });

      if (void 0 !== UpId || UpId !== null || UpId !== "") {
        // nếu có tồn tại F0 của mình

        await new Promise((res, rej) => {
          listF0With7Level(UpId, (err, results) => {
            // lấy thông tin của mình bao gồm F0 của mình
            let i = 0;
            for (let nb in results) {
              let d = results[nb];

              if (d.length > 0) {
                levelVip = d[0].level_vip;

                let rateVal = lsComm[i].value * 1;
                let rateCommission = (money / 100) * rateVal;

                obj.penCom = rateCommission;
                obj.upID = RefFN;
                obj.refID = d[0].ref_code;
                obj.email = d[0].email;
                obj.fromID = uid;
                obj.volum = money;
                obj.mkt = accMarketingBuy;
                obj.session = session;

                if (i === 0) {
                  // F0 của mình chắc chắn sẽ nhận
                  // update số tiền hoa hồng vào tài khoản
                  updateAmountRateCommission(obj);
                } else {
                  if (levelVip >= i) {
                    obj.volum = 0;
                    // update số tiền hoa hồng vào tài khoản
                    updateAmountRateCommission(obj);
                  }
                }
              } else {
                res();
                break;
              }
              i++;
            }
          });
        });
      }
    }
  }

  //BTC_USER_BUY_BACK = [];
}

async function HandlingCommissionSELL() {
  // lấy thông tin systeam hoa hồng
  let lsComm = Helper.getConfig(fileCommission);

  let UpId = ""; // lấy mã ref ( nếu có )
  let RefFN = ""; // ref của chính mình
  //let email = ''; // email của chính mình
  var levelVip = 1;

  let obj = {
    penCom: 0, // rate hoa hồng
    upID: 0,
    refID: 0, // ID ref của mình
    email: "", // email chính mình
    fromID: 0, // là mã ID account LIVE
    volum: 0, // số tiền đặt cược
  };

  for (let xl in BTC_USER_SELL_BACK) {
    let moneyAndActionSell = BTC_USER_SELL_BACK[xl];
    let moneyAndAction = moneyAndActionSell.split("||");
    let money2 = moneyAndAction[0];
    //let action2 = moneyAndAction[1];
    let type2 = moneyAndAction[2];
    let email2 = moneyAndAction[3];
    let accMarketingSell = moneyAndAction[4];
    let uid = moneyAndAction[5];

    if (type2 == 1) {
      await new Promise((res, rej) => {
        checkF0Commission(email2, (err, results) => {
          // lấy thông tin của mình

          if (results.length) {
            // nếu tồn tại
            UpId = results[0].upline_id; // lấy mã ref ( nếu có )
            RefFN = results[0].ref_code; // ref của chính mình
          }
          res();
        });
      });

      if (void 0 !== UpId || UpId !== null || UpId !== "") {
        // nếu có tồn tại F0 của mình
        await new Promise((res, rej) => {
          listF0With7Level(UpId, (err, results) => {
            // lấy thông tin của mình bao gồm F0 của mình
            let i = 0;
            for (let nb in results) {
              let d = results[nb];

              if (d.length > 0) {
                levelVip = d[0].level_vip;

                let rateVal = lsComm[i].value * 1;
                let rateCommission = (money2 / 100) * rateVal;

                obj.penCom = rateCommission;
                obj.upID = RefFN;
                obj.refID = d[0].ref_code;
                obj.email = d[0].email;
                obj.fromID = uid;
                obj.volum = money2;
                obj.mkt = accMarketingSell;
                obj.session = session;

                if (i === 0) {
                  // F0 của mình chắc chắn sẽ nhận
                  // update số tiền hoa hồng vào tài khoản
                  updateAmountRateCommission(obj, (err) => {});
                } else {
                  if (levelVip >= i) {
                    obj.volum = 0;
                    // update số tiền hoa hồng vào tài khoản
                    updateAmountRateCommission(obj, (err) => {});
                  }
                }
              } else {
                res();
                break;
              }
              i++;
            }
          });
        });
      }
    }
  }

  //BTC_USER_SELL_BACK = [];
}

// Kết thúc xử lý thưởng hoa hồng khi đặt cược

/*

*/
function SaveHistory(
  wl,
  uid,
  typeAccount,
  buy_sell,
  currency,
  amountWL,
  amountBet,
  email,
  marketing
) {
  var count = LIST_GET_DATA.length - 1;
  var op = parseFloat(LIST_GET_DATA[count].open).toFixed(2);
  var cl = parseFloat(LIST_GET_DATA[count].close).toFixed(2);

  let obj = {
    uid: uid, // upline_id
    typeAccount: Number(typeAccount), // live or demo
    currency: currency, // BTC_USDT
    buy_sell: buy_sell, // buy or sell
    amount_win: wl == "win" ? Number(amountWL) : 0,
    amount_lose: wl == "win" ? 0 : Number(amountWL),
    amount_bet: amountBet, // số tiền bet
    open: op, // jsonData.open
    close: cl, // jsonData.close
    session: session, // phiên số
    email: email,
    mkt: marketing,
  };

  insertBetOrder(obj, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  });
}

// kết thúc xử lý lưu vào lịch sử

//=========================

var startBotAo,
  numberBuy = 0,
  numberSell = 0;
/* mỗi 2 giây thực thi tăng tổng số tiền cược và phần trăm lên rồi gửi đến khách*/
function BOTAOStart() {
  //var PRICE_BUY_BOT = 0, PRICE_SELL_BOT = 0;

  startBotAo = setInterval(function () {
    var rd = Math.floor(Math.random() * 2 + 1);
    var rdNumBuy = 0;
    var rdNumSell = 0;
    if (rd == 1) {
      rdNumBuy = Math.floor(Math.random() * BET_MAX + BET_MAX * 1.5);
      rdNumSell = Math.floor(Math.random() * 10000 + 1);
    } else {
      rdNumBuy = Math.floor(Math.random() * 10000 + 1);
      rdNumSell = Math.floor(Math.random() * BET_MAX + BET_MAX * 1.5);
    }
    numberBuy += rdNumBuy;
    numberSell += rdNumSell;

    let getPRICE_BUY = PRICE_BUY_LIVE + numberBuy;
    let getPRICE_SELL = PRICE_SELL_LIVE + numberSell;

    numberBuy = getPRICE_BUY;
    numberSell = getPRICE_SELL;

    let total = numberBuy + numberSell;
    totalPTBuy = toFixed((numberBuy / total) * 100, 0); // phần trăm buy
    totalPTSell = toFixed((numberSell / total) * 100, 0); // phần trăm sell

    wss.clients.forEach(function each(client) {
      let json = {
        nbuy: numberBuy,
        nsell: numberSell,
        ptbuy: Number(totalPTBuy),
        ptsell: Number(totalPTSell),
      };

      client.send(JSON.stringify({ type: "transVolum", data: json }));
    });
  }, 2000);
}

function BOTAOClear() {
  numberBuy = 0;
  numberSell = 0;
  clearInterval(startBotAo);
}

// var instanceFuture = Binance({
//   apiKey: config.BINANCE_APIKEY,
//   apiSecret: config.BINANCE_APISECRET,
// });

// khởi chạy game
// function playRealTimeFutures(s) {
//   if (s == 0) {
//     timeGet = new Date().getTime();
//   }

//   instanceFuture
//     .futuresCandles({ symbol: "BTCUSDT", interval: "1m" })
//     .then((ticks) => {
//       if (maintenance) return;

//       //let last_price = Object.keys(price).pop();
//       //last_price = price[last_price];
//       //let [time, open, high, low, close, volume] = price[last_price];

//       let last_tick = ticks[ticks.length - 1];

//       //let t = timeGet;
//       if (s == 30 || o == 0) {
//         o = parseFloat(last_tick.open);
//         o = o + Math.random() * 1;
//       }
//       let h = parseFloat(last_tick.high),
//         l = parseFloat(last_tick.low),
//         c = parseFloat(last_tick.close),
//         v = parseFloat(last_tick.volume);

//       // CHỈNH SỬA THÔNG SỐ GIÁ

//       //=========================================
//       let lastClose = LIST_GET_DATA[LIST_GET_DATA.length - 1].close;
//       //let tC = lastClose - o;

//       // định giá open chuyển nến ( đều nến )
//       //o = (tC + o + (Math.random() * 1.5)).toFixed(2);
//       o = parseFloat(lastClose);
//       // giá hight phải lớn hơn open + close , low phải nhỏ hơn open + close

//       if (h < o) {
//         h = o + parseFloat((Math.random() * 5).toFixed(2));
//       }
//       if (h < c) {
//         h = c + parseFloat((Math.random() * 5).toFixed(2));
//       }

//       if (l > o) {
//         l = o - parseFloat((Math.random() * 5).toFixed(2));
//       }
//       if (l > c) {
//         l = c - parseFloat((Math.random() * 5).toFixed(2));
//       }

//       // ======================================

//       // KẾT THÚC CHỈNH SỬA THÔNG SỐ GIÁ

//       //=========================================

//       if (s < 30) {
//         jsonData = { date: t, open: o, high: h, low: l, close: c, volume: v };
//       }
//       XU_LY_VOLUM(s);
//     });
// }

// function xuLyChartKetThuc1Phien_backup(data) {
//   if (maintenance) return; // bảo trì , dừng

//   let close = data.close,
//     open = data.open;

//   //console.log(ORDER_OR_WATTING);
//   if (ORDER_OR_WATTING === "order") {
//     //watting
//     /* RA BUY */

//     if (DATA_GL.BTC.BUY) {
//       if (close < open || close == open) {
//         var tl = open - close;
//         close = Number(close) + Number(tl) + Math.random() * 3;
//       }
//       jsonData.close = parseFloat(close.toFixed(2));
//     }

//     if (DATA_GL.BTC.SELL) {
//       if (close > open || close == open) {
//         var tl = close - open;
//         close = Number(open) - Number(tl) - Math.random() * 3;
//       }
//       jsonData.close = parseFloat(close.toFixed(2));
//     }

//     // kết thúc

//     /**
//      * Ít là ăn
//      *
//      */
//     //let totalBuy = void 0 === eval(PRICE_BUY_LIVE.join('+')) ? 0 : eval(PRICE_BUY_LIVE.join('+'));
//     //let totalSell = void 0 === eval(PRICE_SELL_LIVE.join('+')) ? 0 : eval(PRICE_SELL_LIVE.join('+'));
//     let totalBuy = PRICE_BUY_LIVE;
//     let totalSell = PRICE_SELL_LIVE;

//     totalBuy -= PRICE_MAKETING_BUY;
//     totalSell -= PRICE_MAKETING_SELL;

//     //kiểm tra nếu số tiền chênh lệch cao thì cho thua
//     //let rd = Math.floor(Math.random() * 200) + 400;

//     if (DATA_GL.LESS_WIN) {
//       // ít là ăn
//       if (totalBuy < totalSell) {
//         // BUY sẽ thắng ( CLOSE > OPEN )

//         if (close < open || close == open) {
//           let tl = open - close;
//           close = Number(close) + Number(tl) + Math.random() * 3;
//         }
//         jsonData.close = parseFloat(close.toFixed(2));
//       } else if (totalBuy > totalSell) {
//         // SELL sẽ thắng ( CLOSE < OPEN ) // if(totalBuy > totalSell)

//         if (close > open || close == open) {
//           var tl = close - open;
//           close = Number(open) - Number(tl) - Math.random() * 3;
//         }
//         jsonData.close = parseFloat(close.toFixed(2));
//       }
//     } else {
//       let totalBuyAv = 0;
//       let totalSellAv = 0;
//       if (totalBuy > totalSell) {
//         totalBuyAv = totalBuy - totalSell;
//       } else if (totalBuy < totalSell) {
//         totalSellAv = totalSell - totalBuy;
//       }

//       let rd = 400;
//       if (totalBuyAv > rd) {
//         // SELL sẽ thắng ( CLOSE < OPEN )
//         if (close > open || close == open) {
//           var tl = close - open;
//           close = Number(open) - Number(tl) - Math.random() * 3;
//         }
//         jsonData.close = parseFloat(close.toFixed(2));
//       } else if (totalSellAv > rd) {
//         // BUY sẽ thắng ( CLOSE > OPEN )
//         if (close < open || close == open) {
//           let tl = open - close;
//           close = Number(close) + Number(tl) + Math.random() * 3;
//         }
//         jsonData.close = parseFloat(close.toFixed(2));
//       }
//     }

//     PRICE_MAKETING_BUY = 0;
//     PRICE_MAKETING_SELL = 0;

//     /**
//      * Ít là ăn
//      *
//      */

//     session++;
//   }

//   let title;

//   if (jsonData.close > jsonData.open) {
//     // BUY
//     title = "buy";
//     BUY.push(title);
//   } else {
//     // SELL
//     title = "sell";
//     SELL.push(title);
//   }

//   if (LIST_GET_DATA.length >= 120) {
//     LIST_GET_DATA.shift();
//   }
//   LIST_GET_DATA.push(jsonData);

//   STATIC.push(title);

//   writeStatic();

//   //timeGet = new Date().getTime();
//   // Xử lý kết quả
//   //HandlingBuySell(title);
//   HandlingBuySell2(title);
// }


// cái này mình chuyển thành kiểu hướng đối tượng gồm static data phía trên với các cái phương thức thực thi bên dứoi đây
// websocket chỉ cần dùng một cái thôi và hứng sự kiện

/* khởi động chương trình lấy 120 cây nến từ biannce và update vào LIST_GET_DATA [{date, open, high, low, close, volume}...]  => chạy countDownGame */

/* chương trình chính của App thực thi theo từng giây mỗi lần thực thi SO_GIAY_DEM_NGUOC sẽ trừ đi 1. Nội dung thực thi:
+) playRealTimeSpot => XU_LY_VOLUM (lấy nến tiếp theo và can thiệp kết quả)
+) jsonData["candleClose"] = SO_GIAY_DEM_NGUOC; jsonData["type"] = ORDER_OR_WATTING;
+) XU_LY_SEND_BOT_DU_DOAN ko quan trọng 
+) khi kết thúc thời gian đếm ngược 
-) BOTAOClear clearInterval(startBotAo)
-) khi kết thúc phiên thì 
.) startBotAo để tăng số lượng cược lên và gửi đến user
.) xuLyChartKetThuc1Phien => khi kết thúc 1 phiên reset lại dữ liệu quét các lệnh của khách khách update mysql trả hoa hồng cho các cấp trên của từng lệnh bet
-) khi kết thúc đặt cược thì
.) xulyInVaoHisBeCau => gửi thông tin cho admin xem có nên bẻ cầu hay không
.) if session !== 1000000 PUSH_STATIC gửo thông tin cho admin là phe nào thắng để admin quyết định có nên bẻ cầu hay không.
*/

/*  mỗi giây sẽ lấy ra 500 cây nến rồi lấy cây nến gần nhất và thực hiện update dữ liệu
dữ liệu lấy theo cây nến mới nhất trong 500 cây nến này trừ giá mở cửa và thời gian, 
nếu thời gian đếm ngược là 0 sẽ set thời gian cho cây nến,
giá mở cửa sẽ lấy theo giá đóng cửa của cây nến mới nhất trong 120 cây nến vừa lấy lúc khởi tạo game 
giá high phải lớn hơn open và close , low phải nhỏ hơn open và close nếu s < 30 thì update jsonData
=> call XU_LY_VOLUME
*/

/* trigger XU_LY_VOLUME nếu waiting và thời gian đếm ngược < 5-14 && != 0 hoặc nếu đang order và thời gian đếm ngược > 20-25 || == 0 else PRICE_BUY_LIVE_BACKUP = PRICE_SELL_LIVE_BACKUP = 0
  uodate OPEN_CHECK and CLOSE_CHECK dựa trên jDATA(jsonData truyền vào từ playRealTimeSpot)
  nếu thời gian đếm ngược < 5 - 14 giây total_bet_amount = PRICE_BUY_LIVE_BACKUP = PRICE_BUY_LIVE
  nếu thời gian đếm ngược > 20 - 25 giây total_bet_amount = PRICE_BUY_LIVE_BACKUP là giá PRICE_BUY_LIVE ở phiên trước
  total_bet_amount - PRICE_MAKETING(số tiền đặt cược không phải của khách hàng)
  Nếu Buy win điều chỉnh cho CLOSE_CHECK và jsonData.close > OPEN_CHECK
  Nếu Sell win điều chỉnh cho CLOSE_CHECK và jsonData.close < OPEN_CHECK
  Nếu less win check xem số tiền total_bet_amount của buy hay sell cái nào nhỏ hơn sẽ điều chỉnh jsonData.close để phía ít hơn sẽ thắng
  Nếu chênh lệch giữa buy và sell lớn hơn AMOUNT_MAX_BREAK_BRIDGE thì sẽ điều chỉnh jsonData.close để phía ít hơn thắng
 */

// mỗi khi kết thúc 1 phiên
/* 1
đặt lại giá PRICE_LIVE_BACKUP (total_bet_amount của users) PRICE_MAKETING = 0 tăng thêm session make rdSe rdSe2 random => PUSH_STATIC_2
*/
/* 2 update số lần Buy hoặc Sell thắng và Static(cả Buy lẫn Sell) update cây nến mới nhất vào LIST_GET_DATA
=> writeStatic gửi Buy Sell Static và mấy cái oslicator cho users
=> HandlingBuySell2
*/
/* 3
quét BTC_USER_BUY và BTC_USER_SELL kiểm tra các lệnh đặt cược của khách 
nếu khách thắng 
+) updatePriceWinLose => update mysql user amount bet win and amount bet lose
+) TOTAL_WIN_PRICE(total of user win amount) AMOUNT_MARKETING_WIN(total of user mkt win amount) += amountShow (95% bet_amount)
+) updateAmountWin => update mysql account balance and win amount
+) SaveHistory => bet_history INSERT INTO bet_history (email, id_account, type_account, buy_sell, currency, amount_win, amount_lose, amount_bet, open, close, session, marketing, created_at)
nếu khách thua
+) updatePriceWinLose => update mysql user amount bet win and amount bet lose
+) TOTAL_LOSE_PRICE(total of user lose amount) AMOUNT_MARKETING_LOSE(total of user mkt lose amount) TOTAL_LOSE_PRICE += money_bet; AMOUNT_MARKETING_LOSE += money_bet;
+) updateAmountLose => update mysql account lose amount
+) SaveHistory => bet_history INSERT INTO bet_history (email, id_account, type_account, buy_sell, currency, amount_win, amount_lose, amount_bet, open, close, session, marketing, created_at)
clear BTC_USER_BUY_SELL(information of user bet), AMOUNT_USER_BUY_SELL(not important), PRICE_BUY_SELL_LIVE(total_bet_amount of session for live) PRICE_BUY_SELL_DEMO(total_bet_amount of session for demo)
keep BTC_USER_BUY_SELL_BACK store value of BTC_USER_BUY_SELL for handle commision 
XU_LY_QUY_BOT => kiểm tra hệ thống lời lỗ thế nào để tự động bẻ cầu không quá aggresive 
HandlingCommissionBUYSELL => trả hoa hồng cho 7 cấp trên của mỗi user đã đặt cược dựa trên danh sách BTC_USER_BUY_SELL_BACK
*/
/* 4
lấy thông tin của người dùng đã đặt cược trong phiên lấy upline_id ref_code
nếu có upline_id thì lấy thông tin 7 người cấp trên của mình và dựa trên hoa hồng từng cấp bắt đầu thực hiện các câu lệnh update insert vào mysql
thực hiện trả thưởng cho 7 cấp trên của người đã bet như sau 
UPDATE users SET money_usdt = money_usdt + ?, pending_commission = pending_commission + ?, commission_update = now() WHERE ref_code = ?
INSERT INTO commission_history (email, from_upid, ref_id, upline_id, pending_commission, personal_trading_volume, type, marketing, session, created_at) 
*/
