package ca.uqac.groupe.examgu.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class AuthenticationRequest {
    @NotEmpty(message="email is required")
    @Email(message ="Invalid email format")
    private String email;
    @NotEmpty(message="password is required")
    @Size(min=8,max=30,message="Pasword must be at least 8 character long")
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
