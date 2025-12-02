package ca.uqac.groupe.examgu.response;

import java.time.LocalDateTime;

public class ExamTimeInfoResponse {

    private Long examId;

    // Heure actuelle du serveur (pour éviter que l'étudiant triche avec l’horloge locale)
    private LocalDateTime serverNow;

    // Fenêtre temporelle de l’examen
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    // Durée prévue (déjà dans l'entité Exam)
    private Integer durationMinutes;

    // Temps restant (en secondes) pour terminer l’examen
    private long remainingSeconds;

    // Petits flags pratiques pour le front
    private boolean notStarted;
    private boolean inProgress;
    private boolean finished;

    public ExamTimeInfoResponse() {}

    // Getters / setters

    public Long getExamId() { return examId; }
    public void setExamId(Long examId) { this.examId = examId; }

    public LocalDateTime getServerNow() { return serverNow; }
    public void setServerNow(LocalDateTime serverNow) { this.serverNow = serverNow; }

    public LocalDateTime getStartDateTime() { return startDateTime; }
    public void setStartDateTime(LocalDateTime startDateTime) { this.startDateTime = startDateTime; }

    public LocalDateTime getEndDateTime() { return endDateTime; }
    public void setEndDateTime(LocalDateTime endDateTime) { this.endDateTime = endDateTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public long getRemainingSeconds() { return remainingSeconds; }
    public void setRemainingSeconds(long remainingSeconds) { this.remainingSeconds = remainingSeconds; }

    public boolean isNotStarted() { return notStarted; }
    public void setNotStarted(boolean notStarted) { this.notStarted = notStarted; }

    public boolean isInProgress() { return inProgress; }
    public void setInProgress(boolean inProgress) { this.inProgress = inProgress; }

    public boolean isFinished() { return finished; }
    public void setFinished(boolean finished) { this.finished = finished; }
}
