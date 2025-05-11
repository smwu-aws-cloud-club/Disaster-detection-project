package acc.firewatch.member.controller;

import acc.firewatch.config.response.dto.CustomResponse;
import acc.firewatch.config.response.dto.SuccessStatus;
import acc.firewatch.member.dto.MemberRequestDto;
import acc.firewatch.member.dto.MemberResponseDto;
import acc.firewatch.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @PostMapping("/signup")
    public CustomResponse<MemberResponseDto> signUp(@RequestBody MemberRequestDto requestDto) {
        MemberResponseDto responseDto = memberService.signUp(requestDto);
        return CustomResponse.success(responseDto, SuccessStatus.SIGNUP_MEMBER_OK);
    }
}