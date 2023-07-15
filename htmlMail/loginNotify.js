
const html = (Ip, OSysTeam, Brow, nameNick, linkLogo, linkFooter, contact, titleSite) => {
    let body = `<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;background-color: #17202A;">
    <tr>
        <td colspan="2" align="center" style="padding-top: 35px; padding-bottom: 15px; padding-left: 10px; padding-right: 10px;"> <img src="${linkLogo}" style="height:53px;" />
        </td>
    </tr>
    <tr>
        <td colspan="2" align="center">
            <div style="padding-left: 15px; padding-right: 15px; padding-top: 15px; padding-bottom: 0px; color: #fff; margin-top: 5px;border-radius: 8px 8px 0 0;">
                <div style="padding-bottom: 15px; font-size: 26px; font-weight: bold; position: relative;"> You Have Signed In From A New Ip Address <span style="position: absolute; display: block; overflow: hidden; width: 114px; height: 5px; border-radius: 5px; bottom: 0; left: 50%; background-color: #fa2843; transform: translateX(-50%);"></span>
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
                        <td style="padding-top: 5px; padding-bottom: 5px;"> Your account have been successfully signed in from a new IP address. Please verify the follow information and if this wasn't you, please take immediate actions to protect your account.</td>
                    </tr>
                    <tr>
                        <td style="padding-top: 5px; padding-bottom: 5px;"> <span style="font-weight: bold;">IP Address:</span> ${Ip}</td>
                    </tr>
                    <tr>
                        <td style="padding-top: 5px; padding-bottom: 5px;"> <span style="font-weight: bold;">Operating System:</span> ${OSysTeam}</td>
                    </tr>
                    <tr>
                        <td style="padding-top: 5px; padding-bottom: 5px;"> <span style="font-weight: bold;">Browser:</span> ${Brow}</td>
                    </tr>
                    <tr>
                        <td style="padding-top: 5px; padding-bottom: 5px;"> If this wasn't you, we recommend you to email us at <span style="color: #EEC92D;">${contact}</span> to report this incident.</td>
                    </tr>
                    <tr>
                        <td style="padding-top: 5px; padding-bottom: 5px;"> For any other queries, reply directly to this email.</td>
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
    htmlLogin: html
}