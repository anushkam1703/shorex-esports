package com.shorex.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class BookingResponseDto {

    private Long bookingId;
    private String fullName;
    private String username;
    private String phone;
    private String selectedGame;
    private String planName;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer paidHours;
    private Integer freeHours;
    private Integer totalHours;
    private Integer pcCount;
    private Double totalPrice;
    private String offerApplied;
    private String bookingType;
    private String status;
    private List<String> assignedPcs;
	private Integer remainingMinutes;
	private Boolean hasCredit;
    

    public BookingResponseDto() {
    }

    public BookingResponseDto(Long bookingId, String fullName, String username, String phone, String selectedGame,
                              String planName, LocalDate bookingDate, LocalTime startTime,
                              LocalTime endTime, Integer paidHours, Integer freeHours,
                              Integer totalHours, Integer pcCount, Double totalPrice,
                              String offerApplied, String bookingType, String status,Integer remainingMinutes,
                              Boolean hasCredit,
                              List<String> assignedPcs) {
        this.bookingId = bookingId;
        this.fullName = fullName;
        this.username = username;
        this.phone = phone;
        this.selectedGame = selectedGame;
        this.planName = planName;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.paidHours = paidHours;
        this.freeHours = freeHours;
        this.totalHours = totalHours;
        this.pcCount = pcCount;
        this.totalPrice = totalPrice;
        this.offerApplied = offerApplied;
        this.bookingType = bookingType;
        this.status = status;
        this.assignedPcs = assignedPcs;
        this.remainingMinutes = remainingMinutes;
        this.hasCredit = hasCredit;
    }

    public Long getBookingId() { return bookingId; }
    public String getFullName() { return fullName; }
    public String getUsername() { return username; }
    public String getPhone() { return phone; }
    public String getSelectedGame() { return selectedGame; }
    public String getPlanName() { return planName; }
    public LocalDate getBookingDate() { return bookingDate; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public Integer getPaidHours() { return paidHours; }
    public Integer getFreeHours() { return freeHours; }
    public Integer getTotalHours() { return totalHours; }
    public Integer getPcCount() { return pcCount; }
    public Double getTotalPrice() { return totalPrice; }
    public String getOfferApplied() { return offerApplied; }
    public String getBookingType() { return bookingType; }
    public String getStatus() { return status; }
    public Integer getRemainingMinutes() { return remainingMinutes; }
    public Boolean getHasCredit() { return hasCredit; }
    public List<String> getAssignedPcs() { return assignedPcs; }
    
}