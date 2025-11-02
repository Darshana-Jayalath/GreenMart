package com.farmermarket.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.farmermarket.backend.service.NameService;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // allow React frontend
@RequestMapping("/api")
public class NameController {

    @Autowired
    private NameService nameService;

    @PostMapping("/add-name")
    public String addName(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        boolean success = nameService.saveName(name);
        return success ? "Success" : "Failed";
    }
}
