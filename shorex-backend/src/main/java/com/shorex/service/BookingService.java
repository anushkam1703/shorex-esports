package com.shorex.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.shorex.dto.BookingRequestDto;
import com.shorex.dto.BookingResponseDto;
import com.shorex.entity.Booking;
import com.shorex.entity.Game;
import com.shorex.entity.PC;
import com.shorex.exception.BookingConflictException;
import com.shorex.exception.ResourceNotFoundException;
import com.shorex.repository.BookingRepository;
import com.shorex.repository.PcRepository;

import java.time.Duration;
import com.shorex.entity.CustomerCredit;
import com.shorex.repository.CustomerCreditRepository;


@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final GameService gameService;
    private final PcRepository pcRepository;
    private final CustomerCreditRepository customerCreditRepository;

    public BookingService(
            BookingRepository bookingRepository,
            GameService gameService,
            PcRepository pcRepository,
            CustomerCreditRepository customerCreditRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.gameService = gameService;
        this.pcRepository = pcRepository;
        this.customerCreditRepository = customerCreditRepository;
    }

    public BookingResponseDto createBooking(BookingRequestDto request) {

        Game game = gameService.getGameById(request.getGameId());

        if (request.getBookingDate().isBefore(LocalDate.now())) {
            throw new BookingConflictException("Past date booking is not allowed");
        }

        if (request.getBookingDate().isEqual(LocalDate.now())) {
            if (request.getStartTime().isBefore(LocalTime.now())) {
                throw new BookingConflictException("Past time booking is not allowed for today");
            }
        }

        if (request.getPcCount() == null || request.getPcCount() <= 0) {
            throw new BookingConflictException("Invalid PC count");
        }

        String normalizedFullName = request.getFullName().trim();

        long previousBookings =
                bookingRepository.countSuccessfulBookingsByFullName(normalizedFullName);

        boolean isFirstTimeCustomer = previousBookings == 0;

        int freeHours = isFirstTimeCustomer && request.getPaidHours() == 2 ? 1 : 0;
        int totalHours = request.getPaidHours() + freeHours;
        LocalTime endTime = request.getStartTime().plusHours(totalHours);

        // Prevent time crossing midnight.
        // Example: 19:26 + 5 hours becomes 00:26, which breaks overlap checking.
        if (endTime.isBefore(request.getStartTime()) || endTime.equals(request.getStartTime())) {
            throw new BookingConflictException(
                    "Booking cannot continue after midnight. Please select an earlier start time."
            );
        }

        if (endTime.isAfter(LocalTime.of(23, 59))) {
            throw new BookingConflictException("Selected slot exceeds closing time range");
        }

        List<Booking> userBookings = bookingRepository.findUserActiveBookings(
                request.getPhone(),
                request.getBookingDate(),
                request.getStartTime(),
                endTime
        );

        if (!userBookings.isEmpty()) {
            throw new BookingConflictException("You already have a booking at this time");
        }

        List<PC> assignedPcs = assignAvailablePcs(
                request.getBookingDate(),
                request.getStartTime(),
                endTime,
                request.getPcCount()
        );

        String offerApplied = freeHours == 1
                ? "New Customer Offer: 2 Hours + 1 Hour Free"
                : null;

        Booking booking = new Booking();
        booking.setUsername(request.getUsername());
        booking.setFullName(normalizedFullName);
        booking.setPhone(request.getPhone());
        booking.setGame(game);
        booking.setSelectedGame(request.getSelectedGame());
        booking.setPlanName(request.getPlanName());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(endTime);
        booking.setPaidHours(request.getPaidHours());
        booking.setFreeHours(freeHours);
        booking.setTotalHours(totalHours);
        booking.setTotalPrice(request.getTotalPrice());
        booking.setOfferApplied(offerApplied);
        booking.setPcCount(request.getPcCount());
        booking.setBookingType(
                request.getBookingType() == null ? "ONLINE" : request.getBookingType()
        );
        booking.setIsNewCustomer(isFirstTimeCustomer);
        booking.setAssignedPcs(assignedPcs);

        if ("WALK_IN".equalsIgnoreCase(booking.getBookingType())) {
            booking.setStatus("CONFIRMED");
        } else {
            booking.setStatus("PENDING");
        }

        Booking saved = bookingRepository.save(booking);

        return mapToResponse(saved);
    }

    private List<PC> assignAvailablePcs(
            LocalDate date,
            LocalTime start,
            LocalTime end,
            int requiredPcCount
    ) {
        List<PC> allActivePcs = pcRepository.findByActiveTrueOrderByPcNumberAsc();

        if (allActivePcs.size() < requiredPcCount) {
            throw new BookingConflictException(
                    "Only " + allActivePcs.size() + " PCs are available in system"
            );
        }

        List<Booking> overlappingBookings =
                bookingRepository.findActiveOverlappingBookings(date, start, end);

        Set<Long> bookedPcIds = new HashSet<>();

        for (Booking booking : overlappingBookings) {
            for (PC pc : booking.getAssignedPcs()) {
                bookedPcIds.add(pc.getId());
            }
        }

        List<PC> availablePcs = new ArrayList<>();

        for (PC pc : allActivePcs) {
            if (!bookedPcIds.contains(pc.getId())) {
                availablePcs.add(pc);
            }
        }

        if (availablePcs.size() < requiredPcCount) {
            throw new BookingConflictException(
                    "Only " + availablePcs.size() + " PC(s) available for selected slot"
            );
        }

        return availablePcs.subList(0, requiredPcCount);
    }

    public List<BookingResponseDto> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingDateDescStartTimeAsc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDto> getBookingsByDate(LocalDate date) {
        return bookingRepository.findByBookingDateOrderByStartTimeAsc(date)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponseDto updateStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus(status.toUpperCase());
        Booking saved = bookingRepository.save(booking);

        return mapToResponse(saved);
    }
    
    public BookingResponseDto endBookingEarly(Long bookingId, LocalDateTime actualEndDateTime) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!"CONFIRMED".equalsIgnoreCase(booking.getStatus())) {
            throw new BookingConflictException("Only confirmed bookings can be ended early");
        }

        LocalDateTime startDateTime = LocalDateTime.of(
                booking.getBookingDate(),
                booking.getStartTime()
        );

        LocalDateTime endDateTime = LocalDateTime.of(
                booking.getBookingDate(),
                booking.getEndTime()
        );

        if (!endDateTime.isAfter(startDateTime)) {
            endDateTime = endDateTime.plusDays(1);
        }

        if (!actualEndDateTime.isAfter(startDateTime)) {
            throw new BookingConflictException("Actual end time must be after booking start time");
        }

        if (!actualEndDateTime.isBefore(endDateTime)) {
            throw new BookingConflictException("No credit available because booking time is already completed");
        }

        long remainingMinutes = Duration.between(actualEndDateTime, endDateTime).toMinutes();

        CustomerCredit credit = new CustomerCredit();
        credit.setPhone(booking.getPhone());
        credit.setFullName(booking.getFullName());
        credit.setRemainingMinutes((int) remainingMinutes);
        credit.setReason("Customer left early from booking #" + booking.getId());

        customerCreditRepository.save(credit);

        booking.setHasCredit(true);
        booking.setRemainingMinutes((int) remainingMinutes);
        booking.setStatus("EARLY_COMPLETED_WITH_CREDIT");

        Booking saved = bookingRepository.save(booking);

        return mapToResponse(saved);
    }
    private BookingResponseDto mapToResponse(Booking booking) {
        List<String> pcNumbers = booking.getAssignedPcs()
                .stream()
                .map(PC::getPcNumber)
                .collect(Collectors.toList());

        return new BookingResponseDto(
                booking.getId(),
                booking.getFullName(),
                booking.getUsername(),
                booking.getPhone(),
                booking.getSelectedGame(),
                booking.getPlanName(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPaidHours(),
                booking.getFreeHours(),
                booking.getTotalHours(),
                booking.getPcCount(),
                booking.getTotalPrice(),
                booking.getOfferApplied(),
                booking.getBookingType(),
                booking.getStatus(),
                booking.getRemainingMinutes(),
                booking.getHasCredit(),
                pcNumbers
        );
    }
}