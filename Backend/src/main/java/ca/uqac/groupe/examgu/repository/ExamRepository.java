package ca.uqac.groupe.examgu.repository;

import ca.uqac.groupe.examgu.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    List<Exam> findByStartDateTimeLessThanEqualAndEndDateTimeGreaterThanEqual(
            LocalDateTime currentTime1,
            LocalDateTime currentTime2
    );
}
