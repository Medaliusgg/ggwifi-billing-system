package com.ggnetworks.repository;

import com.ggnetworks.entity.CustomerDeviceRegistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerDeviceRegistryRepository extends JpaRepository<CustomerDeviceRegistry, Long> {
    
    Optional<CustomerDeviceRegistry> findByDeviceToken(String deviceToken);
    
    Optional<CustomerDeviceRegistry> findByPhoneNumberAndMacAddress(String phoneNumber, String macAddress);
    
    List<CustomerDeviceRegistry> findByPhoneNumber(String phoneNumber);
    
    Optional<CustomerDeviceRegistry> findByPhoneNumberAndIsPrimaryTrue(String phoneNumber);
    
    @Query("SELECT cdr FROM CustomerDeviceRegistry cdr WHERE cdr.phoneNumber = :phoneNumber " +
           "AND cdr.autoConnectEnabled = true")
    List<CustomerDeviceRegistry> findAutoConnectDevices(@Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT COUNT(cdr) FROM CustomerDeviceRegistry cdr WHERE cdr.phoneNumber = :phoneNumber")
    Long countDevicesByPhoneNumber(@Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT cdr FROM CustomerDeviceRegistry cdr WHERE cdr.voucherId = :voucherId")
    Optional<CustomerDeviceRegistry> findByVoucherId(@Param("voucherId") Long voucherId);
    
    @Query("SELECT cdr FROM CustomerDeviceRegistry cdr WHERE cdr.sessionId = :sessionId")
    Optional<CustomerDeviceRegistry> findBySessionId(@Param("sessionId") Long sessionId);
}



