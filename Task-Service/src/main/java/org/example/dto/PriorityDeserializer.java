package org.example.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;

public class PriorityDeserializer extends JsonDeserializer<Priority> {
    @Override
    public Priority deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getValueAsString();
        if (value == null) {
            return Priority.LOW;
        }
        
        try {
            // Try to parse as number first
            int numValue = Integer.parseInt(value);
            return Priority.fromValue(numValue);
        } catch (NumberFormatException e) {
            // If not a number, try to parse as enum name
            try {
                return Priority.valueOf(value.toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("Invalid priority value: " + value);
            }
        }
    }
} 