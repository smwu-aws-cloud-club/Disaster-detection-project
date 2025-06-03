package acc.firewatch.cctv.controller;

import acc.firewatch.cctv.entity.Cctv;
import acc.firewatch.cctv.service.CctvExportService;
import acc.firewatch.external.its.TrafficCctvFetcher;
import acc.firewatch.common.exception.CustomException;
import acc.firewatch.common.exception.ErrorCode;
import acc.firewatch.common.response.dto.CustomResponse;
import acc.firewatch.common.response.dto.SuccessStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cctvs/export")
@RequiredArgsConstructor
public class CctvExportController {

    private final TrafficCctvFetcher fetcher;
    private final CctvExportService exportService;

    @PostMapping
    public CustomResponse<?> exportCctvToCsv() {
        try {
            System.out.println("🚀 CCTV 데이터 수집 시작...");
            List<Cctv> cctvs = fetcher.fetchAllCctvsWithAddress();

            String filePath = "src/main/resources/cctv-merged.csv";
            exportService.exportToCsv(cctvs, filePath);

            return CustomResponse.success("✅ CCTV 데이터를 CSV로 저장했습니다. (파일 경로: " + filePath + ")", SuccessStatus.CCTV_CSV_EXPORT);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.CCTV_CSV_SAVE_ERROR);
        }
    }
}
