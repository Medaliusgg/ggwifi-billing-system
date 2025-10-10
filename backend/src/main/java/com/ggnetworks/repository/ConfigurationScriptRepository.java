package com.ggnetworks.repository;

import com.ggnetworks.entity.ConfigurationScript;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConfigurationScriptRepository extends JpaRepository<ConfigurationScript, Long> {

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.scriptType = :scriptType AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findByScriptType(@Param("scriptType") ConfigurationScript.ScriptType scriptType);

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.targetRouterType = :routerType AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findByTargetRouterType(@Param("routerType") ConfigurationScript.RouterType routerType);

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.status = :status AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findByStatus(@Param("status") ConfigurationScript.ScriptStatus status);

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.scriptType = :scriptType AND cs.targetRouterType = :routerType AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findByScriptTypeAndRouterType(@Param("scriptType") ConfigurationScript.ScriptType scriptType, 
                                                          @Param("routerType") ConfigurationScript.RouterType routerType);

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.status = :status AND cs.scriptType = :scriptType AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findByStatusAndScriptType(@Param("status") ConfigurationScript.ScriptStatus status, 
                                                      @Param("scriptType") ConfigurationScript.ScriptType scriptType);

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.lastExecutedAt >= :startDate AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findByLastExecutedAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.executionCount > 0 AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findExecutedScripts();

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.successCount > 0 AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findSuccessfulScripts();

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.failureCount > 0 AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findFailedScripts();

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.requiresConfirmation = true AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findScriptsRequiringConfirmation();

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.backupBeforeExecution = true AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findScriptsWithBackup();

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.tags LIKE %:tag% AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findByTag(@Param("tag") String tag);

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.version = :version AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findByVersion(@Param("version") String version);

    @Query("SELECT COUNT(cs) FROM ConfigurationScript cs WHERE cs.scriptType = :scriptType AND cs.deletedAt IS NULL")
    long countByScriptType(@Param("scriptType") ConfigurationScript.ScriptType scriptType);

    @Query("SELECT COUNT(cs) FROM ConfigurationScript cs WHERE cs.targetRouterType = :routerType AND cs.deletedAt IS NULL")
    long countByTargetRouterType(@Param("routerType") ConfigurationScript.RouterType routerType);

    @Query("SELECT COUNT(cs) FROM ConfigurationScript cs WHERE cs.status = :status AND cs.deletedAt IS NULL")
    long countByStatus(@Param("status") ConfigurationScript.ScriptStatus status);

    @Query("SELECT COUNT(cs) FROM ConfigurationScript cs WHERE cs.isActive = true AND cs.deletedAt IS NULL")
    long countActiveScripts();

    @Query("SELECT SUM(cs.executionCount) FROM ConfigurationScript cs WHERE cs.deletedAt IS NULL")
    Long sumTotalExecutions();

    @Query("SELECT SUM(cs.successCount) FROM ConfigurationScript cs WHERE cs.deletedAt IS NULL")
    Long sumTotalSuccesses();

    @Query("SELECT SUM(cs.failureCount) FROM ConfigurationScript cs WHERE cs.deletedAt IS NULL")
    Long sumTotalFailures();

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.deletedAt IS NULL")
    Page<ConfigurationScript> findAllActive(Pageable pageable);

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.name LIKE %:name% AND cs.deletedAt IS NULL")
    Page<ConfigurationScript> findByNameContaining(@Param("name") String name, Pageable pageable);

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.description LIKE %:description% AND cs.deletedAt IS NULL")
    Page<ConfigurationScript> findByDescriptionContaining(@Param("description") String description, Pageable pageable);

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.tags LIKE %:tags% AND cs.deletedAt IS NULL")
    Page<ConfigurationScript> findByTagsContaining(@Param("tags") String tags, Pageable pageable);

    @Query("SELECT cs FROM ConfigurationScript cs ORDER BY cs.executionCount DESC")
    Page<ConfigurationScript> findMostExecutedScripts(Pageable pageable);

    @Query("SELECT cs FROM ConfigurationScript cs ORDER BY cs.successCount DESC")
    Page<ConfigurationScript> findMostSuccessfulScripts(Pageable pageable);

    @Query("SELECT cs FROM ConfigurationScript cs ORDER BY cs.lastExecutedAt DESC")
    Page<ConfigurationScript> findRecentlyExecutedScripts(Pageable pageable);

    @Query("SELECT cs FROM ConfigurationScript cs WHERE cs.rollbackScript IS NOT NULL AND cs.deletedAt IS NULL")
    List<ConfigurationScript> findScriptsWithRollback();
} 