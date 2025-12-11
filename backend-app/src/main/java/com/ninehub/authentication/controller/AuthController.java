package com.ninehub.authentication.controller;

import com.ninehub.authentication.dto.AuthentificationDto;
import com.ninehub.authentication.entity.User;
import com.ninehub.authentication.service.JwtService;
import com.ninehub.authentication.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.ninehub.authentication.dto.RegisterDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping
@Tag(name="Authentication", description = "Endpoint for authentication and token management")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterDto registerDto, HttpServletRequest request) {
        log.info("Registration attempt for email: {}", registerDto.getEmail());

        if (userService.existsByEmail(registerDto.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        User user = userService.inscription(registerDto);
        userService.activateAccountRequest(user.getEmail());

        log.info("Registration successful for: {}. Activation code sent.", registerDto.getEmail());

        return ResponseEntity.ok(Map.of(
                "message", "Registration successful! Please check your email for the activation code.",
                "email", user.getEmail()
        ));
    }

    @PostMapping("/activate")
    public ResponseEntity<?> activateAccount(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        log.info("Activation attempt for email: {}", email);

        try {
            userService.activateAccount(email, code);
            log.info("Account activated successfully for: {}", email);

            return ResponseEntity.ok(Map.of(
                    "message", "Account activated successfully! You can now login."
            ));
        } catch (RuntimeException e) {
            log.error("Activation failed for {}: {}", email, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Permit to user to get connected on his/her account")
    public Map<String, String> login(@RequestBody AuthentificationDto authentificationDto){
        log.info("Login attempt for user: {}", authentificationDto.username());

        final Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authentificationDto.username(), authentificationDto.password())
        );

        if (authenticate.isAuthenticated()){
            User user = (User) authenticate.getPrincipal();
            log.info("User authenticated successfully: {}", user.getEmail());

            return this.jwtService.generate(user);
        }

        log.warn("Authentication failed for user: {}", authentificationDto.username());
        return null;
    }

    @PostMapping("/refresh/token")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(jwtService.refreshToken(request));
    }

    @PostMapping("/password/update")
    @Operation(summary = "Update password", description = "Update user password")
    public void updatePassword(@RequestBody Map<String, String> password){
        this.userService.modifyPassword(password);
        log.info("Password modify successful");
    }

    @PostMapping("/password/new")
    @Operation(summary = "Create password", description = "Create a new password")
    public void newPassword(@RequestBody Map<String, String> password){
        this.userService.newPassword(password);
        log.info("New Password created successful");
    }

    @PostMapping("/signout")
    public ResponseEntity<?> signOut() {
        jwtService.signOut();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}