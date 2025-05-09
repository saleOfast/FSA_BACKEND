import nodemailer from 'nodemailer';

const testAccount = nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: 'delbert.mclaughlin1@ethereal.email', // generated ethereal user
//         pass: 'DtXc5MY71HMuHtpqyv', // generated ethereal password
//     },
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "anilchauhan.src@gmail.com",
        pass: "boortxzpvjnzxooz"
    }
});

const emailGenerator = (toEmail: string, subject: string, html: any) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: 'anilchauhan.src@gmail.com', // sender address
            to: toEmail, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
        }, (error, info) => {
            if (error) {
                console.log(error, 'error==========')
                reject(error);
            } else {
                resolve(info);
            }
        });
    })
}


export { emailGenerator }