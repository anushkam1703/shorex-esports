package com.shorex.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.shorex.dto.BookingRequestDto;
import com.shorex.dto.BookingResponseDto;
import com.shorex.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings")

public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public BookingResponseDto createBooking(@Valid @RequestBody BookingRequestDto request) {
        return bookingService.createBooking(request);
    }

    @GetMapping
    public List<BookingResponseDto> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/date/{date}")
    public List<BookingResponseDto> getBookingsByDate(@PathVariable LocalDate date) {
        return bookingService.getBookingsByDate(date);
    }

    @PutMapping("/{id}/confirm")
    public BookingResponseDto confirmBooking(@PathVariable Long id) {
        return bookingService.updateStatus(id, "CONFIRMED");
    }

    @PutMapping("/{id}/cancel")
    public BookingResponseDto cancelBooking(@PathVariable Long id) {
        return bookingService.updateStatus(id, "CANCELLED");
    }

    @PutMapping("/{id}/complete")
    public BookingResponseDto completeBooking(@PathVariable Long id) {
        return bookingService.updateStatus(id, "COMPLETED");
    }
}