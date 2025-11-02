package com.farmermarket.backend.service;

import com.farmermarket.backend.model.Order;
import com.farmermarket.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepo;

    public OrderService(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    /**
     * Place a new order
     */
    public Order placeOrder(Order order) {
        // Set default values
        order.setStatus("Pending");
        order.setOrderDate(LocalDateTime.now());

        // Debug logging
        System.out.println("╔════════════════════════════════════════╗");
        System.out.println("║     PLACING NEW ORDER                  ║");
        System.out.println("╚════════════════════════════════════════╝");
        System.out.println("Order ID: " + order.getOrderId());
        System.out.println("Buyer Email: [" + order.getBuyerEmail() + "]");
        System.out.println("Buyer Name: " + order.getFirstName() + " " + order.getLastName());
        System.out.println("Status: " + order.getStatus());
        System.out.println("Total: " + order.getTotal());
        System.out.println("Items Count: " + (order.getItems() != null ? order.getItems().size() : 0));

        Order savedOrder = orderRepo.save(order);

        System.out.println("✅ Order saved successfully with DB ID: " + savedOrder.getId());
        System.out.println("════════════════════════════════════════\n");

        return savedOrder;
    }

    /**
     * Get orders by buyer email (with extensive debugging)
     */
    public List<Order> getBuyerOrders(String email) {
        System.out.println("\n╔════════════════════════════════════════╗");
        System.out.println("║   FETCHING ORDERS BY EMAIL             ║");
        System.out.println("╚════════════════════════════════════════╝");
        System.out.println("📧 Requested Email: [" + email + "]");
        System.out.println("📏 Email Length: " + (email != null ? email.length() : "NULL"));

        // Validate email
        if (email == null || email.trim().isEmpty()) {
            System.out.println("❌ ERROR: Email is null or empty!");
            System.out.println("════════════════════════════════════════\n");
            return List.of();
        }

        String cleanEmail = email.trim();
        System.out.println("🧹 Clean Email: [" + cleanEmail + "]");
        System.out.println("📏 Clean Length: " + cleanEmail.length());

        // Get all orders for comparison
        List<Order> allOrders = orderRepo.findAll();
        System.out.println("\n📊 DATABASE STATISTICS:");
        System.out.println("   Total Orders in DB: " + allOrders.size());

        if (allOrders.isEmpty()) {
            System.out.println("⚠️  WARNING: Database is empty! No orders found.");
            System.out.println("════════════════════════════════════════\n");
            return List.of();
        }

        // Show all emails in database
        System.out.println("\n📋 ALL EMAILS IN DATABASE:");
        System.out.println("┌─────────────────────────────────────────────────────────────┐");
        for (int i = 0; i < allOrders.size(); i++) {
            Order order = allOrders.get(i);
            String dbEmail = order.getBuyerEmail();
            boolean matches = dbEmail != null && dbEmail.trim().equalsIgnoreCase(cleanEmail);

            System.out.printf("│ %2d. Order: %-15s │ Email: %-30s │ Match: %s │%n",
                    i + 1,
                    order.getOrderId(),
                    "[" + dbEmail + "]",
                    matches ? "✓" : "✗"
            );
        }
        System.out.println("└─────────────────────────────────────────────────────────────┘");

        // Try multiple search strategies
        List<Order> orders = List.of();

        // Strategy 1: Case-insensitive with trim
        System.out.println("\n🔍 SEARCH STRATEGY 1: Case-insensitive + Trim");
        try {
            orders = orderRepo.findByBuyerEmailIgnoreCase(cleanEmail);
            System.out.println("   Result: " + orders.size() + " order(s) found");
            if (orders.size() > 0) {
                System.out.println("   ✅ SUCCESS with Strategy 1!");
            }
        } catch (Exception e) {
            System.out.println("   ❌ Error: " + e.getMessage());
        }

        // Strategy 2: Exact match (if Strategy 1 failed)
        if (orders.isEmpty()) {
            System.out.println("\n🔍 SEARCH STRATEGY 2: Exact Match");
            try {
                orders = orderRepo.findByBuyerEmail(cleanEmail);
                System.out.println("   Result: " + orders.size() + " order(s) found");
                if (orders.size() > 0) {
                    System.out.println("   ✅ SUCCESS with Strategy 2!");
                }
            } catch (Exception e) {
                System.out.println("   ❌ Error: " + e.getMessage());
            }
        }

        // Strategy 3: Contains search (last resort)
        if (orders.isEmpty()) {
            System.out.println("\n🔍 SEARCH STRATEGY 3: Contains Search");
            try {
                orders = orderRepo.findByBuyerEmailContaining(cleanEmail);
                System.out.println("   Result: " + orders.size() + " order(s) found");
                if (orders.size() > 0) {
                    System.out.println("   ✅ SUCCESS with Strategy 3!");
                }
            } catch (Exception e) {
                System.out.println("   ❌ Error: " + e.getMessage());
            }
        }

        // Display results
        System.out.println("\n📦 FINAL RESULTS:");
        System.out.println("═══════════════════════════════════════════════════════════════");

        if (orders.isEmpty()) {
            System.out.println("❌ NO ORDERS FOUND for email: [" + cleanEmail + "]");
            System.out.println("\n💡 TROUBLESHOOTING TIPS:");
            System.out.println("   1. Check if email has extra spaces in database");
            System.out.println("   2. Verify email case sensitivity");
            System.out.println("   3. Check database column name (@Column annotation)");
            System.out.println("   4. Run SQL: SELECT * FROM orders WHERE buyer_email LIKE '%" + cleanEmail + "%'");
        } else {
            System.out.println("✅ FOUND " + orders.size() + " ORDER(S):");
            System.out.println("┌─────────────────────────────────────────────────────────────┐");
            for (int i = 0; i < orders.size(); i++) {
                Order order = orders.get(i);
                System.out.printf("│ %2d. %-15s │ Status: %-10s │ Items: %2d │ Total: %8.2f │%n",
                        i + 1,
                        order.getOrderId(),
                        order.getStatus(),
                        order.getItems() != null ? order.getItems().size() : 0,
                        order.getTotal()
                );
            }
            System.out.println("└─────────────────────────────────────────────────────────────┘");
        }

        System.out.println("═══════════════════════════════════════════════════════════════\n");

        return orders;
    }

    /**
     * Get all pending orders
     */
    public List<Order> getAllPendingOrders() {
        System.out.println("🔍 Fetching all pending orders...");
        List<Order> pendingOrders = orderRepo.findByStatusIgnoreCase("Pending");
        System.out.println("✅ Found " + pendingOrders.size() + " pending order(s)");
        return pendingOrders;
    }

    /**
     * Update order status
     */
    public Order updateOrderStatus(String orderId, String status) {
        System.out.println("🔄 Updating order status...");
        System.out.println("   Order ID: " + orderId);
        System.out.println("   New Status: " + status);

        Optional<Order> optionalOrder = orderRepo.findByOrderId(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            String oldStatus = order.getStatus();
            order.setStatus(status);
            Order updated = orderRepo.save(order);
            System.out.println("✅ Status updated: " + oldStatus + " → " + status);
            return updated;
        }

        System.out.println("❌ Order not found: " + orderId);
        return null;
    }

    /**
     * Cancel order
     */
    public boolean cancelOrder(String orderId) {
        System.out.println("🗑️  Attempting to cancel order: " + orderId);

        Optional<Order> optionalOrder = orderRepo.findByOrderId(orderId);
        if (optionalOrder.isPresent()) {
            orderRepo.delete(optionalOrder.get());
            System.out.println("✅ Order deleted successfully");
            return true;
        }

        System.out.println("❌ Order not found: " + orderId);
        return false;
    }

    /**
     * Get order by ID
     */
    public Order getOrderById(String orderId) {
        System.out.println("🔍 Fetching order by ID: " + orderId);
        Optional<Order> order = orderRepo.findByOrderId(orderId);

        if (order.isPresent()) {
            System.out.println("✅ Order found");
            return order.get();
        }

        System.out.println("❌ Order not found");
        return null;
    }

    /**
     * DEBUG: Get all orders
     */
    public List<Order> getAllOrders() {
        System.out.println("🔍 DEBUG: Fetching ALL orders from database...");
        List<Order> allOrders = orderRepo.findAll();
        System.out.println("✅ Total orders: " + allOrders.size());

        if (!allOrders.isEmpty()) {
            System.out.println("\n📋 ALL ORDERS SUMMARY:");
            System.out.println("┌──────────────────────────────────────────────────────────────────┐");
            for (int i = 0; i < allOrders.size(); i++) {
                Order order = allOrders.get(i);
                System.out.printf("│ %2d. %-15s │ Email: %-35s │%n",
                        i + 1,
                        order.getOrderId(),
                        "[" + order.getBuyerEmail() + "]"
                );
                System.out.printf("│     Status: %-10s │ Total: LKR %10.2f │ Date: %s │%n",
                        order.getStatus(),
                        order.getTotal(),
                        order.getOrderDate()
                );
                System.out.println("├──────────────────────────────────────────────────────────────────┤");
            }
            System.out.println("└──────────────────────────────────────────────────────────────────┘");
        }

        return allOrders;
    }
}