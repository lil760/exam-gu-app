package ca.uqac.groupe.examgu.controller;

import ca.uqac.groupe.examgu.entity.User;
import ca.uqac.groupe.examgu.request.AuthenticationRequest;
import ca.uqac.groupe.examgu.request.RegisterRequest;
import ca.uqac.groupe.examgu.response.AuthenticationResponse;
import ca.uqac.groupe.examgu.service.AuthenticationService;
import ca.uqac.groupe.examgu.service.LoginHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication REST API Endpoints", description = "Operations related to register & login")

public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final LoginHistoryService loginHistoryService;


    public AuthenticationController(AuthenticationService authenticationService,
                                    LoginHistoryService loginHistoryService) {
        this.authenticationService = authenticationService;
        this.loginHistoryService = loginHistoryService;
    }

    @Operation(summary ="Register a user ", description ="Create new user in database " )
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public void register(@Valid @RequestBody RegisterRequest registerRequest) throws Exception {
        authenticationService.register(registerRequest);
    }

    @Operation(summary ="Login a user", description ="submit email & password to authenticate user ")
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/login")
    public AuthenticationResponse login(@Valid @RequestBody AuthenticationRequest authRequest,  HttpServletRequest request)  {
        AuthenticationResponse response = authenticationService.login(authRequest);

        String email = authRequest.getEmail();

        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");



        loginHistoryService.recordLogin(email, ipAddress, userAgent, true);


        return response;
    }


}