package com.shorex.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shorex.entity.CustomerCredit;

public interface CustomerCreditRepository extends JpaRepository<CustomerCredit, Long> {

    List<CustomerCredit> findByPhoneAndUsedFalseOrderByCreatedAtDesc(String phone);
}