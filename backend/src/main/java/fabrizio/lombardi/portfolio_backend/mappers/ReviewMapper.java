package fabrizio.lombardi.portfolio_backend.mappers;

import fabrizio.lombardi.portfolio_backend.models.Review;
import fabrizio.lombardi.portfolio_backend.models.dtos.ReviewDto;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {
    public ReviewDto toDto(Review review) {
        return new ReviewDto(review.getId(), review.getAuthor(), review.getStars(), review.getComment(),
                review.getCreationDate());
    }

    public Review toEntity(ReviewDto dto) {
        Review review = new Review();
        review.setId(dto.getId());
        review.setAuthor(dto.getAuthor());
        review.setStars(dto.getStars());
        review.setComment(dto.getComment());
        review.setCreationDate(dto.getCreationDate());
        return review;
    }
}