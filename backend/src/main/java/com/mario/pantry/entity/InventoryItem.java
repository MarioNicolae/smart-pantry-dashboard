package com.mario.pantry.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents an item stored in the pantry inventory.
 * Tracks current stock quantity and the minimum threshold below which the item is considered low stock.
 */
@Entity
@Table(name = "inventory_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name must not be blank")
    @Column(nullable = false, unique = true)
    private String name;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be <0")
    @Column(nullable = false)
    private Integer quantity;

    @NotNull(message = "Minimum threshold is required")
    @Min(value = 0, message = "Minimum threshold cannot be <0")
    @Column(nullable = false)
    private Integer minThreshold;
}
