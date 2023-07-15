const { 
    getUSDTAddress,
    getBTCAddress,
    getETHAddress
} = require("./wallet.service")

const { verify } = require("jsonwebtoken")

const config = require("./../../config")


module.exports = {

    getUSDTAddress: (req, res) => {

        let token = req.get('authorization');
        token = token.split(" ")[1];

        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if(err){
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            }else{
                let nick = decoded.result.nick_name

                getUSDTAddress(nick, (err, results) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                    return res.json({
                        success: 1,
                        a: results
                    })
                })
            }
        })
    },

    getBTCAddress: (req, res) => {

        let token = req.get('authorization');
        token = token.split(" ")[1];

        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if(err){
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            }else{
                let nick = decoded.result.nick_name

                getBTCAddress(nick, (err, results) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                    return res.json({
                        success: 1,
                        a: results
                    })
                })
            }
        })

    },

    getETHAddress: (req, res) => {

        let token = req.get('authorization');
        token = token.split(" ")[1];

        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if(err){
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            }else{
                let nick = decoded.result.nick_name

                getETHAddress(nick, (err, results) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                    return res.json({
                        success: 1,
                        a: results
                    })
                })
            }
        })

    },

    
}