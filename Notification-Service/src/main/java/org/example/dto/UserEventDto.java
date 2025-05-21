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
public class UserEventDto {
    private String eventType; // REGISTERED, UPDATED_PROFILE, JOINED_TEAM
    private String userId;
    private String username;
    private String email;
    private String teamId;
    private String teamName;
    private LocalDateTime eventTime;
}
