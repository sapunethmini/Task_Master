package org.example.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class LocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {
    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String dateStr = p.getValueAsString();
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }
        
        try {
            // Try to parse as full date-time first
            return LocalDateTime.parse(dateStr);
        } catch (Exception e) {
            try {
                // If that fails, try to parse as date only and set time to start of day
                LocalDate date = LocalDate.parse(dateStr);
                return LocalDateTime.of(date, LocalTime.MIN);
            } catch (Exception ex) {
                throw new IOException("Invalid date format. Expected format: yyyy-MM-dd or yyyy-MM-ddTHH:mm:ss", ex);
            }
        }
    }
} 