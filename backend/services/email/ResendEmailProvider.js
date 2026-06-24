import { Resend } from 'resend';
import EmailProvider from './EmailProvider.js';
import logger from '../../utils/logger.js';

export default class ResendEmailProvider extends EmailProvider {
    constructor() {
        super();
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey || apiKey === 're_your_api_key_here') {
            logger.warn('Email', 'RESEND_API_KEY is not set or invalid. Emails will only be logged.');
            this.resend = null;
        } else {
            this.resend = new Resend(apiKey);
        }
    }

    async sendEmail({ to, subject, html }) {
        if (!this.resend) {
            logger.info('Email (Mock)', `To: ${to} | Subject: ${subject}`);
            return { id: 'mock_id' };
        }

        try {
            let fromAddress = process.env.EMAIL_FROM || 'LeetJudge <onboarding@resend.dev>';
            // Resend does not allow sending *from* gmail.com. Force the testing domain.
            if (fromAddress.includes('@gmail.com')) {
                fromAddress = 'LeetJudge <onboarding@resend.dev>';
            }

            const response = await this.resend.emails.send({
                from: fromAddress,
                to,
                subject,
                html
            });
            
            // Resend SDK returns { data, error } instead of throwing on API errors
            if (response.error) {
                logger.error('Email', `Resend API Error: ${response.error.message}`);
                // Throw a generic error to avoid leaking sensitive API details to the frontend
                throw new Error('Failed to dispatch email. Please try again later.');
            }

            logger.debug('Email', `Successfully sent email to ${to}`);
            return response.data;
        } catch (error) {
            // Check if it's already our generic error
            if (error.message === 'Failed to dispatch email. Please try again later.') {
                throw error;
            }
            logger.error('Email', `Failed to send email to ${to}: ${error.message}`);
            // Mask any unexpected SDK network errors
            throw new Error('An unexpected error occurred while sending the email.');
        }
    }
}
