package com.ggnetworks.repository;

import com.ggnetworks.entity.WebhookReceipt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WebhookReceiptRepository extends JpaRepository<WebhookReceipt, Long> {
    Optional<WebhookReceipt> findByDedupeKey(String dedupeKey);
}


