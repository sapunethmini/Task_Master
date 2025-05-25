package org.example.controller;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.ApiResponse;
import org.example.dto.NotificationResponseDto;
import org.example.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<?> getNotificationsByUserId(@RequestParam String userId) {
        try {
            log.info("Fetching notifications for user (query param): {}", userId);
            List<NotificationResponseDto> notifications = notificationService.getUserNotifications(userId);
            
            if (notifications.isEmpty()) {
                return ResponseEntity.ok()
                    .body(new ApiResponse(true, "No notifications found for user: " + userId, List.of()));
            }
            
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching notifications for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error fetching notifications: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserNotifications(@PathVariable String userId) {
        try {
            log.info("Fetching all notifications for user: {}", userId);
            List<NotificationResponseDto> notifications = notificationService.getUserNotifications(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching notifications for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error fetching notifications: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}/paged")
    public ResponseEntity<?> getUserNotificationsPaged(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            log.info("Fetching paged notifications for user: {}, page: {}, size: {}", userId, page, size);
            Pageable pageable = PageRequest.of(page, size);
            Page<NotificationResponseDto> notifications = notificationService.getUserNotificationsPaged(userId, pageable);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching paged notifications for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error fetching paged notifications: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<?> getUnreadCount(@PathVariable String userId) {
        try {
            log.info("Counting unread notifications for user: {}", userId);
            long count = notificationService.countUnreadNotifications(userId);
            return ResponseEntity.ok(Map.of("unreadCount", count));
        } catch (Exception e) {
            log.error("Error counting unread notifications for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error counting unread notifications: " + e.getMessage()));
        }
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponseDto> markAsRead(@PathVariable Long notificationId) {
        log.info("Marking notification as read: {}", notificationId);
        NotificationResponseDto notification = notificationService.markAsRead(notificationId);

        if (notification != null) {
            return ResponseEntity.ok(notification);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/user/{userId}/read-all")
    public ResponseEntity<ApiResponse> markAllAsRead(@PathVariable String userId) {
        log.info("Marking all notifications as read for user: {}", userId);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(new ApiResponse(true, "All notifications marked as read"));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<ApiResponse> deleteNotification(@PathVariable Long notificationId) {
        log.info("Deleting notification: {}", notificationId);
        notificationService.deleteNotification(notificationId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse(true, "Notification deleted successfully"));
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> deleteAllUserNotifications(@PathVariable String userId) {
        log.info("Deleting all notifications for user: {}", userId);
        notificationService.deleteAllUserNotifications(userId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse(true, "All notifications deleted successfully"));
    }

    // For testing purposes only - would be removed in production
    @PostMapping("/test")
    public ResponseEntity<NotificationResponseDto> createTestNotification(
            @RequestParam String userId,
            @RequestParam String message,
            @RequestParam(defaultValue = "TASK_CREATED") String type) {

        log.info("Creating test notification for user: {}", userId);
        NotificationResponseDto notification = notificationService.createNotification(userId, message, type, false);
        return ResponseEntity.status(HttpStatus.CREATED).body(notification);
    }
}