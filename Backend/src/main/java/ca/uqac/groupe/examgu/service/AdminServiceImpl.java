package ca.uqac.groupe.examgu.service;

import ca.uqac.groupe.examgu.entity.Authority;
import ca.uqac.groupe.examgu.entity.User;
import ca.uqac.groupe.examgu.repository.UserRepository;
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
@Transactional(readOnly = true)
    @Override
    public UserResponse promoteToAdmin(long userId) {
        Optional<User> user = userRepository.findById(userId);

        if(user.isEmpty() || user.get().getAuthorities().stream().anyMatch(authority ->"ROLE_ADMIN"
                .equals(authority.getAuthority()))) {
throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
        "User does not exist or already an admin");
        }
List<Authority> authorities = new ArrayList<Authority>();
        authorities.add(new Authority("ROLE_ETUDIANT"));
        authorities.add(new Authority("ROLE_ADMIN"));
        user.get().setAuthorities(authorities);
       User savedUser = userRepository.save(user.get());
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
        authorities.add(new Authority("ROLE_ETUDIANT"));
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
    public UserResponse createUser(String firstName, String lastName, String email, String password, String role) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        if(existingUser.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with this email already exists");
        }

        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        List<Authority> authorities = new ArrayList<Authority>();
        authorities.add(new Authority("ROLE_ETUDIANT"));

        if (role != null) {
            if ("ENSEIGNANT".equals(role)) {
                authorities.add(new Authority("ROLE_ENSEIGNANT"));
            } else if ("ADMIN".equals(role)) {
                authorities.add(new Authority("ROLE_ADMIN"));
            }
        }

        user.setAuthorities(authorities);

        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }
    @Override
    @Transactional
    public UserResponse updateUser(long userId, String firstName, String lastName, String email, String password, String role) {
        Optional<User> userOpt = userRepository.findById(userId);

        if(userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        User user = userOpt.get();

        if (firstName != null) {
            user.setFirstName(firstName);
        }

        if (lastName != null) {
            user.setLastName(lastName);
        }

        if (email != null && !email.equals(user.getEmail())) {
            Optional<User> existingUser = userRepository.findByEmail(email);
            if(existingUser.isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already used by another user");
            }
            user.setEmail(email);
        }

        if (password != null) {
            user.setPassword(passwordEncoder.encode(password));
        }

        if (role != null) {
            List<Authority> authorities = new ArrayList<Authority>();
            authorities.add(new Authority("ROLE_ETUDIANT"));

            if ("ENSEIGNANT".equals(role)) {
                authorities.add(new Authority("ROLE_ENSEIGNANT"));
            } else if ("ADMIN".equals(role)) {
                authorities.add(new Authority("ROLE_ADMIN"));
            }

            user.setAuthorities(authorities);
        }

        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }

}
