package ca.uqac.groupe.examgu.entity;

import jakarta.persistence.*;

@Table(name = "true_false_question")
@Entity
public class TrueFalseQuestion extends Question {

    @Column(name = "correct_answer", nullable = false)
    private boolean correctAnswer;

    public TrueFalseQuestion() {}

    public boolean isCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(boolean correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
}
