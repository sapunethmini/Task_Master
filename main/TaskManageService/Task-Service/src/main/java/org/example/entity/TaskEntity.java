package org.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.example.dto.Priority;
import org.example.converter.PriorityConverter;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
public class TaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String status;
    private String category;
    private String team;

    @Convert(converter = PriorityConverter.class)
    @Column(name = "priority", length = 20)
    private Priority priority;
    
    private LocalDateTime dueDate;
    private Integer duration; // Duration in hours
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Column(name = "user_id", nullable = false)
    private Long userId; // to link with User Service

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        // Set default priority if not specified
        if (priority == null) {
            priority = Priority.LOW;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Convert string priority to enum for existing data migration
    @PostLoad
    protected void onLoad() {
        if (priority == null) {
            priority = Priority.LOW;
        }
    }
}