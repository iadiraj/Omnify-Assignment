FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2:
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar /app/backend.jar
EXPOSE 8080
CMD ["java", "-jar", "backend.jar"]