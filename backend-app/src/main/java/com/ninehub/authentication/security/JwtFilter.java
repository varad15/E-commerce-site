package com.ninehub.authentication.security;

import com.ninehub.authentication.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Service
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = null;
        String username = null;
        boolean isTokenExpired = true;

        final String authorization = request.getHeader("Authorization");

        if (authorization != null && authorization.startsWith("Bearer ")) {
            token = authorization.substring(7);

            try {
                // Try to parse token
                isTokenExpired = jwtService.isTokenExpired(token);
                username = jwtService.extractUsername(token);
            } catch (io.jsonwebtoken.MalformedJwtException e) {
                // Handle fake/invalid tokens - just skip authentication
                log.warn("⚠️ Invalid JWT token format: {}", e.getMessage());
                filterChain.doFilter(request, response);
                return;
            } catch (Exception e) {
                // Handle any other JWT errors
                log.error("❌ Error processing JWT: {}", e.getMessage());
                filterChain.doFilter(request, response);
                return;
            }
        }

        // If token is valid and not expired, authenticate user
        if (!isTokenExpired && username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }

        filterChain.doFilter(request, response);
    }
}