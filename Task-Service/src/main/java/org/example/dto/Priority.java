package org.example.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Priority {
    LOW(0),
    MEDIUM(1),
    HIGH(2);

    private final int value;

    Priority(int value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return name();
    }

    @JsonCreator
    public static Priority fromValue(Object value) {
        if (value == null) {
            return LOW;
        }

        if (value instanceof Number) {
            int numValue = ((Number) value).intValue();
            switch (numValue) {
                case 0: return LOW;
                case 1: return MEDIUM;
                case 2: return HIGH;
                default: return LOW;
            }
        } else if (value instanceof String) {
            String strValue = ((String) value).toUpperCase();
            try {
                return Priority.valueOf(strValue);
            } catch (IllegalArgumentException e) {
                // Try to parse as number
                try {
                    int numValue = Integer.parseInt(strValue);
                    return fromValue(numValue);
                } catch (NumberFormatException ex) {
                    return LOW;
                }
            }
        }

        return LOW;
    }
} 