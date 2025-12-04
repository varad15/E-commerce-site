package com.ninehub.authentication.service;

import com.ninehub.authentication.dto.RegisterDto;
import com.ninehub.authentication.entity.*;
import com.ninehub.authentication.entity.enums.RoleType;
import com.ninehub.authentication.repository.RoleRepository;
import com.ninehub.authentication.repository.UserRepository;
import com.ninehub.authentication.repository.ValidationRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@Slf4j
@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private ValidationRepository validationRepository;
    private BCryptPasswordEncoder passwordEncoder;
    private ValidationService validationService;
    private NotificationService notificationService;

    private static final Pattern EMAIL_REGEX = Pattern.compile(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );

    /**
     * NEW METHOD: Register user with RegisterDto (INACTIVE by default)
     */
    public User inscription(RegisterDto registerDto) {
        // Validate email format
        if (!EMAIL_REGEX.matcher(registerDto.getEmail()).matches()) {
            throw new RuntimeException("Invalid email format");
        }

        // Check if email already exists
        if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
            throw new RuntimeException("This email already exists");
        }

        // Encode password
        String encodedPassword = passwordEncoder.encode(registerDto.getPassword());

        // Get USER role from database
        Role userRole = roleRepository.findByRoleType(RoleType.USER)
                .orElseThrow(() -> new RuntimeException("Role USER not found"));

        // Create user (NOT ACTIVE until email verification)
        User user = User.builder()
                .firstName(registerDto.getFirstName())
                .email(registerDto.getEmail())
                .password(encodedPassword)
                .role(userRole)
                .isActif(false)  // IMPORTANT: User must verify email first
                .build();

        user = userRepository.save(user);
        log.info("User created (inactive): {}", user.getEmail());

        return user;
    }

    /**
     * NEW METHOD: Send activation code to user's email
     */
    public void activateAccountRequest(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate and save validation code
        validationService.saveValidation(user);

        log.info("Activation code sent to: {}", email);
    }

    /**
     * UPDATED METHOD: Activate account with email and code
     */
    @Transactional
    public void activateAccount(String email, String code) {
        // Find validation record by code
        Validation validation = validationRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid activation code"));

        // Verify code matches the email
        if (!validation.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Invalid activation code for this email");
        }

        // Check if code is expired
        if (Instant.now().isAfter(validation.getExpiration())) {
            throw new RuntimeException("Activation code has expired. Please request a new one.");
        }

        // Activate the user
        User user = validation.getUser();
        user.setActif(true);
        userRepository.save(user);

        // Delete validation record after successful activation
        validationRepository.delete(validation);

        log.info("User {} activated successfully", email);
    }

    /**
     * OLD METHOD: Keep for backward compatibility (if used elsewhere)
     */
    public void activateAccount(Map<String, String> activation) {
        Validation validation = this.validationService.readWithTheCode(activation.get("code"));
        if (Instant.now().isAfter(validation.getExpiredAt())) {
            throw new RuntimeException("Your code has expired");
        }
        User userActivated = this.userRepository.findById(validation.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Unknown user"));

        userActivated.setActif(true);
        this.userRepository.save(userActivated);
    }

    /**
     * NEW METHOD: Check if email already exists
     */
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    /**
     * KEEP: Original register method (for backward compatibility)
     */
    public User register(User user) {
        if (!EMAIL_REGEX.matcher(user.getEmail()).matches()) {
            throw new RuntimeException("Invalid email format");
        }

        // Check if user exists
        Optional<User> optionalUser = this.userRepository.findByEmail(user.getEmail());
        if (optionalUser.isPresent()) {
            throw new RuntimeException("This email already exists");
        }

        String cryptedPassword = this.passwordEncoder.encode(user.getPassword());
        user.setPassword(cryptedPassword);

        // Create role
        Role userRole = new Role();
        userRole.setRoleType(RoleType.USER);

        if (user.getRole() != null && user.getRole().getRoleType().equals(RoleType.ADMIN)) {
            userRole.setRoleType(RoleType.ADMIN);
            // If admin, auto-activate account
            user.setActif(true);
        }

        user.setRole(userRole);
        user = this.userRepository.save(user);

        // Send validation code for regular users
        if (user.getRole() != null && user.getRole().getRoleType().equals(RoleType.USER)) {
            this.validationService.saveValidation(user);
        }

        return user;
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole().getRoleType() == RoleType.ADMIN) {
            throw new RuntimeException("Cannot delete admin user");
        }

        userRepository.deleteById(userId);
        log.info("User deleted: {}", userId);
    }

    /**
     * Activate user by ID (Admin only)
     */
    public void activateUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActif(true);
        userRepository.save(user);
        log.info("User activated by admin: {}", userId);
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with this email"));
    }

    public void modifyPassword(Map<String, String> parameters) {
        User user = this.loadUserByUsername(parameters.get("email"));
        this.validationService.saveValidation(user);
    }

    public void newPassword(Map<String, String> parameters) {
        try {
            User user = this.loadUserByUsername(parameters.get("email"));
            Validation validation = this.validationService.readWithTheCode(parameters.get("code"));
            if (validation.getUser().getEmail().equals(user.getEmail())) {
                String cryptedPassword = this.passwordEncoder.encode(parameters.get("password"));
                user.setPassword(cryptedPassword);
                this.userRepository.save(user);
            }
        } catch (UsernameNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public List<User> getAllUser() {
        final Iterable<User> userIterable = userRepository.findAll();
        List<User> userList = new ArrayList<>();
        for (User user : userIterable) {
            userList.add(user);
        }
        return userList;
    }
}