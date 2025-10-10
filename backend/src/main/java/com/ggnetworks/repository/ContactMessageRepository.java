package com.ggnetworks.repository;

import com.ggnetworks.entity.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    @Query("SELECT cm FROM ContactMessage cm WHERE cm.status = :status AND cm.deletedAt IS NULL")
    List<ContactMessage> findByStatus(@Param("status") ContactMessage.MessageStatus status);

    @Query("SELECT cm FROM ContactMessage cm WHERE cm.email = :email AND cm.deletedAt IS NULL")
    List<ContactMessage> findByEmail(@Param("email") String email);

    @Query("SELECT cm FROM ContactMessage cm WHERE cm.phoneNumber = :phoneNumber AND cm.deletedAt IS NULL")
    List<ContactMessage> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT COUNT(cm) FROM ContactMessage cm WHERE cm.status = :status AND cm.deletedAt IS NULL")
    long countByStatus(@Param("status") ContactMessage.MessageStatus status);

    @Query("SELECT cm FROM ContactMessage cm WHERE cm.deletedAt IS NULL")
    Page<ContactMessage> findAllActive(Pageable pageable);

    @Query("SELECT cm FROM ContactMessage cm WHERE cm.name LIKE %:name% AND cm.deletedAt IS NULL")
    Page<ContactMessage> findByNameContaining(@Param("name") String name, Pageable pageable);

    @Query("SELECT cm FROM ContactMessage cm WHERE cm.subject LIKE %:subject% AND cm.deletedAt IS NULL")
    Page<ContactMessage> findBySubjectContaining(@Param("subject") String subject, Pageable pageable);

    @Query("SELECT cm FROM ContactMessage cm WHERE cm.email LIKE %:email% AND cm.deletedAt IS NULL")
    Page<ContactMessage> findByEmailContaining(@Param("email") String email, Pageable pageable);
} 