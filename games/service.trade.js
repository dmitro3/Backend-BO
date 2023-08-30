const db = require("./../database");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  // SELECT balance FROM account WHERE u_id = ? AND type = ?
  getPriceUser: (data, callback) => {
    db.query(
      `SELECT balance FROM account WHERE u_id = ? AND type = ?`,
      [data.uid, data.typeAccount],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },

  getMaretingAcc: (email, callback) => {
    db.query(
      `SELECT marketing FROM users WHERE email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },

  updateBalanceUser: (data, callback) => {
    db.query(
      `UPDATE account SET balance = balance - ?, order_amount = order_amount + ? WHERE u_id = ? AND type = ?`,
      [data.betAmount, data.betAmount, data.uid, data.typeAccount],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  updatePersonalTrading: (data, callback) => {
    db.query(
      `UPDATE users SET pricePlay = pricePlay + ? WHERE email = ?`,
      [Number(data.betAmount), data.email],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  checkF0Commission: (email, callback) => {
    db.query(
      `SELECT level_vip, ref_code, upline_id, nick_name FROM users WHERE email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  checkF0CommissionInF0: (uid, callback) => { // bỏ
    db.query(
      `SELECT upline_id, ref_code, nick_name, email, level_vip FROM users WHERE ref_code = ?`,
      [uid],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  listF0With7Level: async (uid, callback) => {
    //========== TỔNG SỐ NHÀ GIAO DỊCH
    let listData = {
      cap1: [], // [{upline_id, ref_code, nick_name, email, level_vip}]
      cap2: [],
      cap3: [],
      cap4: [],
      cap5: [],
      cap6: [],
      cap7: [],
      cap8: [],
      cap9: [],
      cap10: [],
      cap11: [],
      cap12: [],
      cap13: [],
      cap14: [],
      cap15: [],
    };

    let cap1 = false,
      cap2 = false,
      cap3 = false,
      cap4 = false,
      cap5 = false,
      cap6 = false,
      cap7 = false;
    // lấy cấp 1
    await new Promise((res, rej) => {
      db.query(
        `SELECT upline_id, ref_code, nick_name, email, level_vip FROM users WHERE ref_code = ?`,
        [uid],
        (error, result, fields) => {
          if (result.length > 0) {
            result.forEach((ele) => {
              listData["cap1"].push(ele);
              cap1 = true;
            });
            res(true);
          }
        }
      );
    });

    if (cap1) {
      for (let i = 0; i < listData["cap1"].length; i++) {
        db.query(
          `SELECT upline_id, ref_code, nick_name, email, level_vip FROM users WHERE ref_code = ?`,
          [listData["cap1"][i].upline_id],
          (error, result, fields) => {
            if (result.length > 0) {
              result.forEach((ele) => {
                listData["cap2"].push(ele);
              });
              cap2 = true;
            }
          }
        );
        await sleep(50);
      }
    }

    if (cap2) {
      for (let i = 0; i < listData["cap2"].length; i++) {
        db.query(
          `SELECT upline_id, ref_code, nick_name, email, level_vip FROM users WHERE ref_code = ?`,
          [listData["cap2"][i].upline_id],
          (error, result, fields) => {
            if (result.length > 0) {
              result.forEach((ele) => {
                listData["cap3"].push(ele);
              });
              cap3 = true;
            }
          }
        );
        await sleep(50);
      }
    }

    if (cap3) {
      for (let i = 0; i < listData["cap3"].length; i++) {
        db.query(
          `SELECT upline_id, ref_code, nick_name, email, level_vip FROM users WHERE ref_code = ?`,
          [listData["cap3"][i].upline_id],
          (error, result, fields) => {
            if (result.length > 0) {
              result.forEach((ele) => {
                listData["cap4"].push(ele);
              });
              cap4 = true;
            }
          }
        );
        await sleep(50);
      }
    }

    if (cap4) {
      for (let i = 0; i < listData["cap4"].length; i++) {
        db.query(
          `SELECT upline_id, ref_code, nick_name, email, level_vip FROM users WHERE ref_code = ?`,
          [listData["cap4"][i].upline_id],
          (error, result, fields) => {
            if (result.length > 0) {
              result.forEach((ele) => {
                listData["cap5"].push(ele);
              });
              cap5 = true;
            }
          }
        );
        await sleep(50);
      }
    }

    if (cap5) {
      for (let i = 0; i < listData["cap5"].length; i++) {
        db.query(
          `SELECT upline_id, ref_code, nick_name, email, level_vip FROM users WHERE ref_code = ?`,
          [listData["cap5"][i].upline_id],
          (error, result, fields) => {
            if (result.length > 0) {
              result.forEach((ele) => {
                listData["cap6"].push(ele);
              });
              cap6 = true;
            }
          }
        );
        await sleep(50);
      }
    }

    if (cap6) {
      for (let i = 0; i < listData["cap6"].length; i++) {
        db.query(
          `SELECT upline_id, ref_code, nick_name, email, level_vip FROM users WHERE ref_code = ?`,
          [listData["cap6"][i].upline_id],
          (error, result, fields) => {
            if (result.length > 0) {
              result.forEach((ele) => {
                listData["cap7"].push(ele);
              });
              cap7 = true;
            }
          }
        );
        await sleep(50);
      }
    }

    return callback(null, listData);
  },

  getLevelVIPUser: (ref, callback) => {
    db.query(
      `SELECT level_vip FROM users WHERE ref_code = ?`,
      [ref],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  updateAmountRateCommission: (data, callback) => {
    //if(data.upID == '' || data.upID == null) return;
    let m = data.penCom * 1;
    // db.query(
    //   `UPDATE users SET money_usdt = money_usdt + ?, pending_commission = pending_commission + ?, commission_update = now() WHERE ref_code = ?`,
    //   [m, m, data.refID],
    //   (error, results, fields) => {
    //   }
    // );

    db.query(
      `INSERT INTO commission_history (email, from_upid, ref_id, upline_id, pending_commission, personal_trading_volume, type, marketing, session, created_at) 
			VALUES (?,?,?,?,?,?,?,?,?,now())`,
      [
        data.email,
        data.fromID, // tài khoản thực trade
        data.refID, // ref code của cấp trên
        data.upID, // ref code của chính mình
        m,
        data.volum,
        "klgd", // khối lượng giao dịch trên mỗi volum, hoa hồng trade
        data.mkt,
        data.session,
      ],
      (error, results, fields) => {
        //if(error){
        //return callback(error);
        //}
      }
    );
  },

  updateAmountWin: (data, callback) => {
    db.query(
      `UPDATE account SET balance = balance + ?, win = win + ? WHERE u_id = ?`,
      [data.balance, data.win, data.upID],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  updateAmountLose: (data, callback) => {
    db.query(
      `UPDATE account SET lose = lose + ? WHERE u_id = ?`,
      [data.lose, data.upID],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  insertBetOrder: (data, callback) => {
    db.query(
      `INSERT INTO bet_history (email, id_account, type_account, buy_sell, currency, amount_win, amount_lose, amount_bet, open, close, session, marketing, created_at) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,now())`,
      [
        data.email,
        data.uid,
        data.typeAccount,
        data.buy_sell,
        data.currency,
        data.amount_win,
        data.amount_lose,
        data.amount_bet,
        data.open,
        data.close,
        data.session,
        data.mkt,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
      }
    );
  },
};

// users, account, commission_history, bet_history