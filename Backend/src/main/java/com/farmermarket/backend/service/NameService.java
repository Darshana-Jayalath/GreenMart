package com.farmermarket.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.farmermarket.backend.entity.Name;
import com.farmermarket.backend.repository.NameRepository;

@Service
public class NameService {

    @Autowired
    private NameRepository nameRepository;

    public boolean saveName(String name) {
        try {
            nameRepository.save(new Name(name));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
