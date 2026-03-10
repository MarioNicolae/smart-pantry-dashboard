package com.mario.pantry.controller;

import com.mario.pantry.dto.CreateItemRequest;
import com.mario.pantry.dto.ItemResponse;
import com.mario.pantry.dto.RestockRequest;
import com.mario.pantry.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller       - inventory management endpoints.
 * GET /api/items        - publicly accessible
 * POST /api/items       - ADMIN only
 * PATCH /api/items/{id}/restock - ADMIN only
 * DELETE /api/items/{id}        - ADMIN only
 */
@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<ItemResponse>> getAllItems() {
        return ResponseEntity.ok(inventoryService.getAllItems());
    }

    @PostMapping
    public ResponseEntity<ItemResponse> createItem(@Valid @RequestBody CreateItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inventoryService.createItem(request));
    }

    @PatchMapping("/{id}/restock")
    public ResponseEntity<ItemResponse> restockItem(@PathVariable Long id, @Valid @RequestBody RestockRequest request) {
        return ResponseEntity.ok(inventoryService.restockItem(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
