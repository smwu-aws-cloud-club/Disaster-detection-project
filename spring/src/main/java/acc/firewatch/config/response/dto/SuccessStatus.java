package acc.firewatch.config.response.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SuccessStatus {
    SUCCESS(200,"성공"),

    // auth
    SIGNUP_MEMBER_OK(200,"회원가입 성공"),
    LOGIN_MEMBER_OK(200,"로그인 성공"),
    TOKEN_REISSUE_OK(200,"토큰 재발급 성공"),

    // member
    GET_MY_INFO_OK(200,"회원 정보 조회 성공"),
    UPDATE_MY_INFO_OK(200,"회원 정보 수정 성공"),
    UPDATE_PASSWORD(200,"비밀번호가 성공적으로 변경되었습니다."),
    ;

    private final int code;
    private final String message;
}
