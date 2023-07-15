let doanhthu = require('./model/doanhthu');
let check = require('./model/check');
let rut = require('./model/rut');
let start = require('./model/start');
let dangky = require('./model/dangky');
let dangkyStart = require('./model/dangkyStart');
//let contact = require('./model/contact');
let kichhoat = require('./model/kichhoat');
let code2fa = require('./model/code2fa');
let changePass = require('./model/changepass');

const TELE = global['ARESTele'];

// TELE.onText('/\/kichhoat/', (msg) => {

// })

// TELE.onText('/\/code2fa/', (msg) => {

// })

TELE.on('message', (msg) => {
    let text = msg.text;
    if(new RegExp("ARES-RUN-AD").test(text)){
        if(new RegExp("dt").test(text)){
            doanhthu(TELE, msg.from.id, text);
        }
    }else if(new RegExp("ARES-CHECK").test(text)){
        if(new RegExp("check").test(text)){
            check(TELE, msg.from.id, text);
        }
    }else if(new RegExp("ARES-ACCPET").test(text)){
        if(new RegExp("rut").test(text)){
            rut(TELE, msg.from.id, text);
        }
    }else if(new RegExp("BOREG_").test(text)){
        dangkyStart(TELE, msg.from.id, text);
    }else if(new RegExp("dangky").test(text)){
        dangky(TELE, msg.from.id, text);
    }else if(new RegExp("ACTIVE").test(text)){
        kichhoat(TELE, msg.from.id);
    }else if(new RegExp("CODE2FA").test(text)){
        code2fa(TELE, msg.from.id);
    }else if(new RegExp("CHANGEPASS").test(text)){
        changePass(TELE, msg.from.id, text);
    }
    
    // else if(msg.contact){
	// 	contact(TELE, msg.from.id, msg.contact.phone_number);
	// }
    else{
		start(TELE, msg.from.id);
	}

});