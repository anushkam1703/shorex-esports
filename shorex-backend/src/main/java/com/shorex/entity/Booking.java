package com.shorex.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(name = "full_name")
    private String fullName;

    @Column(nullable = false)
    private String phone;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(name = "selected_game")
    private String selectedGame;

    @Column(name = "plan_name")
    private String planName;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "paid_hours", nullable = false)
    private Integer paidHours;

    @Column(name = "free_hours", nullable = false)
    private Integer freeHours;

    @Column(name = "total_hours", nullable = false)
    private Integer totalHours;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Column(name = "offer_applied")
    private String offerApplied;

    @Column(name = "pc_count")
    private Integer pcCount;

    @Column(name = "booking_type")
    private String bookingType;

    @Column(name = "is_new_customer")
    private Boolean isNewCustomer;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "remaining_minutes")
    private Integer remainingMinutes = 0;

    @Column(name = "has_credit")
    private Boolean hasCredit = false;

    @ManyToMany
    @JoinTable(
            name = "booking_pcs",
            joinColumns = @JoinColumn(name = "booking_id"),
            inverseJoinColumns = @JoinColumn(name = "pc_id")
    )
    private List<PC> assignedPcs = new ArrayList<>();

    public Booking() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getFullName() {return fullName;}
    public String getPhone() { return phone; }
    public Game getGame() { return game; }
    public String getSelectedGame() { return selectedGame; }
    public String getPlanName() { return planName; }
    public LocalDate getBookingDate() { return bookingDate; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public Integer getPaidHours() { return paidHours; }
    public Integer getFreeHours() { return freeHours; }
    public Integer getTotalHours() { return totalHours; }
    public Double getTotalPrice() { return totalPrice; }
    public String getOfferApplied() { return offerApplied; }
    public Integer getPcCount() { return pcCount; }
    public String getBookingType() { return bookingType; }
    public Boolean getIsNewCustomer() { return isNewCustomer; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<PC> getAssignedPcs() { return assignedPcs; }

    public Integer getRemainingMinutes() {
		return remainingMinutes;
	}

	public void setRemainingMinutes(Integer remainingMinutes) {
		this.remainingMinutes = remainingMinutes;
	}

	public Boolean getHasCredit() {
		return hasCredit;
	}

	public void setHasCredit(Boolean hasCredit) {
		this.hasCredit = hasCredit;
	}

	public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setFullName(String fullName) {this.fullName = fullName;}
    public void setPhone(String phone) { this.phone = phone; }
    public void setGame(Game game) { this.game = game; }
    public void setSelectedGame(String selectedGame) { this.selectedGame = selectedGame; }
    public void setPlanName(String planName) { this.planName = planName; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public void setPaidHours(Integer paidHours) { this.paidHours = paidHours; }
    public void setFreeHours(Integer freeHours) { this.freeHours = freeHours; }
    public void setTotalHours(Integer totalHours) { this.totalHours = totalHours; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public void setOfferApplied(String offerApplied) { this.offerApplied = offerApplied; }
    public void setPcCount(Integer pcCount) { this.pcCount = pcCount; }
    public void setBookingType(String bookingType) { this.bookingType = bookingType; }
    public void setIsNewCustomer(Boolean isNewCustomer) { this.isNewCustomer = isNewCustomer; }
    public void setStatus(String status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setAssignedPcs(List<PC> assignedPcs) { this.assignedPcs = assignedPcs; }
}