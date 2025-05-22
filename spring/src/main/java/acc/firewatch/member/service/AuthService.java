package acc.firewatch.member.service;

import acc.firewatch.config.exception.CustomException;
import acc.firewatch.config.exception.ErrorCode;
import acc.firewatch.config.jwt.JwtTokenProvider;
import acc.firewatch.member.dto.TokenResponse;
import acc.firewatch.member.entity.Member;
import acc.firewatch.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;

    public TokenResponse reissueToken(String refreshToken) {

        // refresh 토큰 유효성 확인
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        // claims에서 memberId 추출
        Long memberId = jwtTokenProvider.parseClaims(refreshToken).get("memberId", Long.class);

        // DB에 저장된 refresh 토큰과 비교
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
        if (!refreshToken.equals(member.getRefreshToken())) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_MISMATCH);
        }

        // 새 토큰 발급 및 저장
        String newAccessToken = jwtTokenProvider.generateToken(member.getPhoneNum(), member.getId());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(member.getPhoneNum(), member.getId());
        member.setRefreshToken(newRefreshToken);
        memberRepository.save(member);

        return new TokenResponse(newAccessToken, newRefreshToken);
    }
}