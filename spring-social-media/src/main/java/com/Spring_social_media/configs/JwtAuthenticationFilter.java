package com.Spring_social_media.configs;

import com.Spring_social_media.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import jakarta.servlet.http.Cookie;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
        JwtService jwtService,
        UserDetailsService userDetailsService,
        HandlerExceptionResolver handlerExceptionResolver
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final Cookie[] cookies = request.getCookies();
        String access_cookie = null;

        if ("/auth/logout".equals(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        if (cookies == null) {
            filterChain.doFilter(request, response);
            return;
        }

        for (Cookie cookie : cookies) {
            if ("access_token".equals(cookie.getName())) {
                access_cookie = cookie.getValue();
            }
        }
        
        if (access_cookie == null) {
            filterChain.doFilter(request, response);
            return;
        } 

        
        try {
            final String jwt = access_cookie;
            final String userEmail = jwtService.extractUsername(jwt);
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (userEmail != null && authentication == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } 
            }

            filterChain.doFilter(request, response);
        } catch (Exception exception) {
            response.setStatus(401);
            handlerExceptionResolver.resolveException(request, response, null, exception);
        }
    }
}
