package acc.firewatch.Cctv.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class VworldCctvCollector {

    private final WebClient webClient = WebClient.builder().baseUrl("https://api.vworld.kr/req/data").build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Dotenv dotenv = Dotenv.load();
    private final String apiKey = dotenv.get("VWORLD_API_KEY");
    private final String domain = dotenv.get("VWORLD_DOMAIN");

    public void exportCctvsToCsv() throws IOException {
        BufferedWriter writer = new BufferedWriter(new FileWriter("src/main/resources/cctv-data.csv"));
        writer.write("name,latitude,longitude\n");

        int page = 1;
        int total = 0;
        while (true) {
            String uri = String.format("?service=data&request=GetFeature&data=LT_P_UTISCCTV&key=%s&domain=%s&size=1000&page=%d&geometry=true",
                    apiKey, domain, page);

            String response = webClient.get().uri(uri).retrieve().bodyToMono(String.class).block();
            JsonNode root = objectMapper.readTree(response);
            JsonNode features = root.path("response").path("result").path("featureCollection").path("features");

            if (!features.isArray() || features.size() == 0) break;

            for (JsonNode feature : features) {
                JsonNode attr = feature.path("properties");
                JsonNode geom = feature.path("geometry").path("coordinates");

                String name = attr.path("cctvname").asText().replace(",", " ");
                double lng = geom.get(0).asDouble();
                double lat = geom.get(1).asDouble();

                writer.write(String.format("%s,%f,%f\n", name, lat, lng));
                total++;
            }
            page++;
        }
        writer.close();
        System.out.println("✅ 총 " + total + "개의 CCTV를 수집하여 CSV로 저장했습니다.");
    }
}
