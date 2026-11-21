# Multi-stage build for Spring Boot Backend
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline -B
COPY src/ ./src/
RUN ./mvnw clean package -DskipTests

# Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/bookstore-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8066
ENV PORT=8066
ENTRYPOINT ["java", "-jar", "app.jar"]
