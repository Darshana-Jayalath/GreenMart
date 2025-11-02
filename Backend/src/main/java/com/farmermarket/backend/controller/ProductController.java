package com.farmermarket.backend.controller;

import com.farmermarket.backend.dto.ProductDTO;
import com.farmermarket.backend.model.Product;
import com.farmermarket.backend.service.ProductService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // Create product
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> createProduct(
            @RequestParam String name,
            @RequestParam Product.Category category,
            @RequestParam Double price,
            @RequestParam(required = false) String description,
            @RequestPart(required = false) MultipartFile image
    ) throws Exception {
        Product p = service.saveProduct(name, category, price, description, image);
        ProductDTO dto = toDTO(p);
        return ResponseEntity.created(URI.create("/api/products/" + p.getId())).body(dto);
    }

    // List all products
    @GetMapping
    public ResponseEntity<List<ProductDTO>> listProducts() {
        List<Product> products = service.listAll();
        List<ProductDTO> dtos = products.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get single product
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        Optional<Product> optionalProduct = service.findById(id);
        if (optionalProduct.isPresent()) {
            Product p = optionalProduct.get();
            return ResponseEntity.ok(toDTO(p));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get product image
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        Optional<Product> optionalProduct = service.findById(id);
        if (optionalProduct.isPresent()) {
            Product p = optionalProduct.get();
            if (p.getImage() == null) {
                return ResponseEntity.notFound().build();
            }
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(p.getImageContentType()));
            headers.setContentLength(p.getImage().length);
            return new ResponseEntity<>(p.getImage(), headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update product
    @PutMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam Product.Category category,
            @RequestParam Double price,
            @RequestParam(required = false) String description,
            @RequestPart(required = false) MultipartFile image
    ) throws Exception {
        Product p = service.updateProduct(id, name, category, price, description, image);
        return ResponseEntity.ok(toDTO(p));
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Convert Product to ProductDTO
    private ProductDTO toDTO(Product p) {
        String imageUrl = (p.getImage() != null) ? "/api/products/" + p.getId() + "/image" : null;
        return new ProductDTO(
                p.getId(),
                p.getName(),
                p.getCategory().name(),
                p.getPrice(),
                p.getDescription(),
                imageUrl
        );
    }
}
