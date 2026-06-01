package fabrizio.lombardi.portfolio_backend.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import fabrizio.lombardi.portfolio_backend.models.Review;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendNewReviewNotification(Review review) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("fabriziolombardi732@gmail.com");
        message.setSubject("Nuova recensione ricevuta");
        message.setText(
                "Hai ricevuto una nuova recensione da: " + review.getAuthor() + "\n" +
                        "Stelle: " + review.getStars() + "\n" +
                        "Commento: " + review.getComment());
        mailSender.send(message);
    }
}
