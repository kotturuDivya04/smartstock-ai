# Stage 1: Build application with Maven and Java 21
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production jar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Java 21 runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-privileged user
RUN addgroup -S smartstock && adduser -S smartstock -G smartstock
USER smartstock:smartstock

COPY --from=builder /build/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
