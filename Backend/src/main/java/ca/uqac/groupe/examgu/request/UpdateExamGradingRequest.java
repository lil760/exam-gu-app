package ca.uqac.groupe.examgu.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class UpdateExamGradingRequest {

    @NotNull
    private List<QuestionPointsUpdate> questions;

    public List<QuestionPointsUpdate> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionPointsUpdate> questions) {
        this.questions = questions;
    }

    public static class QuestionPointsUpdate {

        @NotNull
        private Long questionId;

        @Min(0)
        private double points;

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public double getPoints() {
            return points;
        }

        public void setPoints(double points) {
            this.points = points;
        }
    }
}
