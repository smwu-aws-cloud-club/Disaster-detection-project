package acc.firewatch.Cctv.service;

import acc.firewatch.Cctv.Repository.CctvRepository;
import acc.firewatch.Cctv.entity.Cctv;
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