package com.shorex.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shorex.entity.Game;
import com.shorex.exception.ResourceNotFoundException;
import com.shorex.repository.GameRepository;

@Service
public class GameService {

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public List<Game> getAllActiveGames() {
        return gameRepository.findByActiveTrue();
    }

    public Game getGameById(Long id) {
        return gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found"));
    }
}