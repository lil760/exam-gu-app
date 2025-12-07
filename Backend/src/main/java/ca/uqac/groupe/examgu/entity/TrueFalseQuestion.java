package ca.uqac.groupe.examgu.entity;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("TRUE_FALSE")
public class TrueFalseQuestion extends Question {

    public TrueFalseQuestion() {
        super();
    }

    public TrueFalseQuestion(String text, double points, int orderIndex, boolean correctAnswer) {
        super(text, points, orderIndex, QuestionType.TRUE_FALSE);
        setMultipleAnswersAllowed(false);
        setCorrectAnswer(correctAnswer);
    }

    @Override
    public boolean validateAnswer(Object answer) {
        if (answer instanceof Boolean) {
            return isCorrectAnswer() == (Boolean) answer;
        }
        return false;
    }

    public boolean isCorrectAnswer() {
        return super.isCorrectAnswer();
    }

    public void setCorrectAnswer(boolean correctAnswer) {
        super.setCorrectAnswer(correctAnswer);
    }
}
