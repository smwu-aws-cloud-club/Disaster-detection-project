package acc.firewatch.cctv.service;

import acc.firewatch.cctv.dto.CctvRequestDto;
import acc.firewatch.cctv.dto.CctvResponseDto;
import acc.firewatch.cctv.entity.CctvItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CctvDynamoService {

    private final DynamoDbEnhancedClient enhancedClient;
    private static final String TABLE_NAME = "Cctv";

    // 	ID로 단건 조회
    private DynamoDbTable<CctvItem> getTable() {
        return enhancedClient
                .table(TABLE_NAME, TableSchema.fromBean(CctvItem.class));
    }

    // 단건 새로 저장 또는 덮어쓰기
    public void save(CctvRequestDto.SaveCctvRequestDto requestDto) {
        DynamoDbTable<CctvItem> table = enhancedClient.table("Cctv", TableSchema.fromBean(CctvItem.class));

        CctvItem item = CctvItem.builder()
                .id(requestDto.getId()) // DynamoDB는 RDBMS의 AUTO_INCREMENT 같은 기능을 제공하지 않기 때문에, id 값을 직접 생성하거나 관리헤야 함
                .name(requestDto.getName())
                .latitude(requestDto.getLatitude())
                .longitude(requestDto.getLongitude())
                .cctvUrl(requestDto.getCctvUrl())
                .city(requestDto.getCity())
                .district(requestDto.getDistrict())
                .town(requestDto.getTown())
                .status(false)
                .build();

        getTable().putItem(item);
    }

    // ID로 단건 조회
    public CctvItem getById(String id) {
        return getTable().getItem(r -> r.key(k -> k.partitionValue(id)));
    }

    // 전체 CCTV 아이템 조회
    public List<CctvResponseDto.GetAllCctvResponseDto> getAll() {
        List<CctvResponseDto.GetAllCctvResponseDto> results = new ArrayList<>();
        getTable().scan().items().forEach(cctv -> {
            results.add(CctvResponseDto.GetAllCctvResponseDto.builder()
                    .id(cctv.getId())
                    .name(cctv.getName())
                    .cctvUrl(cctv.getCctvUrl())
                    .city(cctv.getCity())
                    .district(cctv.getDistrict())
                    .town(cctv.getTown())
                    .status(cctv.isStatus())
                    .build());
        });

        return results;
    }

    // 파라미터 district(군/구)에 해당하는 전체 cctv 아이템 조회
    public List<CctvResponseDto.GetAllCctvResponseDto> getByDistrict(String district) {
        return getTable().scan().items().stream()
                .filter(item -> district.equals(item.getDistrict()))
                .map(item -> CctvResponseDto.GetAllCctvResponseDto.builder()
                        .id(item.getId())
                        .name(item.getName())
                        .cctvUrl(item.getCctvUrl())
                        .city(item.getCity())
                        .district(item.getDistrict())
                        .town(item.getTown())
                        .status(item.isStatus())
                        .build()
                )
                .toList();
    }

    // cctv csv -> dynamo 일괄 업로드
    public boolean uploadCsvToDynamo(String filePath) {
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            reader.readLine(); // skip header

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",", -1);
                if (parts.length < 9) continue;


                CctvItem item = CctvItem.builder()
                        .id(parts[0])
                        .name(parts[1])
                        .latitude(Double.parseDouble(parts[2]))
                        .longitude(Double.parseDouble(parts[3]))
                        .cctvUrl(parts[4])
                        .city(parts[5])
                        .district(parts[6])
                        .town(parts[7])
                        .status(Boolean.parseBoolean(parts[8]))
                        .build();

                getTable().putItem(item);
            }

            log.info("✅ CSV 데이터를 DynamoDB에 성공적으로 업로드했습니다.");
            return true;
        } catch (Exception e) {
            log.error("❌ CSV → Dynamo 업로드 중 오류 발생: {}", e.getMessage(), e);
            return false;
        }
    }
}