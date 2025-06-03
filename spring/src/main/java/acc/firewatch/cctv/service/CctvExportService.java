package acc.firewatch.cctv.service;

import acc.firewatch.cctv.entity.Cctv;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CctvExportService {

    public void exportToCsv(List<Cctv> cctvs, String filePath) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            writer.write("id,name,latitude,longitude,cctvUrl,city,district,town,status\n");

            for (Cctv cctv : cctvs) {
                writer.write(String.format("%d,%s,%.6f,%.6f,%s,%s,%s,%s,%b\n",
                        cctv.getId(),
                        sanitize(cctv.getName()),
                        cctv.getLatitude(),
                        cctv.getLongitude(),
                        sanitize(cctv.getCctvUrl()),
                        sanitize(cctv.getCity()),
                        sanitize(cctv.getDistrict()),
                        sanitize(cctv.getTown()),
                        cctv.isStatus()
                ));
            }

            System.out.println("✅ CSV 저장 완료: " + filePath);
        } catch (IOException e) {
            throw new RuntimeException("CSV 저장 중 오류 발생", e);
        }
    }


    private String sanitize(String input) {
        return input == null ? "" : input.replace(",", " ").replace("\n", " ").trim();
    }
}