package com.ggnetworks.repository;

import com.ggnetworks.entity.InternetApplicationForm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InternetApplicationFormRepository extends JpaRepository<InternetApplicationForm, Long> {

    @Query("SELECT iaf FROM InternetApplicationForm iaf WHERE iaf.user.id = :userId AND iaf.deletedAt IS NULL")
    List<InternetApplicationForm> findByUserId(@Param("userId") Long userId);

    @Query("SELECT iaf FROM InternetApplicationForm iaf WHERE iaf.status = :status AND iaf.deletedAt IS NULL")
    List<InternetApplicationForm> findByStatus(@Param("status") InternetApplicationForm.ApplicationStatus status);

    @Query("SELECT iaf FROM InternetApplicationForm iaf WHERE iaf.serviceType = :serviceType AND iaf.deletedAt IS NULL")
    List<InternetApplicationForm> findByServiceType(@Param("serviceType") InternetApplicationForm.ServiceType serviceType);

    @Query("SELECT iaf FROM InternetApplicationForm iaf WHERE iaf.status = :status AND iaf.serviceType = :serviceType AND iaf.deletedAt IS NULL")
    List<InternetApplicationForm> findByStatusAndServiceType(@Param("status") InternetApplicationForm.ApplicationStatus status, 
                                                           @Param("serviceType") InternetApplicationForm.ServiceType serviceType);

    @Query("SELECT iaf FROM InternetApplicationForm iaf WHERE iaf.packageEntity.id = :packageId AND iaf.deletedAt IS NULL")
    List<InternetApplicationForm> findByPackageId(@Param("packageId") Long packageId);

    @Query("SELECT iaf FROM InternetApplicationForm iaf WHERE iaf.surveyDate = :surveyDate AND iaf.deletedAt IS NULL")
    List<InternetApplicationForm> findBySurveyDate(@Param("surveyDate") LocalDateTime surveyDate);

    @Query("SELECT iaf FROM InternetApplicationForm iaf WHERE iaf.installationDate = :installationDate AND iaf.deletedAt IS NULL")
    List<InternetApplicationForm> findByInstallationDate(@Param("installationDate") LocalDateTime installationDate);

    @Query("SELECT COUNT(iaf) FROM InternetApplicationForm iaf WHERE iaf.status = :status AND iaf.deletedAt IS NULL")
    long countByStatus(@Param("status") InternetApplicationForm.ApplicationStatus status);

    @Query("SELECT COUNT(iaf) FROM InternetApplicationForm iaf WHERE iaf.serviceType = :serviceType AND iaf.deletedAt IS NULL")
    long countByServiceType(@Param("serviceType") InternetApplicationForm.ServiceType serviceType);

    @Query("SELECT iaf FROM InternetApplicationForm iaf WHERE iaf.deletedAt IS NULL")
    Page<InternetApplicationForm> findAllActive(Pageable pageable);

    @Query("SELECT iaf FROM InternetApplicationForm iaf WHERE iaf.location LIKE %:location% AND iaf.deletedAt IS NULL")
    Page<InternetApplicationForm> findByLocationContaining(@Param("location") String location, Pageable pageable);

    @Query("SELECT iaf FROM InternetApplicationForm iaf WHERE iaf.user.phoneNumber = :phoneNumber AND iaf.deletedAt IS NULL")
    List<InternetApplicationForm> findByUserPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT iaf FROM InternetApplicationForm iaf WHERE iaf.createdAt >= :startDate AND iaf.deletedAt IS NULL")
    List<InternetApplicationForm> findByCreatedAtAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT iaf FROM InternetApplicationForm iaf WHERE iaf.createdAt BETWEEN :startDate AND :endDate AND iaf.deletedAt IS NULL")
    List<InternetApplicationForm> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                                        @Param("endDate") LocalDateTime endDate);
} 