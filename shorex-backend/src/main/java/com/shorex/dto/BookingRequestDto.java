package com.shorex.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.*;

public class BookingRequestDto {
	
	@NotBlank(message = "Full name is required")
	private String fullName;
	
    @NotBlank(message = "Username is required")
    private String username;

 
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;
    
    @NotNull(message = "Selected game is required")
    private Long gameId = 1L;

    @NotBlank
    private String selectedGame;

    @NotBlank(message = "Plan name is required")
    private String planName;

    @NotNull
    private LocalDate bookingDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    @Min(1)
    @Max(10)
    private Integer paidHours;

    @NotNull
    @Min(1)
    private Integer pcCount;

    @NotNull
    private Double totalPrice;

    private Boolean isNewCustomer = false;

    private String bookingType = "ONLINE";

    public String getUsername() { return username; }
    
    public String getPhone() { return phone; }
    public Long getGameId() { return gameId; }
    public String getSelectedGame() { return selectedGame; }
    public String getPlanName() { return planName; }
    public LocalDate getBookingDate() { return bookingDate; }
    public LocalTime getStartTime() { return startTime; }
    public Integer getPaidHours() { return paidHours; }
    public Integer getPcCount() { return pcCount; }
    public Double getTotalPrice() { return totalPrice; }
    public Boolean getIsNewCustomer() { return isNewCustomer; }
    public String getBookingType() { return bookingType; }
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public void setUsername(String username) { this.username = username; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setGameId(Long gameId) { this.gameId = gameId; }
    public void setSelectedGame(String selectedGame) { this.selectedGame = selectedGame; }
    public void setPlanName(String planName) { this.planName = planName; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public void setPaidHours(Integer paidHours) { this.paidHours = paidHours; }
    public void setPcCount(Integer pcCount) { this.pcCount = pcCount; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public void setIsNewCustomer(Boolean isNewCustomer) { this.isNewCustomer = isNewCustomer; }
    public void setBookingType(String bookingType) { this.bookingType = bookingType; }
}