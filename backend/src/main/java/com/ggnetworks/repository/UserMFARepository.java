package com.ggnetworks.repository;

import com.ggnetworks.entity.UserMFA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserMFARepository extends JpaRepository<UserMFA, Long> {
    Optional<UserMFA> findByUserId(Long userId);
}

