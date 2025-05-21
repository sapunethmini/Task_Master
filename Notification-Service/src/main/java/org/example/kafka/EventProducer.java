package org.example.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.TaskEventDto;
import org.example.dto.UserEventDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import static org.hibernate.query.sqm.tree.SqmNode.log;
@Component
@RequiredArgsConstructor
@Slf4j
public class EventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${kafka.topics.task-events}")
    private String taskEventsTopic;

    @Value("${kafka.topics.user-events}")
    private String userEventsTopic;

    public void sendTaskEvent(TaskEventDto taskEventDto) {
        try {
            String eventAsJson = objectMapper.writeValueAsString(taskEventDto);
            log.info("Sending task event to topic {}: {}", taskEventsTopic, eventAsJson);
            kafkaTemplate.send(taskEventsTopic, eventAsJson);
        } catch (JsonProcessingException e) {
            log.error("Error serializing task event: {}", e.getMessage(), e);
        }
    }

    public void sendUserEvent(UserEventDto userEventDto) {
        try {
            String eventAsJson = objectMapper.writeValueAsString(userEventDto);
            log.info("Sending user event to topic {}: {}", userEventsTopic, eventAsJson);
            kafkaTemplate.send(userEventsTopic, eventAsJson);
        } catch (JsonProcessingException e) {
            log.error("Error serializing user event: {}", e.getMessage(), e);
        }
    }
}
