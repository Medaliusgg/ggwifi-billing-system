package com.ggnetworks.service;

import com.ggnetworks.entity.CustomerProfile;
import com.ggnetworks.entity.InternetApplicationForm;
import com.ggnetworks.repository.CustomerProfileRepository;
import com.ggnetworks.repository.InternetApplicationFormRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class InternetApplicationFormService {

    private final InternetApplicationFormRepository applicationFormRepository;
    private final CustomerProfileRepository customerProfileRepository;

    public InternetApplicationForm createApplicationForm(InternetApplicationForm applicationForm) {
        try {
            return applicationFormRepository.save(applicationForm);
        } catch (Exception e) {
            log.error("Failed to create application form", e);
            throw new RuntimeException("Failed to create application form", e);
        }
    }

    public InternetApplicationForm getApplicationFormById(Long id) {
        try {
            return applicationFormRepository.findById(id).orElse(null);
        } catch (Exception e) {
            log.error("Failed to get application form by ID", e);
            return null;
        }
    }

    // Additional methods for AdminCustomerController
    public List<InternetApplicationForm> getApplicationsByCustomerId(Long customerId) {
        // Find applications through user phone number
        CustomerProfile customerProfile = customerProfileRepository.findById(customerId).orElse(null);
        if (customerProfile == null) {
            return new ArrayList<>();
        }
        return applicationFormRepository.findByUserPhoneNumber(customerProfile.getPhoneNumber());
    }
} 