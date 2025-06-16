package org.example.controller;

import org.example.dto.Employee;
import org.example.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emp-controller")
@Controller

public class EmployeeController {
   @Autowired
   EmployeeService service;


    @PostMapping("/add-employee")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> addEmployeeDetails(@RequestBody Employee employee) {
        try {
            // Validate required fields
            if (employee.getFirstname() == null || employee.getFirstname().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("First name is required");
            }
            if (employee.getLastname() == null || employee.getLastname().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Last name is required");
            }
            if (employee.getEmail() == null || employee.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (employee.getDepartment_Id() == null || employee.getDepartment_Id().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Department ID is required");
            }
            if (employee.getRole_Id() == null || employee.getRole_Id().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Role ID is required");
            }

            // Add the employee
            service.addEmployee(employee);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Employee added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding employee: " + e.getMessage());
        }
    }

    @GetMapping("/get-all")
    public List<Employee> getAll(){
        return service.getAll();
    }

    @DeleteMapping("delete-emp/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public String deleteEmployee(@PathVariable Long id){
        service.deleteEmployeeById(id);
        return "successfully deleted";
    }

    @PutMapping("/update-emp")
    @ResponseStatus(HttpStatus.RESET_CONTENT)
    public void updateEmployee(@RequestBody Employee emp){
        service.updateEmployee(emp);
    }


    @GetMapping("/find-by-id/{id}")
    public Employee findById(@PathVariable Long id){
        return service.findById(id);

    }

    @GetMapping("/find-by-name/{firstname}")
    public Employee findByfirstname(@PathVariable String firstname){
         return service.findByfirstname(firstname);
    }

    @GetMapping("/find-by-department/{departmentId}")
    public List<Employee> findByDepartmentId(@PathVariable Long departmentId) {
        return service.findByDepartmentId(departmentId);
    }

     @GetMapping("/getAllByDepartment/{department_Id}")
    public List<Employee> getAllByDepartment(@PathVariable String department_Id)
    {
        return service.getAllByDepartment(department_Id);
    }

    @GetMapping("/get-all/{department_Id}")
    public ResponseEntity<Integer> getEmployeeCountByDepartment(@PathVariable String department_Id) {
        long count = service.getEmployeeCountByDepartment(department_Id);
        return ResponseEntity.ok((int) count);
    }

}
