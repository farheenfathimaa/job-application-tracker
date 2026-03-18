package com.tracker.jobapp.service;

import com.tracker.jobapp.dto.UserDto;
import com.tracker.jobapp.exception.ResourceNotFoundException;
import com.tracker.jobapp.model.User;
import com.tracker.jobapp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        user = new User("test@example.com", "Test User");
        user.setId(1L);

        userDto = new UserDto();
        userDto.setEmail("test@example.com");
        userDto.setName("Test User");
    }

    @Test
    void createUser_ShouldReturnSavedDto() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDto created = userService.createUser(userDto);

        assertNotNull(created);
        assertEquals(user.getEmail(), created.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUser_WithExistingEmail_ShouldThrowException() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> userService.createUser(userDto));
    }

    @Test
    void getUserById_ShouldReturnDto() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserDto found = userService.getUserById(1L);

        assertNotNull(found);
        assertEquals(1L, found.getId());
    }

    @Test
    void getUserById_NotFound_ShouldThrowException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(1L));
    }

    @Test
    void getUserByEmail_ShouldReturnDto() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        UserDto found = userService.getUserByEmail("test@example.com");

        assertNotNull(found);
        assertEquals("test@example.com", found.getEmail());
    }

    @Test
    void getAllUsers_ShouldReturnList() {
        when(userRepository.findAll()).thenReturn(Collections.singletonList(user));

        List<UserDto> users = userService.getAllUsers();

        assertFalse(users.isEmpty());
        assertEquals(1, users.size());
    }
}
