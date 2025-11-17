package ca.uqac.groupe.examgu.repository;

import ca.uqac.groupe.examgu.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamRepository extends JpaRepository<Exam, Long> {
}
