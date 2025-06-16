package org.example.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.model.Notification;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${notification.email.sender}")
    private String sender;

    @Value("${notification.email.enabled}")
    private boolean emailEnabled;

    /**
     * Send an email notification
     *
     * @param recipient The email address of the recipient
     * @param subject The email subject
     * @param content The HTML content of the email
     * @return true if the email was sent successfully, false otherwise
     */
    public boolean sendEmail(String recipient, String subject, String content) {
        if (!emailEnabled) {
            log.info("Email sending is disabled. Would have sent email to: {}", recipient);
            return false;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(sender);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(content, true); // true indicates HTML content

            mailSender.send(message);
            log.info("Email sent successfully to: {}", recipient);
            return true;
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", recipient, e.getMessage());
            return false;
        }
    }

    /**
     * Create email content based on notification type
     *
     * @param notification The notification entity
     * @return HTML content for the email
     */
    public String createEmailContent(Notification notification) {
        StringBuilder contentBuilder = new StringBuilder();

        contentBuilder.append("<!DOCTYPE html>")
                .append("<html lang=\"en\">")
                .append("<head>")
                .append("<meta charset=\"UTF-8\">")
                .append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">")
                .append("<style>")
                .append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }")
                .append("h1 { color: #2c3e50; }")
                .append(".notification { background-color: #f8f9fa; border-left: 4px solid #4e73df; padding: 15px; margin-bottom: 20px; }")
                .append(".footer { font-size: 12px; text-align: center; margin-top: 30px; color: #6c757d; }")
                .append("</style>")
                .append("</head>")
                .append("<body>")
                .append("<h1>Task Manager Notification</h1>")
                .append("<div class=\"notification\">")
                .append("<p>").append(notification.getMessage()).append("</p>")
                .append("</div>")
                .append("<div class=\"footer\">")
                .append("<p>This is an automated message from the Task Manager application. Please do not reply to this email.</p>")
                .append("</div>")
                .append("</body>")
                .append("</html>");

        return contentBuilder.toString();
    }
}