package com.farmermarket.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmermarket.backend.entity.Name;

public interface NameRepository extends JpaRepository<Name, Long> { }
