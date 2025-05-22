package acc.firewatch.member.controller;

import acc.firewatch.config.response.dto.CustomResponse;
import acc.firewatch.config.response.dto.SuccessStatus;
import acc.firewatch.member.dto.*;
import acc.firewatch.member.repository.MemberRepository;
import acc.firewatch.member.service.AuthService;
import acc.firewatch.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;
    private final AuthService authService;
    private final MemberRepository memberRepository;

    @PostMapping("/auth/signup")
    public CustomResponse<MemberResponseDto> signUp(@RequestBody MemberRequestDto requestDto) {
        MemberResponseDto responseDto = memberService.signUp(requestDto);
        return CustomResponse.success(responseDto, SuccessStatus.SIGNUP_MEMBER_OK);
    }

    @PostMapping("/auth/login")
    public CustomResponse<LoginResponseDto> login(@RequestBody LoginRequestDto requestDto) {
        LoginResponseDto responseDto = memberService.login(requestDto);
        return CustomResponse.success(responseDto, SuccessStatus.LOGIN_MEMBER_OK);
    }

    @PostMapping("/auth/reissue")
    public CustomResponse<TokenResponse> reissue(@RequestBody TokenReissueRequest request) {
        TokenResponse response = authService.reissueToken(request.getRefreshToken());
        return CustomResponse.success(response, SuccessStatus.TOKEN_REISSUE_OK);
    }

    @PostMapping("/auth/logout")
    public CustomResponse<?> logout() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String phoneNum = (String) auth.getPrincipal();
        memberService.logout(phoneNum);
        return CustomResponse.success(SuccessStatus.LOGOUT_MEMBER_OK);
    }

    @GetMapping("/members/me")
    public CustomResponse<MemberResponseDto> getMyInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String phoneNum = (String) auth.getPrincipal(); // Jwt에서 설정한 값

        return CustomResponse.success(memberService.getMyInfo(phoneNum), SuccessStatus.GET_MY_INFO_OK);
    }

    @PatchMapping("/members/me")
    public CustomResponse<MemberResponseDto> updateMyInfo(@RequestBody MemberUpdateRequestDto requestDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String phoneNum = (String) auth.getPrincipal();
        MemberResponseDto responseDto = memberService.updateMyInfo(phoneNum, requestDto);
        return CustomResponse.success(responseDto, SuccessStatus.UPDATE_MY_INFO_OK);
    }

    @PatchMapping("/members/me/password")
    public CustomResponse<?> changePassword(@RequestBody PasswordChangeRequestDto dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String phoneNum = (String) auth.getPrincipal();

        memberService.changePassword(phoneNum, dto);
        return CustomResponse.success(SuccessStatus.UPDATE_PASSWORD);
    }
}