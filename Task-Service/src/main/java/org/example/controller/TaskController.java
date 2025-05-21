package org.example.controller;
import org.example.dto.TaskRequestDto;
import org.example.dto.TaskResponseDto;
import org.example.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/createTask")
    public ResponseEntity<TaskResponseDto> createTask(@RequestBody TaskRequestDto taskDto) {
        if (taskDto.getUserId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // For debugging
        System.out.println("Received userId: " + taskDto.getUserId());

        TaskResponseDto createdTask = taskService.createTask(taskDto);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<TaskResponseDto> getTaskById(@PathVariable Long id) {
        TaskResponseDto task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getAllTasks() {
        List<TaskResponseDto> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDto> updateTask(@PathVariable Long id, @RequestBody TaskRequestDto taskDto) {
        TaskResponseDto updatedTask = taskService.updateTask(id, taskDto);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByUserId(@PathVariable Long userId) {
        List<TaskResponseDto> tasks = taskService.getTasksByUserId(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByCategory(@PathVariable String category) {
        List<TaskResponseDto> tasks = taskService.getTasksByCategory(category);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByStatus(@PathVariable String status) {
        List<TaskResponseDto> tasks = taskService.getTasksByStatus(status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByUserIdAndCategory(
            @PathVariable Long userId,
            @PathVariable String category) {
        List<TaskResponseDto> tasks = taskService.getTasksByUserIdAndCategory(userId, category);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByUserIdAndStatus(
            @PathVariable Long userId,
            @PathVariable String status) {
        List<TaskResponseDto> tasks = taskService.getTasksByUserIdAndStatus(userId, status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort/created-date/desc")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSortedByCreatedDateDesc() {
        List<TaskResponseDto> tasks = taskService.getAllTasksSortedByCreatedDateDesc();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort/created-date/asc")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSortedByCreatedDateAsc() {
        List<TaskResponseDto> tasks = taskService.getAllTasksSortedByCreatedDateAsc();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort/priority/desc")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSortedByPriorityDesc() {
        List<TaskResponseDto> tasks = taskService.getAllTasksSortedByPriorityDesc();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort/priority/asc")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSortedByPriorityAsc() {
        List<TaskResponseDto> tasks = taskService.getAllTasksSortedByPriorityAsc();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort/title")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSortedByTitleAsc() {
        List<TaskResponseDto> tasks = taskService.getAllTasksSortedByTitleAsc();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort/status")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSortedByStatusAsc() {
        List<TaskResponseDto> tasks = taskService.getAllTasksSortedByStatusAsc();
        return ResponseEntity.ok(tasks);
    }

    // Combined filtering and sorting
    @GetMapping("/user/{userId}/sort/priority")
    public ResponseEntity<List<TaskResponseDto>> getTasksByUserIdSortedByPriority(@PathVariable Long userId) {
        List<TaskResponseDto> tasks = taskService.getTasksByUserIdSortedByPriority(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/{userId}/sort/created-date")
    public ResponseEntity<List<TaskResponseDto>> getTasksByUserIdSortedByCreatedDate(@PathVariable Long userId) {
        List<TaskResponseDto> tasks = taskService.getTasksByUserIdSortedByCreatedDate(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/category/{category}/sort/priority")
    public ResponseEntity<List<TaskResponseDto>> getTasksByCategorySortedByPriority(@PathVariable String category) {
        List<TaskResponseDto> tasks = taskService.getTasksByCategorySortedByPriority(category);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}/sort/created-date")
    public ResponseEntity<List<TaskResponseDto>> getTasksByStatusSortedByCreatedDate(@PathVariable String status) {
        List<TaskResponseDto> tasks = taskService.getTasksByStatusSortedByCreatedDate(status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSorted(
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        // Call a service method instead of using repository directly
        List<TaskResponseDto> tasks = taskService.getAllTasksSorted(sortBy, direction);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}/count")
    public ResponseEntity<Long> getTaskCountByStatus(@PathVariable String status) {
        Long count = taskService.getTaskCountByStatus(status);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/team/{team}/count")
    public ResponseEntity<Long> getTaskCountByTeam(@PathVariable String team) {
        Long count = taskService.getTaskCountByTeam(team);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalTaskCount() {
        Long count = taskService.getTotalTaskCount();
        return ResponseEntity.ok(count);
    }
}