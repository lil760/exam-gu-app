package ca.uqac.groupe.examgu.repository;

import ca.uqac.groupe.examgu.entity.LoginHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {

    Page<LoginHistory> findAllByOrderByLoginTimeDesc(Pageable pageable);

    Page<LoginHistory> findByUserIdOrderByLoginTimeDesc(Long userId, Pageable pageable);
}
