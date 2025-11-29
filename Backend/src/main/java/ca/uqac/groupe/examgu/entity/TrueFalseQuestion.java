package ca.uqac.groupe.examgu.entity;



import jakarta.persistence.*;

@Entity
@DiscriminatorValue("TRUE_FALSE")
public class TrueFalseQuestion extends Question {

    @Column(nullable = false)
    private boolean correctAnswer;

    // Default constructor
    public TrueFalseQuestion() {
        super();
    }

    public TrueFalseQuestion(String text, double points, int orderIndex, boolean correctAnswer) {
        super(text, points, orderIndex, QuestionType.TRUE_FALSE);
        this.correctAnswer = correctAnswer;
    }

    @Override
    public boolean validateAnswer(Object answer) {
        if (answer instanceof Boolean) {
            return correctAnswer == (Boolean) answer;
        }
        return false;
    }

    // Getters and Setters
    public boolean isCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(boolean correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
}
