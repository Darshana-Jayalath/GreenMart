package com.farmermarket.backend.controller;

import com.farmermarket.backend.model.Order;
import com.farmermarket.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // -------------------------------------------
    // Buyer places a new order
    // POST /api/orders
    // -------------------------------------------
    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        System.out.println("=== POST /api/orders ===");
        System.out.println("Received order for: " + order.getBuyerEmail());

        Order savedOrder = orderService.placeOrder(order);
        return ResponseEntity.ok(savedOrder);
    }

    // -------------------------------------------
    // Buyer fetches their orders
    // GET /api/orders/buyer/{email}
    // -------------------------------------------
    @GetMapping("/buyer/{email}")
    public ResponseEntity<List<Order>> getBuyerOrders(@PathVariable String email) {
        System.out.println("========================================");
        System.out.println("=== GET /api/orders/buyer/{email} ===");
        System.out.println("Received email parameter: [" + email + "]");
        System.out.println("Email length: " + email.length());
        System.out.println("Email bytes: " + java.util.Arrays.toString(email.getBytes()));
        System.out.println("========================================");

        List<Order> orders = orderService.getBuyerOrders(email);

        System.out.println("Returning " + orders.size() + " orders");
        System.out.println("========================================");

        return ResponseEntity.ok(orders);
    }

    // -------------------------------------------
    // Farmer fetches all pending orders
    // GET /api/orders/pending
    // -------------------------------------------
    @GetMapping("/pending")
    public ResponseEntity<List<Order>> getPendingOrders() {
        List<Order> pendingOrders = orderService.getAllPendingOrders();
        return ResponseEntity.ok(pendingOrders);
    }

    // -------------------------------------------
    // Farmer updates order status (confirm/reject)
    // PUT /api/orders/status/{orderId}?status=confirmed
    // -------------------------------------------
    @PutMapping("/status/{orderId}")
    public ResponseEntity<Order> updateStatus(
            @PathVariable String orderId,
            @RequestParam String status) {

        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        if (updatedOrder == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedOrder);
    }

    // -------------------------------------------
    // Buyer cancels an order
    // DELETE /api/orders/cancel/{orderId}
    // -------------------------------------------
    @DeleteMapping("/cancel/{orderId}")
    public ResponseEntity<Void> cancelOrder(@PathVariable String orderId) {
        boolean cancelled = orderService.cancelOrder(orderId);
        if (!cancelled) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    // -------------------------------------------
    // Fetch order by ID (optional, helpful for testing)
    // GET /api/orders/{orderId}
    // -------------------------------------------
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable String orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    // -------------------------------------------
    // DEBUG: Get ALL orders (remove in production!)
    // GET /api/orders/debug/all
    // -------------------------------------------
    @GetMapping("/debug/all")
    public ResponseEntity<List<Order>> getAllOrdersDebug() {
        System.out.println("=== DEBUG: Fetching ALL orders ===");
        List<Order> allOrders = orderService.getAllOrders();
        System.out.println("Total orders in database: " + allOrders.size());

        allOrders.forEach(order -> {
            System.out.println("Order ID: " + order.getOrderId() +
                    " | Email: [" + order.getBuyerEmail() + "]" +
                    " | Status: " + order.getStatus());
        });

        return ResponseEntity.ok(allOrders);
    }
}