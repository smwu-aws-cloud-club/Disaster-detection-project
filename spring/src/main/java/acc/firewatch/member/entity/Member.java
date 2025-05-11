package acc.firewatch.member.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String phoneNum;

    @Column(nullable = false)
    private String password;

    @Embedded
    private Address address;

    @Column(nullable = false)
    private boolean verified;
}

