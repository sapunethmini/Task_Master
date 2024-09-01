package org.example.service;

import org.example.dto.Employee;

import java.util.List;

public interface EmployeeService {

    void addEmployee(Employee employee);

    List<Employee> getAll();

    void deleteEmployeeById(Long id);

    void updateEmployee(Employee emp);

    Employee findById(Long id);
}
