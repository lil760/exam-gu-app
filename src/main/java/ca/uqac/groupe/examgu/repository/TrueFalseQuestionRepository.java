package ca.uqac.groupe.examgu.repository;

import ca.uqac.groupe.examgu.entity.TrueFalseQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrueFalseQuestionRepository extends JpaRepository<TrueFalseQuestion, Long> {
}
