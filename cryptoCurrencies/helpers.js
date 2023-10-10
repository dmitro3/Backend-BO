const getDecimalsOfUsersBalance = (pool) => {
  return new Promise((response, reject) => {
    pool.getConnection((errGetConnection, connection) => {
      if (errGetConnection) reject(errGetConnection.message);
      connection.query(
        `show columns from users`,
        function (errQuerry, rows, fields) {
          if (errQuerry) reject(errQuerry.message);
          result = {};
          for (let i = 0; i < rows.length; i++) {
            if (rows[i]?.Field?.includes("_balance")) {
              result[`${rows[i]?.Field}`] = parseInt(
                rows[i]?.Type.match(/\d+/g)[1]
              );
            }
          }
          response(result);
        }
      );
    });
  });
};

module.exports = { getDecimalsOfUsersBalance: getDecimalsOfUsersBalance };
