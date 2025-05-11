package acc.firewatch.config;

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
public class TrafficCctvFetcher {
    private final WebClient client = WebClient.builder()
            .baseUrl("https://openapi.its.go.kr:9443")
            .codecs(config -> config.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Dotenv dotenv = Dotenv.load();
    private final String apiKey = dotenv.get("ITS_API_KEY"); // 🔁 반드시 교체

    public void fetchAndSaveCctvs() throws IOException {
        BufferedWriter writer = new BufferedWriter(new FileWriter("src/main/resources/cctv-data.csv"));
        writer.write("name,latitude,longitude,cctvUrl,type,roadId,resolution,format,time\n");
        System.out.println(apiKey);

        for (double minX = 126.0; minX < 130.0; minX += 1.0) {
            for (double minY = 34.0; minY < 38.0; minY += 1.0) {
                double maxX = minX + 1.0;
                double maxY = minY + 1.0;

                String url = "/cctvInfo?apiKey=" + apiKey +
                        "&type=ex" +
                        "&cctvType=1" +
                        "&minX=" + minX +
                        "&maxX=" + maxX +
                        "&minY=" + minY +
                        "&maxY=" + maxY +
                        "&getType=json";
                System.out.println("▶ 요청 URL: " + url);

                String response = client.get().uri(url).retrieve().bodyToMono(String.class).block();
                System.out.println("▶ 응답: " + response);

                JsonNode items = objectMapper.readTree(response).path("response").path("data");
                System.out.println("▶ CCTV 개수: " + items.size());


                if (!items.isArray()) continue;

                for (JsonNode item : items) {
                    String name = item.path("cctvname").asText().replace(",", " ");
                    double lat = item.path("coordy").asDouble();
                    double lng = item.path("coordx").asDouble();
                    String cctvUrl = item.path("cctvurl").asText();
                    String type = item.path("cctvtype").asText();
                    String roadId = item.path("roadsectionid").asText();
                    String resolution = item.path("cctvresolution").asText();
                    String format = item.path("cctvformat").asText();
                    String time = item.path("filecreatetime").asText();

                    writer.write(String.format("%s,%f,%f,%s,%s,%s,%s,%s,%s\n",
                            name, lat, lng, cctvUrl, type, roadId, resolution, format, time));
                }
            }
        }
        writer.close();
        System.out.println("✅ [1] 도로교통 CCTV 데이터를 CSV로 저장 완료");
    }
}
