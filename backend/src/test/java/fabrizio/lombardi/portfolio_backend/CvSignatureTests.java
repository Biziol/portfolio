package fabrizio.lombardi.portfolio_backend;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import javax.imageio.ImageIO;
import fabrizio.lombardi.portfolio_backend.repositories.CvSignatureRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpMethod;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CvSignatureTests {
    @Autowired MockMvc mvc;
    @Autowired CvSignatureRepository repository;
    private static final String URL = "/api/cv/signature";

    @BeforeEach
    void clean() { repository.deleteAll(); }

    private MockMultipartFile png(int width) throws Exception {
        var output = new ByteArrayOutputStream();
        ImageIO.write(new BufferedImage(width, 10, BufferedImage.TYPE_INT_ARGB), "png", output);
        return new MockMultipartFile("image", "firma.png", "image/png", output.toByteArray());
    }

    @Test
    void signatureAndChosenDateArePublicAndPersistAcrossReplacements() throws Exception {
        mvc.perform(get(URL)).andExpect(status().isNoContent());
        mvc.perform(multipart(HttpMethod.PUT, URL).file(png(100)).param("signedOn", "2026-10-16")
                        .with(user("admin").roles("ADMIN")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.signedOn").value("2026-10-16"));
        mvc.perform(get(URL)).andExpect(status().isOk())
                .andExpect(jsonPath("$.imageDataUrl").value(org.hamcrest.Matchers.startsWith("data:image/png;base64,")))
                .andExpect(jsonPath("$.signedOn").value("2026-10-16"));
        mvc.perform(multipart(HttpMethod.PUT, URL).file(png(200)).param("signedOn", "2026-10-17")
                        .with(user("admin").roles("ADMIN"))).andExpect(status().isOk());
        assertEquals(1, repository.count());
        assertEquals("2026-10-17", repository.findById(1L).orElseThrow().getSignedOn().toString());
        mvc.perform(delete(URL).with(user("admin").roles("ADMIN"))).andExpect(status().isNoContent());
        mvc.perform(get(URL)).andExpect(status().isNoContent());
    }

    @Test
    void onlyAdminsCanChangeOrDeleteSignature() throws Exception {
        mvc.perform(multipart(HttpMethod.PUT, URL).file(png(100)).param("signedOn", "2026-10-16"))
                .andExpect(status().isForbidden());
        mvc.perform(multipart(HttpMethod.PUT, URL).file(png(100)).param("signedOn", "2026-10-16")
                        .with(user("viewer").roles("USER"))).andExpect(status().isForbidden());
        mvc.perform(delete(URL).with(user("viewer").roles("USER"))).andExpect(status().isForbidden());
        assertEquals(0, repository.count());
    }

    @Test
    void rejectsInvalidImagesAndDatesWithoutLosingTheExistingSignature() throws Exception {
        mvc.perform(multipart(HttpMethod.PUT, URL).file(png(100)).param("signedOn", "2026-10-16")
                        .with(user("admin").roles("ADMIN"))).andExpect(status().isOk());
        String original = repository.findById(1L).orElseThrow().getImageDataUrl();
        for (var invalid : new MockMultipartFile[]{
                new MockMultipartFile("image", "fake.png", "image/png", "not an image".getBytes()),
                new MockMultipartFile("image", "large.png", "image/png", new byte[1_048_577]),
                png(4001)}) {
            mvc.perform(multipart(HttpMethod.PUT, URL).file(invalid).param("signedOn", "2026-10-16")
                            .with(user("admin").roles("ADMIN"))).andExpect(status().isBadRequest());
        }
        mvc.perform(multipart(HttpMethod.PUT, URL).file(png(100)).param("signedOn", "invalid")
                        .with(user("admin").roles("ADMIN"))).andExpect(status().isBadRequest());
        assertEquals(original, repository.findById(1L).orElseThrow().getImageDataUrl());
    }
}
