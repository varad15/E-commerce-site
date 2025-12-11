package com.backend.ecommerce_backendcheckout.Model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;

@Document(collection = "products")
public class Product {

    @Id
    private ObjectId id;

    private String name;
    private String slug;
    private String description;
    private double price;
    private Double compareAtPrice;
    private int discount;
    private String image;
    private List<String> images;
    private String category;
    private String categoryName;
    private boolean inStock;
    private int stockQuantity;
    private double rating;
    private int reviewCount;
    private boolean featured;
    private List<String> tags;
    private Map<String, Object> specifications;
    private String createdAt;
    private String updatedAt;

    // Getters and setters

    public String getId() {
        return id != null ? id.toHexString() : null;
    }

    // Setter that converts string to ObjectId
    public void setId(String id) {
        this.id = (id != null && ObjectId.isValid(id)) ? new ObjectId(id) : null;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public Double getCompareAtPrice() { return compareAtPrice; }
    public void setCompareAtPrice(Double compareAtPrice) { this.compareAtPrice = compareAtPrice; }

    public int getDiscount() { return discount; }
    public void setDiscount(int discount) { this.discount = discount; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public boolean isInStock() { return inStock; }
    public void setInStock(boolean inStock) { this.inStock = inStock; }

    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public Map<String, Object> getSpecifications() { return specifications; }
    public void setSpecifications(Map<String, Object> specifications) { this.specifications = specifications; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
