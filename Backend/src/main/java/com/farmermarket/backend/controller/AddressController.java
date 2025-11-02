package com.farmermarket.backend.controller;

import com.farmermarket.backend.model.Address;
import com.farmermarket.backend.repository.AddressRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/address")
@CrossOrigin(origins = "*") // allow requests from frontend
public class AddressController {

    private final AddressRepository addressRepository;

    // Constructor injection
    public AddressController(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    // Get address by buyer email
    @GetMapping("/{buyerEmail}")
    public Address getAddress(@PathVariable String buyerEmail) {
        return addressRepository.findByBuyerEmail(buyerEmail).orElse(null);
    }

    // Save or update address
    @PostMapping("/save")
    public Address saveAddress(@RequestBody Address address) {
        Optional<Address> existing = addressRepository.findByBuyerEmail(address.getBuyerEmail());
        if (existing.isPresent()) {
            Address addr = existing.get();
            addr.setFirstName(address.getFirstName());
            addr.setLastName(address.getLastName());
            addr.setPhone(address.getPhone());
            addr.setProvince(address.getProvince());
            addr.setDistrict(address.getDistrict());
            addr.setCityAddress(address.getCityAddress());
            return addressRepository.save(addr);
        } else {
            return addressRepository.save(address);
        }
    }

    // Delete address by buyer email
    @DeleteMapping("/{buyerEmail}")
    public String deleteAddress(@PathVariable String buyerEmail) {
        Optional<Address> existing = addressRepository.findByBuyerEmail(buyerEmail);
        if (existing.isPresent()) {
            addressRepository.delete(existing.get());
            return "Address deleted successfully";
        } else {
            return "No address found for this buyer";
        }
    }
}
