package acc.firewatch.config.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    TEST_ERROR_CODE(400, "응답 테스트 실패입니다."),

    // auth
    ALREADY_EXIST_MEMBER(400,"이미 가입된 전화번호(멤버)입니다."),
    PASSWORD_CONFIRM_MISMATCH(400,"비밀번호와 비밀번호 확인이 일치하지 않습니다.")
    ;

    private final int code;
    private final String message;
}