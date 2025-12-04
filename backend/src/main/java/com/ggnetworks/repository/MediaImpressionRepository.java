package com.ggnetworks.repository;

import com.ggnetworks.entity.MediaImpression;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaImpressionRepository extends JpaRepository<MediaImpression, Long> {
}

