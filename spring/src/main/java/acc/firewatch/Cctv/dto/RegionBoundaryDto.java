package acc.firewatch.Cctv.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegionBoundaryDto {
    private String area1;
    private String area2;
    private String area3;
    private double minLat;
    private double maxLat;
    private double minLng;
    private double maxLng;
}
