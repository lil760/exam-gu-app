package ca.uqac.groupe.examgu.service;

import ca.uqac.groupe.examgu.entity.LoginHistory;
import ca.uqac.groupe.examgu.entity.User;
import ca.uqac.groupe.examgu.repository.LoginHistoryRepository;
import ca.uqac.groupe.examgu.repository.UserRepository;
import ca.uqac.groupe.examgu.response.LoginHistoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LoginHistoryServiceImpl implements LoginHistoryService {

    private final LoginHistoryRepository loginHistoryRepository;
    private final UserRepository userRepository;

    public LoginHistoryServiceImpl(LoginHistoryRepository loginHistoryRepository,
                                   UserRepository userRepository) {
        this.loginHistoryRepository = loginHistoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void recordLogin(String email, String ipAddress, String userAgent, boolean success) {
        // On va chercher l’utilisateur à partir de son email
        User user = userRepository.findByEmail(email)
                .orElse(null); // tu peux aussi throw une exception si tu préfères

        LoginHistory history = new LoginHistory();
        history.setUser(user);
        history.setLoginTime(LocalDateTime.now());
        history.setIpAddress(ipAddress);
        history.setUserAgent(userAgent);
        history.setSuccess(success);

        loginHistoryRepository.save(history);
    }

    @Override
    public Page<LoginHistoryResponse> getAllLoginHistory(Pageable pageable) {
        return loginHistoryRepository
                .findAllByOrderByLoginTimeDesc(pageable)
                .map(this::toResponse);
    }

    @Override
    public Page<LoginHistoryResponse> getUserLoginHistory(Long userId, Pageable pageable) {
        return loginHistoryRepository
                .findByUserIdOrderByLoginTimeDesc(userId, pageable)
                .map(this::toResponse);
    }

    private LoginHistoryResponse toResponse(LoginHistory entity) {
        LoginHistoryResponse resp = new LoginHistoryResponse();
        resp.setId(entity.getId());
        if (entity.getUser() != null) {
            resp.setUserId(entity.getUser().getId());
            resp.setEmail(entity.getUser().getEmail());
            // resp.setRole(entity.getUser().getRole().name());
        }
        resp.setLoginTime(entity.getLoginTime());
        resp.setIpAddress(entity.getIpAddress());
        resp.setUserAgent(entity.getUserAgent());
        resp.setSuccess(entity.isSuccess());
        return resp;
    }
}
