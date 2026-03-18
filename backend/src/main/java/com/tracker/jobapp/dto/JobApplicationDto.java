package com.tracker.jobapp.dto;

import com.tracker.jobapp.model.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class JobApplicationDto {
    private Long id;

    @NotBlank(message = "Company name is required")
    @Size(max = 255, message = "Company name must not exceed 255 characters")
    private String company;

    @NotBlank(message = "Role is required")
    @Size(max = 255, message = "Role must not exceed 255 characters")
    private String role;

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    @NotNull(message = "Date applied is required")
    private LocalDate dateApplied;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;

    @NotNull(message = "User ID is required")
    private Long userId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public LocalDate getDateApplied() { return dateApplied; }
    public void setDateApplied(LocalDate dateApplied) { this.dateApplied = dateApplied; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
