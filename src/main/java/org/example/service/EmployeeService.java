package org.example.service;

import org.example.dto.Employee;
import org.example.entity.EmployeeEntity;

import java.util.List;

public interface EmployeeService {

    void addEmployee(Employee employee);

    List<Employee> getAll();
}
