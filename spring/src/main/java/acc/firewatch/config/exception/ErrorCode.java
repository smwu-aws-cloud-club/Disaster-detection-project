package acc.firewatch.config.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    TEST_ERROR_CODE(400, "응답 테스트 실패입니다."),

    // auth
    ALREADY_EXIST_MEMBER(400,"이미 가입된 전화번호(멤버)입니다."),
    PASSWORD_CONFIRM_MISMATCH(400,"비밀번호와 비밀번호 확인이 일치하지 않습니다."),
    LOGIN_FAILED(400,"전화번호 또는 비밀번호가 일치하지 않습니다."),

    // member
    NOT_FOUND_MEMBER(404,"회원 정보를 찾을 수 없습니다."),
    PASSWORD_MISMATCH(400,"현재 비밀번호가 일치하지 않습니다."),

    // jwt
    NOT_FOUND_JWT_SECRET(404, "Jwt Secret 키를 찾을 수 없습니다. .env 파일에 설정해주세요."),
    TOKEN_VALIDATE_FAILED(400,"Jwt Token이 유효하지 않습니다."),
    ;

    private final int code;
    private final String message;
}