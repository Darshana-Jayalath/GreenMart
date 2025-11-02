package com.farmermarket.backend.service;

import com.farmermarket.backend.model.Product;
import com.farmermarket.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public Product saveProduct(String name, Product.Category category, Double price, String description, MultipartFile imageFile) throws IOException {
        Product p = new Product();
        p.setName(name);
        p.setCategory(category);
        p.setPrice(price);
        p.setDescription(description);
        if (imageFile != null && !imageFile.isEmpty()) {
            p.setImage(imageFile.getBytes());
            p.setImageContentType(imageFile.getContentType());
        }
        return repo.save(p);
    }

    public List<Product> listAll() {
        return repo.findAll();
    }

    public Optional<Product> findById(Long id) {
        return repo.findById(id);
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    public Product updateProduct(Long id, String name, Product.Category category, Double price, String description, MultipartFile imageFile) throws IOException {
        Product p = repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        p.setName(name);
        p.setCategory(category);
        p.setPrice(price);
        p.setDescription(description);
        if (imageFile != null && !imageFile.isEmpty()) {
            p.setImage(imageFile.getBytes());
            p.setImageContentType(imageFile.getContentType());
        }
        return repo.save(p);
    }
}
