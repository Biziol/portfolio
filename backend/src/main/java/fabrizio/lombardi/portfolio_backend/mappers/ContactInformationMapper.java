package fabrizio.lombardi.portfolio_backend.mappers;

import fabrizio.lombardi.portfolio_backend.models.ContactInformation;
import fabrizio.lombardi.portfolio_backend.models.dtos.ContactInformationDto;
import org.springframework.stereotype.Component;

@Component
public class ContactInformationMapper {
    public ContactInformationDto toDto(ContactInformation contactInformation) {
        return new ContactInformationDto(
                contactInformation.getId(),
                contactInformation.getFieldName(),
                contactInformation.getValue(),
                contactInformation.getLink());
    }

    public ContactInformation toEntity(ContactInformationDto dto) {
        ContactInformation contactInformation = new ContactInformation();
        contactInformation.setId(dto.getId());
        contactInformation.setFieldName(dto.getFieldName());
        contactInformation.setValue(dto.getValue());
        contactInformation.setLink(dto.getLink());
        return contactInformation;
    }
}