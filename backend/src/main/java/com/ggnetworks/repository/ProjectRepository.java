package com.ggnetworks.repository;

import com.ggnetworks.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByStatus(Project.ProjectStatus status);

    List<Project> findByHighlightedTrue();

    List<Project> findByTargetLaunchDateBetween(LocalDateTime start, LocalDateTime end);

    long countByStatus(Project.ProjectStatus status);

    boolean existsByNameIgnoreCase(String name);
}

