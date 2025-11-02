package com.farmermarket.backend.dto;

import java.math.BigDecimal;

public class OrderItemDTO {
    public Long productId;
    public String productName;
    public String category;
    public BigDecimal price;
    public Integer quantity;
    public String imageUrl;
}
