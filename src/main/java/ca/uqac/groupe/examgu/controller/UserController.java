package ca.uqac.groupe.examgu.controller;


import ca.uqac.groupe.examgu.response.UserResponse;
import ca.uqac.groupe.examgu.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
@Tag(name="User REST API Endpoints", description = "Operations related to info about current user ")
@Controller
@RequestMapping("/api/users")
public class UserController {
private final UserService userService;
public UserController(UserService userService) {
    this.userService = userService;
}
 @GetMapping("/info")
public UserResponse getUserInfo(){
    return userService.getUserInfo();

 }
 @DeleteMapping
    public void deleteUser(){
userService.deleteUser();
    }

}
