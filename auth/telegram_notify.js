const config = require('../config');
let TELEGRAM_NAP_ID = config.TELEGRAM_NAP_ID;
let TELEGRAM_RUT_ID = config.TELEGRAM_RUT_ID;
let TELEGRAM_BET_ID = config.TELEGRAM_BET_ID;
let TELEGRAM_BET_AMOUNT = config.TELEGRAM_BET_AMOUNT;
let TELEGRAM_BET_THONG_BAO = config.TELEGRAM_BET_THONG_BAO;
let TELEGRAM_BET_PHIM_LENH = config.TELEGRAM_BET_PHIM_LENH;

module.exports = {

    sendMessBOTTrade: (content = '') => {
    
        if(content == '' || content == null) return
    
        global['ARESTele'].sendMessage(`@${TELEGRAM_BET_PHIM_LENH}`, content, {parse_mode : "HTML"})
    },
	
	sendMessThongBao: (content = '') => {
    
        if(content == '' || content == null) return
    
        global['ARESTele'].sendMessage(`@${TELEGRAM_BET_THONG_BAO}`, content, {parse_mode : "HTML"})
    },

    sendMessBetAmount: (content = '') => {
    
        if(content == '' || content == null) return
        global['ARESTele'].sendMessage(`@${TELEGRAM_BET_AMOUNT}`, content, {parse_mode : "HTML"})
    },

    sendMessBet: (content = '') => {
    
        if(content == '' || content == null) return
    
        global['ARESTele'].sendMessage(`@${TELEGRAM_BET_ID}`, content, {parse_mode : "HTML"})
    },

    sendMessNap: (content = '') => {
    
        if(content == '' || content == null) return
    
        global['ARESTele'].sendMessage(`@${TELEGRAM_NAP_ID}`, content, {parse_mode : "HTML"})
    },

    sendMessRut: (content = '') => {
    
        if(content == '' || content == null) return
    
        global['ARESTele'].sendMessage(`@${TELEGRAM_RUT_ID}`, content, {parse_mode : "HTML"})
    },
    
    sendImage: (linkImage = '', content = '') => {
    
    
        if(linkImage != '' && content == ''){
    
            global['ARESTele'].sendPhoto(`@${TELEGRAM_RUT_ID}`,linkImage )
    
        }else if(linkImage != '' && content != ''){
    
            global['ARESTele'].sendPhoto(`@${TELEGRAM_RUT_ID}`,linkImage, {caption : content, parse_mode : "HTML"} )
        
        }
    
    }
}




// Code thủ công

// function sendMess(content = ''){

//     const configMess = {
//         chat_id: `@${dataSys.teleChatID}`,
//         text: content,
//         parse_mode: 'HTML',
//     }
//     if(content == '' || content == null) return

//     axios.post(`https://api.telegram.org/bot${dataSys.teleChatToken}/sendMessage?`, configMess).then((res) => {})
 
// }

// function sendImage(linkImage = ''){

//     const config = {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         },
//         params: {
//             chat_id: '@test_channel_bo',
//             photo: linkImage
//         },
//     }

//     if(linkImage == '' || linkImage == null) return 

//     axios.get(`https://api.telegram.org/bot${dataSys.teleChatToken}/sendPhoto?`, config).then((res) => {})
// }