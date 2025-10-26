package com.ggnetworks.repository;

import com.ggnetworks.entity.DeviceAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DeviceAssignmentRepository extends JpaRepository<DeviceAssignment, Long> {
    
    List<DeviceAssignment> findByDeviceId(Long deviceId);
    
    List<DeviceAssignment> findByAssignedTo(String assignedTo);
    
    List<DeviceAssignment> findByAssignmentType(DeviceAssignment.AssignmentType assignmentType);
    
    List<DeviceAssignment> findByStatus(DeviceAssignment.AssignmentStatus status);
    
    List<DeviceAssignment> findByAssignedBy(String assignedBy);
    
    List<DeviceAssignment> findByAssignedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<DeviceAssignment> findByDeviceIdAndStatus(Long deviceId, DeviceAssignment.AssignmentStatus status);
    
    List<DeviceAssignment> findByAssignedToAndStatus(String assignedTo, DeviceAssignment.AssignmentStatus status);
    
    long countByDeviceId(Long deviceId);
    
    long countByAssignedTo(String assignedTo);
    
    long countByAssignmentType(DeviceAssignment.AssignmentType assignmentType);
    
    long countByStatus(DeviceAssignment.AssignmentStatus status);
}
