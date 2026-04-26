package com.shorex.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shorex.entity.Game;

public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByActiveTrue();
}