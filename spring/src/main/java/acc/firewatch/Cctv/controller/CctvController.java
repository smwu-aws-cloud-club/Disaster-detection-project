package acc.firewatch.Cctv.controller;

import acc.firewatch.Cctv.dto.RegionBoundaryDto;
import acc.firewatch.Cctv.entity.Cctv;
import acc.firewatch.Cctv.service.CctvService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cctv")
@RequiredArgsConstructor
public class CctvController {

    private final CctvService cctvService;

    @GetMapping("/region-boundaries")
    public ResponseEntity<List<RegionBoundaryDto>> getRegionBoundaries() {
        return ResponseEntity.ok(cctvService.getRegionBoundaries());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Cctv>> searchInBox(
            @RequestParam double minLat,
            @RequestParam double maxLat,
            @RequestParam double minLng,
            @RequestParam double maxLng) {
        return ResponseEntity.ok(cctvService.findCctvsInBox(minLat, maxLat, minLng, maxLng));
    }
}
