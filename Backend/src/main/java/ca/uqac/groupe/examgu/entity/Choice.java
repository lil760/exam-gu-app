package ca.uqac.groupe.examgu.entity;



import jakarta.persistence.*;

@Table(name = "choices")
@Entity
public class Choice {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private long id;

    @Column(nullable = false, length = 500)
    private String text;

    @Column(nullable = false)
    private boolean isCorrect;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private QCMQuestion question;

    // Default constructor
    public Choice() {}

    public Choice(String text, boolean isCorrect) {
        this.text = text;
        this.isCorrect = isCorrect;
    }

    // Getters and Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }

    public QCMQuestion getQuestion() {
        return question;
    }

    public void setQuestion(QCMQuestion question) {
        this.question = question;
    }
}