package com.shorex.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shorex.entity.PC;

public interface PcRepository extends JpaRepository<PC, Long> {

    List<PC> findByActiveTrueOrderByPcNumberAsc();
}