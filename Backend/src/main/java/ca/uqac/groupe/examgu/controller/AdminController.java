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
import java.util.Map;

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
    @PutMapping("/{userId}/role/admin")
    public UserResponse promoteUserToAdmin(@PathVariable @Min(1) long userId) {
        return adminService.promoteToAdmin(userId);
    }
    @Operation(summary = "Promote user to Teacher ", description = "promote user to teacher role")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{userId}/role/teacher")
    public UserResponse promoteUserToTeacher(@PathVariable @Min(1) long userId){
        return adminService.promoteToTeacher(userId);
    }
    @Operation(summary = "Delete user  ", description = "Delete a non-admin user from system ")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping ("/{userId}")
    public void deleteUser(@PathVariable @Min(1) long userId) {
        adminService.deleteNonAdminUser(userId);
    }
    @Operation(summary = "Update user", description = "Update user information")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{userId}")
    public UserResponse updateUser(@PathVariable @Min(1) long userId, @RequestBody Map<String, String> request) {
        return adminService.updateUser(
                userId,
                request.get("firstName"),
                request.get("lastName"),
                request.get("email"),
                request.get("password"),
                request.get("role")
        );
    }
    @Operation(summary = "Create user", description = "Create a new user in the system")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public UserResponse createUser(@RequestBody Map<String, String> request) {
        return adminService.createUser(
                request.get("firstName"),
                request.get("lastName"),
                request.get("email"),
                request.get("password"),
                request.get("role")
        );
    }

}
