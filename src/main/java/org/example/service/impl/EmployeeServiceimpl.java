package org.example.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.dto.Employee;
import org.example.entity.EmployeeEntity;
import org.example.repository.EmployeeRepository;
import org.example.service.EmployeeService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class EmployeeServiceimpl implements EmployeeService {
    final EmployeeRepository repository;

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void addEmployee(Employee employee) {

            repository.save(mapper.convertValue(employee, EmployeeEntity.class));
    }

    @Override
    public List<EmployeeEntity> getAll() {


        return repository.findAll();
    }
}
