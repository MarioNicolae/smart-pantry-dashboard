package com.mario.pantry.repository;

import com.mario.pantry.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for InventoryItem persistence operations.
 * Extends JpaRepository to provide standard CRUD operations.
 */
@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
}
