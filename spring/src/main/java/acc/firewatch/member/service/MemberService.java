package acc.firewatch.member.service;

import acc.firewatch.config.exception.CustomException;
import acc.firewatch.config.exception.ErrorCode;
import acc.firewatch.member.dto.MemberRequestDto;
import acc.firewatch.member.dto.MemberResponseDto;
import acc.firewatch.member.entity.Address;
import acc.firewatch.member.entity.Member;
import acc.firewatch.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

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
}