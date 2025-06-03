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
import java.util.Set;

@RestController
@RequestMapping("/api/dynamo/cctvs")
@RequiredArgsConstructor
public class CctvDynamoController {

    private final CctvDynamoService cctvDynamoService;
    private static final Set<String> ALLOWED_DISTRICTS = Set.of(
            "강남구", "서초구", "송파구", "종로구", "용산구"
    );

    // 단건 새로 저장 또는 덮어쓰기
    @PostMapping
    public CustomResponse<String> save(@RequestBody CctvRequestDto.SaveCctvRequestDto requestDto) {
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
    public CustomResponse<List<CctvResponseDto.GetAllCctvResponseDto>> getAll(
            @RequestParam(required = false) String district) {

        // 파라미터 district(군/구)에 해당하는 전체 cctv 아이템 조회
        if (district != null && !district.isBlank()) {

            // district가 있으면 검증
            if (!ALLOWED_DISTRICTS.contains(district)) {
                throw new CustomException(ErrorCode.INVALID_DISTRICT);
            }
            return CustomResponse.success(
                    cctvDynamoService.getByDistrict(district),
                    SuccessStatus.DYNAMO_CCTV_GET
            );
        }

        // 모든 CCTV 목록 조회
        return CustomResponse.success(
                cctvDynamoService.getAll(),
                SuccessStatus.DYNAMO_CCTV_GET
        );
    }

    // cctv csv -> dynamo 일괄 업로드
    @PostMapping("/upload")
    public CustomResponse<?> uploadCsv(@RequestParam(defaultValue = "src/main/resources/cctv-merged.csv") String path) {
        if(cctvDynamoService.uploadCsvToDynamo(path)){
            return CustomResponse.success(SuccessStatus.CSV2DYNAMO_SAVE);
        }
        throw new CustomException(ErrorCode.CSV2DYNAMO_SAVE_FAIL);
    }
}
