package org.example.model;


import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    private String message;

    private String subject;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String sourceId; // taskId or userId that generated the notification

    private String sourceType; // TASK or USER

    private boolean read;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus emailDeliveryStatus;

    public enum NotificationType {
        TASK_CREATED,
        TASK_UPDATED,
        TASK_ASSIGNED,
        TASK_COMPLETED,
        DEADLINE_APPROACHING,
        USER_REGISTERED,
        USER_UPDATED_PROFILE,
        USER_JOINED_TEAM
    }

    public enum DeliveryStatus {
        PENDING,
        SENT,
        FAILED,
        NOT_APPLICABLE
    }
}