package com.shorex.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "pcs")
public class PC {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pc_number", unique = true, nullable = false)
    private String pcNumber;

    private Boolean active = true;

    public PC() {
    }

    public Long getId() {
        return id;
    }

    public String getPcNumber() {
        return pcNumber;
    }

    public Boolean getActive() {
        return active;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPcNumber(String pcNumber) {
        this.pcNumber = pcNumber;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}