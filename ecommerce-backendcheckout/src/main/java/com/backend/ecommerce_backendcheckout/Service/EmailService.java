package com.backend.ecommerce_backendcheckout.Service;


import com.backend.ecommerce_backendcheckout.Model.OrderEmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOrderConfirmation(OrderEmailRequest order) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(order.getTo());
        message.setSubject("Order Confirmation - #" + order.getOrderId());
        message.setText(
                "Hello " + order.getCustomerName() + ",\n\n" +
                        "Thank you for your purchase!\n\n" +
                        "Order Total: ₹" + order.getTotalAmount() + "\n\n" +
                        "Items:\n" + order.getItems().toString() + "\n\n" +
                        "Best Regards,\nEcoShop Team"
        );

        mailSender.send(message);
    }
}
