package org.example.repository;

import org.example.dto.Priority;
import org.example.dto.TaskResponseDto;
import org.example.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    List<TaskEntity> findByUserId(Long userId);
    List<TaskEntity> findByCategory(String category);
    List<TaskEntity> findByStatus(String status);
    List<TaskEntity> findByUserIdAndCategory(Long userId, String category);
    List<TaskEntity> findByUserIdAndStatus(Long userId, String status);

    List<TaskEntity> findAllByOrderByCreatedAtDesc();
    List<TaskEntity> findAllByOrderByCreatedAtAsc();
    List<TaskEntity> findAllByOrderByPriorityDesc();
    List<TaskEntity> findAllByOrderByPriorityAsc();
    List<TaskEntity> findAllByOrderByTitleAsc();
    List<TaskEntity> findAllByOrderByStatusAsc();

    List<TaskEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<TaskEntity> findByUserIdOrderByPriorityDesc(Long userId);
    List<TaskEntity> findByCategoryOrderByPriorityDesc(String category);
    List<TaskEntity> findByStatusOrderByCreatedAtAsc(String status);

    Long countByStatus(String status);
    Long countByTeam(String team);
    Long countByTeamAndPriority(String team, Priority priority);

    List<TaskEntity> findByTeamAndPriority(String team, Priority priority);
}