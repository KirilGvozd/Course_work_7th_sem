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
            subject: `Обновление цены: ${itemName}`,
            text: `Цена на товар "${itemName}" была ${priceChange}. 
Предыдущая цена: ${previousPrice} 
Новая цена: ${newPrice}.`,
        };

        await this.transporter.sendMail(message);
    }

    async sendCredentialsToNewModerator(
        email: string,
        password: string,
    ) {
        const message = {
            from: 'kirillgvozd0@gmail.com',
            to: email,
            subject: "Данные для входа в аккаунт модератора",
            text: `Ваши данные для входа в аккаунт модератора: \nЛогин: ${email}\nПароль: ${password}`,
        };

        await this.transporter.sendMail(message);
    }

    async sendReservationOfItemNotification(
        email: string,
        itemName: string,
        userName: string,
    ) {
        const message = {
            from: 'no-reply@example.com',
            to: email,
            subject: `Бронирование товара ${itemName}`,
            text: `Ваш товар ${itemName} хочет купить пользователь ${userName}. 
            Ответьте на его предложение в течении 24 часов или бронь на товар истечёт.`,
        }

        await this.transporter.sendMail(message);
    }

    async sendApprovedReservationNotification(
        email: string,
        itemName: string,
        userName: string,
    ) {
        const message = {
            from: 'no-reply@example.com',
            to: email,
            subject: `Бронирование товара ${itemName} прошло успешно`,
            text: `Здравствуйте, ${userName}. Рады вам сообщить, 
            что бронь товара ${itemName} была успешно подтверждена продавцом.`,
        }

        await this.transporter.sendMail(message);
    }

    async sendRejectReservationNotification(
        email: string,
        itemName: string,
        userName: string,
    ) {
        const message = {
            from: 'no-reply@example.com',
            to: email,
            subject: `Бронирование товара ${itemName} было отклонено`,
            text: `Здравствуйте, ${userName}. К сожалению, бронь товара ${itemName} была отклонена продавцом.`,
        }

        await this.transporter.sendMail(message);
    }

    async sendRemovalOfReservationNotification(
        email: string,
        itemName: string,
        userName: string,
        buyerName: string,
    ) {
        const message = {
            from: 'no-reply@example.com',
            to: email,
            subject: `Бронирование товара ${itemName} было отменено`,
            text: `Здравствуйте, ${userName}. К сожалению, бронь товара ${itemName} была отклонена покупателем ${buyerName}.`,
        }

        await this.transporter.sendMail(message);
    }

    async sendRemovalOfItemMessage(
        email: string,
        itemName: string,
        userName: string,
    ) {
        const message = {
            from: 'no-reply@example.com',
            to: email,
            subject: `Удаление товара ${itemName} с площадки`,
            text: `Здравствуйте, ${userName}. Ваш товар ${itemName} был удалён с площадки Flea Market из-за нарушения
            правил площадки.`,
        }

        await this.transporter.sendMail(message);
    }

    async sendRemovalOfUserMessage(
        email: string,
        userName: string,
    ) {
        const message = {
            from: 'no-reply@example.com',
            to: email,
            subject: `Удаление вашего аккаунта с площадки`,
            text: `Здравствуйте, ${userName}. Ваш аккаунт был удалён с площадки Flea Market из-за нарушения правил площадки.`,
        }

        await this.transporter.sendMail(message);
    }

    async sendReportNotification(
        email: string,
        reportId: number,
    ) {
        const message = {
            from: 'no-reply@example.com',
            to: email,
            subject: `Новая жалоба`,
            text: `Здравствуйте. Вы были выбраны для проверки данной жалобы: http:localhost:4000/report/${reportId}`,
        }

        await this.transporter.sendMail(message);
    }

    async sendAddedToWishlistNotification(
        email: string,
        itemName: string,
        itemId: number,
    ) {
        const message = {
            from: 'no-reply@example.com',
            to: email,
            subject: 'Товар из вашего списка желаний появился на площадке',
            text: `Здравствуйте, товар ${itemName} из вашего списка желаний появился на площадке: http:localhost:4000/item/${itemId}`,
        }

        await this.transporter.sendMail(message);
    }
}
