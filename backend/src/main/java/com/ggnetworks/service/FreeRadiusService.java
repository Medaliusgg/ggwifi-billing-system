package com.ggnetworks.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class FreeRadiusService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${radius.nas-identifier:GGNetworks-Hotspot}")
    private String nasIdentifier;

    /**
     * Add user to FreeRADIUS radcheck table
     */
    public boolean addRadiusUser(String username, String password, String userType, 
                                Long locationId, Long routerId, Long packageId) {
        try {
            String sql = """
                INSERT INTO radcheck (username, attribute, op, value, user_type, nas_identifier, 
                                    location_id, router_id, package_id, expires_at, is_active, created_at)
                VALUES (?, 'Cleartext-Password', ':=', ?, ?, ?, ?, ?, ?, ?, TRUE, ?)
                """;
            
            jdbcTemplate.update(sql, username, password, userType, nasIdentifier, 
                              locationId, routerId, packageId, 
                              LocalDateTime.now().plusDays(30), LocalDateTime.now());
            
            return true;
        } catch (Exception e) {
            System.err.println("Error adding RADIUS user: " + e.getMessage());
            return false;
        }
    }

    /**
     * Add user reply attributes to FreeRADIUS radreply table
     */
    public boolean addRadiusReply(String username, String attribute, String value, 
                                 String userType, Long locationId, Long routerId, Long packageId) {
        try {
            String sql = """
                INSERT INTO radreply (username, attribute, op, value, user_type, nas_identifier,
                                    location_id, router_id, package_id, is_active, created_at)
                VALUES (?, ?, ':=', ?, ?, ?, ?, ?, ?, TRUE, ?)
                """;
            
            jdbcTemplate.update(sql, username, attribute, value, userType, nasIdentifier,
                              locationId, routerId, packageId, LocalDateTime.now());
            
            return true;
        } catch (Exception e) {
            System.err.println("Error adding RADIUS reply: " + e.getMessage());
            return false;
        }
    }

    /**
     * Update user session in FreeRADIUS radacct table
     */
    public boolean updateRadiusSession(String username, String sessionId, String nasIpAddress,
                                      Long bytesIn, Long bytesOut, Long sessionTime) {
        try {
            String sql = """
                UPDATE radacct 
                SET acctinputoctets = ?, acctoutputoctets = ?, acctsessiontime = ?, 
                    acctstoptime = ?, acctterminatecause = 'User-Request'
                WHERE username = ? AND acctsessionid = ? AND nasipaddress = ?
                """;
            
            jdbcTemplate.update(sql, bytesIn, bytesOut, sessionTime, LocalDateTime.now(),
                              username, sessionId, nasIpAddress);
            
            return true;
        } catch (Exception e) {
            System.err.println("Error updating RADIUS session: " + e.getMessage());
            return false;
        }
    }

    /**
     * Get active RADIUS sessions
     */
    public List<Map<String, Object>> getActiveRadiusSessions() {
        try {
            String sql = """
                SELECT username, acctsessionid, nasipaddress, framedipaddress, 
                       acctinputoctets, acctoutputoctets, acctsessiontime, acctstarttime
                FROM radacct 
                WHERE acctstoptime IS NULL 
                ORDER BY acctstarttime DESC
                """;
            
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            System.err.println("Error getting RADIUS sessions: " + e.getMessage());
            return List.of();
        }
    }

    /**
     * Get RADIUS user statistics
     */
    public Map<String, Object> getRadiusStatistics() {
        try {
            String activeUsersSql = "SELECT COUNT(*) FROM radcheck WHERE is_active = TRUE";
            String activeSessionsSql = "SELECT COUNT(*) FROM radacct WHERE acctstoptime IS NULL";
            String totalSessionsSql = "SELECT COUNT(*) FROM radacct WHERE acctstarttime >= DATE_SUB(NOW(), INTERVAL 24 HOUR)";
            
            Integer activeUsersInt = jdbcTemplate.queryForObject(activeUsersSql, Integer.class);
            Integer activeSessionsInt = jdbcTemplate.queryForObject(activeSessionsSql, Integer.class);
            Integer totalSessions24hInt = jdbcTemplate.queryForObject(totalSessionsSql, Integer.class);
            int activeUsers = activeUsersInt != null ? activeUsersInt : 0;
            int activeSessions = activeSessionsInt != null ? activeSessionsInt : 0;
            int totalSessions24h = totalSessions24hInt != null ? totalSessions24hInt : 0;
            
            return Map.of(
                "activeUsers", activeUsers,
                "activeSessions", activeSessions,
                "totalSessions24h", totalSessions24h,
                "nasIdentifier", nasIdentifier
            );
        } catch (Exception e) {
            System.err.println("Error getting RADIUS statistics: " + e.getMessage());
            return Map.of(
                "activeUsers", 0,
                "activeSessions", 0,
                "totalSessions24h", 0,
                "nasIdentifier", nasIdentifier
            );
        }
    }

    /**
     * Remove user from FreeRADIUS
     */
    public boolean removeRadiusUser(String username) {
        try {
            // Remove from radcheck
            jdbcTemplate.update("DELETE FROM radcheck WHERE username = ?", username);
            
            // Remove from radreply
            jdbcTemplate.update("DELETE FROM radreply WHERE username = ?", username);
            
            return true;
        } catch (Exception e) {
            System.err.println("Error removing RADIUS user: " + e.getMessage());
            return false;
        }
    }

           /**
            * Check if RADIUS tables exist
            */
           public boolean checkRadiusTables() {
               try {
                   jdbcTemplate.queryForObject("SELECT COUNT(*) FROM radcheck", Integer.class);
                   jdbcTemplate.queryForObject("SELECT COUNT(*) FROM radreply", Integer.class);
                   jdbcTemplate.queryForObject("SELECT COUNT(*) FROM radacct", Integer.class);
                   return true;
               } catch (Exception e) {
                   System.err.println("RADIUS tables not found: " + e.getMessage());
                   return false;
               }
           }

           /**
            * Configure RADIUS client (NAS)
            */
           public boolean configureRadiusClient(String nasname, String secret) {
               try {
                   String sql = """
                       INSERT INTO nas (nasname, shortname, type, secret, description, is_active, created_at)
                       VALUES (?, ?, 'mikrotik', ?, 'RADIUS Client', TRUE, ?)
                       """;
                   
                   jdbcTemplate.update(sql, nasname, nasname, secret, LocalDateTime.now());
                   return true;
               } catch (Exception e) {
                   System.err.println("Error configuring RADIUS client: " + e.getMessage());
                   return false;
               }
           }

           /**
            * Start accounting session
            */
           public boolean startAccountingSession(String username, String sessionId, String nasIpAddress, String framedIpAddress) {
               try {
                   String sql = """
                       INSERT INTO radacct (acctsessionid, acctuniqueid, username, nasipaddress, 
                                           calledstationid, callingstationid, framedipaddress, 
                                           acctstarttime, acctterminatecause, created_at)
                       VALUES (?, ?, ?, ?, '00-00-00-00-00-00', '00-00-00-00-00-00', ?, ?, 'Start', ?)
                       """;
                   
                   String uniqueId = sessionId + "_" + System.currentTimeMillis();
                   jdbcTemplate.update(sql, sessionId, uniqueId, username, nasIpAddress, 
                                     framedIpAddress, LocalDateTime.now(), LocalDateTime.now());
                   return true;
               } catch (Exception e) {
                   System.err.println("Error starting accounting session: " + e.getMessage());
                   return false;
               }
           }

           /**
            * Stop accounting session
            */
           public boolean stopAccountingSession(String username, String terminateCause) {
               try {
                   String sql = """
                       UPDATE radacct 
                       SET acctstoptime = ?, acctterminatecause = ?, updated_at = ?
                       WHERE username = ? AND acctstoptime IS NULL
                       """;
                   
                   jdbcTemplate.update(sql, LocalDateTime.now(), terminateCause, LocalDateTime.now(), username);
                   return true;
               } catch (Exception e) {
                   System.err.println("Error stopping accounting session: " + e.getMessage());
                   return false;
               }
           }
           
           /**
            * Get RADIUS analytics for hotspot billing system
            */
           public Map<String, Object> getRadiusAnalytics(LocalDateTime startDate, LocalDateTime endDate) {
               Map<String, Object> analytics = new HashMap<>();
               
               try {
                   // Total sessions in period
                   String totalSessionsSql = """
                       SELECT COUNT(*) FROM radacct 
                       WHERE acctstarttime BETWEEN ? AND ?
                       """;
                   Integer totalSessionsInt = jdbcTemplate.queryForObject(totalSessionsSql, Integer.class, startDate, endDate);
                   int totalSessions = totalSessionsInt != null ? totalSessionsInt : 0;
                   
                   // Active sessions
                   String activeSessionsSql = "SELECT COUNT(*) FROM radacct WHERE acctstoptime IS NULL";
                   Integer activeSessionsInt = jdbcTemplate.queryForObject(activeSessionsSql, Integer.class);
                   int activeSessions = activeSessionsInt != null ? activeSessionsInt : 0;
                   
                   // Total data usage
                   String dataUsageSql = """
                       SELECT 
                           SUM(acctinputoctets + acctoutputoctets) as totalBytes,
                           SUM(acctinputoctets) as bytesIn,
                           SUM(acctoutputoctets) as bytesOut
                       FROM radacct 
                       WHERE acctstarttime BETWEEN ? AND ?
                       """;
                   Map<String, Object> dataUsage = jdbcTemplate.queryForMap(dataUsageSql, startDate, endDate);
                   
                   // Sessions by NAS
                   String sessionsByNasSql = """
                       SELECT nasipaddress, COUNT(*) as sessionCount
                       FROM radacct 
                       WHERE acctstarttime BETWEEN ? AND ?
                       GROUP BY nasipaddress
                       """;
                   List<Map<String, Object>> sessionsByNas = jdbcTemplate.queryForList(sessionsByNasSql, startDate, endDate);
                   
                   // Average session duration
                   String avgDurationSql = """
                       SELECT AVG(acctsessiontime) as avgDuration
                       FROM radacct 
                       WHERE acctstarttime BETWEEN ? AND ? AND acctstoptime IS NOT NULL
                       """;
                   Double avgDuration = jdbcTemplate.queryForObject(avgDurationSql, Double.class, startDate, endDate);
                   
                   // Active users
                   String activeUsersSql = "SELECT COUNT(DISTINCT username) FROM radcheck WHERE is_active = TRUE";
                   Integer activeUsersInt = jdbcTemplate.queryForObject(activeUsersSql, Integer.class);
                   int activeUsers = activeUsersInt != null ? activeUsersInt : 0;
                   
                   analytics.put("period", Map.of("start", startDate.toString(), "end", endDate.toString()));
                   analytics.put("totalSessions", totalSessions);
                   analytics.put("activeSessions", activeSessions);
                   analytics.put("activeUsers", activeUsers);
                   analytics.put("dataUsage", dataUsage);
                   analytics.put("sessionsByNas", sessionsByNas);
                   analytics.put("averageSessionDuration", avgDuration != null ? avgDuration : 0.0);
                   analytics.put("generatedAt", LocalDateTime.now().toString());
                   
               } catch (Exception e) {
                   System.err.println("Error getting RADIUS analytics: " + e.getMessage());
                   analytics.put("error", e.getMessage());
               }
               
               return analytics;
           }
       }
