package ca.uqac.groupe.examgu.repository;

import ca.uqac.groupe.examgu.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
