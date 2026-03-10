package com.mario.pantry.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Response DTO for inventory items.
 * Includes the computed isLowStock field which is true when quantity is below the minimum threshold.
 */
@Data
@Builder
public class ItemResponse {
    private Long id;
    private String name;
    private Integer quantity;
    private Integer minThreshold;
    private boolean isLowStock;
}
