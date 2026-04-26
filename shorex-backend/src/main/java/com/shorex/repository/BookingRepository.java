package com.shorex.repository;

import java.time.LocalDate;

import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shorex.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findAllByOrderByBookingDateDescStartTimeAsc();

    List<Booking> findByBookingDateOrderByStartTimeAsc(LocalDate date);

    @Query("""
        SELECT b FROM Booking b
        JOIN b.assignedPcs pc
        WHERE b.bookingDate = :date
        AND b.status IN ('PENDING', 'CONFIRMED', 'BOOKED')
        AND (:start < b.endTime AND :end > b.startTime)
    """)
    List<Booking> findActiveOverlappingBookings(
            @Param("date") LocalDate date,
            @Param("start") LocalTime start,
            @Param("end") LocalTime end
    );

    @Query("""
        SELECT b FROM Booking b
        WHERE b.phone = :phone
        AND b.bookingDate = :date
        AND b.status IN ('PENDING', 'CONFIRMED', 'BOOKED')
        AND (:start < b.endTime AND :end > b.startTime)
    """)
    List<Booking> findUserActiveBookings(
            @Param("phone") String phone,
            @Param("date") LocalDate date,
            @Param("start") LocalTime start,
            @Param("end") LocalTime end
    );

    List<Booking> findByStatusAndBookingTypeAndCreatedAtBefore(
            String status,
            String bookingType,
            LocalDateTime createdAt
    );
    
    @Query("""
    	    SELECT COUNT(b) FROM Booking b
    	    WHERE LOWER(TRIM(b.fullName)) = LOWER(TRIM(:fullName))
    	    AND b.status IN ('CONFIRMED', 'COMPLETED', 'EARLY_COMPLETED_WITH_CREDIT')
    	""")
    	long countSuccessfulBookingsByFullName(@Param("fullName") String fullName);
}