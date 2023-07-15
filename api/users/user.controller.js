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
  forgotPassAccount: (req, res) => {
    let body = req.body;
    // const jsontoken = sign({result: body}, config.TOKEN_KEY, {
    //     expiresIn: "1m"
    // });
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
        let token = body.t;
        let code = body.c;
        let email = decoded.result.email;
        let password = body.p;

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
                secret,
                encoding: "base32",
                token,
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
        let secret = body.s;
        let token = body.t;
        let code = body.c;
        let email = decoded.result.email;
        let password = body.p;

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
            // let token2 = speakeasy.totp({
            //     secret: secret,
            //     encoding: 'base32'
            // });
            //console.log(token2)
            // Verify a given token
            const tokenValidates = speakeasy.totp.verify({
              secret,
              encoding: "base32",
              token,
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
            sendLoginMail(data);
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
        return;
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

  // get ds đại lý
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

  LiveToUsdt: (req, res) => {
    const body = req.body;
    let token = req.get("authorization");
    token = token.split(" ")[1];
    verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.json({
          success: 3,
          l: false,
          message: "no no",
        });
      } else {
        // tránh trường hợp sử dụng email người khác
        let email = decoded.result.email;
        body.email = email;
        body["nick"] = decoded.result.nick_name;

        LiveToUsdt(body, (err, results) => {
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
            message: "Send success",
          });
        });
      }
    });
  },

  UsdtToLive: (req, res) => {
    const body = req.body;
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
        // tránh trường hợp sử dụng email người khác
        let email = decoded.result.email;
        body.email = email;
        body["nick"] = decoded.result.nick_name;

        UsdtToLive(body, (err, results) => {
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
            message: "Send success",
          });
        });
      }
    });
  },

  WithDrawalNoiBo: (req, res) => {
    const body = req.body;
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
        body["email"] = decoded.result.email;
        body["nick_name"] = decoded.result.nick_name;

        let token = body.code;
        getSecrect2FA(decoded.result.email, (err, results) => {
          let secret = results.secret_2fa;

          //console.log(secret);
          let token2 = speakeasy.totp({
            secret: secret,
            encoding: "base32",
          });
          //console.log(token2);

          const tokenValidates = speakeasy.totp.verify({
            secret,
            encoding: "base32",
            token,
            window: 2,
            //step:60
          });

          //console.log(tokenValidates);
          if (tokenValidates) {
            checkUserNickName(body.address, (err, results) => {
              if (err) {
                console.log(err);
                return;
              }
              if (!results.length) {
                return res.json({
                  success: 5,
                  message: "Faile to send user",
                });
              }

              WithDrawalNoiBo(body, (err, results) => {
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
                if (!!results.err && results.err === 10) {
                  return res.json({
                    success: results.err,
                    message: "User not verify",
                  });
                }
                return res.json({
                  success: 1,
                  message: "Send success",
                });
              });
            });
          } else {
            return res.json({
              success: 2,
            });
          }
        });
      }
    });
  },

  WithDrawalERC: (req, res) => {
    const body = req.body;

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
        body["email"] = decoded.result.email;
        body["nick_name"] = decoded.result.nick_name;

        let token = body.code;
        let secret = decoded.result.secret_2fa;

        const tokenValidates = speakeasy.totp.verify({
          secret,
          encoding: "base32",
          token,
          window: 2,
          //step:60
        });

        if (tokenValidates) {
          WithDrawalERC(body, (err, results) => {
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
              message: "Send success",
            });
          });
        } else {
          return res.json({
            success: 2,
          });
        }
      }
    });
  },

  WithDrawalBSC: (req, res) => {
    const body = req.body;

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
        body["email"] = decoded.result.email;
        body["nick_name"] = decoded.result.nick_name;

        let token = body.code;
        let secret = decoded.result.secret_2fa;

        const tokenValidates = speakeasy.totp.verify({
          secret,
          encoding: "base32",
          token,
          window: 2,
          //step:60
        });

        if (tokenValidates) {
          WithDrawalBSC(body, (err, results) => {
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
            if (!!results.err && results.err === 10) {
              return res.json({
                success: results.err,
                message: "User not verify",
              });
            }
            return res.json({
              success: 1,
              message: "Send success",
            });
          });
        } else {
          return res.json({
            success: 2,
          });
        }
      }
    });
  },

  WithDrawalPaypalNB: (req, res) => {
    const body = req.body;

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
        body["email"] = decoded.result.email;
        body["nick_name"] = decoded.result.nick_name;

        WithDrawalPaypalNB(body, (err, results) => {
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
            message: "Send success",
          });
        });
      }
    });
  },

  WithDrawalPaypalAc: (req, res) => {
    const body = req.body;

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
        body["email"] = decoded.result.email;
        body["nick_name"] = decoded.result.nick_name;

        WithDrawalPaypalAc(body, (err, results) => {
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
            message: "Send success",
          });
        });
      }
    });
  },

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

  DepositToWallet: (req, res) => {
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
        let email = decoded.result.email;

        let obj = {
          email: email,
          m: body.money,
          nick: decoded.result.nick_name,
          uidLive: body.id,
        };

        checkMoneyUser(email, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (results.balance >= body.money) {
            DepositToWallet(obj, (err, results) => {
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
          } else {
            return res.json({
              success: 3,
              message: "Faile to send user",
            });
          }
        });
      }
    });
  },

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

  UserBuyVIP: (req, res) => {
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
        let nick = decoded.result.nick_name;

        let obj = {
          email: email,
          amount: 100,
          nick: nick,
        };

        checkMoneyUser(email, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (results.balance >= 100) {
            UserBuyVIP(obj, (err, results) => {
              if (err) {
                console.log(err);
                return;
              }
              if (!results) {
                return res.json({
                  success: 0,
                  message: "Faile",
                });
              }
              return res.json({
                success: 1,
              });
            });
          } else {
            return res.json({
              success: 2,
            });
          }
        });
      }
    });
  },

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
