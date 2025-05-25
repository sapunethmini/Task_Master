package org.example.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Value("${kafka.topics.task-events}")
    private String taskEventsTopic;

    @Value("${kafka.topics.user-events}")
    private String userEventsTopic;

    // Create Kafka topics programmatically
    @Bean
    public NewTopic taskEventsTopic() {
        return TopicBuilder
                .name(taskEventsTopic)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic userEventsTopic() {
        return TopicBuilder
                .name(userEventsTopic)
                .partitions(3)
                .replicas(1)
                .build();
    }
}