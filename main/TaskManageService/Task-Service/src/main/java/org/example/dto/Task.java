package org.example.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Task {

    private String title;
    private String description;
    private String status;
    private String category;
    private Priority priority;
    private Long userId;
    private Integer duration;
    private LocalDateTime dueDate;
    private String team;


}
