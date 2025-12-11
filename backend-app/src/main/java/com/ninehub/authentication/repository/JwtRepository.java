package com.ninehub.authentication.repository;

import com.ninehub.authentication.entity.Jwt;
import com.ninehub.authentication.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JwtRepository extends JpaRepository<Jwt, Long> {

    Optional<List<Jwt>> findByUserAndDeactivateAndExpired(User user, boolean deactivate, boolean expired);

    Optional<Jwt> findByValue(String value);

    @Query("SELECT j FROM Jwt j WHERE j.refreshToken.refreshTokenValue = :refreshTokenValue")
    Optional<Jwt> findByRefreshTokenRefreshTokenValue(String refreshTokenValue);

    void deleteAllByExpiredAndDeactivate(boolean expired, boolean deactivate);
}