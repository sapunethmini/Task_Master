package org.example.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.example.dto.Priority;

@Converter(autoApply = true)
public class PriorityConverter implements AttributeConverter<Priority, String> {

    @Override
    public String convertToDatabaseColumn(Priority priority) {
        if (priority == null) {
            return "LOW";
        }
        return priority.name();
    }

    @Override
    public Priority convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return Priority.LOW;
        }
        try {
            return Priority.valueOf(dbData);
        } catch (IllegalArgumentException e) {
            // Try to parse as number
            try {
                int numValue = Integer.parseInt(dbData);
                return Priority.fromValue(numValue);
            } catch (NumberFormatException ex) {
                return Priority.LOW;
            }
        }
    }
} 