package ca.uqac.groupe.examgu.service;


import ca.uqac.groupe.examgu.response.UserResponse;

public interface UserService {
    UserResponse getUserInfo();
    void deleteUser();
}
