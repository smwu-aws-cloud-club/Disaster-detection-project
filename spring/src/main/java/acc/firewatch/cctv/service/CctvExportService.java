package acc.firewatch.cctv.service;

import acc.firewatch.cctv.entity.Cctv;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CctvExportService {

    public void exportToCsv(List<Cctv> cctvs, String filePath) {
        AtomicInteger cnt = new AtomicInteger(1); // 순번 카운터

        // district가 비어 있는 CCTV ID들을 수집
        List<Long> skippedIds = cctvs.stream()
                .filter(cctv -> cctv.getDistrict() == null || cctv.getDistrict().trim().isEmpty())
                .map(Cctv::getId)
                .collect(Collectors.toList());

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            writer.write("id,name,latitude,longitude,cctvUrl,city,district,town,status\n");

            // 유효한 district가 있는 CCTV만 CSV에 기록
            cctvs.stream()
                    .filter(cctv -> cctv.getDistrict() != null && !cctv.getDistrict().trim().isEmpty())
                    .forEach(cctv -> {
                        try {
                            writer.write(String.format("%s,%s,%.6f,%.6f,%s,%s,%s,%s,%b\n",
                                    cnt.getAndIncrement(),
                                    sanitize(cctv.getName()),
                                    cctv.getLatitude(),
                                    cctv.getLongitude(),
                                    sanitize(cctv.getCctvUrl()),
                                    sanitize(cctv.getCity()),
                                    sanitize(cctv.getDistrict()),
                                    sanitize(cctv.getTown()),
                                    cctv.isStatus()
                            ));
                        } catch (IOException e) {
                            throw new RuntimeException("CSV 쓰기 중 오류 발생", e);
                        }
                    });

            System.out.println("✅ CSV 저장 완료: " + filePath);
        } catch (IOException e) {
            throw new RuntimeException("CSV 저장 중 오류 발생", e);
        }

        // 누락된 ID 로그 출력
        if (!skippedIds.isEmpty()) {
            System.out.println("⚠️ district가 비어 있어 제외된 CCTV name:");
            skippedIds.forEach(name -> System.out.println(" - " + name));
        }
    }

    private String sanitize(String input) {
        return input == null ? "" : input.replace(",", " ").replace("\n", " ").trim();
    }
}
