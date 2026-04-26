package com.shorex.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shorex.entity.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {
}