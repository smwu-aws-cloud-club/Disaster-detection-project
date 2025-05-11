package acc.firewatch.Cctv.service;

import io.github.cdimascio.dotenv.Dotenv;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReverseGeocodingService {

    private final Dotenv dotenv = Dotenv.load();
    private final String clientId = dotenv.get("NAVER_CLIENT_ID");
    private final String clientSecret = dotenv.get("NAVER_CLIENT_SECRET");

    private final WebClient naverWebClient;

    public Map<String, String> getRegionFromCoords(double lat, double lng) {
        if (clientId == null || clientSecret == null) {
            throw new IllegalStateException("naver api key가 .env에 존재하지 않습니다.");
        }

        String coords = lng + "," + lat;

        Map<String, Object> response = naverWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("coords", coords)
                        .queryParam("orders", "admcode")
                        .queryParam("output", "json")
                        .build())
                .header("X-NCP-APIGW-API-KEY-ID", clientId)
                .header("X-NCP-APIGW-API-KEY", clientSecret)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
        Map<String, Object> region = (Map<String, Object>) results.get(0).get("region");

        return Map.of(
                "area1", ((Map<String, String>) region.get("area1")).get("name"),
                "area2", ((Map<String, String>) region.get("area2")).get("name"),
                "area3", ((Map<String, String>) region.get("area3")).get("name")
        );
    }
}
