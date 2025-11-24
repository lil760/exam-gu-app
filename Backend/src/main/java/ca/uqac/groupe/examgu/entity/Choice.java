package ca.uqac.groupe.examgu.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
public class Choice {

    @Id
    private String id;

    @Column(nullable = false)
    private String text;

    private boolean correct;

    public Choice() {
    }

    public Choice(String id, String text, boolean correct) {
        this.id = id;
        this.text = text;
        this.correct = correct;
    }

    public String getId() { 
        return id; 
    }
    public void setId(String id) { 
        this.id = id; 
    }

    public String getText() { 
        return text; 
    }
    public void setText(String text) { 
        this.text = text; 
    }

    public boolean isCorrect() { 
        return correct; 
    }
    public void setCorrect(boolean correct) { 
        this.correct = correct; 
    }

    public void setQuestion(QCMQuestion question) {
        // Si tu veux un mapping bidirectionnel plus tard,
        // tu pourras ajouter un champ @ManyToOne ici.
    }
}
