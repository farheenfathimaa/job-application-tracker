package com.tracker.jobapp.controller;

import com.tracker.jobapp.dto.JobApplicationDto;
import com.tracker.jobapp.model.ApplicationStatus;
import com.tracker.jobapp.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService applicationService;

    public JobApplicationController(JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<JobApplicationDto> createApplication(@Valid @RequestBody JobApplicationDto applicationDto) {
        return new ResponseEntity<>(applicationService.createApplication(applicationDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationDto> updateApplication(@PathVariable Long id, @Valid @RequestBody JobApplicationDto applicationDto) {
        return ResponseEntity.ok(applicationService.updateApplication(id, applicationDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationDto> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<JobApplicationDto>> getApplicationsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getApplicationsByUserId(userId));
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> countByStatus(@PathVariable Long userId, @RequestParam ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.countApplicationsByStatus(userId, status));
    }

    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<List<JobApplicationDto>> getRecentApplications(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate since) {
        return ResponseEntity.ok(applicationService.getRecentApplications(userId, since));
    }

    @GetMapping("/user/{userId}/search")
    public ResponseEntity<List<JobApplicationDto>> searchByCompany(@PathVariable Long userId, @RequestParam String company) {
        return ResponseEntity.ok(applicationService.searchApplicationsByCompany(userId, company));
    }
}
