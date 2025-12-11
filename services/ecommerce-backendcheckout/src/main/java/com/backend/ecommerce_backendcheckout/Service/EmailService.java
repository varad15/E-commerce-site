package com.backend.ecommerce_backendcheckout.Service;

import com.backend.ecommerce_backendcheckout.Model.OrderEmailRequest;
import com.backend.ecommerce_backendcheckout.Model.OrderEmailRequest.Item;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOrderConfirmation(OrderEmailRequest order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");

            helper.setTo(order.getTo());
            helper.setSubject("Your TechStore Order #" + order.getOrderId());

            String html = buildOrderEmailHtml(order);
            helper.setText(html, true); // send as HTML

            mailSender.send(message);
            System.out.println("Order confirmation email sent successfully");
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send order email: " + e.getMessage(), e);
        }
    }

    private String buildOrderEmailHtml(OrderEmailRequest order) {
        StringBuilder itemsTable = new StringBuilder();

        List<Item> items = order.getItems(); // uses your typed inner class
        if (items != null) {
            for (Item item : items) {
                String name = item.getName();
                int quantity = item.getQuantity();
                double price = item.getPrice();
                double lineTotal = price * quantity;

                itemsTable.append("<tr>")
                        .append("<td style='padding:8px 12px; border-bottom:1px solid #eef2f7; font-size:14px; color:#1f2933;'>")
                        .append(escapeHtml(name))
                        .append("</td>")
                        .append("<td style='padding:8px 12px; border-bottom:1px solid #eef2f7; font-size:14px; text-align:center; color:#52606d;'>")
                        .append(quantity)
                        .append("</td>")
                        .append("<td style='padding:8px 12px; border-bottom:1px solid #eef2f7; font-size:14px; text-align:right; color:#52606d;'>₹")
                        .append(String.format("%.2f", price))
                        .append("</td>")
                        .append("<td style='padding:8px 12px; border-bottom:1px solid #eef2f7; font-size:14px; text-align:right; color:#1f2933; font-weight:600;'>₹")
                        .append(String.format("%.2f", lineTotal))
                        .append("</td>")
                        .append("</tr>");
            }
        }

        String formattedDate = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm"));

        // getTotalAmount is primitive double in your model
        double totalAmount = order.getTotalAmount();

        String customerName = order.getCustomerName() != null
                ? order.getCustomerName()
                : "Customer";

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>")
                .append("<html lang='en'>")
                .append("<head>")
                .append("<meta charset='UTF-8' />")
                .append("<title>Your TechStore Order Confirmation</title>")
                .append("</head>")
                .append("<body style=\"margin:0; padding:0; background-color:#f4f5f7; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;\">")

                .append("<table role='presentation' width='100%' cellspacing='0' cellpadding='0' style='background-color:#f4f5f7; padding:24px 0;'>")
                .append("<tr><td align='center'>")

                .append("<table role='presentation' width='600' cellspacing='0' cellpadding='0' ")
                .append("style='background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 10px 25px rgba(15,23,42,0.08);'>")

                // Header
                .append("<tr><td style='background:#2563eb; padding:20px 32px; text-align:left;'>")
                .append("<h1 style='margin:0; font-size:22px; color:#ffffff;'>TechStore</h1>")
                .append("<p style='margin:4px 0 0; font-size:13px; color:rgba(255,255,255,0.85);'>Thank you for shopping with us!</p>")
                .append("</td></tr>")

                // Body
                .append("<tr><td style='padding:24px 32px;'>")
                .append("<p style='margin:0 0 8px; font-size:16px; color:#1f2933;'>Hi ")
                .append(escapeHtml(customerName))
                .append(",</p>")
                .append("<p style='margin:0 0 16px; font-size:14px; color:#52606d;'>")
                .append("Thank you for your order! We have received it and are getting it ready for you.")
                .append("</p>")

                // Order highlight box
                .append("<table role='presentation' width='100%' cellspacing='0' cellpadding='0' ")
                .append("style='margin:16px 0; background-color:#eff6ff; border-radius:6px; border-left:4px solid #2563eb;'>")
                .append("<tr><td style='padding:16px 20px;'>")
                .append("<div style='font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#2563eb; font-weight:600; margin-bottom:4px;'>")
                .append("Order Confirmation</div>")
                .append("<div style='font-size:24px; font-weight:700; color:#111827; letter-spacing:0.08em;'>#")
                .append(order.getOrderId())
                .append("</div>")
                .append("<div style='margin-top:6px; font-size:13px; color:#52606d;'>Placed on <span style='font-weight:600;'>")
                .append(formattedDate)
                .append("</span></div>")
                .append("</td></tr></table>")

                // Items table
                .append("<h2 style='font-size:15px; margin:16px 0 8px; color:#111827;'>Order Details</h2>")
                .append("<table role='presentation' width='100%' cellspacing='0' cellpadding='0' ")
                .append("style='border-collapse:collapse; background-color:#f9fafb; border-radius:6px; overflow:hidden;'>")
                .append("<thead><tr style='background-color:#e5e7eb;'>")
                .append("<th align='left' style='padding:8px 12px; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; color:#4b5563;'>Item</th>")
                .append("<th align='center' style='padding:8px 12px; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; color:#4b5563;'>Qty</th>")
                .append("<th align='right' style='padding:8px 12px; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; color:#4b5563;'>Price</th>")
                .append("<th align='right' style='padding:8px 12px; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; color:#4b5563;'>Total</th>")
                .append("</tr></thead>")
                .append("<tbody>")
                .append(itemsTable)
                .append("</tbody></table>")

                // Total
                .append("<table role='presentation' width='100%' cellspacing='0' cellpadding='0' style='margin-top:16px;'>")
                .append("<tr>")
                .append("<td align='right' style='font-size:14px; color:#52606d;'>Order Total:</td>")
                .append("<td align='right' style='width:120px; font-size:20px; color:#111827; font-weight:700;'>₹")
                .append(String.format("%.2f", totalAmount))
                .append("</td>")
                .append("</tr>")
                .append("</table>")

                // CTA
                .append("<div style='text-align:center; margin:24px 0 8px;'>")
                .append("<a href='http://localhost:3000/orders' ")
                .append("style='display:inline-block; background-color:#2563eb; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding:10px 20px; border-radius:999px;'>")
                .append("View your order</a>")
                .append("</div>")

                .append("<p style='margin:8px 0 0; font-size:12px; color:#9aa5b1; text-align:center;'>")
                .append("If you didn’t make this purchase, please contact our support immediately.")
                .append("</p>")

                .append("</td></tr>") // end body

                // Footer
                .append("<tr><td style='background-color:#f9fafb; padding:16px 32px; text-align:center;'>")
                .append("<p style='margin:0; font-size:12px; color:#9aa5b1;'>© ")
                .append(LocalDateTime.now().getYear())
                .append(" TechStore. All rights reserved.</p>")
                .append("</td></tr>")

                .append("</table>")   // inner
                .append("</td></tr></table>") // outer
                .append("</body></html>");

        return html.toString();
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
