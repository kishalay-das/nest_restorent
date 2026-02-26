import { transporter } from "config/mail.config";

interface SendMailOptions {
    senderId: string;
    receiverId: string;
    subject: string;
    text?: string;
}

export const send = async ({
    senderId,
    receiverId,
    subject,
    text,
}: SendMailOptions) => {
    try {
        if (!senderId || !receiverId || !subject) {
            throw new Error('Missing required email fields');
        }

        const mailOptions = {
            from: `"${process.env.MAIL_FROM_NAME || 'App'}" <${senderId}>`,
            to: receiverId,
            subject,
            text: text || undefined,
            html:
                `<div style="font-family:Arial,sans-serif;">
           <h2>${subject}</h2>
           <p>${text}</p>
         </div>`,
        };
        const info = await transporter.sendMail(mailOptions);
        return {
            success: true,
            message: 'Mail sent successfully',
            messageId: info.messageId,
        };
    } catch (error: any) {
        console.error(' Mail Error:', error?.message || error);
        return {
            success: false,
            message: 'Error in sending mail',
            error: error?.message || 'UNKNOWN_ERROR',
        };
    }
};
