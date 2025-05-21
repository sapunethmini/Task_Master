package org.example.service;

import org.example.dto.NotificationResponseDto;
import org.example.model.Notification;
import org.example.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    @Transactional
    public NotificationResponseDto createNotification(String userId, String message, String type, boolean isRead) {
        log.info("Creating notification for user: {}, type: {}", userId, type);

        Notification notification = Notification.builder()
                .userId(userId)
                .message(message)
                .type(Notification.NotificationType.valueOf(type))
                .read(isRead)
                .createdAt(LocalDateTime.now())
                .build();

        Notification savedNotification = notificationRepository.save(notification);
        return mapToDto(savedNotification);
    }

    @Transactional
    public NotificationResponseDto createAndSendEmailNotification(String userId, String userEmail, String message, String type) {
        log.info("Creating notification with email for user: {}, email: {}", userId, userEmail);

        // Create notification in database
        NotificationResponseDto notificationDto = createNotification(userId, message, type, false);

        // Send email notification
        try {
            emailService.sendEmail(userEmail, "Task Manager Notification", message);
            log.info("Email notification sent successfully to: {}", userEmail);
        } catch (Exception e) {
            log.error("Failed to send email notification: {}", e.getMessage(), e);
        }

        return notificationDto;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getUserNotifications(String userId) {
        log.info("Fetching notifications for user: {}", userId);

        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponseDto> getUserNotificationsPaged(String userId, Pageable pageable) {
        log.info("Fetching paged notifications for user: {}", userId);

        Page<Notification> notificationsPage = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return notificationsPage.map(this::mapToDto);
    }

    @Transactional
    public NotificationResponseDto markAsRead(Long notificationId) {
        log.info("Marking notification as read: {}", notificationId);

        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setRead(true);
            return mapToDto(notificationRepository.save(notification));
        } else {
            log.warn("Notification not found with id: {}", notificationId);
            return null;
        }
    }

    @Transactional
    public void markAllAsRead(String userId) {
        log.info("Marking all notifications as read for user: {}", userId);

        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndReadFalse(userId);
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
        });
        notificationRepository.saveAll(unreadNotifications);
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        log.info("Deleting notification: {}", notificationId);
        notificationRepository.deleteById(notificationId);
    }

    @Transactional
    public void deleteAllUserNotifications(String userId) {
        log.info("Deleting all notifications for user: {}", userId);
        notificationRepository.deleteByUserId(userId);
    }

    @Transactional(readOnly = true)
    public long countUnreadNotifications(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    private NotificationResponseDto mapToDto(Notification notification) {
        return NotificationResponseDto.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .message(notification.getMessage())
                .type(notification.getType().name())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}