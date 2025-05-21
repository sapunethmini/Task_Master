package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDto {
    private Long id;
    private String userId;
    private String message;
    private String subject;
    private String type;
    private String sourceId;
    private String sourceType;
    private boolean read;
    private LocalDateTime createdAt;
}