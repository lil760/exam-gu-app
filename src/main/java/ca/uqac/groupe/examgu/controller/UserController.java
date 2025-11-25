package ca.uqac.groupe.examgu.controller;


import ca.uqac.groupe.examgu.request.PasswordUpdateRequest;
import ca.uqac.groupe.examgu.response.UserResponse;
import ca.uqac.groupe.examgu.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Tag(name = "User REST API Endpoints", description = "Operations related to info about current user ")
@Controller
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "User information", description = "Get current user info")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/info")
    public UserResponse getUserInfo() {
        return userService.getUserInfo();

    }

    @Operation(summary = "Delete user", description = "Delete current user account")
    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping
    public void deleteUser() {
        userService.deleteUser();
    }

    @Operation(summary = "Password update", description = "Change user password after verification ")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/password")
    public void updatePassword(@Valid @RequestBody PasswordUpdateRequest passwordUpdateRequest)
            throws Exception {
        userService.updatePassword(passwordUpdateRequest);

    }

}
