package org.example.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@Data
public class TaskRequestDto {
    private String title;
    private String description;
    private String status;
    private String category;
    private String team;
    private Priority priority;

    @JsonProperty("userId")  // Explicitly define the JSON property name
    private Long userId;

    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime dueDate;

    private Integer duration;

    // Add toString method for debugging
    @Override
    public String toString() {
        return "TaskRequestDto{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", status='" + status + '\'' +
                ", category='" + category + '\'' +
                ", team='" + team + '\'' +
                ", priority=" + priority +
                ", userId=" + userId +
                ", dueDate=" + dueDate +
                ", duration=" + duration +
                '}';
    }
}