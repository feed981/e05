# 使用適合的 JDK 基礎映像
FROM openjdk:17-jdk-slim

# 設置工作目錄
WORKDIR /app

# 複製本地 JAR 文件到容器內
COPY target/YT1-gateway-1.0-SNAPSHOT-0122.jar app.jar

# 暴露應用的端口
EXPOSE 64101

# 設置啟動命令
CMD ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]

