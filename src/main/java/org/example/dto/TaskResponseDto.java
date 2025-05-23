package org.example.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskResponseDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String category;
    private String team;
    private Priority priority;
    private Long userId;
    private LocalDateTime dueDate;
    private Integer duration;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
