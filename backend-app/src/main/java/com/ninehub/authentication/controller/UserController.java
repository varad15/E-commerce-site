package com.ninehub.authentication.controller;

import com.ninehub.authentication.entity.User;
import com.ninehub.authentication.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        log.info("Admin fetching all users");
        List<User> users = userService.getAllUser();
        log.info("Returning {} users", users.size());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        log.info("Admin deleting user with id: {}", id);
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        log.info("Admin activating user with id: {}", id);
        userService.activateUserById(id);
        return ResponseEntity.ok(Map.of("message", "User activated successfully"));
    }
}