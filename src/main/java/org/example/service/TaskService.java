package org.example.service;

import org.example.dto.Priority;
import org.example.dto.Task;
import org.example.dto.TaskRequestDto;
import org.example.dto.TaskResponseDto;
import org.example.entity.TaskEntity;

import java.util.List;

public interface TaskService {
    // Basic CRUD operations
    TaskResponseDto createTask(TaskRequestDto taskDto);
    TaskResponseDto getTaskById(Long id);
    List<TaskResponseDto> getAllTasks();
    TaskResponseDto updateTask(Long id, TaskRequestDto taskDto);
    void deleteTask(Long id);

    // Additional operations
    List<TaskResponseDto> getTasksByUserId(Long userId);
    List<TaskResponseDto> getTasksByCategory(String category);
    List<TaskResponseDto> getTasksByStatus(String status);
    List<TaskResponseDto> getTasksByUserIdAndCategory(Long userId, String category);
    List<TaskResponseDto> getTasksByUserIdAndStatus(Long userId, String status);

    List<TaskResponseDto> getAllTasksSortedByCreatedDateDesc();
    List<TaskResponseDto> getAllTasksSortedByCreatedDateAsc();
    List<TaskResponseDto> getAllTasksSortedByPriorityDesc();
    List<TaskResponseDto> getAllTasksSortedByPriorityAsc();
    List<TaskResponseDto> getAllTasksSortedByTitleAsc();
    List<TaskResponseDto> getAllTasksSortedByStatusAsc();

    // Combined filtering and sorting
    List<TaskResponseDto> getTasksByUserIdSortedByPriority(Long userId);
    List<TaskResponseDto> getTasksByUserIdSortedByCreatedDate(Long userId);
    List<TaskResponseDto> getTasksByCategorySortedByPriority(String category);
    List<TaskResponseDto> getTasksByStatusSortedByCreatedDate(String status);
    List<TaskResponseDto> getAllTasksSorted(String sortBy, String direction);

    Long getTaskCountByStatus(String status);
    Long getTaskCountByTeam(String team);

    Long getTotalTaskCount();

    Long getTaskCountByTeamAndPriority(String team, Priority priority);
    List<TaskResponseDto> getTasksByTeamAndPriority(String team, Priority priority);
    List<TaskResponseDto> getTasksByTeam(String team);


    // New method for counting tasks by team and status
    Long getTaskCountByTeamAndStatus(String team, String status);
    Long getTaskCountByUserAndStatus(Long userId, String status);


    // New method for getting tasks by team and status
    List<TaskResponseDto> getTasksByTeamAndStatus(String team, String status);

}
