const db = require("./../../database");
const SmartChain = require("./../sendCoint.js");
const moment = require("moment-timezone");
// bản ghi có type_key khác nt nn là trade còn có nt, nn là deposit 
// type: nt, nn, rt
module.exports = {
  // select * from trade_history where delete_status = 0 and ( type_key != "nt" and type_key != "nn") order by id desc 
  getAllTradeHis: (callback) => {
    db.query(
      `select * from trade_history where delete_status = 0 and ( type_key != "nt" and type_key != "nn") order by id desc `,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  // select * from trade_history where delete_status = 1 and (type_key != "nt" and type_key != "nn") order by id desc 
  getAllTradeHisTrash: (callback) => {
    db.query(
      `select * from trade_history where delete_status = 1 and (type_key != "nt" and type_key != "nn") order by id desc `,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  // update trade_history set delete_status= ? where id = ?
  deleteTradeHisById: (data, callback) => {
    db.query(
      `update trade_history set delete_status= ? where id = ?`,
      [data.val, data.id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  // update status của trade history và account + thêm số tiền vàp balance
  acceptDepositById: (data, callback) => {
    db.query(
      `update trade_history set status= ? where id = ?`,
      [data.status, data.id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        if (data.status == 1) {
          db.query(
            `select email, amount from trade_history where id = ?`,
            [data.id],
            (error, results, fields) => {
              if (error) {
                return callback(error);
              }

              db.query(
                `UPDATE account SET balance = balance + ? WHERE email = ?`,
                [results[0].amount, results[0].email],
                (error, results, fields) => {
                  if (error) {
                    return callback(error);
                  }
                  return callback(null, results);
                }
              );
              return callback(null, results);
            }
          );
        }

        return callback(null, results);
      }
    );
  },
  // `select * from trade_history where delete_status = 0 and (type_key = "nt" or type_key = "nn") order by id desc `
  getAllDepositHis: (callback) => {
    db.query(
      `select * from trade_history where delete_status = 0 and (type_key = "nt" or type_key = "nn") order by id desc `,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  // `select * from trade_history where delete_status = 1 and (type_key = "nt" or type_key = "nn") order by id desc `
  getAllDepositHisTrash: (callback) => {
    db.query(
      `select * from trade_history where delete_status = 1 and (type_key = "nt" or type_key = "nn") order by id desc `,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  // `select * from trade_history where delete_status = 0 and type_key = "rt" order by id desc `
  getAllWithDrawalHis: (callback) => {
    db.query(
      `select * from trade_history where delete_status = 0 and type_key = "rt" order by id desc `,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  // `SELECT * FROM add_money_history ORDER BY id desc`
  historyAllAddMoney: (callback) => {
    db.query(
      `SELECT * FROM add_money_history ORDER BY id desc`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  // update trade_history set status= ? where id = ?
  // doneWithdrawal: (data, callback) => {
  //   db.query(
  //     `update trade_history set status= ? where id = ?`,
  //     [data.val, data.id],
  //     (error, results, fields) => {
  //       if (error) {
  //         return callback(error);
  //       }
  //       return callback(null, results);
  //     }
  //   );
  // },
  // UPDATE trade_history SET status = 2 WHERE id = ?
  // UPDATE users SET money_usdt = money_usdt + ? WHERE email = ?
  // update status thành 2 từ chối xong cộng lại tiền + phí cái này nó có một thằng đã gửi yêu cầu rút tiền rồi việc ở đây là từ chối cái yêu cầu đấy
  // doneRefuseWithdrawal: (data, callback) => {
  //   db.query(
  //     `UPDATE trade_history SET status = ? WHERE id = ?`,
  //     [2, data.id],
  //     (error, results, fields) => {
  //       if (error) {
  //         return callback(error);
  //       }
  //       return callback(null, results);
  //     }
  //   );

  //   let amount = Number(data.amount) + Number(data.fee);

  //   db.query(
  //     `UPDATE users SET money_usdt = money_usdt + ? WHERE email = ?`,
  //     [amount, data.email],
  //     (error, results, fields) => {
  //       if (error) {
  //         return callback(error);
  //       }
  //       return callback(null, results);
  //     }
  //   );
  // },
  // SELECT SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB FROM trade_history WHERE type_key = nt AND status = 1 AND network = bep20
  getRevenueNap: (callback) => {
    db.query(
      `SELECT SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB FROM trade_history WHERE type_key = ? AND status = 1 AND network = ?`,
      [
        "nt", // nạp tiền
        "bep20",
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  // SELECT SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB FROM trade_history WHERE type_key = rt AND status = 1 AND network = bep20
  getRevenueRut: (callback) => {
    db.query(
      `SELECT SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB FROM trade_history WHERE type_key = ? AND status = 1 AND network = ?`,
      [
        "rt", // rút tiền
        "bep20",
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  // SELECT SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB FROM trade_history WHERE status = 1 AND network = bep20
  // cái này lấy mọi loại type luôn
  getRevenueTrans: (callback) => {
    db.query(
      `SELECT SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB FROM trade_history WHERE status = 1 AND network = ?`,
      ["bep20"],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  
  // `SELECT SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB FROM trade_history WHERE type_key = nt AND status = 1`;
  // `SELECT SUM(amount_win) AS tsWin, SUM(amount_lose) AS tsLose FROM bet_history WHERE marketing = 0 AND status = 1 AND type_account = 1`;
  // `SELECT SUM(pending_commission) AS tsHHong FROM commission_history WHERE marketing = ? AND type = ?`;
  getShowDT: async (data, callback) => {
    let type = data.type;

    let dt = moment().tz("Asia/Ho_Chi_Minh");
    let dt1 = moment().tz("Asia/Ho_Chi_Minh");
    let dt2 = moment().tz("Asia/Ho_Chi_Minh");
    let dt3 = moment().tz("Asia/Ho_Chi_Minh");

    let cach90ngay = dt.subtract(90, "days").format("YYYY-MM-DD");
    let cach30ngay = dt1.subtract(30, "days").format("YYYY-MM-DD");
    let cach7ngay = dt2.subtract(7, "days").format("YYYY-MM-DD");
    let homnay = dt3.format("YYYY-MM-DD");

    let qr = "",
      qr2 = "",
      qr3 = "";

    if (type == "all") {
      qr = `SELECT SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB FROM trade_history WHERE type_key = ? AND status = 1`;
      qr2 = `SELECT SUM(amount_win) AS tsWin, SUM(amount_lose) AS tsLose FROM bet_history WHERE marketing = ? AND status = 1 AND type_account = ?`;
      qr3 = `SELECT SUM(pending_commission) AS tsHHong FROM commission_history WHERE marketing = ? AND type = ?`;
    } else if (type == "today") {
      qr = `SELECT SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB FROM trade_history WHERE type_key = ? AND status = 1 AND created_at > '${homnay}'`;
      qr2 = `SELECT SUM(amount_win) AS tsWin, SUM(amount_lose) AS tsLose FROM bet_history WHERE marketing = ? AND status = 1 AND type_account = ? AND created_at > '${homnay}'`;
      qr3 = `SELECT SUM(pending_commission) AS tsHHong FROM commission_history WHERE marketing = ? AND type = ? AND created_at > '${homnay}'`;
    } else if (type == "lastweek") {
      qr = `SELECT SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB FROM trade_history WHERE type_key = ? AND status = 1 AND created_at > '${cach7ngay}'`;
      qr2 = `SELECT SUM(amount_win) AS tsWin, SUM(amount_lose) AS tsLose FROM bet_history WHERE marketing = ? AND status = 1 AND type_account = ? AND created_at > '${cach7ngay}'`;
      qr3 = `SELECT SUM(pending_commission) AS tsHHong FROM commission_history WHERE marketing = ? AND type = ? AND created_at > '${cach7ngay}'`;
    } else if (type == "lastmonth") {
      qr = `SELECT SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB FROM trade_history WHERE type_key = ? AND status = 1 AND created_at > '${cach30ngay}'`;
      qr2 = `SELECT SUM(amount_win) AS tsWin, SUM(amount_lose) AS tsLose FROM bet_history WHERE marketing = ? AND status = 1 AND type_account = ? AND created_at > '${cach30ngay}'`;
      qr3 = `SELECT SUM(pending_commission) AS tsHHong FROM commission_history WHERE marketing = ? AND type = ? AND created_at > '${cach30ngay}'`;
    } else if (type == "threelastmonth") {
      qr = `SELECT SUM(amount) AS dtUSD, SUM(real_amount) AS dtBNB, SUM(pay_fee) AS freeBNB FROM trade_history WHERE type_key = ? AND status = 1 AND created_at > '${cach90ngay}'`;
      qr2 = `SELECT SUM(amount_win) AS tsWin, SUM(amount_lose) AS tsLose FROM bet_history WHERE marketing = ? AND status = 1 AND type_account = ? AND created_at > '${cach90ngay}'`;
      qr3 = `SELECT SUM(pending_commission) AS tsHHong FROM commission_history WHERE marketing = ? AND type = ? AND created_at > '${cach90ngay}'`;
    }

    let rsData = {};

    await new Promise((res, rej) => {
      db.query(qr, ["nt"], (error, results, fields) => {
        if (results.length > 0) {
          rsData.dtUSD = results[0].dtUSD;
          rsData.dtBNB = results[0].dtBNB;
          rsData.freeBNB = results[0].freeBNB;
        }
        res();
      });
    });
    await new Promise((res, rej) => {
      db.query(
        qr2,
        [
          0,
          1, // tài khoản thực
        ],
        (error, results, fields) => {
          if (results.length > 0) {
            rsData.tsWin = results[0].tsWin;
            rsData.tsLose = results[0].tsLose;
          }

          res();
        }
      );
    });

    await new Promise((res, rej) => {
      db.query(qr3, [0, "klgd"], (error, results, fields) => {
        if (results.length > 0) {
          rsData.tsHHong = results[0].tsHHong;
        }
        res();
      });
    });

    return callback(null, rsData);
  },
  // SELECT SUM(price_USDT) AS tUSD, SUM(price_ETH) AS tETH, SUM(price_BTC) AS tBTC, SUM(price_PAYPAL) AS tPAYPAL, SUM(price_VN) AS tVN FROM add_money_history
  totalAddMoney: (callback) => {
    db.query(
      `SELECT SUM(price_USDT) AS tUSD, SUM(price_ETH) AS tETH, SUM(price_BTC) AS tBTC, SUM(price_PAYPAL) AS tPAYPAL, SUM(price_VN) AS tVN FROM add_money_history`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
};
