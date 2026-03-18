package com.tracker.jobapp.service;

import com.tracker.jobapp.dto.JobApplicationDto;
import com.tracker.jobapp.exception.ResourceNotFoundException;
import com.tracker.jobapp.model.ApplicationStatus;
import com.tracker.jobapp.model.JobApplication;
import com.tracker.jobapp.model.User;
import com.tracker.jobapp.repository.JobApplicationRepository;
import com.tracker.jobapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    public JobApplicationServiceImpl(JobApplicationRepository jobApplicationRepository, UserRepository userRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public JobApplicationDto createApplication(JobApplicationDto applicationDto) {
        JobApplication jobApplication = mapToEntity(applicationDto);
        JobApplication savedApplication = jobApplicationRepository.save(jobApplication);
        return mapToDto(savedApplication);
    }

    @Override
    public JobApplicationDto updateApplication(Long id, JobApplicationDto applicationDto) {
        JobApplication existingApplication = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job Application not found with id: " + id));

        existingApplication.setCompany(applicationDto.getCompany());
        existingApplication.setRole(applicationDto.getRole());
        existingApplication.setStatus(applicationDto.getStatus());
        existingApplication.setDateApplied(applicationDto.getDateApplied());
        existingApplication.setNotes(applicationDto.getNotes());

        JobApplication updatedApplication = jobApplicationRepository.save(existingApplication);
        return mapToDto(updatedApplication);
    }

    @Override
    public void deleteApplication(Long id) {
        JobApplication existingApplication = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job Application not found with id: " + id));
        jobApplicationRepository.delete(existingApplication);
    }

    @Override
    public JobApplicationDto getApplicationById(Long id) {
        JobApplication jobApplication = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job Application not found with id: " + id));
        return mapToDto(jobApplication);
    }

    @Override
    public List<JobApplicationDto> getApplicationsByUserId(Long userId) {
        return jobApplicationRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public long countApplicationsByStatus(Long userId, ApplicationStatus status) {
        return jobApplicationRepository.countApplicationsByStatusForUser(status, userId);
    }

    @Override
    public List<JobApplicationDto> getRecentApplications(Long userId, LocalDate since) {
        return jobApplicationRepository.findRecentApplicationsForUser(since, userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobApplicationDto> searchApplicationsByCompany(Long userId, String companyName) {
        return jobApplicationRepository.searchByCompanyForUser(companyName, userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private JobApplicationDto mapToDto(JobApplication entity) {
        JobApplicationDto dto = new JobApplicationDto();
        dto.setId(entity.getId());
        dto.setCompany(entity.getCompany());
        dto.setRole(entity.getRole());
        dto.setStatus(entity.getStatus());
        dto.setDateApplied(entity.getDateApplied());
        dto.setNotes(entity.getNotes());
        dto.setUserId(entity.getUser().getId());
        return dto;
    }

    private JobApplication mapToEntity(JobApplicationDto dto) {
        JobApplication entity = new JobApplication();
        entity.setCompany(dto.getCompany());
        entity.setRole(dto.getRole());
        entity.setStatus(dto.getStatus());
        entity.setDateApplied(dto.getDateApplied());
        entity.setNotes(dto.getNotes());

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));
        entity.setUser(user);

        return entity;
    }
}
