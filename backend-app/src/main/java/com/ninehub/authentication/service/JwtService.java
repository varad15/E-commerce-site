package com.ninehub.authentication.service;

import com.ninehub.authentication.entity.Jwt;
import com.ninehub.authentication.entity.RefreshToken;
import com.ninehub.authentication.entity.User;
import com.ninehub.authentication.repository.JwtRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class JwtService {

    @Value("${jwt.secret}")
    private String SECRET;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    private final JwtRepository jwtRepository;

    /**
     * Generate NEW access token and refresh token for a user (used during login)
     * This disables all previous tokens and creates fresh ones
     */
    public Map<String, String> generate(User user) {
        log.info("Generating new tokens for user: {}", user.getEmail());
        this.disableTokens(user);

        Map<String, String> jwtMap = new HashMap<>(this.generateJwt(user));

        RefreshToken refreshToken = RefreshToken.builder()
                .refreshTokenValue(UUID.randomUUID().toString())
                .isExpired(false)
                .createdAt(Instant.now())
                .expiredAt(Instant.now().plus(refreshExpiration, ChronoUnit.MILLIS))
                .build();

        Jwt jwt = Jwt.builder()
                .value(jwtMap.get("bearer"))
                .deactivate(false)
                .expired(false)
                .user(user)
                .refreshToken(refreshToken)
                .build();

        jwtRepository.save(jwt);

        jwtMap.put("refresh-token", refreshToken.getRefreshTokenValue());
        log.info("New tokens generated successfully for user: {}", user.getEmail());
        return jwtMap;
    }

    /**
     * Generate the actual JWT token string with claims
     */
    private Map<String, String> generateJwt(User user) {
        Instant now = Instant.now();
        Instant expirationTime = now.plus(jwtExpiration, ChronoUnit.MILLIS);

        // Create mutable map to include role
        Map<String, Object> claims = new HashMap<>();
        claims.put("firstName", user.getFirstName());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().getRoleType().name()); // ADMIN or USER
        claims.put("sub", user.getEmail());

        String bearer = Jwts.builder()
                .issuedAt(Date.from(now))
                .expiration(Date.from(expirationTime))
                .subject(user.getEmail())
                .claims(claims)
                .signWith(getSignKey())
                .compact();

        return Map.of("bearer", bearer);
    }

    public String extractUsername(String token) {
        return getClaim(token, Claims::getSubject);
    }

    public boolean isTokenExpired(String token) {
        Date expirationDate = getClaim(token, Claims::getExpiration);
        return expirationDate.before(new Date());
    }

    private <T> T getClaim(String token, Function<Claims, T> function) {
        Claims claims = getAllClaims(token);
        return function.apply(claims);
    }

    private Claims getAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Disable all active tokens for a user (used before generating new tokens)
     */
    private void disableTokens(User user) {
        List<Jwt> validJwtList = jwtRepository.findByUserAndDeactivateAndExpired(user, false, false)
                .orElse(Collections.emptyList());

        if (!validJwtList.isEmpty()) {
            log.info("Disabling {} active tokens for user: {}", validJwtList.size(), user.getEmail());
            validJwtList.forEach(jwt -> {
                jwt.setExpired(true);
                jwt.setDeactivate(true);
            });
            jwtRepository.saveAll(validJwtList);
        }
    }

    /**
     * Logout current user by disabling their active token
     */
    public void logout() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Jwt jwt = jwtRepository.findByUserAndDeactivateAndExpired(user, false, false)
                .map(jwtList -> jwtList.get(0))
                .orElse(null);

        if (jwt != null) {
            log.info("Logout user: {}", user.getEmail());
            jwt.setDeactivate(true);
            jwt.setExpired(true);
            jwtRepository.save(jwt);
        }
    }

    /**
     * Clean expired tokens every hour
     */
    @Scheduled(cron = "0 0 */1 * * *")
    public void cleanExpiredTokens() {
        log.info("Cleaning expired tokens");
        jwtRepository.deleteAllByExpiredAndDeactivate(true, true);
    }

    /**
     * Refresh tokens using an existing refresh token
     * This is used when the access token expires but refresh token is still valid
     */
    @Transactional
    public Map<String, String> refreshToken(Map<String, String> refreshRequest) {
        String refreshToken = refreshRequest.get("refresh-token");
        log.info("Attempting to refresh token with refresh token");

        Jwt jwtRefresh = jwtRepository.findByRefreshTokenRefreshTokenValue(refreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (jwtRefresh.getRefreshToken().getExpiredAt().isBefore(Instant.now())) {
            log.warn("Refresh token expired");
            throw new RuntimeException("Refresh token expired");
        }

        log.info("Refresh token valid, generating new tokens for user: {}", jwtRefresh.getUser().getEmail());
        this.disableTokens(jwtRefresh.getUser());
        return this.generate(jwtRefresh.getUser());
    }

    public Jwt loadTokenByValue(String token) {
        return jwtRepository.findByValue(token)
                .orElseThrow(() -> new RuntimeException("Token not found"));
    }

    /**
     * Alias for logout - used by signout endpoint
     */
    public void signOut() {
        logout();
    }
}