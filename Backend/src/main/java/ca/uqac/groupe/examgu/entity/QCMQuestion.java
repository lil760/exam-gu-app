
package ca.uqac.groupe.examgu.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("QCM")
public class QCMQuestion extends Question {

    @Column(nullable = false)
    private boolean multipleAnswersAllowed;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Choice> choices = new ArrayList<>();

    // Default constructor
    public QCMQuestion() {
        super();
    }

    public QCMQuestion(String text, double points, int orderIndex, boolean multipleAnswersAllowed) {
        super(text, points, orderIndex, QuestionType.QCM);
        this.multipleAnswersAllowed = multipleAnswersAllowed;
    }

    @Override
    public boolean validateAnswer(Object answer) {
        if (answer instanceof List<?>) {
            @SuppressWarnings("unchecked")
            List<Long> selectedChoiceIds = (List<Long>) answer;

            List<Long> correctChoiceIds = choices.stream()
                    .filter(Choice::isCorrect)
                    .map(Choice::getId)
                    .toList();

            return selectedChoiceIds.size() == correctChoiceIds.size()
                    && selectedChoiceIds.containsAll(correctChoiceIds);
        }
        return false;
    }

    // Getters and Setters
    public boolean isMultipleAnswersAllowed() {
        return multipleAnswersAllowed;
    }

    public void setMultipleAnswersAllowed(boolean multipleAnswersAllowed) {
        this.multipleAnswersAllowed = multipleAnswersAllowed;
    }

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }
}