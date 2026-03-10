package com.mario.pantry;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for InventoryController security.
 */
@SpringBootTest
@AutoConfigureMockMvc
class InventoryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String VALID_ITEM_JSON = """
            {
                "name": "Test Item",
                "quantity": 10,
                "minThreshold": 5
            }
            """;

    @Test
    @DisplayName("POST /api/items without credentials returns 401")
    void createItem_withoutCredentials_returns401() throws Exception {
        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_ITEM_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/items with admin credentials returns 201")
    void createItem_withAdminCredentials_returns201() throws Exception {
        mockMvc.perform(post("/api/items")
                        .with(httpBasic("admin", "password"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_ITEM_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("POST /api/items with user credentials returns 403")
    void createItem_withUserCredentials_returns403() throws Exception {
        mockMvc.perform(post("/api/items")
                        .with(httpBasic("user", "password"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_ITEM_JSON))
                .andExpect(status().isForbidden());
    }
}