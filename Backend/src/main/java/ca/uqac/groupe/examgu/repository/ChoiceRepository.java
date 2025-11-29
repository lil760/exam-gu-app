package ca.uqac.groupe.examgu.repository;





import ca.uqac.groupe.examgu.entity.Choice;
import ca.uqac.groupe.examgu.entity.QCMQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChoiceRepository extends JpaRepository<Choice, Long> {
    List<Choice> findByQuestion(QCMQuestion question);
    void deleteByQuestion(QCMQuestion question);
}
