package ca.uqac.groupe.examgu.service;

import ca.uqac.groupe.examgu.request.RegisterRequest;
import ca.uqac.groupe.examgu.response.UserResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AdminService {
    List<UserResponse> getAllUsers();
    UserResponse promoteToAdmin(long userId);
UserResponse promoteToTeacher(long userId);
    void deleteNonAdminUser(long userId);
    UserResponse createUser(RegisterRequest request);
    UserResponse updateUser(long userId, RegisterRequest request);

}
