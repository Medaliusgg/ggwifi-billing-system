package com.ggnetworks.repository;

import com.ggnetworks.entity.WebhookProcessing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WebhookProcessingRepository extends JpaRepository<WebhookProcessing, Long> {
    
    Optional<WebhookProcessing> findByWebhookId(String webhookId);
    
    boolean existsByWebhookId(String webhookId);
    
    @Query("SELECT w FROM WebhookProcessing w WHERE w.orderId = :orderId AND w.paymentStatus = :status ORDER BY w.processedAt DESC")
    Optional<WebhookProcessing> findLatestByOrderIdAndStatus(@Param("orderId") String orderId, @Param("status") String status);
    
    long countByProcessedAndGateway(Boolean processed, String gateway);
}

