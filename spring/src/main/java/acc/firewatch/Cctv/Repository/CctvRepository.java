package acc.firewatch.Cctv.Repository;

import acc.firewatch.Cctv.entity.Cctv;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CctvRepository extends JpaRepository<Cctv, Long> {
}