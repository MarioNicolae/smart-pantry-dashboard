package com.mario.pantry.service;

import com.mario.pantry.dto.CreateItemRequest;
import com.mario.pantry.dto.ItemResponse;
import com.mario.pantry.dto.RestockRequest;
import com.mario.pantry.entity.InventoryItem;
import com.mario.pantry.repository.InventoryItemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service layer for inventory management business logic.
 * - we handle item creation, restocking, retrieval and deletion
 * - one very important method is isLowStock
 */
@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryItemRepository repository;

    /**
     * Retrieves all inventory items with computed isLowStock
     */
    public List<ItemResponse> getAllItems() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Creates new inventory item.
     */
    public ItemResponse createItem(CreateItemRequest request) {
        InventoryItem item = InventoryItem.builder()
                .name(request.getName())
                .quantity(request.getQuantity())
                .minThreshold(request.getMinThreshold())
                .build();
        return toResponse(repository.save(item));
    }

    /**
     * Adds given quantity to current stock of item.
     */
    public ItemResponse restockItem(Long id, RestockRequest request) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("The Item with id " + id + " was not found!!!"));
        item.setQuantity(item.getQuantity() + request.getQuantity());
        return toResponse(repository.save(item));
    }

    /**
     * Deletes an inventory item by id.
     */
    public void deleteItem(Long id) {
        if(!repository.existsById(id))
            throw new EntityNotFoundException("Item with id " + id + " was not found !!");
        repository.deleteById(id);
    }

    /**
     * Maps an InventoryItem entity to an ItemResponse DTO and computes the isLowStock flag
     * This is true when quantity is < minimum threshold
     */
    private ItemResponse toResponse(InventoryItem item) {
        return ItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .quantity(item.getQuantity())
                .minThreshold(item.getMinThreshold())
                .isLowStock(item.getQuantity() < item.getMinThreshold())
                .build();
    }
}
