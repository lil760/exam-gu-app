package ca.uqac.groupe.examgu.service;

import ca.uqac.groupe.examgu.request.AuthenticationRequest;
import ca.uqac.groupe.examgu.request.RegisterRequest;
import ca.uqac.groupe.examgu.response.AuthenticationResponse;

public interface AuthenticationService {
    void register(RegisterRequest input) throws Exception ;
    AuthenticationResponse login (AuthenticationRequest request) ;
}
