package ca.uqac.groupe.examgu.controller;

import ca.uqac.groupe.examgu.response.LoginHistoryResponse;
import ca.uqac.groupe.examgu.service.LoginHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/login-history")
@Tag(name = "Admin – Login History", description = "View user connection logs")
public class AdminLoginHistoryController {

    private final LoginHistoryService loginHistoryService;

    public AdminLoginHistoryController(LoginHistoryService loginHistoryService) {
        this.loginHistoryService = loginHistoryService;
    }

    @Operation(summary = "Get all login history", description = "Accessible only by admin")
    @GetMapping
    public Page<LoginHistoryResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return loginHistoryService.getAllLoginHistory(PageRequest.of(page, size));
    }

    @Operation(summary = "Get login history for specific user", description = "Accessible only by admin")
    @GetMapping("/{userId}")
    public Page<LoginHistoryResponse> getByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return loginHistoryService.getUserLoginHistory(userId, PageRequest.of(page, size));
    }
}
