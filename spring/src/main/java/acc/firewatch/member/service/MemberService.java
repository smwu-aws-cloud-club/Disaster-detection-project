package acc.firewatch.member.service;

import acc.firewatch.config.exception.CustomException;
import acc.firewatch.config.exception.ErrorCode;
import acc.firewatch.config.jwt.JwtTokenProvider;
import acc.firewatch.member.dto.LoginRequestDto;
import acc.firewatch.member.dto.LoginResponseDto;
import acc.firewatch.member.dto.MemberRequestDto;
import acc.firewatch.member.dto.MemberResponseDto;
import acc.firewatch.member.entity.Address;
import acc.firewatch.member.entity.Member;
import acc.firewatch.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    public MemberResponseDto signUp(MemberRequestDto dto) {

        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new CustomException(ErrorCode.PASSWORD_CONFIRM_MISMATCH);
        }

        if (memberRepository.existsByPhoneNum(dto.getPhoneNum())) {
            throw new CustomException(ErrorCode.ALREADY_EXIST_MEMBER);
        }

        Member member = Member.builder()
                .name(dto.getName())
                .phoneNum(dto.getPhoneNum())
                .password(passwordEncoder.encode(dto.getPassword()))
                .address(Address.builder()
                        .city(dto.getCity())
                        .district(dto.getDistrict())
                        .detail(dto.getDetail())
                        .build())
                .verified(false)
                .build();

        Member saved = memberRepository.save(member);

        return MemberResponseDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .phoneNum(saved.getPhoneNum())
                .verified(saved.isVerified())
                .city(saved.getAddress().getCity())
                .district(saved.getAddress().getDistrict())
                .detail(saved.getAddress().getDetail())
                .build();
    }

    // 로그인
    public LoginResponseDto login(LoginRequestDto dto) {
        Optional<Member> optional = memberRepository.findByPhoneNum(dto.getPhoneNum());

        if (optional.isEmpty() || !passwordEncoder.matches(dto.getPassword(), optional.get().getPassword())) {
            throw new CustomException(ErrorCode.LOGIN_FAILED);
        }

        Member member = optional.get();
        String token = jwtTokenProvider.generateToken(member.getPhoneNum(), member.getId());

        return LoginResponseDto.builder()
                .jwtToken(token)
                .name(member.getName())
                .memberId(member.getId())
                .build();
    }

    // 회원 정보 조회
    public MemberResponseDto getMyInfo(String phoneNum) {
        Member member = memberRepository.findByPhoneNum(phoneNum)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_MEMBER));

        return MemberResponseDto.builder()
                .id(member.getId())
                .name(member.getName())
                .phoneNum(member.getPhoneNum())
                .city(member.getAddress().getCity())
                .district(member.getAddress().getDistrict())
                .detail(member.getAddress().getDetail())
                .build();
    }

}