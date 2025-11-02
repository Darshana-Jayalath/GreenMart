package com.farmermarket.backend.repository;

import com.farmermarket.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find orders by buyer email (case-insensitive for better matching)
    @Query("SELECT o FROM Order o WHERE LOWER(o.buyerEmail) = LOWER(:email)")
    List<Order> findByBuyerEmailIgnoreCase(@Param("email") String email);

    // Alternative: exact match (keep this as backup)
    List<Order> findByBuyerEmail(String email);

    // Find orders by status
    List<Order> findByStatusIgnoreCase(String status);

    // Find order by orderId
    Optional<Order> findByOrderId(String orderId);

    List<Order> findByBuyerEmailContaining(String cleanEmail);
}