package com.tracker.jobapp.service;

import com.tracker.jobapp.dto.JobApplicationDto;
import com.tracker.jobapp.exception.ResourceNotFoundException;
import com.tracker.jobapp.model.ApplicationStatus;
import com.tracker.jobapp.model.JobApplication;
import com.tracker.jobapp.model.User;
import com.tracker.jobapp.repository.JobApplicationRepository;
import com.tracker.jobapp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobApplicationServiceImplTest {

    @Mock
    private JobApplicationRepository applicationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private JobApplicationServiceImpl applicationService;

    private User user;
    private JobApplication application;
    private JobApplicationDto applicationDto;

    @BeforeEach
    void setUp() {
        user = new User("test@example.com", "Test User");
        user.setId(1L);

        application = new JobApplication();
        application.setId(1L);
        application.setCompany("Test Co");
        application.setRole("Dev");
        application.setStatus(ApplicationStatus.APPLIED);
        application.setDateApplied(LocalDate.now());
        application.setUser(user);

        applicationDto = new JobApplicationDto();
        applicationDto.setCompany("Test Co");
        applicationDto.setRole("Dev");
        applicationDto.setStatus(ApplicationStatus.APPLIED);
        applicationDto.setDateApplied(LocalDate.now());
        applicationDto.setUserId(1L);
    }

    @Test
    void createApplication_ShouldReturnSavedDto() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(applicationRepository.save(any(JobApplication.class))).thenReturn(application);

        JobApplicationDto created = applicationService.createApplication(applicationDto);

        assertNotNull(created);
        assertEquals("Test Co", created.getCompany());
        verify(applicationRepository).save(any(JobApplication.class));
    }

    @Test
    void updateApplication_ShouldReturnUpdatedDto() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(JobApplication.class))).thenAnswer(i -> i.getArguments()[0]);

        applicationDto.setCompany("Updated Co");
        JobApplicationDto updated = applicationService.updateApplication(1L, applicationDto);

        assertNotNull(updated);
        assertEquals("Updated Co", updated.getCompany());
    }

    @Test
    void deleteApplication_ShouldInvokeRepoDelete() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));

        applicationService.deleteApplication(1L);

        verify(applicationRepository).delete(application);
    }

    @Test
    void deleteApplication_NotFound_ShouldThrowException() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> applicationService.deleteApplication(1L));
    }

    @Test
    void getApplicationById_ShouldReturnDto() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));

        JobApplicationDto found = applicationService.getApplicationById(1L);

        assertNotNull(found);
        assertEquals(1L, found.getId());
    }

    @Test
    void getApplicationsByUserId_ShouldReturnList() {
        when(applicationRepository.findByUserId(1L)).thenReturn(Collections.singletonList(application));

        List<JobApplicationDto> result = applicationService.getApplicationsByUserId(1L);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void countApplicationsByStatus_ShouldReturnCount() {
        when(applicationRepository.countApplicationsByStatusForUser(ApplicationStatus.APPLIED, 1L)).thenReturn(5L);

        long count = applicationService.countApplicationsByStatus(1L, ApplicationStatus.APPLIED);

        assertEquals(5L, count);
    }

    @Test
    void getRecentApplications_ShouldReturnList() {
        LocalDate since = LocalDate.now().minusDays(30);
        when(applicationRepository.findRecentApplicationsForUser(since, 1L)).thenReturn(Collections.singletonList(application));

        List<JobApplicationDto> result = applicationService.getRecentApplications(1L, since);

        assertFalse(result.isEmpty());
    }

    @Test
    void searchApplicationsByCompany_ShouldReturnList() {
        when(applicationRepository.searchByCompanyForUser("Test", 1L)).thenReturn(Collections.singletonList(application));

        List<JobApplicationDto> result = applicationService.searchApplicationsByCompany(1L, "Test");

        assertFalse(result.isEmpty());
    }
}
