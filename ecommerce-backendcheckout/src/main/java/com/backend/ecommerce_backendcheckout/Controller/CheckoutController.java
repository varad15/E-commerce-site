package com.backend.ecommerce_backendcheckout.Controller;

import com.backend.ecommerce_backendcheckout.Model.Product;
import com.backend.ecommerce_backendcheckout.Repository.ProductRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class CheckoutController {

    @Autowired
    private ProductRepository productRepository;

    // ✅ PATCH endpoint to update product stock
//    @PatchMapping("/{id}/stock")
//    public ResponseEntity<String> updateStock(@PathVariable String id, @RequestBody Map<String, Object> body) {
//        try {
//            // ✅ Clean the ID if frontend added timestamp suffix (e.g., -1764936733931)
//            if (id.contains("-")) {
//                id = id.split("-")[0];
//            }
//
//            // ✅ Log incoming request for debugging
//            System.out.println("🧾 Received stock update request for product ID: " + id);
//
//            // ✅ Extract and validate stockQuantity from request body
//            Object stockValue = body.get("stockQuantity");
//            if (stockValue == null) {
//                return ResponseEntity.badRequest().body("Missing 'stockQuantity' field in request body");
//            }
//
//            int newStock;
//            try {
//                newStock = (stockValue instanceof Integer)
//                        ? (int) stockValue
//                        : Integer.parseInt(stockValue.toString());
//            } catch (NumberFormatException e) {
//                return ResponseEntity.badRequest().body("Invalid stockQuantity format");
//            }
//
//            // ✅ Find product by ID
//            ObjectId objectId = new ObjectId(id);
//            Optional<Product> productOpt = productRepository.findById(objectId);
//            if (productOpt.isEmpty()) {
//                System.out.println("❌ Product not found for ID: " + id);
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
//            }
//
//            // ✅ Update stock quantity
//            Product product = productOpt.get();
//            product.setStockQuantity(newStock);
//            productRepository.save(product);
//
//            System.out.println("✅ Stock updated successfully for " + product.getName() + " to " + newStock);
//            return ResponseEntity.ok("Stock updated successfully");
//
//        } catch (Exception e) {
//            System.out.println("❌ Error updating stock: " + e.getMessage());
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error updating stock: " + e.getMessage());
//        }
//    }
}
