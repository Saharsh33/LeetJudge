/**
 * Abstract Base Class defining the Email Provider Interface.
 * Any new email service (like SendGrid, AWS SES) should extend this class.
 */
export default class EmailProvider {
    /**
     * Sends an email.
     * @param {Object} options - Email options
     * @param {string} options.to - Recipient email address
     * @param {string} options.subject - Subject line
     * @param {string} options.html - HTML body
     * @returns {Promise<any>}
     */
    async sendEmail({ to, subject, html }) {
        throw new Error("sendEmail() must be implemented by subclass");
    }
}
