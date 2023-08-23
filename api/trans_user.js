const db = require("./../database")

module.exports = {
    updatePriceWinLose: (data, type) => {
        let w = 0, l = 0;
        if(type == 'w'){
            w = data.win;
            l = 0;
        }else{
            w = 0;
            l = data.lose;
        }
        db.query(
            `UPDATE users SET 
            priceWin = priceWin + ?,
            priceLose = priceLose + ? WHERE email = ?`,
            [
                w, 
                l,
                data.email
            ]
        )
    },
}