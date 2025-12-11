package com.backend.ecommerce_backendcheckout.Controller;

import com.backend.ecommerce_backendcheckout.Model.OrderEmailRequest;
import com.backend.ecommerce_backendcheckout.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "http://localhost:5173")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-order-email")
    public ResponseEntity<String> sendOrderEmail(@RequestBody OrderEmailRequest orderRequest) {
        try {
            emailService.sendOrderConfirmation(orderRequest);
            return ResponseEntity.ok("Order email sent successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        }
    }
}
