package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskEventDto {
    private String eventType; // CREATED, UPDATED, ASSIGNED, DEADLINE_APPROACHING, COMPLETED
    private String taskId;
    private String taskTitle;
    private String taskDescription;
    private LocalDateTime dueDate;
    private String assignedToUserId;
    private String assignedToUserEmail;
    private String createdByUserId;
    private LocalDateTime eventTime;
}
