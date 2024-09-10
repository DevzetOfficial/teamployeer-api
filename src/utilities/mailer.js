import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_ENCRYPTION,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

// Configure Handlebars templating engine with Nodemailer
const handlebarOptions = {
    viewEngine: {
        extName: ".hbs",
        partialsDir: path.resolve("./src/view/mail/"),
        defaultLayout: false,
    },
    viewPath: path.resolve("./src/view/mail/"),
    extName: ".hbs",
};

transporter.use("compile", hbs(handlebarOptions));

// Create send email function
const sendMail = async (to, subject, context, template) => {
    const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: to,
        subject: subject,
        context: context,
        template: template ? template : "default",
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};

export default sendMail;
