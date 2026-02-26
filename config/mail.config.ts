import nodemailer from 'nodemailer'
// Create a transporter using SMTP
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "bcasudipta@gmail.com",
        pass: "cgcw bvfe jgqv jbsm",
    },
});