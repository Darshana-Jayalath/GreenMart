package com.farmermarket.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {
    public String orderId;
    public String buyerEmail;
    public String firstName;
    public String lastName;
    public String phone;
    public String province;
    public String district;
    public String city;
    public String address;
    public String payment;
    public BigDecimal deliveryFee;
    public BigDecimal total;
    public String status;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime orderDate;

    public List<OrderItemDTO> items;
}
