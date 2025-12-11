package com.backend.ecommerce_backendcheckout.Model;

import lombok.Data;
import java.util.List;

@Data
public class OrderEmailRequest {
    private String to;
    private String customerName;
    private long orderId;
    private double totalAmount;
    private List<Item> items;

    @Data
    public static class Item {
        private String name;
        private int quantity;
        private double price;
    }
}
