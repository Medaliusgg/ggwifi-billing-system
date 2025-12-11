package com.ggnetworks.repository;

import com.ggnetworks.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findByProductId(String productId);
    
    Optional<Product> findBySku(String sku);
    
    List<Product> findByCategory(Product.ProductCategory category);
    
    List<Product> findByVisibility(Product.Visibility visibility);
    
    List<Product> findByIsActive(Boolean isActive);
    
    List<Product> findByIsFeatured(Boolean isFeatured);
    
    List<Product> findByCategoryAndIsActive(Product.ProductCategory category, Boolean isActive);
    
    List<Product> findByVisibilityAndIsActive(Product.Visibility visibility, Boolean isActive);
}
