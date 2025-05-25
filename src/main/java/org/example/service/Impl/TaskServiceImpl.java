package org.example.service.Impl;
import org.example.dto.Priority;
import org.example.dto.TaskRequestDto;
import org.example.dto.TaskResponseDto;
import org.example.entity.TaskEntity;
import org.example.repository.TaskRepository;
import org.example.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    private TaskEntity convertToEntity(TaskResponseDto dto) {
        TaskEntity task = new TaskEntity();
        task.setTeam(dto.getTeam());
        task.setId(dto.getId());
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setCategory(dto.getCategory());
        task.setPriority(dto.getPriority());
        task.setUserId(dto.getUserId());
        task.setCreatedAt(dto.getCreatedAt());
        task.setUpdatedAt(dto.getUpdatedAt());
        task.setDueDate(dto.getDueDate());
        task.setDuration(dto.getDuration());
        return task;
    }

    private TaskEntity convertToEntity(TaskRequestDto dto) {
        TaskEntity task = new TaskEntity();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setCategory(dto.getCategory());
        task.setPriority(dto.getPriority());
        task.setUserId(dto.getUserId());
        task.setTeam(dto.getTeam());
        task.setDuration(dto.getDuration());
        task.setDueDate(dto.getDueDate());
        return task;
    }

    private TaskResponseDto convertToDto(TaskEntity task) {
        TaskResponseDto dto = new TaskResponseDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setCategory(task.getCategory());
        dto.setTeam(task.getTeam());
        dto.setDuration(task.getDuration());
        dto.setDueDate(task.getDueDate());
        dto.setUserId(task.getUserId());
        try {
            dto.setPriority(task.getPriority());
        } catch (Exception e) {
            dto.setPriority(Priority.LOW);
        }
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }

    // Update entity from DTO
    private void updateEntityFromDto(TaskRequestDto dto, TaskEntity task) {
        // Log the incoming DTO for debugging
        System.out.println("Updating task with DTO: " + dto);
        
        // Update all fields from DTO
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setCategory(dto.getCategory());
        task.setPriority(dto.getPriority());
        task.setTeam(dto.getTeam());
        task.setDuration(dto.getDuration());
        task.setDueDate(dto.getDueDate());
        
        // Don't update userId if it's null in the request
        if (dto.getUserId() != null) {
            task.setUserId(dto.getUserId());
        }
        
        // Log the updated task for debugging
        System.out.println("Updated task entity: " + task);
    }

    private TaskResponseDto convertToResponseDto(TaskEntity entity) {
        TaskResponseDto dto = new TaskResponseDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setStatus(entity.getStatus());
        dto.setCategory(entity.getCategory());
        dto.setTeam(entity.getTeam());
        dto.setPriority(entity.getPriority());
        dto.setUserId(entity.getUserId());
        dto.setDueDate(entity.getDueDate());
        dto.setDuration(entity.getDuration());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
    @Override
    public TaskResponseDto createTask(TaskRequestDto taskDto) {
        TaskEntity task = convertToEntity(taskDto);
        TaskEntity savedTask = taskRepository.save(task);
        return convertToDto(savedTask);
    }

    @Override
    public TaskResponseDto getTaskById(Long id) {
        TaskEntity task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        return convertToDto(task);
    }

    @Override
    public List<TaskResponseDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponseDto updateTask(Long id, TaskRequestDto taskDto) {
        System.out.println("Updating task with ID: " + id);
        TaskEntity task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        System.out.println("Found existing task: " + task);
        updateEntityFromDto(taskDto, task);
        TaskEntity updatedTask = taskRepository.save(task);
        System.out.println("Saved updated task: " + updatedTask);

        return convertToDto(updatedTask);
    }

    @Override
    public void deleteTask(Long id) {
        TaskEntity task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        taskRepository.delete(task);
    }

    @Override
    public List<TaskResponseDto> getTasksByUserId(Long userId) {
        return taskRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getTasksByCategory(String category) {
        if (category.startsWith("{") && category.endsWith("}")) {
            category = category.substring(1, category.length() - 1);
        }

        List<TaskEntity> tasks = taskRepository.findByCategory(category);
        return tasks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getTasksByStatus(String status) {
        return taskRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getTasksByUserIdAndCategory(Long userId, String category) {
        return taskRepository.findByUserIdAndCategory(userId, category).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getTasksByUserIdAndStatus(Long userId, String status) {
        return taskRepository.findByUserIdAndStatus(userId, status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getAllTasksSortedByCreatedDateDesc() {
        return taskRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getAllTasksSortedByCreatedDateAsc() {
        return taskRepository.findAllByOrderByCreatedAtAsc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getAllTasksSortedByPriorityDesc() {
        return taskRepository.findAllByOrderByPriorityDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getAllTasksSortedByPriorityAsc() {
        return taskRepository.findAllByOrderByPriorityAsc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getAllTasksSortedByTitleAsc() {
        return taskRepository.findAllByOrderByTitleAsc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getAllTasksSortedByStatusAsc() {
        return taskRepository.findAllByOrderByStatusAsc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getTasksByUserIdSortedByPriority(Long userId) {
        return taskRepository.findByUserIdOrderByPriorityDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getTasksByUserIdSortedByCreatedDate(Long userId) {
        return taskRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getTasksByCategorySortedByPriority(String category) {
        return taskRepository.findByCategoryOrderByPriorityDesc(category).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getTasksByStatusSortedByCreatedDate(String status) {
        return taskRepository.findByStatusOrderByCreatedAtAsc(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getAllTasksSorted(String sortBy, String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ?
                Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(sortDirection, sortBy);

        return taskRepository.findAll(sort).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Long getTaskCountByStatus(String status) {
        return taskRepository.countByStatus(status);
    }


    @Override
    public Long getTaskCountByTeam(String team) {

        return taskRepository.countByTeam(team);
    }



    @Override
    public Long getTotalTaskCount() {
        return taskRepository.count();
    }


    @Override
    public Long getTaskCountByTeamAndPriority(String team, Priority priority) {
        return taskRepository.countByTeamAndPriority(team, priority); // Correct parameter order
    }


    @Override
    public Long getTaskCountByTeamAndStatus(String team, String status) {
        System.out.println("Service: Counting tasks for team: " + team + ", status: " + status);
        Long count = taskRepository.countByTeamAndStatus(team, status);
        System.out.println("Service: Found count: " + count);
        return count;
    }

    @Override
    public Long getTaskCountByUserAndStatus(Long userId, String status) {
        return taskRepository.countByUserIdAndStatus(userId, status);
    }




    @Override
    public List<TaskResponseDto> getTasksByTeamAndStatus(String team, String status) {
        List<TaskEntity> tasks = taskRepository.findByTeamAndStatus(team, status);
        return tasks.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getTasksByTeamAndPriority(String team, Priority priority) {
        return taskRepository.findByTeamAndPriority(team, priority).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getTasksByTeam(String team) {
        return taskRepository.findByTeam(team).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

}