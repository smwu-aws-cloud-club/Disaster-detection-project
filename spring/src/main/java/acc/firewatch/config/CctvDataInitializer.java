package acc.firewatch.config;

import acc.firewatch.Cctv.entity.Cctv;
import acc.firewatch.Cctv.service.CctvService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.FileReader;

@Component
@RequiredArgsConstructor
public class CctvDataInitializer implements CommandLineRunner {
    private final TrafficCctvFetcher fetcher;
    private final CctvService cctvService;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 [2] CCTV 정보 수집 시작");
        fetcher.fetchAndSaveCctvs();
        System.out.println("✅ [2] CCTV 수집 완료 → CSV 저장됨");

        System.out.println("🚀 [3] CSV 기반 DB 등록 시작");

        BufferedReader reader = new BufferedReader(new FileReader("src/main/resources/cctv-data.csv"));
        String line;
        reader.readLine(); // skip header

        while ((line = reader.readLine()) != null) {
            String[] parts = line.split(",", -1); // 빈 필드 포함
            if (parts.length < 9) continue;

            // 0:name, 1:latitude, 2:longitude, 3:cctvUrl, 4:type, 5:roadId, 6: resolution, 7:format, 8:time
            Cctv cctv = Cctv.builder()
                    .name(parts[0])
                    .latitude(Double.parseDouble(parts[1]))
                    .longitude(Double.parseDouble(parts[2]))
                    .url(parts[3])
                    .type(parts[4])
                    .roadId(parts[5])
                    .resolution(parts[6])
                    .format(parts[7])
                    .createdAt(parts[8])
                    .build();
            cctvService.save(cctv);
        }
        reader.close();

        System.out.println("✅ [3] CCTV DB 저장 완료");
    }
}
