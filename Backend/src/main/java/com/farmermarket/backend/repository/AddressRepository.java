package com.farmermarket.backend.repository;

import com.farmermarket.backend.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByBuyerEmail(String email);
}
