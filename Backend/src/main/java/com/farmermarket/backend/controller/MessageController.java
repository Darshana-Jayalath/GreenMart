package com.farmermarket.backend.controller;

import com.farmermarket.backend.model.Message;
import com.farmermarket.backend.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    private final MessageService service;
    private static final String UPLOAD_DIR = "uploads/messages/";

    public MessageController(MessageService service) {
        this.service = service;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @RequestParam("buyerName") String buyerName,
            @RequestParam("buyerEmail") String buyerEmail,
            @RequestParam("senderRole") String senderRole,
            @RequestParam(value = "subject", required = false) String subject,
            @RequestParam(value = "message", required = false) String message,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            String imagePath = null;

            // ✅ Handle image upload
            if (image != null && !image.isEmpty()) {
                String contentType = image.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity.badRequest().body("Only image files are allowed.");
                }

                // Ensure upload directory exists
                File dir = new File(UPLOAD_DIR);
                if (!dir.exists()) dir.mkdirs();

                // Save with unique name
                String uniqueName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + uniqueName);
                Files.write(path, image.getBytes());

                // Store relative path for frontend
                imagePath = "/uploads/messages/" + uniqueName;
            }

            // Create message object
            Message msg = new Message();
            msg.setBuyerName(buyerName);
            msg.setBuyerEmail(buyerEmail);
            msg.setSenderRole(senderRole);
            msg.setSubject(subject);
            msg.setMessage(message);
            msg.setImagePath(imagePath);

            Message saved = service.save(msg);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error sending message: " + e.getMessage());
        }
    }

    @GetMapping("/buyer/{email}")
    public ResponseEntity<List<Message>> getBuyerMessages(@PathVariable String email) {
        return ResponseEntity.ok(service.getBuyerMessages(email));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Message>> getAllMessages() {
        return ResponseEntity.ok(service.getAllMessages());
    }
}
