package com.shorex.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.shorex.entity.AdminUser;
import com.shorex.entity.Booking;
import com.shorex.entity.PC;
import com.shorex.exception.ResourceNotFoundException;
import com.shorex.repository.AdminUserRepository;
import com.shorex.repository.BookingRepository;
import com.shorex.repository.PcRepository;
import com.shorex.security.JwtUtil;

import java.time.LocalTime;
import org.springframework.http.ResponseEntity;
import com.shorex.dto.BookingResponseDto;
import com.shorex.service.BookingService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final BookingRepository bookingRepository;
    private final PcRepository pcRepository;
    private final JwtUtil jwtUtil;
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final BookingService bookingService;

    public AdminController(
            BookingRepository bookingRepository,
            PcRepository pcRepository,
            JwtUtil jwtUtil,
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            BookingService bookingService
    ) {
        this.bookingRepository = bookingRepository;
        this.pcRepository = pcRepository;
        this.jwtUtil = jwtUtil;
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.bookingService = bookingService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, Object> body) {

        if (body == null || !body.containsKey("username") || !body.containsKey("password")) {
            throw new RuntimeException("Username and password are required");
        }

        String username = String.valueOf(body.get("username")).trim();
        String password = String.valueOf(body.get("password")).trim();

        AdminUser admin = adminUserRepository.findByUsernameAndActiveTrue(username)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        System.out.println("INPUT USERNAME = [" + username + "]");
        System.out.println("INPUT PASSWORD = [" + password + "]");
        System.out.println("DB USERNAME = [" + admin.getUsername() + "]");
        System.out.println("DB HASH = [" + admin.getPassword() + "]");
        System.out.println("DB HASH LENGTH = " + admin.getPassword().length());
        System.out.println("MATCH RESULT = " + passwordEncoder.matches(password, admin.getPassword()));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtUtil.generateToken(username);

        return Map.of("token", token);
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/available-pcs")
    public int getAvailablePcs(
            @RequestParam LocalDate date,
            @RequestParam LocalTime start,
            @RequestParam int hours
    ) {
        LocalTime end = start.plusHours(hours);

        List<PC> allPcs = pcRepository.findByActiveTrueOrderByPcNumberAsc();

        List<Booking> conflicts = bookingRepository.findActiveOverlappingBookings(
                date,
                start,
                end
        );

        Set<Long> bookedPcIds = conflicts.stream()
                .flatMap(b -> b.getAssignedPcs().stream())
                .map(PC::getId)
                .collect(Collectors.toSet());

        return (int) allPcs.stream()
                .filter(pc -> !bookedPcIds.contains(pc.getId()))
                .count();
    }

    @PutMapping("/bookings/{id}/confirm")
    public Booking confirmBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus("CONFIRMED");
        return bookingRepository.save(booking);
    }

    @PutMapping("/bookings/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    @PutMapping("/bookings/{id}/complete")
    public Booking completeBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus("COMPLETED");
        return bookingRepository.save(booking);
    }
    
    @PostMapping("/bookings/{id}/end-early")
    public ResponseEntity<BookingResponseDto> endBookingEarly(
            @PathVariable Long id,
            @RequestParam String actualEndDateTime
    ) {
        BookingResponseDto response = bookingService.endBookingEarly(
                id,
                LocalDateTime.parse(actualEndDateTime)
        );

        return ResponseEntity.ok(response);
    }
}