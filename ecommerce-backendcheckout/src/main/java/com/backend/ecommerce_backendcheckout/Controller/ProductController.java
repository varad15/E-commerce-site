package com.backend.ecommerce_backendcheckout.Controller;

import com.backend.ecommerce_backendcheckout.Model.Product;
import com.backend.ecommerce_backendcheckout.Repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ✅ Get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        try {
            List<Product> products = productRepository.findAll();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    // ✅ Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        try {
            ObjectId objectId = new ObjectId(id);
            Optional<Product> productOpt = productRepository.findById(objectId);

            if (productOpt.isPresent()) {
                return ResponseEntity.ok(productOpt.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Product not found", "id", id));
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid ObjectId format", "id", id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Create product
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            Product saved = productRepository.save(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error creating product", "message", e.getMessage()));
        }
    }

    // ✅ Update product
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody Product updatedProduct) {
        try {
            ObjectId objectId = new ObjectId(id);

            if (productRepository.existsById(objectId)) {
                updatedProduct.setId(id);
                productRepository.save(updatedProduct);
                return ResponseEntity.ok(updatedProduct);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Product not found", "id", id));
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid ObjectId format", "id", id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error updating product", "message", e.getMessage()));
        }
    }

    // ✅ Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        try {
            ObjectId objectId = new ObjectId(id);

            if (productRepository.existsById(objectId)) {
                productRepository.deleteById(objectId);
                return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Product not found", "id", id));
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid ObjectId format", "id", id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error deleting product", "message", e.getMessage()));
        }
    }

    // ✅ Update stock quantity
    @PatchMapping("/{id}/stock")
    public ResponseEntity<?> updateStock(@PathVariable String id, @RequestBody Map<String, Object> body) {
        try {
            ObjectId objectId = new ObjectId(id);

            if (!body.containsKey("stockQuantity")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Missing 'stockQuantity' in request body"));
            }

            int newStock;
            try {
                newStock = (int) body.get("stockQuantity");
            } catch (ClassCastException ex) {
                // In case stockQuantity is passed as double or string
                Object val = body.get("stockQuantity");
                if (val instanceof Number) {
                    newStock = ((Number) val).intValue();
                } else {
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Invalid stockQuantity format"));
                }
            }

            Optional<Product> productOpt = productRepository.findById(objectId);
            if (productOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Product not found", "id", id));
            }

            Product product = productOpt.get();
            product.setStockQuantity(newStock);
            productRepository.save(product);

            return ResponseEntity.ok(Map.of(
                    "message", "Stock updated successfully",
                    "productId", id,
                    "newStock", newStock
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid ObjectId format", "id", id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error updating stock", "message", e.getMessage()));
        }
    }

    @PostConstruct
    public void verifyMongoConnection() {
        System.out.println("🟢 MongoDB Product count: " + productRepository.count());
    }

}
