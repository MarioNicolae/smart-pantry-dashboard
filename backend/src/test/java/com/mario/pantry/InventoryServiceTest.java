package com.mario.pantry;

import com.mario.pantry.dto.ItemResponse;
import com.mario.pantry.entity.InventoryItem;
import com.mario.pantry.repository.InventoryItemRepository;
import com.mario.pantry.service.InventoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

/**
 * Unit tests for InventoryService.
 */
@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private InventoryItemRepository repository;

    @InjectMocks
    private InventoryService inventoryService;

    private InventoryItem item;

    @BeforeEach
    void setUp() {
        item = InventoryItem.builder()
                .id(1L)
                .name("Mario")
                .quantity(10)
                .minThreshold(10)
                .build();
    }

    @Test
    @DisplayName("isLowStock is false when quantity equals minThreshold")
    void isLowStock_false_whenQuantityEqualsMinThreshold() {
        item.setQuantity(10);
        item.setMinThreshold(10);
        when(repository.findAll()).thenReturn(List.of(item));

        ItemResponse response = inventoryService.getAllItems().get(0);

        assertThat(response.isLowStock()).isFalse();
    }

    @Test
    @DisplayName("isLowStock is true when quantity is below minThreshold")
    void isLowStock_true_whenQuantityBelowMinThreshold() {
        item.setQuantity(5);
        item.setMinThreshold(10);
        when(repository.findAll()).thenReturn(List.of(item));

        ItemResponse response = inventoryService.getAllItems().get(0);

        assertThat(response.isLowStock()).isTrue();
    }

    @Test
    @DisplayName("isLowStock is false when quantity is above minThreshold")
    void isLowStock_false_whenQuantityAboveMinThreshold() {
        item.setQuantity(15);
        item.setMinThreshold(10);
        when(repository.findAll()).thenReturn(List.of(item));

        ItemResponse response = inventoryService.getAllItems().get(0);

        assertThat(response.isLowStock()).isFalse();
    }
}