package com.mario.pantry.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request DTO for creating a new inventory item.
 * Validated before reaching the service layer.
 */
@Data
public class CreateItemRequest {
    @NotBlank(message = "Item name must not be blank")
    private String name;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be <0")
    private Integer quantity;

    @NotNull(message = "Minimum threshold is required")
    @Min(value = 0, message = "Minimum threshold cannot be <0")
    private Integer minThreshold;
}
