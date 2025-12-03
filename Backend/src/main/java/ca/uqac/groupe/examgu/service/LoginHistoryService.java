package ca.uqac.groupe.examgu.service;

import ca.uqac.groupe.examgu.entity.User;
import ca.uqac.groupe.examgu.response.LoginHistoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LoginHistoryService {

    void recordLogin(String email, String ipAddress, String userAgent, boolean success);

    Page<LoginHistoryResponse> getAllLoginHistory(Pageable pageable);

    Page<LoginHistoryResponse> getUserLoginHistory(Long userId, Pageable pageable);
}
