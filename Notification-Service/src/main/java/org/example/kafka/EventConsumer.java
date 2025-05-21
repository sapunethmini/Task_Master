package org.example.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.dto.TaskEventDto;
import org.example.dto.UserEventDto;
import org.example.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EventConsumer {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "${kafka.topics.task-events}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeTaskEvents(String message) {
        try {
            log.info("Received task event: {}", message);
            TaskEventDto eventDto = objectMapper.readValue(message, TaskEventDto.class);
            processTaskEvent(eventDto);
        } catch (Exception e) {
            log.error("Error processing task event: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(topics = "${kafka.topics.user-events}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeUserEvents(String message) {
        try {
            log.info("Received user event: {}", message);
            UserEventDto eventDto = objectMapper.readValue(message, UserEventDto.class);
            processUserEvent(eventDto);
        } catch (Exception e) {
            log.error("Error processing user event: {}", e.getMessage(), e);
        }
    }

    private void processTaskEvent(TaskEventDto eventDto) {
        log.info("Processing task event: {} for task: {}", eventDto.getEventType(), eventDto.getTaskId());

        String userId = eventDto.getAssignedToUserId();
        String userEmail = eventDto.getAssignedToUserEmail();
        String message = "";
        String type = "TASK";

        switch (eventDto.getEventType()) {
            case "TASK_CREATED":
                message = String.format("New task created: %s", eventDto.getTaskTitle());
                break;
            case "TASK_UPDATED":
                message = String.format("Task updated: %s", eventDto.getTaskTitle());
                break;
            case "TASK_DELETED":
                message = String.format("Task deleted: %s", eventDto.getTaskTitle());
                break;
            case "TASK_ASSIGNED":
                message = String.format("Task assigned to you: %s", eventDto.getTaskTitle());
                break;
            case "TASK_COMPLETED":
                message = String.format("Task marked as completed: %s", eventDto.getTaskTitle());
                break;
            case "TASK_DUE_SOON":
                message = String.format("Task due soon: %s (Due: %s)",
                        eventDto.getTaskTitle(), eventDto.getDueDate());
                break;
            case "TASK_OVERDUE":
                message = String.format("Task is overdue: %s (Due: %s)",
                        eventDto.getTaskTitle(), eventDto.getDueDate());
                break;
            default:
                log.warn("Unknown task event type: {}", eventDto.getEventType());
                return;
        }

        notificationService.createAndSendEmailNotification(userId, userEmail, message, type);
    }

    private void processUserEvent(UserEventDto eventDto) {
        log.info("Processing user event: {} for user: {}", eventDto.getEventType(), eventDto.getUserId());

        String userId = eventDto.getUserId();
        String userEmail = eventDto.getEmail();
        String message = "";
        String type = "USER";

        switch (eventDto.getEventType()) {
            case "USER_REGISTERED":
                message = "Welcome to Task Manager! Your account has been successfully created.";
                break;
            case "PASSWORD_CHANGED":
                message = "Your account password has been changed successfully.";
                break;
            case "PROFILE_UPDATED":
                message = "Your profile has been updated successfully.";
                break;
            case "TEAM_JOINED":
                message = String.format("You have been added to team: %s", eventDto.getTeamName());
                type = "TEAM";
                break;
            case "TEAM_LEFT":
                message = String.format("You have been removed from team: %s", eventDto.getTeamName());
                type = "TEAM";
                break;
            default:
                log.warn("Unknown user event type: {}", eventDto.getEventType());
                return;
        }

        notificationService.createAndSendEmailNotification(userId, userEmail, message, type);
    }
}
