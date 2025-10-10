package com.ggnetworks.repository;

import com.ggnetworks.entity.Package;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long> {

    @Query("SELECT p FROM Package p WHERE p.type = :type AND p.isActive = true AND p.deletedAt IS NULL")
    List<Package> findByTypeAndActive(@Param("type") Package.PackageType type);

    @Query("SELECT p FROM Package p WHERE p.isActive = true AND p.deletedAt IS NULL")
    List<Package> findAllActive();

    @Query("SELECT p FROM Package p WHERE p.isPopular = true AND p.isActive = true AND p.deletedAt IS NULL")
    List<Package> findPopularPackages();

    @Query("SELECT p FROM Package p WHERE p.type = :type AND p.isPopular = true AND p.isActive = true AND p.deletedAt IS NULL")
    List<Package> findPopularPackagesByType(@Param("type") Package.PackageType type);

    @Query("SELECT p FROM Package p WHERE p.deletedAt IS NULL")
    Page<Package> findAllActive(Pageable pageable);

    @Query("SELECT p FROM Package p WHERE p.type = :type AND p.deletedAt IS NULL")
    Page<Package> findByType(@Param("type") Package.PackageType type, Pageable pageable);

    @Query("SELECT p FROM Package p WHERE p.name LIKE %:name% AND p.deletedAt IS NULL")
    Page<Package> findByNameContaining(@Param("name") String name, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Package p WHERE p.type = :type AND p.isActive = true AND p.deletedAt IS NULL")
    long countActiveByType(@Param("type") Package.PackageType type);

    // Additional methods for PackageService
    @Query("SELECT COUNT(p) FROM Package p WHERE p.isActive = true AND p.deletedAt IS NULL")
    long countByIsActiveTrue();

    @Query("SELECT COUNT(p) FROM Package p WHERE p.type = :type AND p.deletedAt IS NULL")
    long countByType(@Param("type") Package.PackageType type);
} 