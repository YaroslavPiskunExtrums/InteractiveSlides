import sgMail from '@sendgrid/mail'
import { prettyLog } from '@app/lib/logger.js'
import { registrationTemplate } from './templates/registration.template.js'
import dotenv from 'dotenv'
dotenv.config({ path: process.env.APP_ENV_FILE_PATH || '.env' })

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async (messageData: {
  to: string
  from: string
  subject: string
  text: string
  html: string
}) => {
  try {
    const emailResponse = await sgMail.send(messageData)
    prettyLog('EMAIL HAS SENT', { emailResponse })
    return emailResponse
  } catch (e) {
    prettyLog.error('EMAIL SENDING ERROR', JSON.stringify(e))
  }
}

const sendRegistrationEmail = async (data: {
  email: string
  password: string
  link: string
}): Promise<void> => {
  const messageData = {
    to: "jenni@slidex.ai",
    from: process.env.SENDGRID_NOTIFICATIONS_EMAIL_FROM,
    subject: 'SlideX Registration',
    text: 'You were successfully registered to the SlideX',
    html: registrationTemplate(data),
  }
  await sendEmail(messageData)
}

export const SendGridService = {
  sendRegistrationEmail,
}
