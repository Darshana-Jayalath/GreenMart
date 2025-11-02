package com.farmermarket.backend.service;

import com.farmermarket.backend.model.Message;
import com.farmermarket.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository repo;

    public MessageService(MessageRepository repo) {
        this.repo = repo;
    }

    public Message save(Message msg) {
        return repo.save(msg);
    }

    public List<Message> getBuyerMessages(String email) {
        return repo.findByBuyerEmailOrderByCreatedAtAsc(email);
    }

    public List<Message> getAllMessages() {
        return repo.findAll();
    }
}
