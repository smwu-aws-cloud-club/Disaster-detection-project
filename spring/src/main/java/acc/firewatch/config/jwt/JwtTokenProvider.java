package acc.firewatch.config.jwt;

import acc.firewatch.common.exception.CustomException;
import acc.firewatch.common.exception.ErrorCode;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Getter
public class JwtTokenProvider {

    private String secret;
    private Key key;
    private static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60; // 60분
    private static final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7일

    @PostConstruct
    public void init() {
        Dotenv dotenv = Dotenv.load();
        this.secret = dotenv.get("JWT_SECRET_KEY");
        if(this.secret == null || secret.isEmpty()) {
            throw new CustomException(ErrorCode.NOT_FOUND_JWT_SECRET);
        }

        this.key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
    }

    public String generateToken(String phoneNum, Long memberId) {
        return createToken(phoneNum, memberId, ACCESS_TOKEN_EXPIRATION);
    }

    public String generateRefreshToken(String phoneNum, Long memberId) {
        return createToken(phoneNum, memberId, REFRESH_TOKEN_EXPIRATION);
    }

    private String createToken(String phoneNum, Long memberId, long expiration) {
        Claims claims = Jwts.claims().setSubject(phoneNum);
        claims.put("memberId", memberId);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try{
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new CustomException(ErrorCode.JWT_EXPIRED);
        } catch (MalformedJwtException e) {
            throw new CustomException(ErrorCode.JWT_PARSING_FAILED);
        } catch (SignatureException e) {
            throw new CustomException(ErrorCode.INVALID_JWT_TOKEN);
        } catch (JwtException | IllegalArgumentException e) {
            throw new CustomException(ErrorCode.JWT_PARSING_FAILED);
        }
    }

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
