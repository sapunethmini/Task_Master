package org.example.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.ApiResponse;
import org.example.dto.TaskEventDto;
import org.example.dto.UserEventDto;
import org.example.kafka.EventProducer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Slf4j
public class TestEventController {

    private final EventProducer eventProducer;

    @PostMapping("/task-event")
    public ResponseEntity<ApiResponse> sendTaskEvent(
            @RequestParam String userId,
            @RequestParam String userEmail,
            @RequestParam String taskId,
            @RequestParam String taskTitle,
            @RequestParam(required = false) String taskDescription,
            @RequestParam(required = false) String taskDueDate,
            @RequestParam String eventType) {

        try {
            log.info("Creating test task event: {}", eventType);

            TaskEventDto taskEventDto = TaskEventDto.builder()
                    .eventType(eventType)
                    .taskId(taskId)
                    .taskTitle(taskTitle)
                    .taskDescription(taskDescription)
                    .dueDate(taskDueDate != null ? LocalDateTime.parse(taskDueDate) : null)
                    .assignedToUserId(userId)
                    .assignedToUserEmail(userEmail)
                    .eventTime(LocalDateTime.now())
                    .build();

            eventProducer.sendTaskEvent(taskEventDto);

            return ResponseEntity.ok(new ApiResponse(true, "Task event sent successfully"));
        } catch (DateTimeParseException e) {
            log.error("Invalid date format for taskDueDate: {}", taskDueDate, e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid date format. Please use ISO-8601 format (e.g., 2025-05-20T12:00:00)"));
        } catch (Exception e) {
            log.error("Error processing task event: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error processing task event: " + e.getMessage()));
        }
    }

    @PostMapping("/user-event")
    public ResponseEntity<ApiResponse> sendUserEvent(
            @RequestParam String userId,
            @RequestParam String userEmail,
            @RequestParam String userName,
            @RequestParam(required = false) String teamId,
            @RequestParam(required = false) String teamName,
            @RequestParam String eventType) {

        log.info("Creating test user event: {}", eventType);

        UserEventDto userEventDto = UserEventDto.builder()
                .eventType(eventType)
                .userId(userId)
                .email(userEmail)
                .username(userName)
                .teamId(teamId)
                .teamName(teamName)
                .eventTime(LocalDateTime.now())
                .build();

        eventProducer.sendUserEvent(userEventDto);

        return ResponseEntity.ok(new ApiResponse(true, "User event sent successfully"));
    }
}
