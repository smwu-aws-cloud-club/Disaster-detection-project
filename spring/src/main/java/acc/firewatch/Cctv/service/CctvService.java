package acc.firewatch.Cctv.service;

import acc.firewatch.Cctv.Repository.CctvRepository;
import acc.firewatch.Cctv.dto.RegionBoundaryDto;
import acc.firewatch.Cctv.entity.Cctv;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CctvService {

    private final CctvRepository cctvRepository;
    private final ReverseGeocodingService reverseGeocodingService;

    public void registerCctv(String name, double lat, double lng) {
        Map<String, String> region = reverseGeocodingService.getRegionFromCoords(lat, lng);
        Cctv cctv = new Cctv();
        cctv.setName(name);
        cctv.setLatitude(lat);
        cctv.setLongitude(lng);
        cctv.setArea1(region.get("area1"));
        cctv.setArea2(region.get("area2"));
        cctv.setArea3(region.get("area3"));
        cctvRepository.save(cctv);
    }

    public List<RegionBoundaryDto> getRegionBoundaries() {
        return cctvRepository.findRegionBoundaries();
    }

    public List<Cctv> findCctvsInBox(double minLat, double maxLat, double minLng, double maxLng) {
        return cctvRepository.findByLatitudeBetweenAndLongitudeBetween(minLat, maxLat, minLng, maxLng);
    }
}
