package ca.uqac.groupe.examgu.response;

import java.util.List;

public class AuthenticationResponse {
    private String token;
    private Long id;
    private List<String> authorities;

    public AuthenticationResponse() {

    }

    public AuthenticationResponse(String token, Long id, List<String> authorities) {
        this.token = token;
        this.id = id;
        this.authorities = authorities;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(List<String> authorities) {
        this.authorities = authorities;
    }
}