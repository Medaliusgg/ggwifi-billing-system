package com.ggnetworks.service;

import com.ggnetworks.entity.ContactMessage;
import com.ggnetworks.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactMessage createContactMessage(ContactMessage contactMessage) {
        try {
            return contactMessageRepository.save(contactMessage);
        } catch (Exception e) {
            log.error("Failed to create contact message", e);
            throw new RuntimeException("Failed to create contact message", e);
        }
    }
} 