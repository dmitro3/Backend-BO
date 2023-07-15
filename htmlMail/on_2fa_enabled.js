
const html = (nameNick, linkLogo, linkFooter, titleSite, titleSub) => {
    let body = `<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;background-color: #17202A;">
    <tr>
        <td colspan="2" align="center" style="padding-top: 35px; padding-bottom: 15px; padding-left: 10px; padding-right: 10px;"> <img src="${linkLogo}" style="height:53px;" />
        </td>
    </tr>
    <tr>
        <td colspan="2" align="center">
            <div style="padding-left: 15px; padding-right: 15px; padding-top: 15px; padding-bottom: 0px; color: #fff; margin-top: 5px;border-radius: 8px 8px 0 0;">
                <div style="padding-bottom: 15px; font-size: 26px; font-weight: bold; position: relative;">${titleSub}<span style="position: absolute; display: block; overflow: hidden; width: 114px; height: 5px; border-radius: 5px; bottom: 0; left: 50%; background-color: #fa2843; transform: translateX(-50%);"></span>
                </div>
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <div style="padding-top: 20px; padding-bottom: 20px; padding-left: 25px; padding-right: 25px; color: rgba(255, 255, 255, 0.7);">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding-top: 5px; padding-bottom: 15px; font-size: 22px; color: #fff;"> Dear <b>${nameNick}</b>,</td>
                    </tr>
                    <tr>
                    <td style="padding-top:5px;padding-bottom:5px">
                        Your account at <span style="color:#2177ff">${titleSite}</span> has been enabled Google Authentication.
                    </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 25px; padding-bottom: 5px;"> Best regards,</td>
                    </tr>
                    <tr>
                        <td style="padding-top: 5px; padding-bottom: 5px;"> <span style="color: #fa2843;">${titleSite}</span> Team</td>
                    </tr>
                </table>
            </div>
        </td>
    </tr>
    <tr>
        <td align="center" style="font-weight: normal; color: #fff; font-size: 15px;">
            <div style="height: 180px; background: url(${linkFooter}) no-repeat; background-size: contain;"> <span style="vertical-align: middle; display: inline-block; margin-top: 120px;">
        	© ${titleSite}. ® All Rights Reserved.</span>
            </div>
        </td>
    </tr>
</table>`
    return body
}

module.exports = {
    html2FAEnabled: html
}