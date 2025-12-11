package com.ninehub.authentication.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class NotificationService {

    private final JavaMailSender javaMailSender;

    public void sendActivationEmail(String to, String firstName, String activationCode) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("noreply@dishup.com");
            helper.setTo(to);
            helper.setSubject("Account Activation - DishUp");

            String htmlContent = buildActivationEmailHtml(firstName, activationCode);
            helper.setText(htmlContent, true); // true = HTML content

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send activation email", e);
        }
    }

    private String buildActivationEmailHtml(String firstName, String activationCode) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
                <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding: 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                                <tr>
                                    <td style="text-align: center;">
                                        <h1 style="color: #2E86C1; margin-bottom: 20px;">Welcome to TechStore!</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 16px; color: #333; line-height: 1.6;">
                                        <p>Hi <strong>%s</strong>,</p>
                                        <p>Thank you for registering with us! We're excited to have you on board.</p>
                                        <p>To complete your registration, please use the activation code below:</p>
                                        
                                        <div style="background-color: #f0f8ff; border-left: 4px solid #2E86C1; padding: 15px; margin: 20px 0;">
                                            <p style="font-size: 32px; color: #2E86C1; font-weight: bold; margin: 0; text-align: center; letter-spacing: 5px;">%s</p>
                                        </div>
                                        
                                        <p>This code will expire in <strong>15 minutes</strong>.</p>
                                        <p>If you didn't create an account, please ignore this email.</p>
                                        <p style="margin-top: 30px;">Best regards,</p>
                                        <p style="color: #2E86C1; font-weight: bold; font-size: 18px;">The TechStore Team</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 20px; border-top: 1px solid #eee; margin-top: 20px;">
                                        <p style="color: #888888; font-size: 12px; text-align: center; margin: 0;">
                                            This is an automated email. Please do not reply to this message.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(firstName, activationCode);
    }
}