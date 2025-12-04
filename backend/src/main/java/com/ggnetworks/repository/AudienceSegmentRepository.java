package com.ggnetworks.repository;

import com.ggnetworks.entity.AudienceSegment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AudienceSegmentRepository extends JpaRepository<AudienceSegment, Long> {

    Optional<AudienceSegment> findBySegmentId(String segmentId);
}

