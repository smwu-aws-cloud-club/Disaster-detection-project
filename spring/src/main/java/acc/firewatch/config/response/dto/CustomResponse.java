package acc.firewatch.config.response.dto;

import acc.firewatch.config.exception.ErrorCode;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomResponse<T> {
    private final int code;
    private final String message;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final T data;

    public static <T> CustomResponse<T> success(T data, SuccessStatus status) {
        return new CustomResponse<>(status.getCode(), status.getMessage(), data);
    }

    public static CustomResponse<Void> success(SuccessStatus status) {
        return new CustomResponse<>(status.getCode(), status.getMessage(), null);
    }

    public static CustomResponse<Object> failure(ErrorCode errorCode) {
        return new CustomResponse<>(errorCode.getCode(), errorCode.getMessage(), null);
    }

    public static CustomResponse<Object> failure(int code, String message) {
        return new CustomResponse<>(code, message, null);
    }
}