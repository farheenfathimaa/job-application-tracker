package com.tracker.jobapp.service;

import com.tracker.jobapp.dto.JobApplicationDto;
import com.tracker.jobapp.model.ApplicationStatus;

import java.time.LocalDate;
import java.util.List;

public interface JobApplicationService {
    JobApplicationDto createApplication(JobApplicationDto applicationDto);
    JobApplicationDto updateApplication(Long id, JobApplicationDto applicationDto);
    void deleteApplication(Long id);
    JobApplicationDto getApplicationById(Long id);
    List<JobApplicationDto> getApplicationsByUserId(Long userId);

    // Custom Query Methods
    long countApplicationsByStatus(Long userId, ApplicationStatus status);
    List<JobApplicationDto> getRecentApplications(Long userId, LocalDate since);
    List<JobApplicationDto> searchApplicationsByCompany(Long userId, String companyName);
}
