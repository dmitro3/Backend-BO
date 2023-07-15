const { verify } = require("jsonwebtoken");
const config = require("./../config")

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get('authorization');
        if(token){
            //token = token.slice(7);
            token = token.split(" ")[1];
            verify(token, config.TOKEN_KEY, (err, decoded) => {
                if(err){
                    res.json({
                        success: 4,
                        l: false,
                        message: "Invalid token"
                    })
                }else{
                    next();
                }
            })
        }else{
            res.json({
                success: 5,
                message: "Access denied!"
            })
        }
    }
}