import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'kirillgvozd0@gmail.com',
                pass: process.env.NODEMAILER_PASSWORD,
            },
        });
    }

    async sendPriceUpdateNotification(
        email: string,
        itemName: string,
        previousPrice: number,
        newPrice: number,
        priceChange: string,
    ) {
        const message = {
            from: 'no-reply@example.com',
            to: email,
            subject: `Price Update: ${itemName}`,
            text: `The price for the item "${itemName}" has ${priceChange}. 
Previous Price: ${previousPrice} 
New Price: ${newPrice}.`,
        };

        await this.transporter.sendMail(message);
    }
}
