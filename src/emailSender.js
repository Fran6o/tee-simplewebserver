import nodemailer from "nodemailer";
import utils from './utils.js';

async function sendMail(subject, body) {
    try {

        const config = utils.getServiceConfig()
        if (config.gmailUser && config.gmailPwd) {
            return new Promise((resolve, reject) => {

                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: config.gmailUser,
                        pass: config.gmailPwd,
                    },
                });
                
                const mailOptions = {
                    from: config.gmailUser,
                    to: config.notifyToEmail ? config.notifyToEmail : config.gmailUser,
                    subject: subject,
                    text: body,
                };

                try {
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            //console.error("Error sending email: ", error);
                            console.error("Error sending email: ", error.message);
                            resolve(false);
                        } else {
                            console.log("Email sent: ", info.response);
                            resolve(true);
                        }
                    });
                }
                catch (e1) {
                    console.log(e1)
                }
            });
        }
    }
    catch (e) {
        console.log(e)
    }

}

export default {
    sendMail: sendMail
}