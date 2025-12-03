package ca.uqac.groupe.examgu.response;

import java.util.List;

public class AuthenticationResponse {
    private String token;
    private List<String> authorities;

    public AuthenticationResponse() {

    }

    public AuthenticationResponse(String token, List<String> authorities) {
        this.token = token;
        this.authorities = authorities;
    }

    public List<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(List<String> authorities) {
        this.authorities = authorities;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
