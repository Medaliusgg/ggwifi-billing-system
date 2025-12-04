package com.ggnetworks.repository;

import com.ggnetworks.entity.DeviceFingerprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceFingerprintRepository extends JpaRepository<DeviceFingerprint, Long> {
    Optional<DeviceFingerprint> findByFingerprintHash(String fingerprintHash);
    Optional<DeviceFingerprint> findByVoucherCode(String voucherCode);
    Optional<DeviceFingerprint> findByPhoneNumber(String phoneNumber);
}

