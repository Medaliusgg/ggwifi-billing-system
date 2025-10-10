package com.ggnetworks.repository;

import com.ggnetworks.entity.PppoeUserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PppoeUserProfileRepository extends JpaRepository<PppoeUserProfile, Long> {

    Optional<PppoeUserProfile> findByUserIdAndDeletedAtIsNull(Long userId);

    Optional<PppoeUserProfile> findByUsernameAndDeletedAtIsNull(String username);

    @Query("SELECT p FROM PppoeUserProfile p WHERE p.status = :status AND p.deletedAt IS NULL")
    List<PppoeUserProfile> findByStatus(@Param("status") PppoeUserProfile.ProfileStatus status);

    @Query("SELECT p FROM PppoeUserProfile p WHERE p.packageEntity.id = :packageId AND p.deletedAt IS NULL")
    List<PppoeUserProfile> findByPackageId(@Param("packageId") Long packageId);

    @Query("SELECT p FROM PppoeUserProfile p WHERE p.status = :status AND p.packageEntity.id = :packageId AND p.deletedAt IS NULL")
    List<PppoeUserProfile> findByStatusAndPackageId(@Param("status") PppoeUserProfile.ProfileStatus status, 
                                                   @Param("packageId") Long packageId);

    @Query("SELECT COUNT(p) FROM PppoeUserProfile p WHERE p.status = :status AND p.deletedAt IS NULL")
    long countByStatus(@Param("status") PppoeUserProfile.ProfileStatus status);

    @Query("SELECT COUNT(p) FROM PppoeUserProfile p WHERE p.packageEntity.id = :packageId AND p.status = :status AND p.deletedAt IS NULL")
    long countByPackageIdAndStatus(@Param("packageId") Long packageId, 
                                  @Param("status") PppoeUserProfile.ProfileStatus status);

    @Query("SELECT p FROM PppoeUserProfile p WHERE p.deletedAt IS NULL")
    Page<PppoeUserProfile> findAllActive(Pageable pageable);

    @Query("SELECT p FROM PppoeUserProfile p WHERE p.username LIKE %:username% AND p.deletedAt IS NULL")
    Page<PppoeUserProfile> findByUsernameContaining(@Param("username") String username, Pageable pageable);

    @Query("SELECT p FROM PppoeUserProfile p WHERE p.installationLocation LIKE %:location% AND p.deletedAt IS NULL")
    Page<PppoeUserProfile> findByInstallationLocationContaining(@Param("location") String location, Pageable pageable);

    @Query("SELECT p FROM PppoeUserProfile p WHERE p.user.phoneNumber = :phoneNumber AND p.deletedAt IS NULL")
    Optional<PppoeUserProfile> findByUserPhoneNumber(@Param("phoneNumber") String phoneNumber);
} 