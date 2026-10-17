package fabrizio.lombardi.portfolio_backend.services;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.Optional;
import javax.imageio.ImageIO;
import fabrizio.lombardi.portfolio_backend.models.CvSignature;
import fabrizio.lombardi.portfolio_backend.repositories.CvSignatureRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CvSignatureService {
    private final CvSignatureRepository repository;
    public record Signature(String imageDataUrl, LocalDate signedOn) {}

    public CvSignatureService(CvSignatureRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Optional<Signature> get() {
        return repository.findById(1L).map(entity -> new Signature(entity.getImageDataUrl(), entity.getSignedOn()));
    }

    @Transactional
    public Signature save(MultipartFile image, LocalDate signedOn) {
        if (image.isEmpty() || image.getSize() > 1_048_576 || signedOn == null) {
            throw invalidImage();
        }
        try (var stream = ImageIO.createImageInputStream(new ByteArrayInputStream(image.getBytes()))) {
            var readers = ImageIO.getImageReaders(stream);
            if (!readers.hasNext()) throw invalidImage();
            var reader = readers.next();
            BufferedImage decoded;
            try {
                String format = reader.getFormatName();
                if (!format.equalsIgnoreCase("PNG") && !format.equalsIgnoreCase("JPEG")) throw invalidImage();
                reader.setInput(stream);
                int width = reader.getWidth(0), height = reader.getHeight(0);
                if (width < 1 || height < 1 || width > 4000 || height > 2000 || (long) width * height > 4_000_000) {
                    throw invalidImage();
                }
                decoded = reader.read(0);
            } finally {
                reader.dispose();
            }
            // Re-encode actual pixels so uploaded metadata is not published in the CV API.
            var output = new ByteArrayOutputStream();
            ImageIO.write(decoded, "png", output);
            if (output.size() > 1_048_576) throw invalidImage();
            var entity = new CvSignature();
            entity.setImageDataUrl("data:image/png;base64," + Base64.getEncoder().encodeToString(output.toByteArray()));
            entity.setSignedOn(signedOn);
            repository.save(entity);
            return new Signature(entity.getImageDataUrl(), signedOn);
        } catch (IOException exception) {
            throw invalidImage();
        }
    }

    @Transactional
    public void delete() {
        repository.findById(1L).ifPresent(repository::delete);
    }

    private ResponseStatusException invalidImage() {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Carica una firma PNG o JPEG fino a 1 MB, massimo 4000 × 2000 pixel e 4 megapixel, con la data.");
    }
}
