package com.mario.pantry.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request DTO for restocking an existing inventory item.
 * The quantity field represents the amount to ADD to current stock.
 */
@Data
public class RestockRequest {
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Restock quantity must be >= 1")
    private Integer quantity;
}
