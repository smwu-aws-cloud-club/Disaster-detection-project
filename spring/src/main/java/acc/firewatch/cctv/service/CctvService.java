package acc.firewatch.cctv.service;

import acc.firewatch.cctv.Repository.CctvRepository;
import acc.firewatch.cctv.entity.Cctv;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CctvService {
    private final CctvRepository cctvRepository;

    public void save(Cctv cctv) {
        cctvRepository.save(cctv);
    }
}