module.exports = {
  BTC: {
    BUY: false,
    SELL: false,
  },
  LESS_WIN: false,
  BOT: true,
  PRICE_FUND_ON_OFF: true,
  //PRICE_FUND_DEFAULT: 0,
  // PRICE_FUND_NEXT: 0,
  PRICE_FUND_PROFITS: 0,
  //PRICE_FUND_RATE: 70
};
/* 
  gửi lần đầu khi user connect vào socket
  ws.send(JSON.stringify({ type: "getListDauTien", data: LIST_GET_DATA }));
  ws.send(JSON.stringify({ type: "transVolum", data: jsonTransVolum }));
  ws.send(JSON.stringify({ type: "static", data: staticShow, load: getLoadStaticGue }));

  ws.on message
    accountDetail
        gửi khi không tim thấy email trong 
        ws.send(JSON.stringify({ type: "mess", data: mess }));
        tài khoản đã được đăng nhập ở nơi khác
        ws.send(JSON.stringify({ type: "mess", data: mess }));
        gửi cho admin 
        ws.send(JSON.stringify({ type: "getTruck", data: DATA_GL, min_am_go: AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE, max_amount_be: AMOUNT_MAX_BREAK_BRIDGE }));
  
  checkBaoTriBinance
    gửi cho tất cả client khi api binance không hoạt động
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify({ type: "mess", data: obj }));
    });

  countDownGame
    chuyển jsonData liên tục đến tất cả client mỗi giây trôi qua 
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify({ type: "allData", data: jsonData }));
    });
  BetBUY
    khi khách cố đặt khi hết thời gian đặt cược
    ws.send(JSON.stringify({ type: "mess", data: { type: "bet", mess: "Vui lòng đợi phiên sau!", style: "danger" } }));
    khi khách cược số tiền nhỏ hơn BET_MIN
    ws.send(JSON.stringify({ type: "mess", data: { type: "bet", mess: "Số tiền không được nhở hơn " + BET_MAX, style: "danger" } }));
    khi khách đặt cược số tiền vượt quá số dư của họ
    ws.send(JSON.stringify({ type: "mess", data: { type: "bet", mess: "Số dư không đủ!", style: "danger" } }))
    khi khách đặt cược thành công và số dư đã được trừ
    ws.send(JSON.stringify({ type: "checkBet", data: "ok" }));
  BetSELL
    khi khách cố đặt khi hết thời gian đặt cược
    ws.send(JSON.stringify({ type: "mess", data: { type: "bet", mess: "Vui lòng đợi phiên sau!", style: "danger" } }));
    khi khách cược số tiền nhỏ hơn BET_MIN
    ws.send(JSON.stringify({ type: "mess", data: { type: "bet", mess: "Số tiền không được nhở hơn " + BET_MAX, style: "danger" } }));
    khi khách đặt cược số tiền vượt quá số dư của họ
    ws.send(JSON.stringify({ type: "mess", data: { type: "bet", mess: "Số dư không đủ!", style: "danger" } }))
    khi khách đặt cược thành công và số dư đã được trừ
    ws.send(JSON.stringify({ type: "checkBet", data: "ok" }));
  xulyInVaoHisBeCau
    gửi dữ liệu cho admin dể admin quyết định xem có cần bẻ cầu hay không
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
  writeStatic
    gửi Buy Sell Static và mấy cái oslicator cho tất cả users chỉ gửi khi kết thúc cược hoặc kết thúc phiên
    wss.clients.forEach(function each(client) {
      client.send(
        JSON.stringify({ type: "static", data: obj, load: getLoadStaticGue })
      );
    });
  HandlingBuySell2
    khi quét hết các lệnh đặt cược BUY thì gửi kết quả đến cho user khi họ thắng
    if (ws !== "") ws.send(JSON.stringify({ type: "kq", data: { kq: "win", money: addMo }} ));
    khi quét hết các lệnh đặt cược BUY thì gửi kết quả đến cho user khi họ thua
    if (ws !== "") ws.send(JSON.stringify({ type: "kq", data: { kq: "lose", money: addMo }} ));
    khi quét hết các lệnh đặt cược SELL thì gửi kết quả đến cho user khi họ thắng
    if (ws !== "") ws.send(JSON.stringify({ type: "kq", data: { kq: "win", money: addMo }} ));
    khi quét hết các lệnh đặt cược SELL thì gửi kết quả đến cho user khi họ thua
    if (ws !== "") ws.send(JSON.stringify({ type: "kq", data: { kq: "lose", money: addMo }} ));
*/
