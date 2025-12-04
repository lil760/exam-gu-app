package ca.uqac.groupe.examgu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_history")
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // utilisateur qui s'est connecté
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // date et heure de la tentative de connexion
    @Column(name = "login_time", nullable = false)
    private LocalDateTime loginTime;

    // IP du client
    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    // User-Agent du navigateur
    @Column(name = "user_agent", length = 512)
    private String userAgent;

    // Connexion réussie ou non (on peut garder les échecs aussi)
    @Column(name = "success", nullable = false)
    private boolean success;

    public LoginHistory() {}

    // Getters / setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getLoginTime() { return loginTime; }
    public void setLoginTime(LocalDateTime loginTime) { this.loginTime = loginTime; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}
