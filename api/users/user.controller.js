const {
  createUser,
  getAllUser,
  getUserById,
  updateUserById,
  deleteUserById,
  checkUserEmail,
  updateUserMoneyById,
  updateUserPasswordByEmail,
  getUserByUserEmail,
  getAdminByAdminUsername,
  verifiedAccount,
  getListAgency,
  viewMemberAgency,
  createAccount,
  checkUserNickName,
  checkCodeSecure,
  activeUser,
  checkActiveUser,
  getInfoUser,
  updateInfoVerify,
  reloadMoneyDemo,
  listHisBO,
  UsdtToLive,
  LiveToUsdt,
  WithDrawalNoiBo,
  WithDrawalERC,
  WithDrawalBSC,
  BalanceWallet,
  DepositToWallet,
  UserBuyVIP,
  checkMoneyUser,
  createDepositHistory,
  getNguoiGioiThieu,
  getBoStatistics,
  getListHisOrder,
  getListHisOrderDate,
  getListHisTradeWallet,
  getListHisTradeWalletPage,
  getListHisTradeWalletHH,
  getListHisTradeWalletHHPage,
  getListHisTradeWalletWGD,
  getListHisTradeWalletWGDPage,
  getComDetails,
  getComDetailsPage,
  getComDetailsDate,
  getAgencySearchLevel,
  getAgencySearchName,
  updateSecret2FA,
  updateCodeSecure,
  checkCodeSecure2FA,
  Disabled2FA,
  getListAnalytics,
  WithDrawalPaypalAc,
  WithDrawalPaypalNB,
  addMoneyMember,
  changeAccType,
  changPassAd,
  getListF1F7,
  getSecrect2FA,
  getListCmsHis,
  getListNotifi,
  updateListNotifi,
  getAddressToDeposit,
} = require("./user.service");

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign, verify } = require("jsonwebtoken");
const config = require("./../../config");
const mailer = require("./../../auth/mail");
const htmlActive = require("./../../htmlMail/active");
const htmlFoget = require("./../../htmlMail/fogotPass");
const htmlLogin = require("./../../htmlMail/loginNotify");
const html2FACode = require("./../../htmlMail/on_2fa_code");
const html2FAEnabled = require("./../../htmlMail/on_2fa_enabled");
const html2FADisabled = require("./../../htmlMail/on_2fa_disabled");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const getIP = require("ipware")().get_ip;
const Sniffr = require("sniffr");

let linkLogo = config.MAIL_LOGO;
let linkFooter = config.MAIL_IMG_FOOTER;
let titleSite = config.TITLE_SITE;
let contact = config.CONTACT;
let domain = config.DOMAIN;

function makeid(length) {
  var result = [];
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}

function sendOn2FACode(data) {
  let nameNick = data.nick_name;
  let code = data.code;
  let to = data.email;
  let subject = "Verification Code To Turn On 2FA";
  let titleSub = "Verification Code To Turn On 2FA";
  let body = html2FACode.html2FACode(
    nameNick,
    linkLogo,
    linkFooter,
    contact,
    code,
    titleSite,
    titleSub
  );
  mailer.sendMail(to, subject, body);
}

function sendOn2FAEnable(data) {
  let nameNick = data.nick_name;

  let to = data.email;
  let subject = "Two-Factor Authentication enabled";
  let titleSub = "Enable Google Authentication";
  let body = html2FAEnabled.html2FAEnabled(
    nameNick,
    linkLogo,
    linkFooter,
    titleSite,
    titleSub
  );
  mailer.sendMail(to, subject, body);
}

function sendOn2FADisabled(data) {
  let nameNick = data.nick_name;

  let to = data.email;
  let subject = "Two-Factor Authentication Disabled";
  let titleSub = "Disabled Google Authentication";
  let body = html2FADisabled.html2FADisabled(
    nameNick,
    linkLogo,
    linkFooter,
    titleSite,
    titleSub
  );
  mailer.sendMail(to, subject, body);
}

function sendActiveMail(data) {
  const jsontoken = sign({ result: data }, config.TOKEN_KEY, {
    expiresIn: "30m",
  });

  let linkActive = domain + "/login?a=" + jsontoken;

  let nameNick = data.nick_name;

  let to = data.email;
  let subject = "Activate your account";
  let body = htmlActive.htmlActive(
    nameNick,
    linkLogo,
    linkFooter,
    contact,
    linkActive,
    titleSite
  );
  mailer.sendMail(to, subject, body);
}

function sendLoginMail(data) {
  return;
  let Ip = data.ip;
  let os = data.userAgent.os.name + " " + data.userAgent.os.versionString;
  let OSysTeam = os.charAt(0).toUpperCase() + os.slice(1);
  let br =
    data.userAgent.browser.name + " " + data.userAgent.browser.versionString;
  let Brow = br.charAt(0).toUpperCase() + br.slice(1);

  let nameNick = data.nick_name;

  let to = data.email;
  let subject = "You Have Signed In From A New Ip Address";
  let body = htmlLogin.htmlLogin(
    Ip,
    OSysTeam,
    Brow,
    nameNick,
    linkLogo,
    linkFooter,
    contact,
    titleSite
  );

  mailer.sendMail(to, subject, body);
}

module.exports = {
  getAddressToDeposit: (req, res) => {
    const { email } = req.query;
    getAddressToDeposit(email, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          message: "get deposit address caught error",
          data: err,
        });
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "get deposit address failed",
          data: null,
        });
      }
      return res.json({
        success: 1,
        message: "get deposit success",
        data: results,
      });
    });
  },

  // gửi user 1 email với đoạn link /reset-password?e=email phía client có thể tự thêm param email và access cái api này để đổi pass lỗ hổng bảo mật lớn
  forgotPassAccount: (req, res) => {
    let body = req.body;
    let linkActive = domain + "/reset-password?e=" + body.email;

    let nameNick = body.nick_name;

    let to = body.email;
    let subject = "You had requested to reset your password on " + titleSite;
    let boHtml = htmlFoget.htmlFoget(
      nameNick,
      linkLogo,
      titleSite,
      linkFooter,
      contact,
      linkActive
    );
    mailer.sendMail(to, subject, boHtml);
    return res.status(200).json({
      success: 1,
    });
  },

  resendConfirmationAccount: (req, res) => {
    let email = req.body.email;
    let obj = {
      email: email,
      nick_name: "Guest",
    };
    sendActiveMail(obj);

    return res.status(200).json({
      success: 1,
    });
  },
  // update user đặt active = 1 và tạo conde_secure tạo 2 account live và demo cho user này với u_id của account được tạo ngẫu nhiên
  activeUser: (req, res) => {
    const token = req.body.token;

    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 0,
          l: false,
          message: "Invalid token",
        });
      } else {
        checkActiveUser(decoded.result.email, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results.length) {
            activeUser(decoded.result, (err, results) => {
              if (err) {
                console.log(err);
                return;
              }
              if (!results) {
                return res.json({
                  success: 0,
                  message: "Faile to update user",
                });
              }
              return res.json({
                success: 1,
                message: "Active success",
              });
            });
          }
        });
      }
    });
  },

  reloadMoneyDemo: (req, res) => {
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 0,
          l: false,
          message: "Invalid token",
        });
      } else {
        reloadMoneyDemo(decoded.result.email, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
            });
          }
          return res.json({
            success: 1,
          });
        });
      }
    });
  },
  // lấy u_id từ 2 account của user sau đó lấy tất cả lịch sử bet_history dựa trên u_id
  listHisBO: (req, res) => {
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 0,
          l: false,
          message: "Invalid token",
        });
      } else {
        listHisBO(decoded.result.email, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
            });
          }
          return res.json({
            success: 1,
            data: results,
          });
        });
      }
    });
  },

  // tạo bản ghi mới trong users với địa chi ví eth và btc có kèm cả private_key sau đó gửi
  // data.email, data.nick_name, data.password, data.upline_id, makeid(7), account.address, account.address, account.privateKey, account.privateKey, adr.address, adr.wif, adr.private,
  createUserAccount: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    if (body.password != "") {
      body.password = hashSync(body.password, salt);
    } else {
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    checkUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results.length) {
        checkUserNickName(body.nick_name, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results.length) {
            createAccount(body, (err, results) => {
              if (err) {
                console.log(err);
                return res.status(500).json({
                  success: 0,
                  message: "Database connection error",
                });
              }
              sendActiveMail(body);
              return res.status(200).json({
                success: 1,
              });
            });
          } else {
            return res.json({
              success: 3,
            });
          }
        });
      } else {
        return res.json({
          success: 2,
        });
      }
    });
  },
  // tạo user marketing với trạng thái active được truyền từ client tạo 2 account live và demo cho user luôn u_id của 2 account cũng được chọn ngẫu nhiên
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    if (body.password != "" || void 0 !== body.password) {
      body.password = hashSync(body.password, salt);
    } else {
      return res.status(500).json({
        success: 0,
        message: "Có lỗi ở mật khẩu",
      });
    }
    checkUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results.length) {
        createUser(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection error",
            });
          }
          return res.status(200).json({
            success: 1,
            data: results,
          });
        });
      } else {
        return res.json({
          success: 2,
        });
      }
    });
  },
  // lấy tất cả thông tin user có vẻ khá phức tạp phải check kỹ phía admin client
  getAllUser: (req, res) => {
    getAllUser((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  getUserById: (req, res) => {
    const id = req.params.id;
    getUserById(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not Found",
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  // kiểm tra email đã tồn tại chưa
  checkUserEmail: (req, res) => {
    const email = req.params.email;
    checkUserEmail(email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results.length) {
        return res.json({
          success: 0,
          message: "Record not Found",
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  // create qr code and secret.base32
  createGoogle2FA: (req, res) => {
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        let email = decoded.result.email;

        let secret = speakeasy.generateSecret({
          length: 20,
          name: "BO Trade (" + email + ")",
        });

        QRCode.toDataURL(secret.otpauth_url, (err, image_data) => {
          return res.json({
            success: 1,
            qr: image_data,
            s: secret.base32, // Save this value to your DB for the user
          });
        });
      }
    });
  },
  // tạo code_secure mới update vào DB rồi gửi mail cho khách
  sendCodeG2FA: (req, res) => {
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        let email = decoded.result.email;
        let nick = decoded.result.nick_name;
        let code = makeid(6);

        let data = {
          email: email,
          nick_name: nick,
          code: code,
        };

        updateCodeSecure(data, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          sendOn2FACode(data);
          return res.json({
            success: 1,
          });
        });
      }
    });
  },
  // nếu client ko gửi secret_2fa lên thì lấy trong DB kiểm tra code_secure (code dùng 1 lần) nếu đúng thì tiếp
  // validate đoạn mã 2fa từ google authenticator nếu đúng thì disable gg2fa ở DB và gửi mail cho khách // ở đây nó ko xoá code_secure lỗi logic
  unActiveGoogle2FA: (req, res) => {
    const body = req.body;
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        let secret = decoded.result.secret_2fa;
        let token = body.t; // mã 2fa
        let code = body.c; // code_secure
        let email = decoded.result.email;
        let password = body.p; // password

        let da = {
          email: email,
          code: code,
        };

        if (secret == null) {
          getUserByUserEmail(email, (err, results) => {
            if (err) {
              console.log(err);
              return;
            }
            secret = results.secret_2fa;
          });
        }

        setTimeout(() => {
          // kiểm tra mật khẩu và code secure
          checkCodeSecure2FA(da, (err, results) => {
            if (err) {
              console.log(err);
              return;
            }
            if (!results) {
              return res.json({
                success: 0,
                message: "Invalid email or password",
              });
            }
            const result = compareSync(password, results.password);
            if (result) {
              // let token2 = speakeasy.totp({
              //     secret: secret,
              //     encoding: 'base32'
              // });

              // Verify a given token
              const tokenValidates = speakeasy.totp.verify({
                secret, // đoãn mã qr được generate ra từ hệ thống
                encoding: "base32",
                token, // mã 2fa gửi từ google authenticator
                window: 2,
                //step:60
              });

              if (tokenValidates) {
                // Tắt 2FA
                Disabled2FA(email, (err, results) => {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  if (!results) {
                    return res.json({
                      success: 0,
                      message: "Faile to update user",
                    });
                  }
                  // send mail
                  let nick = decoded.result.nick_name;
                  let data = {
                    nick_name: nick,
                    email: email,
                  };

                  sendOn2FADisabled(data);

                  return res.json({
                    success: 1,
                  });
                });
              } else {
                return res.json({
                  success: 2,
                });
              }
            } else {
              return res.json({
                success: 0,
              });
            }
          });
        }, 500);
      }
    });
  },
  // kiểm tra code_secure (code dùng 1 lần) của user nếu đúng => validate mã 2fa của user bằng đoạn mã qr tạo ra trước đó nếu đúng thì update vào DB
  // xoá code_secure (code dùng 1 lần) đi và update secret_2fa rồi gửi mail cho khách
  activeGoogle2FA: (req, res) => {
    const body = req.body;
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        // s : maSL,
        // t : this.code2FA,
        // c : this.codeActive,
        // p : this.passwordSend
        let secret = body.s; // mã sao lưu // tự generate từ server gửi cho khách
        let token = body.t; // mã 2fa // lấy từ app google authenticator
        let code = body.c; // code_secure // lấy từ email
        let email = decoded.result.email;
        let password = body.p; // password

        let da = {
          email: email,
          code: code,
        };

        // kiểm tra mật khẩu và code secure
        checkCodeSecure2FA(da, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Invalid password or code active",
            });
          }

          const result = compareSync(password, results.password);
          if (result) {
            const tokenValidates = speakeasy.totp.verify({
              secret, // mã này tương ứng với đoạn qr code tạo ra gửi cho khách
              encoding: "base32",
              token, // mã 2fa // lấy từ app google authenticator
              window: 2,
              //step:60 // là bước thời gian + thêm (s) giây
            });
            let obj = {
              e: email,
              s: secret,
            };
            if (tokenValidates) {
              // update vào db mã secret
              updateSecret2FA(obj, (err, results) => {
                if (err) {
                  console.log(err);
                  return;
                }
                if (!results) {
                  return res.json({
                    success: 0,
                    message: "Faile to update user",
                  });
                }
                // send mail
                let nick = decoded.result.nick_name;
                let data = {
                  nick_name: nick,
                  email: email,
                };

                sendOn2FAEnable(data);

                return res.status(200).json({
                  success: 1,
                });
              });
            } else {
              return res.json({
                success: 2,
              });
            }
          } else {
            return res.json({
              success: 0,
            });
          }
        });
      }
    });
  },
  // update user dựa trên id email = ?, nick_name = ?, first_name = ?, last_name = ?, vip_user = ?, level_vip = ?, password = ?
  updateUserById: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    if (!!body.password) {
      body.password = hashSync(body.password, salt);
    }
    updateUserById(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Faile to update user",
        });
      }
      return res.json({
        success: 1,
        message: "Update success",
      });
    });
  },
  // update user dựa trên email: first_name,last_name, country, so_cmnd, verified = 2
  updateInfoVerify: (req, res) => {
    const body = req.body;
    updateInfoVerify(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Faile to update user",
        });
      }
      return res.json({
        success: 1,
        message: "Update success",
      });
    });
  },
  // update số dư của user các loại tiền như btc, eth, vnd, usdt, và thêm bản ghi add_money_history
  updateUserMoneyById: (req, res) => {
    const body = req.body;
    updateUserMoneyById(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Faile to update user money",
        });
      }
      return res.json({
        success: 1,
        message: "Update success",
      });
    });
  },
  // update password của user mà không cần xác minh cái gì cả
  updateUserPasswordByEmailClient: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    if (body.password != "") {
      // checkCodeSecure(body, (err, results) => {
      //     if(err){
      //         console.log(err);
      //         return;
      //     }
      //if(results.length){
      body.password = hashSync(body.password, salt);

      updateUserPasswordByEmail(body, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        if (!results) {
          return res.json({
            success: 0,
            message: "Faile to update user password",
          });
        }
        return res.json({
          success: 1,
          message: "Update success",
        });
      });
      // }else{
      //     return res.json({
      //         success: 2
      //     })
      // }

      // })
    }
  },
  // update password của user với password cũ và secure_code
  updateUserPasswordByEmailClient2: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    if (body.password != "") {
      checkCodeSecure(body, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        if (results.length) {
          getUserByUserEmail(body.email, (err, results) => {
            if (err) {
              console.log(err);
              return;
            }
            if (!results) {
              return res.json({
                success: 0,
                message: "Invalid email or password",
              });
            }
            const result = compareSync(body.passOld, results.password);
            if (result) {
              body.password = hashSync(body.password, salt);

              updateUserPasswordByEmail(body, (err, results) => {
                if (err) {
                  console.log(err);
                  return;
                }
                if (!results) {
                  return res.json({
                    success: 3,
                    message: "Faile to update user password",
                  });
                } else {
                  return res.json({
                    success: 1,
                    message: "Update success",
                  });
                }
              });
            } else {
              return res.json({
                success: 0,
                message: "Invalid email or password",
              });
            }
          });
        } else {
          return res.json({
            success: 2,
          });
        }
      });
    }
  },
  // update password của user với password cũ
  updateUserPasswordByEmail: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    if (body.password != "") {
      body.password = hashSync(body.password, salt);
      updateUserPasswordByEmail(body, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        if (!results) {
          return res.json({
            success: 0,
            message: "Faile to update user password",
          });
        }
        return res.json({
          success: 1,
          message: "Update success",
        });
      });
    }
  },

  deleteUserById: (req, res) => {
    const id = req.params.id;
    deleteUserById(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        message: "Delete success",
      });
    });
  },
  // xác minh mã mã 2fa với mã qr lấy được sau khi decoded token nếu hợp lệ thì getUserByUserEmail và trả data cho client
  loginG2FA: (req, res) => {
    const body = req.body;
    let token = body.token;
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        let secret = decoded.result.secret_2fa;
        let token = body.code;

        // Verify a given token
        const tokenValidates = speakeasy.totp.verify({
          secret,
          encoding: "base32",
          token,
          window: 2,
        });

        if (tokenValidates) {
          let email = decoded.result.email;
          let password = decoded.result.password;
          getUserByUserEmail(email, (err, results) => {
            if (err) {
              console.log(err);
              return;
            }
            if (!results) {
              return res.json({
                success: 0,
                message: "Invalid email or password",
              });
            }
            const result = compareSync(password, results.password);
            if (result) {
              return res.json({
                success: 1,
                message: "Login success",
              });
            } else {
              return res.json({
                success: 0,
                message: "Invalid email or password",
              });
            }
          });
        } else {
          return res.json({
            success: 6,
            message: "Google 2FA",
          });
        }
      }
    });
  },

  loginUser: (req, res) => {
    const body = req.body;
    const ip = getIP(req);

    const userAgent = req.headers["user-agent"];
    const s = new Sniffr();
    s.sniff(userAgent);

    checkActiveUser(body.email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (results.length) {
        getUserByUserEmail(body.email, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Invalid email or password",
            });
          }
          const result = compareSync(body.password, results.password);
          if (result) {
            results.password = body.password;

            const jsontoken = sign({ result: results }, config.TOKEN_KEY, {
              expiresIn: "8h",
            });

            let data = {
              email: body.email,
              nick_name: results.nick_name,
              ip: ip.clientIp,
              userAgent: s,
            };
            //if(!results.active_2fa){
            sendLoginMail(data); // cai nay bo me roi
            //}

            return res.json({
              success: 1,
              message: "Login success",
              g_2fa: results.active_2fa,
              token: jsontoken,
            });
          } else {
            return res.json({
              success: 0,
              message: "Invalid email or password",
            });
          }
        });
      } else {
        return res.json({
          success: 3,
        });
      }
    });
  },

  getAdminByAdminUsername: (req, res) => {
    const body = req.body;
    getAdminByAdminUsername(body.username, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: "Invalid email or password",
        });
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Invalid username or password",
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, config.TOKEN_KEY, {
          expiresIn: "1h",
        });
        //res.header('Authorization', 'sky '+jsontoken);
        return res.json({
          success: 1,
          message: "Login success",
          token: jsontoken,
        });
      } else {
        return res.json({
          success: 0,
          message: "Invalid email or password",
        });
      }
    });
  },
  // update verified status dựa trên user id
  verifiedAccount: (req, res) => {
    const data = req.body;
    verifiedAccount(data, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Faile to update user verifi",
        });
      }
      return res.json({
        success: 1,
        message: "Verify success",
      });
    });
  },

  // get ds đại lý vip_user = 1
  getListAgency: (req, res) => {
    getListAgency((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  // lấy ra những người có upline_id là ref_code của agency đấy chỉ lấy được tầng 1
  viewMemberAgency: (req, res) => {
    const id = req.params.id;
    viewMemberAgency(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not Found",
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  // lấy thông tin user và account dựa trên email
  getInfoUser: (req, res) => {
    let token = req.get("authorization");
    token = token.split(" ")[1];

    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.json({
          success: 0,
          l: false,
          message: "Invalid token",
        });
      } else {
        getInfoUser(decoded.result, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
          });
        });
      }
    });
  },
  // giảm balance trong account tăng money_usdt trong users và in vào trade_history
  // LiveToUsdt: (req, res) => {
  //   const body = req.body;
  //   let token = req.get("authorization");
  //   token = token.split(" ")[1];
  //   verify(token, config.TOKEN_KEY, (err, decoded) => {
  //     if (err) {
  //       return res.json({
  //         success: 3,
  //         l: false,
  //         message: "no no",
  //       });
  //     } else {
  //       // tránh trường hợp sử dụng email người khác
  //       let email = decoded.result.email;
  //       body.email = email;
  //       body["nick"] = decoded.result.nick_name;

  //       LiveToUsdt(body, (err, results) => {
  //         if (err) {
  //           console.log(err);
  //           return;
  //         }
  //         if (!results) {
  //           return res.json({
  //             success: 0,
  //             message: "Faile to send user",
  //           });
  //         }
  //         return res.json({
  //           success: 1,
  //           message: "Send success",
  //         });
  //       });
  //     }
  //   });
  // },
  // giảm money_usdt trong users tăng balance trong account và in vào trade_history
  // UsdtToLive: (req, res) => {
  //   const body = req.body;
  //   let token = req.get("authorization");
  //   token = token.split(" ")[1];
  //   verify(token, config.TOKEN_KEY, (err, decoded) => {
  //     if (err) {
  //       return res.json({
  //         success: 3,
  //         l: false,
  //         m: "no no",
  //       });
  //     } else {
  //       // tránh trường hợp sử dụng email người khác
  //       let email = decoded.result.email;
  //       body.email = email;
  //       body["nick"] = decoded.result.nick_name;

  //       UsdtToLive(body, (err, results) => {
  //         if (err) {
  //           console.log(err);
  //           return;
  //         }
  //         if (!results) {
  //           return res.json({
  //             success: 0,
  //             message: "Faile to send user",
  //           });
  //         }
  //         return res.json({
  //           success: 1,
  //           message: "Send success",
  //         });
  //       });
  //     }
  //   });
  // },

  // trừ money_usdt users gửi cộng money_usdt users nhận insert bản ghi trade_history gửi thông bảo telegram
  // WithDrawalNoiBo: (req, res) => {
  //   const body = req.body;
  //   let token = req.get("authorization");
  //   token = token.split(" ")[1];
  //   verify(token, config.TOKEN_KEY, (err, decoded) => {
  //     if (err) {
  //       return res.json({
  //         success: 3,
  //         l: false,
  //         m: "no no",
  //       });
  //     } else {
  //       body["email"] = decoded.result.email;
  //       body["nick_name"] = decoded.result.nick_name;

  //       let token = body.code;
  //       getSecrect2FA(decoded.result.email, (err, results) => { // lấy mã qr của user
  //         let secret = results.secret_2fa;

  //         //console.log(secret);
  //         let token2 = speakeasy.totp({
  //           secret: secret,
  //           encoding: "base32",
  //         });
  //         //console.log(token2);

  //         const tokenValidates = speakeasy.totp.verify({ // xác minh mã 2fa có chuẩn ko
  //           secret,
  //           encoding: "base32",
  //           token, // mã 2fa từ google authenticator
  //           window: 2,
  //           //step:60
  //         });

  //         //console.log(tokenValidates);
  //         if (tokenValidates) {
  //           checkUserNickName(body.address, (err, results) => { // check địa chỉ nhận có tồn tại không
  //             if (err) {
  //               console.log(err);
  //               return;
  //             }
  //             if (!results.length) {
  //               return res.json({
  //                 success: 5,
  //                 message: "Faile to send user",
  //               });
  //             }

  //             WithDrawalNoiBo(body, (err, results) => { // thực hiện rút tiền nội bộ
  //               if (err) {
  //                 console.log(err);
  //                 return;
  //               }
  //               if (!results) {
  //                 return res.json({
  //                   success: 0,
  //                   message: "Faile to send user",
  //                 });
  //               }
  //               if (!!results.err && results.err === 10) {
  //                 return res.json({
  //                   success: results.err,
  //                   message: "User not verify",
  //                 });
  //               }
  //               return res.json({
  //                 success: 1,
  //                 message: "Send success",
  //               });
  //             });
  //           });
  //         } else {
  //           return res.json({
  //             success: 2,
  //           });
  //         }
  //       });
  //     }
  //   });
  // },
  // trừ money_usdt user gửi và cộng money_usdt user nhận in vào trade_history và phải thực hiện chuyển tiền ERC20 ở đâu đó // vô lý
  // WithDrawalERC: (req, res) => {
  //   const body = req.body;

  //   let token = req.get("authorization");
  //   token = token.split(" ")[1];
  //   verify(token, config.TOKEN_KEY, (err, decoded) => {
  //     if (err) {
  //       return res.json({
  //         success: 3,
  //         l: false,
  //         m: "no no",
  //       });
  //     } else {
  //       body["email"] = decoded.result.email;
  //       body["nick_name"] = decoded.result.nick_name;

  //       let token = body.code;
  //       let secret = decoded.result.secret_2fa;

  //       const tokenValidates = speakeasy.totp.verify({ // xác mình mã gg2fa
  //         secret,
  //         encoding: "base32",
  //         token,
  //         window: 2,
  //         //step:60
  //       });

  //       if (tokenValidates) { // nếu mã gg2fa chuẩn thì rút
  //         WithDrawalERC(body, (err, results) => {
  //           if (err) {
  //             console.log(err);
  //             return;
  //           }
  //           if (!results) {
  //             return res.json({
  //               success: 0,
  //               message: "Faile to send user",
  //             });
  //           }
  //           return res.json({
  //             success: 1,
  //             message: "Send success",
  //           });
  //         });
  //       } else {
  //         return res.json({
  //           success: 2,
  //         });
  //       }
  //     }
  //   });
  // },
  // nếu money_usdt của user đủ và đã verified thì tiến hành trừ money_usdt của user và lưu vào trade_history chờ duyệt ở đâu đó
  // WithDrawalBSC: (req, res) => {
  //   const body = req.body;

  //   let token = req.get("authorization");
  //   token = token.split(" ")[1];
  //   verify(token, config.TOKEN_KEY, (err, decoded) => {
  //     if (err) {
  //       return res.json({
  //         success: 3,
  //         l: false,
  //         m: "no no",
  //       });
  //     } else {
  //       body["email"] = decoded.result.email;
  //       body["nick_name"] = decoded.result.nick_name;

  //       let token = body.code;
  //       let secret = decoded.result.secret_2fa;

  //       const tokenValidates = speakeasy.totp.verify({
  //         secret,
  //         encoding: "base32",
  //         token,
  //         window: 2,
  //         //step:60
  //       });

  //       if (tokenValidates) {
  //         WithDrawalBSC(body, (err, results) => {
  //           if (err) {
  //             console.log(err);
  //             return;
  //           }
  //           if (!results) {
  //             return res.json({
  //               success: 0,
  //               message: "Faile to send user",
  //             });
  //           }
  //           if (!!results.err && results.err === 10) {
  //             return res.json({
  //               success: results.err,
  //               message: "User not verify",
  //             });
  //           }
  //           return res.json({
  //             success: 1,
  //             message: "Send success",
  //           });
  //         });
  //       } else {
  //         return res.json({
  //           success: 2,
  //         });
  //       }
  //     }
  //   });
  // },
  // nếu số dư money_paypal đủ thì trừ money_paypal người gửi và thêm money_paypal người nhận
  // WithDrawalPaypalNB: (req, res) => {
  //   const body = req.body;

  //   let token = req.get("authorization");
  //   token = token.split(" ")[1];
  //   verify(token, config.TOKEN_KEY, (err, decoded) => {
  //     if (err) {
  //       return res.json({
  //         success: 3,
  //         l: false,
  //         m: "no no",
  //       });
  //     } else {
  //       body["email"] = decoded.result.email;
  //       body["nick_name"] = decoded.result.nick_name;

  //       WithDrawalPaypalNB(body, (err, results) => {
  //         if (err) {
  //           console.log(err);
  //           return;
  //         }
  //         if (!results) {
  //           return res.json({
  //             success: 0,
  //             message: "Faile to send user",
  //           });
  //         }
  //         return res.json({
  //           success: 1,
  //           message: "Send success",
  //         });
  //       });
  //     }
  //   });
  // },
  // nếu số dư money_paypal của người gửi đủ thì trừ số dư money_paypal của người thêm vào lịch sử trade_history và chờ duyệt và gửi money_paypal ở đâu đó trong hệ thống
  // WithDrawalPaypalAc: (req, res) => {
  //   const body = req.body;

  //   let token = req.get("authorization");
  //   token = token.split(" ")[1];
  //   verify(token, config.TOKEN_KEY, (err, decoded) => {
  //     if (err) {
  //       return res.json({
  //         success: 3,
  //         l: false,
  //         m: "no no",
  //       });
  //     } else {
  //       body["email"] = decoded.result.email;
  //       body["nick_name"] = decoded.result.nick_name;

  //       WithDrawalPaypalAc(body, (err, results) => {
  //         if (err) {
  //           console.log(err);
  //           return;
  //         }
  //         if (!results) {
  //           return res.json({
  //             success: 0,
  //             message: "Faile to send user",
  //           });
  //         }
  //         return res.json({
  //           success: 1,
  //           message: "Send success",
  //         });
  //       });
  //     }
  //   });
  // },
  // lấy money_usdt, money_eth, money_btc, money_paypal từ user bằng email
  BalanceWallet: (req, res) => {
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        let email = decoded.result.email;

        BalanceWallet(email, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Faile to send user",
            });
          }
          return res.json({
            success: 1,
            data: results,
          });
        });
      }
    });
  },

  // kiểm tra xem money_usdt của user có đủ không nếu đủ thì giảm money_usdt của user đi  và tăng balance của account live lên tạo bản ghi trade_history mới
  // DepositToWallet: (req, res) => {
  //   const body = req.body;

  //   let token = req.get("authorization");
  //   token = token.split(" ")[1];
  //   verify(token, config.TOKEN_KEY, (err, decoded) => {
  //     if (err) {
  //       res.json({
  //         success: 3,
  //         l: false,
  //         m: "no no",
  //       });
  //     } else {
  //       let email = decoded.result.email;

  //       let obj = {
  //         email: email,
  //         m: body.money,
  //         nick: decoded.result.nick_name,
  //         uidLive: body.id,
  //       };

  //       checkMoneyUser(email, (err, results) => { // lấy money_usdt balance của users
  //         if (err) {
  //           console.log(err);
  //           return;
  //         }
  //         if (results.balance >= body.money) { // kiểm tra có đủ tiền để deposit không
  //           DepositToWallet(obj, (err, results) => { //
  //             if (err) {
  //               console.log(err);
  //               return;
  //             }
  //             if (!results) {
  //               return res.json({
  //                 success: 0,
  //                 message: "Faile to send user",
  //               });
  //             }
  //             return res.json({
  //               success: 1,
  //             });
  //           });
  //         } else { // nếu không thì gửi lại user
  //           return res.json({
  //             success: 3,
  //             message: "Faile to send user",
  //           });
  //         }
  //       });
  //     }
  //   });
  // },
  // tạo bản ghi trade_history về user nạp tiền và chờ duyệt
  DepositRequest: (req, res) => {
    const body = req.body;
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        let obj = {
          email: decoded.result.email,
          nick: decoded.result.nick_name,
          m: body.m,
        };
        createDepositHistory(obj, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Faile to send user",
            });
          }
          return res.json({
            success: 1,
          });
        });
      }
    });
  },
  // kiểm tra user có đủ tiền không nếu đủ thì tiến hành mua vip
  // trừ tiền mua vip và tăng vip cho user cộng tiền hoa hồng mua vip cho tối da 7 tầng người giới thiệu của user
  // UserBuyVIP: (req, res) => {
  //   let token = req.get("authorization");
  //   token = token.split(" ")[1];
  //   verify(token, config.TOKEN_KEY, (err, decoded) => {
  //     if (err) {
  //       res.json({
  //         success: 3,
  //         l: false,
  //         m: "no no",
  //       });
  //     } else {
  //       let email = decoded.result.email;
  //       let nick = decoded.result.nick_name;

  //       let obj = {
  //         email: email,
  //         amount: 100,
  //         nick: nick,
  //       };

  //       checkMoneyUser(email, (err, results) => {
  //         if (err) {
  //           console.log(err);
  //           return;
  //         }
  //         if (results.balance >= 100) {
  //           UserBuyVIP(obj, (err, results) => {
  //             if (err) {
  //               console.log(err);
  //               return;
  //             }
  //             if (!results) {
  //               return res.json({
  //                 success: 0,
  //                 message: "Faile",
  //               });
  //             }
  //             return res.json({
  //               success: 1,
  //             });
  //           });
  //         } else {
  //           return res.json({
  //             success: 2,
  //           });
  //         }
  //       });
  //     }
  //   });
  // },
  // lấy nhiều thông tin về đại lý cấp dưới
  getNguoiGioiThieu: (req, res) => {
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        let email = decoded.result.email;

        getNguoiGioiThieu(email, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
            });
          }
          return res.json({
            success: 1,
            data: results,
          });
        });
      }
    });
  },
  // lấy các thông số thắng thua từ bet_history và account
  getBoStatistics: (req, res) => {
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        let email = decoded.result.email;

        getBoStatistics(email, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
            });
          }
          return res.json({
            success: 1,
            data: results,
          });
        });
      }
    });
  },
  // lấy 20 thông tin bet_history gần nhất của 1 account live dựa trên 1 email
  getListHisOrder: (req, res) => {
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        getListHisOrder(decoded.result.email, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
          });
        });
      }
    });
  },
  // lấy thông tin bet_history trong 1 khoảng thời gian nhất định của 1 account live dựa trên 1 email
  getListHisOrderDate: (req, res) => {
    let data = req.body;
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        data["email"] = decoded.result.email;

        getListHisOrderDate(data, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
          });
        });
      }
    });
  },
  // lấy thông tin trade_history liên quan đến user
  getListHisTradeWallet: (req, res) => {
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        getListHisTradeWallet(decoded.result.nick_name, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
            count: results.count,
          });
        });
      }
    });
  },
  // lấy thông tin trade_history theo kiểu phân trang
  getListHisTradeWalletPage: (req, res) => {
    let body = req.params;
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        let obj = {
          nick: decoded.result.nick_name,
          page: body.page,
        };
        getListHisTradeWalletPage(obj, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
            count: results.count,
          });
        });
      }
    });
  },
  // lấy commission_history của user dựa trên ref_code tối đa 10 cái
  getListHisTradeWalletHH: (req, res) => {
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        getListHisTradeWalletHH(decoded.result.email, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
            count: results.count,
          });
        });
      }
    });
  },
  // lấy commission_history của user dựa trên ref code theo kiểu phân trang
  getListHisTradeWalletHHPage: (req, res) => {
    let body = req.params;
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        let obj = {
          email: decoded.result.email,
          page: body.page,
        };
        getListHisTradeWalletHHPage(obj, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
            count: results.count,
          });
        });
      }
    });
  },
  // lấy 10 thông tin chuyển tiền từ ví nội bộ qua tkgd và từ tkgd qua ví của user
  getListHisTradeWalletWGD: (req, res) => {
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        getListHisTradeWalletWGD(decoded.result.nick_name, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
            count: results.count,
          });
        });
      }
    });
  },
  // lấy 10 thông tin chuyển tiền từ ví nội bộ qua tkgd và từ tkgd qua ví của user theo kiểu phân trang
  getListHisTradeWalletWGDPage: (req, res) => {
    let body = req.params;
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        let obj = {
          nick: decoded.result.nick_name,
          page: body.page,
        };
        getListHisTradeWalletWGDPage(obj, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
            count: results.count,
          });
        });
      }
    });
  },
  // lấy thanhtoan(tổng tiền chiết khấu) soluongGD(tổng số lượng giao dịch) sonhaGD(tổng số nhà giao dịch)
  getComDetails: (req, res) => {
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        getComDetails(decoded.result.email, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
            count: results.count,
          });
        });
      }
    });
  },
  // lấy thanhtoan(tổng tiền chiết khấu) soluongGD(tổng số lượng giao dịch) sonhaGD(tổng số nhà giao dịch) theo kiểu phân trang
  getComDetailsPage: (req, res) => {
    let body = req.params;
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        let obj = {
          email: decoded.result.email,
          page: body.page,
        };
        getComDetailsPage(obj, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
            count: results.count,
          });
        });
      }
    });
  },
  // dựa theo ngày yêu cầu lấy SUM(pending_commission), SUM(personal_trading_volume), COUNT(pending_commission) hoặc SUM(vip_commission) nếu user là vip
  getComDetailsDate: (req, res) => {
    let data = req.body;
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        data["email"] = decoded.result.email;

        getComDetailsDate(data, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
          });
        });
      }
    });
  },
  // lấy danh sách cấp dưới có dạng {cap1 = [{level_vip, pricePlay AS tklgd, ref_code, upline_id, nick_name}...], cap2...}
  getAgencySearchLevel: (req, res) => {
    let body = req.body;
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        body["email"] = decoded.result.email;

        getAgencySearchLevel(body, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
            count: results.count,
          });
        });
      }
    });
  },
  // lấy đái lý cấp 1 với cái tên gần giống cái tên client gửi lên
  getAgencySearchName: (req, res) => {
    let body = req.body;
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.json({
          success: 3,
          l: false,
          m: "no no",
        });
      } else {
        body["email"] = decoded.result.email;

        getAgencySearchName(body, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
            count: results.count,
          });
        });
      }
    });
  },
  // lấy dữ 15 dữ liệu tổng hợp tại 4 bảng users, trade_history, bet_history, commission_history
  getListAnalytics: (req, res) => {
    let body = req.body;
    getListAnalytics(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  // trừ những thông số này trong bảng users money_usdt, money_btc, money_eth, money_paypal, money_vn
  addMoneyMember: (req, res) => {
    const body = req.body;
    addMoneyMember(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Faile to update user",
        });
      }
      return res.json({
        success: 1,
        message: "Update success",
      });
    });
  },
  // chuyển trạng thái marketing của user
  changeAccType: (req, res) => {
    const body = req.body;
    changeAccType(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Faile to update user",
        });
      }
      return res.json({
        success: 1,
        message: "Update success",
      });
    });
  },
  // đổi pass cho admin
  changPassAd: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);

    if (body.pass != "") {
      body.pass = hashSync(body.pass, salt);
    } else {
      return res.json({
        success: 0,
        message: "Faile to update user password",
      });
    }

    changPassAd(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Faile to update user password",
        });
      }
      return res.json({
        success: 1,
        message: "Update success",
      });
    });
  },
  // lấy thông tin cấp 1 trong các khoảng thời gian khác nhau và lấy thông tin 7 tần còn lại
  getListF1F7: (req, res) => {
    const body = req.body;
    getListF1F7(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results.data,
        obj: results.obj,
      });
    });
  },
  // lấy hết từ commission_history cho 1 user cụ thể
  getListCmsHis: (req, res) => {
    const body = req.body;
    getListCmsHis(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  // lấy hết notification gửi lên cho user
  getListNotifi: (req, res) => {
    const body = req.body;
    getListNotifi(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  // update trạng thái đã xem khi user ấn vào thông báo
  updateListNotifi: (req, res) => {
    const body = req.body;
    updateListNotifi(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
      });
    });
  },
};
// addMoneyMember updateUserMoneyById BalanceWallet getListAnalytics
