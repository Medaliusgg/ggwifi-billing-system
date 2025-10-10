package com.ggnetworks.service;

import com.ggnetworks.entity.Promotion;
import com.ggnetworks.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public List<Promotion> getActivePromotions() {
        try {
            return promotionRepository.findByIsActiveTrueAndStartDateBeforeAndEndDateAfter(
                    LocalDateTime.now(), LocalDateTime.now());
        } catch (Exception e) {
            log.error("Failed to get active promotions", e);
            return List.of();
        }
    }

    public Promotion getPromotionById(Long id) {
        try {
            return promotionRepository.findByIdAndDeletedAtIsNull(id).orElse(null);
        } catch (Exception e) {
            log.error("Failed to get promotion by ID", e);
            return null;
        }
    }
} 