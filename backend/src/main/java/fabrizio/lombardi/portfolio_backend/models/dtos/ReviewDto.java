package fabrizio.lombardi.portfolio_backend.models.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewDto {
    private long id;
    private String author;
    private Integer stars;
    private String comment;
    private LocalDateTime creationDate;
}