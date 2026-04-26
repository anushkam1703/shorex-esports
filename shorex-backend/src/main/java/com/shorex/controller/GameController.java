package com.shorex.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.shorex.entity.Game;
import com.shorex.service.GameService;

@RestController
@RequestMapping("/api/games")

public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public List<Game> getAllGames() {
        return gameService.getAllActiveGames();
    }

    @GetMapping("/{id}")
    public Game getGameById(@PathVariable Long id) {
        return gameService.getGameById(id);
    }
}