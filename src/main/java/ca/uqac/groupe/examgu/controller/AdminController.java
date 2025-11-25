package ca.uqac.groupe.examgu.controller;

import ca.uqac.groupe.examgu.entity.User;
import ca.uqac.groupe.examgu.response.UserResponse;
import ca.uqac.groupe.examgu.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Admin REST API Endpoints ", description = "Operation related to admin ")
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @Operation(summary = "Get all users", description = "retrieve a list of all users in the system")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public List<UserResponse> getAllUsers() {
        return adminService.getAllUsers();
    }
    @Operation(summary = "Promote user to admin ", description = "promote user to admin role")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{userId}/role")
    public UserResponse promoteUserToAdmin(@PathVariable @Min(1) long userId) {
        return adminService.promoteToAdmin(userId);
    }
    @Operation(summary = "Delete user  ", description = "Delete a non-admin user from system ")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping ("/{userId}")
    public void deleteUser(@PathVariable @Min(1) long userId) {
        adminService.deleteNonAdminUser(userId);
    }
}
