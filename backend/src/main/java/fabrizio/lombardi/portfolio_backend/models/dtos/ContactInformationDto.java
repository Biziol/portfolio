package fabrizio.lombardi.portfolio_backend.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ContactInformationDto {
    private long id;
    private String fieldName;
    private String value;
    private String link;
}