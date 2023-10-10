const { createPool, createConnection } = require("mysql");
const config = require("./config.js");

const pool = createPool({
  host: config.DATA_HOST,
  user: config.DATA_USER,
  password: config.DATA_PASS,
  database: config.DATA_DB,
  port: config.DATA_PORT,
  connectionLimit: 10,
});

module.exports = pool;

// connectToDB( () => {
//     connection = createPool.createConnection(pool);
//     connection.connect(function (err) {
//         // The server is either down or restarting (takes a while sometimes).
//         if (err) {
//             setTimeout(connectToDB, 2000);
//         }
//     });
//     connection.on('error', function (err) {
//         // Display error message
//         systemMessage('Error: ' + err);
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             connectToDB();
//         } else {
//             throw err;
//         }
//     });
// });

// systemMessage = function (message) {
//     console.log('================================');
//     console.log(message);
//     console.log('================================');
// }

// connectToDB();
