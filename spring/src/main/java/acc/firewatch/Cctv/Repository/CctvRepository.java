package acc.firewatch.Cctv.Repository;

import acc.firewatch.Cctv.dto.RegionBoundaryDto;
import acc.firewatch.Cctv.entity.Cctv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CctvRepository extends JpaRepository<Cctv, Long> {
    @Query("""
    SELECT new acc.firewatch.Cctv.dto.RegionBoundaryDto(
        c.area1, c.area2, c.area3,
        MIN(c.latitude), MAX(c.latitude),
        MIN(c.longitude), MAX(c.longitude)
    )
    FROM Cctv c
    GROUP BY c.area1, c.area2, c.area3
""")
    List<RegionBoundaryDto> findRegionBoundaries();

    List<Cctv> findByLatitudeBetweenAndLongitudeBetween(double minLat, double maxLat, double minLng, double maxLng);
}
