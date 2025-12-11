package com.ninehub.authentication.service;

import com.ninehub.authentication.entity.User;
import com.ninehub.authentication.entity.Validation;
import com.ninehub.authentication.repository.ValidationRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Slf4j
@Service
@AllArgsConstructor
public class ValidationService {

    private ValidationRepository validationRepository;
    private NotificationService notificationService;

    @Transactional
    public void saveValidation(User user) {
        // Generate random 6-digit code
        String code = String.format("%06d", new Random().nextInt(999999));

        // Create validation entity
        Validation validation = new Validation();
        validation.setUser(user);
        validation.setCode(code);
        validation.setCreatedAt(Instant.now());
        validation.setExpiredAt(Instant.now().plus(15, ChronoUnit.MINUTES));

        // Save to database
        validationRepository.save(validation);

        // Send activation email
        notificationService.sendActivationEmail(
                user.getEmail(),
                user.getFirstName(),
                code
        );

        log.info("Activation code generated and sent to: {}", user.getEmail());
    }

    public Validation readWithTheCode(String code) {
        return validationRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid or expired code"));
    }
}