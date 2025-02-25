FROM python:3.10-slim

# 安裝必要的套件
RUN apt-get update && apt-get install -y ffmpeg jq && rm -rf /var/lib/apt/lists/*

# 安裝 yt-dlp
RUN pip install --no-cache-dir yt-dlp

# 創建必要的目錄
RUN mkdir -p /config /workspace /root/yt1/downloads

# 複製設定檔
COPY config/yt-dlp.conf /config/
COPY process.sh /usr/local/bin/process.sh

# 設定執行權限
RUN chmod +x /usr/local/bin/process.sh

# 設定工作目錄
WORKDIR /workspace

# 容器啟動時執行的指令
ENTRYPOINT ["process.sh"]