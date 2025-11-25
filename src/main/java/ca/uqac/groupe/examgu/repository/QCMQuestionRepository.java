package ca.uqac.groupe.examgu.repository;

import ca.uqac.groupe.examgu.entity.QCMQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QCMQuestionRepository extends JpaRepository<QCMQuestion, Long> {
}
