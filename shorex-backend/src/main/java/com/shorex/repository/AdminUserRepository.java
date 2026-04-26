package com.shorex.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shorex.entity.AdminUser;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    Optional<AdminUser> findByUsernameAndActiveTrue(String username);
}