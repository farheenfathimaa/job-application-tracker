package com.tracker.jobapp.repository;

import com.tracker.jobapp.model.ApplicationStatus;
import com.tracker.jobapp.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByUserId(Long userId);

    // 1. Count applications by status
    @Query("SELECT COUNT(j) FROM JobApplication j WHERE j.status = :status AND j.user.id = :userId")
    long countApplicationsByStatusForUser(@Param("status") ApplicationStatus status, @Param("userId") Long userId);

    // 2. Get applications from the last 30 days (or given date)
    @Query("SELECT j FROM JobApplication j WHERE j.dateApplied >= :thirtyDaysAgo AND j.user.id = :userId ORDER BY j.dateApplied DESC")
    List<JobApplication> findRecentApplicationsForUser(@Param("thirtyDaysAgo") LocalDate thirtyDaysAgo, @Param("userId") Long userId);

    // 3. Filter by company name (case-insensitive search)
    @Query("SELECT j FROM JobApplication j WHERE LOWER(j.company) LIKE LOWER(CONCAT('%', :companyName, '%')) AND j.user.id = :userId")
    List<JobApplication> searchByCompanyForUser(@Param("companyName") String companyName, @Param("userId") Long userId);

}
