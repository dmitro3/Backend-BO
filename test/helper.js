const userService = require("../api/users/user.service");
const db = require("../database");

const _insertFakeUser = ({ upline_id, email, nick_name, password }) => {
  return new Promise((res, rej) => {
    if (!email.includes("fake_email" || !nick_name.includes("fake_user")))
      throw Error("this should create fake Account");
    userService.createAccount(
      {
        upline_id,
        email,
        nick_name,
        password,
      },
      (error, result) => {
        if (error) return rej(error);
        if (result) {
          userService.activeUser({ email }, (error1, result1) => {
            if (error1) {
              return rej(error1);
            }
            if (!result1) {
              return rej(null);
            }
            return res(result1);
          });
        }
      }
    );
  });
};

_getFakeUsersCount = () => {
  return new Promise((res, rej) => {
    db.query(
      `SELECT COUNT(email) FROM users WHERE email LIKE '%fake_email%'`,
      [],
      (error, result, fields) => {
        if (error) rej(error);
        res(result);
      }
    );
  });
};

const insertFakeUsers = async (numberOfUsers) => {
  const errors = [];
  const results = [];
  const getFakeUsersCount = await _getFakeUsersCount();
  const fakeUsersCount = getFakeUsersCount[0]["COUNT(email)"];
  for (let i = fakeUsersCount + 1; i <= fakeUsersCount + numberOfUsers; i++) {
    try {
      const email = `fake_email${i}`;
      const nick_name = `fake_user${i}`;
      const result = await _insertFakeUser({
        upline_id: "",
        email,
        nick_name,
        password: "123456",
      });
      if (result) results.push(result);
    } catch (error) {
      if (error) errors.push(error);
    }
  }
  return {
    errors: errors.length > 0 ? errors : [],
    results: results.length > 0 ? results : [],
  };
};

const deleteFakeUser = async () => {
  await userService.deleteFakeAccount();
};

const getUserBalance = (email) => {
  const result = {};
  return new Promise((res, rej) => {
    db.query(
        `SELECT 
            CAST(btc_balance AS CHAR) AS btc_balance,
            CAST(eth_balance AS CHAR) AS eth_balance,
            CAST(bnb_balance AS CHAR) AS bnb_balance,
            CAST(matic_balance AS CHAR) AS matic_balance,
            CAST(usdt_eth_balance AS CHAR) AS usdt_eth_balance,
            CAST(usdt_bsc_balance AS CHAR) AS usdt_bsc_balance,
            CAST(usdt_matic_balance AS CHAR) AS usdt_matic_balance,
            CAST(usdc_eth_balance AS CHAR) AS usdc_eth_balance,
            CAST(usdc_bsc_balance AS CHAR) AS usdc_bsc_balance,
            CAST(usdc_matic_balance AS CHAR) AS usdc_matic_balance 
        FROM users 
        WHERE email = ?;
        `,
      [email],
      (error1, result1, fields1) => {
        if (error1) rej(error1);
        result.btc_balance = result1[0].btc_balance;
        result.eth_balance = result1[0].eth_balance;
        result.bnb_balance = result1[0].bnb_balance;
        result.matic_balance = result1[0].matic_balance;
        result.usdt_eth_balance = result1[0].usdt_eth_balance;
        result.usdt_bsc_balance = result1[0].usdt_bsc_balance;
        result.usdt_matic_balance = result1[0].usdt_matic_balance;
        result.usdc_eth_balance = result1[0].usdc_eth_balance;
        result.usdc_bsc_balance = result1[0].usdc_bsc_balance;
        result.usdc_matic_balance = result1[0].usdc_matic_balance;
        db.query(
          `select balance from account where email = ? and type = ?`,
          [email, 1],
          (error2, result2, fields2) => {
            if (error2) rej(error2);
            result.account_balance = result2[0].balance;
            res(result);
          }
        );
      }
    );
  });
};

module.exports = {
  insertFakeUsers,
  deleteFakeUser,
  getUserBalance,
};

const main = async () => {
  // await insertFakeUsers(2);
  // const getUsersCount = await _getFakeUsersCount();
  // console.log(`INSERT ${getUsersCount[0]["COUNT(email)"]} MORE FAKE USERS`);
  // deleteFakeUser();
  // const userBalance = await getUserBalance('fake_email1')
  // console.log(userBalance)
};

// main();
