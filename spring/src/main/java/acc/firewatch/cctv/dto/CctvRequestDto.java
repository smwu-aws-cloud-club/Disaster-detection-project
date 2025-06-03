package acc.firewatch.cctv.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class CctvRequestDto {

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SaveCctvRequestDto{
        private String id;
        private String name;
        private double latitude;
        private double longitude;
        private String cctvUrl;
        private String city;
        private String district;
        private String town;
    }

}
