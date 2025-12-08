package ca.uqac.groupe.examgu.service;

import ca.uqac.groupe.examgu.entity.Authority;
import ca.uqac.groupe.examgu.entity.User;
import ca.uqac.groupe.examgu.repository.UserRepository;
import ca.uqac.groupe.examgu.request.RegisterRequest;
import ca.uqac.groupe.examgu.response.UserResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Service
public class AdminServiceImpl implements AdminService {
    private final PasswordEncoder passwordEncoder;
private final UserRepository userRepository;

    public AdminServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return StreamSupport.stream(userRepository.findAll().spliterator(),false)
                .map(this::convertToUserResponse).toList();
    }
@Transactional
    @Override
    public UserResponse promoteToAdmin(long userId) {
        Optional<User> user1 = userRepository.findById(userId);

        if(user1.isEmpty() || user1.get().getAuthorities().stream().anyMatch(authority ->"ROLE_ADMIN"
                .equals(authority.getAuthority()))) {
throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
        "User does not exist or already an admin");
        }
User user =user1.get();
        List<Authority> authorities = new ArrayList<Authority>();
    user.getAuthorities().forEach(a -> authorities.add((Authority) a));

        authorities.add(new Authority("ROLE_ADMIN"));
        user.setAuthorities(authorities);
       User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }
    @Override
    @Transactional
    public UserResponse promoteToTeacher(long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getAuthorities().stream().anyMatch(authority ->
                "ROLE_ENSEIGNANT".equals(authority.getAuthority()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is already a teacher");
        }

        List<Authority> authorities = new ArrayList<>();
        user.getAuthorities().forEach(a -> authorities.add((Authority) a));

        authorities.add(new Authority("ROLE_ENSEIGNANT"));
        user.setAuthorities(authorities);

        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }

    @Override
    @Transactional
    public void deleteNonAdminUser(long userId) {
Optional<User> user = userRepository.findById(userId);

        if(user.isEmpty() || user.get().getAuthorities().stream().anyMatch(authority ->"ROLE_ADMIN"
                .equals(authority.getAuthority()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "User does not exist or already an admin");
        }
        userRepository.delete(user.get());
    }

    private UserResponse convertToUserResponse(User user) {
return new UserResponse(user.getId(),
        user.getFirstName()+""+user.getLastName()
        ,user.getEmail(),
        user.getAuthorities().stream().map(auth ->(Authority) auth).toList());
}
    @Override
    @Transactional
    public UserResponse createUser(RegisterRequest request) {
        if (isEmailTaken(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already taken");
        }

        User user = buildUserForAdmin(request);
        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse updateUser(long userId, RegisterRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        if (!request.getEmail().equals(user.getEmail())) {
            if (isEmailTaken(request.getEmail())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already used by another user");
            }
            user.setEmail(request.getEmail());
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }

    private boolean isEmailTaken(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    private User buildUserForAdmin(RegisterRequest request) {
        User user = new User();
        user.setId(0);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Les utilisateurs créés par l'admin sont toujours des étudiants par défaut
        List<Authority> authorities = new ArrayList<>();
        authorities.add(new Authority("ROLE_ETUDIANT"));
        user.setAuthorities(authorities);

        return user;
    }

}
