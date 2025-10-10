package com.ggnetworks.service;

import com.ggnetworks.entity.Feedback;
import com.ggnetworks.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public Feedback createFeedback(Feedback feedback) {
        try {
            return feedbackRepository.save(feedback);
        } catch (Exception e) {
            log.error("Failed to create feedback", e);
            throw new RuntimeException("Failed to create feedback", e);
        }
    }
} 