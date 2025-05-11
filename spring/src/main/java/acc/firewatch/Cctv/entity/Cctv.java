package acc.firewatch.Cctv.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cctv {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double latitude; // 위도
    private double longitude; // 경도

    @Column(length = 1000, nullable = false)
    private String url;
    private String type;
    private String roadId;
    private String resolution;
    private String format;
    private String createdAt;
}
