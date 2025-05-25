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
        if (dto.getTitle() != null) task.setTitle(dto.getTitle());
        if (dto.getDescription() != null) task.setDescription(dto.getDescription());
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());
        if (dto.getCategory() != null) task.setCategory(dto.getCategory());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getUserId() != null) task.setUserId(dto.getUserId());
        if (dto.getTeam() != null) task.setTeam(dto.getTeam());
        if (dto.getDuration() != null) task.setDuration(dto.getDuration());
        if (dto.getDueDate() != null) task.setDueDate(dto.getDueDate());
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
        TaskEntity task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        updateEntityFromDto(taskDto, task);
        TaskEntity updatedTask = taskRepository.save(task);

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
}