package acc.firewatch.cctv.controller;

import acc.firewatch.cctv.dto.CctvRequestDto;
import acc.firewatch.cctv.dto.CctvResponseDto;
import acc.firewatch.cctv.entity.CctvItem;
import acc.firewatch.cctv.service.CctvDynamoService;
import acc.firewatch.common.exception.CustomException;
import acc.firewatch.common.exception.ErrorCode;
import acc.firewatch.common.response.dto.CustomResponse;
import acc.firewatch.common.response.dto.SuccessStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dynamo/cctvs")
@RequiredArgsConstructor
public class CctvDynamoController {

    private final CctvDynamoService cctvDynamoService;

    // 단건 새로 저장 또는 덮어쓰기
    @PostMapping
    public CustomResponse<String> save(@RequestBody CctvRequestDto requestDto) {
        cctvDynamoService.save(requestDto);
        return CustomResponse.success("cctvItem ID: " + requestDto.getId(), SuccessStatus.DYNAMO_CCTV_SAVE);
    }

    // ID로 단건 조회
    @GetMapping("/{id}")
    public CustomResponse<CctvItem> getById(@PathVariable String id) {
        CctvItem item = cctvDynamoService.getById(id);
        if (item == null) {
            throw new CustomException(ErrorCode.DYNAMO_CCTV_NOT_FOUND);
        }
        return CustomResponse.success(item,SuccessStatus.DYNAMO_CCTV_GET);
    }

    @GetMapping
    public CustomResponse<List<CctvResponseDto>> getAll(
            @RequestParam(required = false) String district) {

        // 검증 안함 → 있는 값이면 조회, 없으면 빈 리스트 반환
        if (district != null && !district.isBlank()) {
            return CustomResponse.success(
                    cctvDynamoService.getByDistrict(district),
                    SuccessStatus.DYNAMO_CCTV_GET
            );
        }

        return CustomResponse.success(
                cctvDynamoService.getAll(),
                SuccessStatus.DYNAMO_CCTV_GET
        );
    }

    // cctv csv -> dynamo 일괄 업로드
    @PostMapping("/import-csv")
    public CustomResponse<?> uploadCsv(@RequestParam(defaultValue = "src/main/resources/cctv-merged.csv") String path) {
        if(cctvDynamoService.uploadCsvToDynamo(path)){
            return CustomResponse.success(SuccessStatus.CSV2DYNAMO_SAVE);
        }
        throw new CustomException(ErrorCode.CSV2DYNAMO_SAVE_FAIL);
    }

    // DynamoDB에 저장된 district 값 조회
    @GetMapping("/districts")
    public CustomResponse<List<String>> getAllDistricts() {
        List<String> districts = cctvDynamoService.getAllDistricts();
        return CustomResponse.success(districts, SuccessStatus.DYNAMO_CCTV_GET);
    }

    // id에 해당하는 레코드 삭제
    @DeleteMapping("/{id}")
    public CustomResponse<Void> deleteCctv(@PathVariable String id) {
        cctvDynamoService.deleteById(id);
        return CustomResponse.success(null, SuccessStatus.DYNAMO_CCTV_DELETE);
    }

    // id에 해당하는 cctvUrl 조회
    @GetMapping("/{id}/stream")
    public CustomResponse<String> getCctvStreamUrl(@PathVariable String id) {
        String streamUrl = cctvDynamoService.getStreamUrlById(id);
        return CustomResponse.success(streamUrl, SuccessStatus.DYNAMO_CCTV_GET);
    }

}
