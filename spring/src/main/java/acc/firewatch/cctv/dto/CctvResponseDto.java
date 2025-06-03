package acc.firewatch.cctv.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class CctvResponseDto {

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GetAllCctvResponseDto{
        private String id;
        private String name;
        private String cctvUrl;
        private String city;
        private String district;
        private String town;
        private boolean status;
    }
}
