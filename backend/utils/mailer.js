const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

exports.sendMail = async (to, subject, htmlContent) => {
  const transport = nodeMailer.createTransport({
    service: "gmail",
    port: 25,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const options = {
    from: "2964139hoangchi@gmail.com",
    to: to,
    subject: subject,
    html: htmlContent,
  };
  await transport.sendMail(options, (err, data) => {
    err ? console.log(err) : console.log("SEND IT");
  });
};
