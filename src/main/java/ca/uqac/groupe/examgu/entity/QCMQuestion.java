package ca.uqac.groupe.examgu.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Table(name = "qcm_question")
@Entity
public class QCMQuestion extends Question {

    @Column(name = "multiple_answers_allowed", nullable = false)
    private boolean multipleAnswersAllowed;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Choice> choices = new ArrayList<>();

    public QCMQuestion() {}

    public boolean isMultipleAnswersAllowed() {
        return multipleAnswersAllowed;
    }

    public void setMultipleAnswersAllowed(boolean multipleAnswersAllowed) {
        this.multipleAnswersAllowed = multipleAnswersAllowed;
    }

    public List<Choice> getChoices() { return choices; }
    public void setChoices(List<Choice> choices) { this.choices = choices; }
}
