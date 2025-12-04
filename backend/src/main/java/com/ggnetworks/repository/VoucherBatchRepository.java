package com.ggnetworks.repository;

import com.ggnetworks.entity.VoucherBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoucherBatchRepository extends JpaRepository<VoucherBatch, Long> {
    Optional<VoucherBatch> findByBatchId(String batchId);
}

