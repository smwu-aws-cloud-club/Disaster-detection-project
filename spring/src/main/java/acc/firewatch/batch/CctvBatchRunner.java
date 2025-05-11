package acc.firewatch.batch;

import acc.firewatch.Cctv.service.CctvService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.FileReader;

@Component
@RequiredArgsConstructor
public class CctvBatchRunner implements CommandLineRunner {

    private final CctvService cctvService;

    @Override
    public void run(String... args) throws Exception {
        BufferedReader reader = new BufferedReader(new FileReader("src/main/resources/cctv-data.csv"));
        String line;

        while ((line = reader.readLine()) != null) {
            String[] parts = line.split(",");
            String name = parts[0];
            double lat = Double.parseDouble(parts[1]);
            double lng = Double.parseDouble(parts[2]);

            cctvService.registerCctv(name, lat, lng);
        }

        reader.close();
    }
}
