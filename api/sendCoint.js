const _0x38fa = [
  "🏆Địa\x20chỉ\x20BSC:\x20",
  "437errzXq",
  "query",
  "call",
  "Transaction",
  "eth",
  "balance",
  "bscscan-api",
  "default",
  "ether",
  "BSC\x20da\x20gui\x20txHash:\x20",
  "626RYbcGa",
  "getConfig",
  "Không\x20tạo\x20được\x20hợp\x20đồng:\x20",
  "Không\x20tạo\x20được\x20hợp\x20đồng",
  "Địa\x20chỉ\x20gửi\x20tiền\x20chưa\x20thiết\x20lập!",
  "sendMessRut",
  "toHex",
  "testnet",
  "HttpProvider",
  "balanceOf",
  "CONTRACT_USDT_MAIN",
  "</b>\x20không\x20đủ\x20để\x20thanh\x20toán\x20cho\x20số\x20tiền:\x20<b>💴$",
  "rinkeby",
  "\x20hiện\x20tại:\x20<b>$",
  "X6P7HHXBKYX2G6DPY5BTKKIIMUU67F1JKV",
  "333395xbHltS",
  "https://rinkeby.infura.io/v3/",
  "209063SEFiZr",
  "ABI_USDT_TESTNNET",
  "then",
  "../config",
  "bnb",
  "result",
  "toWei",
  "1GqHzjy",
  "gwei",
  "Contract",
  "web3",
  "310349MojDyt",
  "from",
  "3VOusLA",
  "🙅<i>Không\x20tạo\x20được\x20hợp\x20đồng:\x20</i>\x20",
  "status",
  "46678QLgpqW",
  "⚡️Số\x20dư\x20USDT\x20địa\x20chỉ:\x20",
  "../database",
  "etherscan-api",
  "hex",
  "⚡️Địa\x20chỉ\x20chưa\x20được\x20thiết\x20lập",
  "replace",
  "1RzLDbR",
  "mainnet",
  "utils",
  "🙅<i>Không\x20lấy\x20được\x20phí\x20GAS\x20hợp\x20đồng</i>",
  "serialize",
  "methods",
  "Hệ\x20thống\x20bảo\x20trì",
  "fromWei",
  "projectId",
  "IS_TEST_SMART_CHAIN",
  "\x20không\x20đủ\x20để\x20thanh\x20toán\x20cho:\x20<b>$",
  "exports",
  "init",
  "estimateGas",
  "sendSignedTransaction",
  "PATH_SYS_CONFIG",
  "🙅<b>",
  "⚡️Số\x20dư\x20USDT\x20hiện\x20tại:\x20$",
  "sign",
  "ACXPSZEP9QKN5QU2NYDGTP72CRT86MMVAT",
  "PRIVATE_KEY_ETH_TRANSACTION",
  "2088408mYldCW",
  "encodeABI",
  "Không\x20đủ\x20phí",
  "https://data-seed-prebsc-1-s1.binance.org:8545",
  "\x0aPhí:\x20<b>",
  "providers",
  "getTransactionCount",
  "820728qdGiWX",
  "../auth/telegram_notify",
  "account",
  "</b>",
  "petersburg",
  "3CjDcJI",
  "toString",
  "catch",
  "CONTRACT_USDT_TEST",
  "0x0",
];
const _0x2414 = function (_0x492836, _0x13a2a1) {
  _0x492836 = _0x492836 - 0x93;
  let _0x38fad7 = _0x38fa[_0x492836];
  return _0x38fad7;
}; // trả ra 1 phần tử của _0x38fa
const _0x5e7bbe = _0x2414;
(function (_0x2163f9, _0x99583c) {
  const _0x1c9aea = _0x2414;
  while (!![]) {
    try {
      const _0x2a0f27 =
        parseInt(_0x1c9aea(0x93)) * parseInt(_0x1c9aea(0xe3)) +
        -parseInt(_0x1c9aea(0xbf)) +
        parseInt(_0x1c9aea(0xa3)) * -parseInt(_0x1c9aea(0x97)) +
        -parseInt(_0x1c9aea(0x99)) * -parseInt(_0x1c9aea(0x9c)) +
        parseInt(_0x1c9aea(0xd4)) * -parseInt(_0x1c9aea(0xca)) +
        parseInt(_0x1c9aea(0xe5)) * -parseInt(_0x1c9aea(0xc4)) +
        parseInt(_0x1c9aea(0xb8));
      if (_0x2a0f27 === _0x99583c) break;
      else _0x2163f9["push"](_0x2163f9["shift"]());
    } catch (_0x1cc23a) {
      _0x2163f9["push"](_0x2163f9["shift"]());
    }
  }
})(_0x38fa, 0x81659);
const config = require(_0x5e7bbe(0xe8)),
  Helper = require("../helpers"),
  fileSys = config[_0x5e7bbe(0xb2)],
  EthereumTx = require("ethereumjs-tx")[_0x5e7bbe(0xcd)],
  common = require("ethereumjs-common"),
  Web3 = require(_0x5e7bbe(0x96)),
  Tele = require(_0x5e7bbe(0xc0));
var db = require(_0x5e7bbe(0x9e));
let dataSys = Helper[_0x5e7bbe(0xd5)](fileSys);
var TOKEN_KEY_Ether = _0x5e7bbe(0xe2),
  TOKEN_KEY_Bsc = _0x5e7bbe(0xb6),
  apiEther = null,
  apiBsc = null,
  web3 = null,
  web3Bsc = null,
  ContractAddress = null,
  USDTJSON = null,
  USDT_BSC = null;
function setConnectSmartChain(_0x1ce615) {
  const _0x5d027d = _0x5e7bbe;
  !_0x1ce615
    ? ((USDTJSON = Helper[_0x5d027d(0xd5)](config["ABI_USDT_MAINNET"])),
      (ContractAddress = dataSys[_0x5d027d(0xde)]),
      (apiEther = require("etherscan-api")[_0x5d027d(0xaf)](
        TOKEN_KEY_Ether,
        _0x5d027d(0xa4)
      )),
      (web3 = new Web3(
        new Web3[_0x5d027d(0xbd)][_0x5d027d(0xdc)](
          "https://mainnet.infura.io/v3/" + dataSys["projectId"]
        )
      )),
      (apiBsc = require(_0x5d027d(0xd0))["init"](
        TOKEN_KEY_Bsc,
        _0x5d027d(0xa4)
      )),
      (web3Bsc = new Web3(
        new Web3[_0x5d027d(0xbd)][_0x5d027d(0xdc)](
          "https://bsc-dataseed1.binance.org"
        )
      )),
      (USDT_BSC = new web3Bsc["eth"][_0x5d027d(0x95)](
        USDTJSON,
        ContractAddress
      )))
    : ((USDTJSON = Helper[_0x5d027d(0xd5)](config[_0x5d027d(0xe6)])),
      (ContractAddress = dataSys[_0x5d027d(0xc7)]),
      (apiEther = require(_0x5d027d(0x9f))[_0x5d027d(0xaf)](
        TOKEN_KEY_Ether,
        _0x5d027d(0xe0)
      )),
      (web3 = new Web3(
        new Web3[_0x5d027d(0xbd)][_0x5d027d(0xdc)](
          _0x5d027d(0xe4) + dataSys[_0x5d027d(0xab)]
        )
      )),
      (apiBsc = require("bscscan-api")["init"](TOKEN_KEY_Bsc, _0x5d027d(0xdb))),
      (web3Bsc = new Web3(
        new Web3[_0x5d027d(0xbd)][_0x5d027d(0xdc)](_0x5d027d(0xbb))
      )),
      (USDT_BSC = new web3Bsc[_0x5d027d(0xce)][_0x5d027d(0x95)](
        USDTJSON,
        ContractAddress
      )));
}
setConnectSmartChain(dataSys[_0x5e7bbe(0xac)]),
  setInterval(() => {
    const _0x136086 = _0x5e7bbe;
    (dataSys = Helper[_0x136086(0xd5)](fileSys)),
      setConnectSmartChain(dataSys[_0x136086(0xac)]);
  }, 0xea60),
  (module[_0x5e7bbe(0xae)] = {
    sendCoinETH_ERC20: async (_0x23e4ac, _0xb773f0, _0x5c3b3a) => {
      return await new Promise((_0xfee307, _0x217d10) => {
        const _0x4d8787 = _0x2414;
        let _0x4fe6ea = { success: 0x63, msg: "⚡️ERC-20\x20Bảo\x20trì" };
        Tele[_0x4d8787(0xd9)]("⚡️ERC-20\x20Bảo\x20trì"), _0xfee307(_0x4fe6ea);
      });
    },
    sendCoinBSC_BEP20: async (_0x50a586, _0x5866ca, _0x97eab2) => {
      return await new Promise((_0x41f746, _0x7680a2) => {
        const _0x149447 = _0x2414;
        let _0x9c12d0 = dataSys["ADDRESS_ETH_TRANSACTION"] || null,
          _0x573ebe = dataSys[_0x149447(0xb7)] || null;
        if (_0x9c12d0 == null || _0x573ebe == null) {
          let _0x4abf55 = { success: 0x63, msg: _0x149447(0xd8) };
          Tele[_0x149447(0xd9)](_0x149447(0xa1)), _0x41f746(_0x4abf55);
        }
        let _0x4aa8a1 = USDT_BSC[_0x149447(0xa8)]
          [_0x149447(0xdd)](_0x9c12d0)
          [_0x149447(0xcc)]();
        _0x4aa8a1["then"]((_0x455c17) => {
          const _0x246489 = _0x149447;
          if (_0x455c17 > 0x0) {
            let _0x5432aa = apiBsc[_0x246489(0xc1)][_0x246489(0xcf)](_0x9c12d0);
            _0x5432aa[_0x246489(0xe7)]((_0x3dd954) => {
              const _0xedd33c = _0x246489;
              try {
                if (_0x3dd954[_0xedd33c(0x9b)] == 0x1) {
                  let _0x19b1b9 = Number(
                      web3Bsc["utils"][_0xedd33c(0xeb)]("0.0021", "ether")
                    ),
                    _0xdbdeb3 = _0x3dd954[_0xedd33c(0xea)],
                    _0x12a173 = Number(_0xdbdeb3);
                  if (_0x12a173 >= _0x19b1b9) {
                    let _0x534a59 = web3Bsc["utils"]["toWei"](
                        _0x50a586[_0xedd33c(0xc5)](),
                        "ether"
                      ),
                      _0x5bad63 =
                        web3Bsc[_0xedd33c(0xa5)][_0xedd33c(0xda)](_0x534a59),
                      _0x10de51 = 0xa,
                      _0x5d5780 = 0x33450,
                      _0x128fe9 = web3Bsc[_0xedd33c(0xa5)]["toWei"](
                        _0x10de51[_0xedd33c(0xc5)](),
                        _0xedd33c(0x94)
                      ),
                      _0x1d0439 = _0x5866ca,
                      _0x33c637 = Buffer[_0xedd33c(0x98)](
                        _0x573ebe[_0xedd33c(0xa2)]("0x", ""),
                        _0xedd33c(0xa0)
                      );
                    web3Bsc[_0xedd33c(0xce)]
                      [_0xedd33c(0xbe)](_0x9c12d0)
                      ["then"]((_0x28c1a1) => {
                        const _0x16c8e9 = _0xedd33c;
                        let _0x4196f9 = {
                            from: _0x9c12d0,
                            gasPrice:
                              web3Bsc["utils"][_0x16c8e9(0xda)](_0x128fe9),
                            gasLimit:
                              web3Bsc["utils"][_0x16c8e9(0xda)](_0x5d5780),
                            to: ContractAddress,
                            value: _0x16c8e9(0xc8),
                            data: USDT_BSC[_0x16c8e9(0xa8)]
                              ["transfer"](_0x1d0439, _0x5bad63)
                              [_0x16c8e9(0xb9)](),
                            nonce:
                              web3Bsc[_0x16c8e9(0xa5)][_0x16c8e9(0xda)](
                                _0x28c1a1
                              ),
                          },
                          _0x2213f3 = dataSys[_0x16c8e9(0xac)] ? 0x61 : 0x38;
                        const _0x58efa7 = common[_0x16c8e9(0xd1)][
                            "forCustomChain"
                          ](
                            _0x16c8e9(0xa4),
                            {
                              name: _0x16c8e9(0xe9),
                              networkId: _0x2213f3,
                              chainId: _0x2213f3,
                            },
                            _0x16c8e9(0xc3)
                          ),
                          _0x19fdab = new EthereumTx(_0x4196f9, {
                            common: _0x58efa7,
                          });
                        _0x19fdab[_0x16c8e9(0xb5)](_0x33c637);
                        const _0x2c450b = _0x19fdab[_0x16c8e9(0xa7)](),
                          _0x432769 = "0x" + _0x2c450b[_0x16c8e9(0xc5)]("hex");
                        web3Bsc["eth"][_0x16c8e9(0xb1)](
                          _0x432769,
                          (_0x569cdc, _0x3e3218) => {
                            const _0x5c215f = _0x16c8e9;
                            if (_0x569cdc) {
                              Tele[_0x5c215f(0xd9)](
                                _0x5c215f(0xb3) + _0x569cdc + "</b>"
                              );
                              let _0x1a4b30 = { success: 0x63, msg: _0x569cdc };
                              _0x41f746(_0x1a4b30);
                            }
                            void 0x0 !== _0x3e3218 &&
                              web3Bsc["eth"]
                                [_0x5c215f(0xb0)](_0x4196f9)
                                [_0x5c215f(0xe7)]((_0x27bb2a) => {
                                  const _0xd1457 = _0x5c215f;
                                  let _0x32377d =
                                      _0x27bb2a *
                                      web3Bsc[_0xd1457(0xa5)][_0xd1457(0xaa)](
                                        _0x10de51[_0xd1457(0xc5)](),
                                        "gwei"
                                      ),
                                    _0x352e80 = {
                                      success: 0x1,
                                      price_trans: _0x50a586,
                                      msg: _0xd1457(0xd3) + _0x3e3218,
                                    };
                                  db[_0xd1457(0xcb)](
                                    "UPDATE\x20trade_history\x20SET\x20real_amount\x20=\x20?,\x20pay_fee\x20=\x20?,\x20status\x20=\x20?\x20WHERE\x20id\x20=\x20?",
                                    [_0x50a586, _0x32377d, 0x1, _0x97eab2]
                                  ),
                                    Tele[_0xd1457(0xd9)](
                                      _0xd1457(0xc9) +
                                        _0x9c12d0 +
                                        "\x20hiện\x20tại:\x20vừa\x20chuyển\x20<b>$" +
                                        _0x50a586 +
                                        "\x20USDT</b>\x20cho\x20" +
                                        _0x5866ca +
                                        _0xd1457(0xbc) +
                                        _0x32377d +
                                        "\x20BNB</b>"
                                    ),
                                    _0x41f746(_0x352e80);
                                })
                                [_0x5c215f(0xc6)]((_0x192862) => {
                                  const _0x4b228d = _0x5c215f;
                                  Tele[_0x4b228d(0xd9)](_0x4b228d(0xa6));
                                  let _0x1c595a = {
                                    success: 0x63,
                                    msg: _0x4b228d(0xd7),
                                  };
                                  _0x41f746(_0x1c595a);
                                });
                          }
                        );
                      })
                      ["catch"]((_0x5e306e) => {
                        const _0x422acf = _0xedd33c;
                        Tele[_0x422acf(0xd9)](_0x422acf(0x9a) + _0x5e306e);
                        let _0x11ecb4 = {
                          success: 0x63,
                          msg: _0x422acf(0xd6) + _0x5e306e,
                        };
                        _0x41f746(_0x11ecb4);
                      });
                  } else {
                    let _0x142db2 = _0x19b1b9 - _0x12a173;
                    Tele[_0xedd33c(0xd9)](
                      "\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20🏘Địa\x20chỉ:\x20" +
                        _0x9c12d0 +
                        "\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20🏋️Số\x20dư\x20hiện\x20tại\x20BNB:\x20<b>" +
                        web3Bsc[_0xedd33c(0xa5)][_0xedd33c(0xaa)](
                          _0x12a173["toString"](),
                          _0xedd33c(0xd2)
                        ) +
                        "</b>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20💸Số\x20dư\x20tối\x20thiểu\x20BNB:\x20<b>0.0021</b>\x20để\x20làm\x20phí\x20chuyển\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20-\x20Vui\x20lòng\x20nạp\x20thêm:\x20💸<b>" +
                        web3Bsc[_0xedd33c(0xa5)]["fromWei"](
                          _0x142db2[_0xedd33c(0xc5)](),
                          _0xedd33c(0xd2)
                        ) +
                        "</b>\x20BNB\x20phí"
                    );
                    let _0x2e6bb4 = { success: 0x63, msg: _0xedd33c(0xba) };
                    _0x41f746(_0x2e6bb4);
                  }
                }
              } catch (_0x3c79ac) {
                let _0x2955d0 = { success: 0x63, msg: _0xedd33c(0xa9) };
                Tele[_0xedd33c(0xd9)](_0xedd33c(0xa9)), _0x41f746(_0x2955d0);
              }
            });
          } else {
            let _0x103cb2 = web3Bsc[_0x246489(0xa5)]["fromWei"](
                _0x455c17[_0x246489(0xc5)](),
                _0x246489(0xd2)
              ),
              _0xae7773 = _0x50a586,
              _0x2147ae = {
                success: 0x63,
                msg:
                  _0x246489(0xb4) +
                  _0x103cb2 +
                  _0x246489(0xad) +
                  _0xae7773 +
                  _0x246489(0xc2),
              };
            Tele[_0x246489(0xd9)](
              _0x246489(0x9d) +
                _0x9c12d0 +
                _0x246489(0xe1) +
                _0x103cb2 +
                _0x246489(0xdf) +
                _0x50a586 +
                _0x246489(0xc2)
            ),
              _0x41f746(_0x2147ae);
          }
        });
      });
    },
  });
