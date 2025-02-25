#!/bin/bash
set -e  # 出錯時立即停止執行

# 參數檢查
if [ -z "$VIDEO_URL" ] || [ -z "$FORMAT" ]; then
    echo "錯誤: 參數不足，請提供 VIDEO_URL 和 FORMAT" >&2
    echo "用法: VIDEO_URL=<url> FORMAT=<mp3|mp4> $0" >&2
    exit 1
fi

# 設定變數
OUTPUT_DIR="$HOME/yt1/downloads"
CONFIG_FILE="/config/yt-dlp.conf"  # Docker 容器中的 yt-dlp 設定檔
MAX_DURATION=600  # 影片長度上限（秒）

# 確保目標資料夾存在
mkdir -p "$OUTPUT_DIR"
echo "下載影片: $VIDEO_URL，格式: $FORMAT"

# 取得影片資訊
echo "正在獲取影片資訊..."
VIDEO_INFO=$(yt-dlp --cookies cookies.txt --dump-json "$VIDEO_URL" | jq '{id, title, ext, duration}')

# 解析影片資訊
VIDEO_TITLE=$(echo "$VIDEO_INFO" | jq -r '.title')
VIDEO_DURATION=$(echo "$VIDEO_INFO" | jq -r '.duration')
VIDEO_ID=$(echo "$VIDEO_INFO" | jq -r '.id')

echo "影片標題: $VIDEO_TITLE"
echo "影片時長: $VIDEO_DURATION 秒"

# 檢查影片時長
if [ "$VIDEO_DURATION" -gt "$MAX_DURATION" ]; then
    echo "錯誤: 影片時長超過限制 ($MAX_DURATION 秒)" >&2
    exit 2
fi

# 清理標題，移除不安全字符
SAFE_TITLE=$(echo "$VIDEO_TITLE" | tr -dc '[:alnum:][:space:]._-' | tr -s ' ' '_')
OUTPUT_VIDEO="$OUTPUT_DIR/${SAFE_TITLE}.mp4"
OUTPUT_AUDIO="$OUTPUT_DIR/${SAFE_TITLE}.mp3"

# 下載影片（mp4 格式）
echo "開始下載影片..."
yt-dlp --cookies cookies.txt --config-location "$CONFIG_FILE" -f best -o "$OUTPUT_VIDEO" "$VIDEO_URL"

# 確認檔案存在
if [ ! -f "$OUTPUT_VIDEO" ]; then
    echo "錯誤: 下載失敗，影片檔案不存在" >&2
    exit 3
fi

echo "下載完成: $OUTPUT_VIDEO"
echo "檔案大小: $(du -h "$OUTPUT_VIDEO" | cut -f1)"

# **如果 FORMAT 是 MP3，則轉檔**
if [ "$FORMAT" = "mp3" ]; then
    echo "轉換為 MP3 格式..."
    ffmpeg -i "$OUTPUT_VIDEO" -q:a 0 -map a "$OUTPUT_AUDIO"

    # 確認 MP3 是否轉換成功
    if [ -f "$OUTPUT_AUDIO" ]; then
        echo "MP3 轉換成功: $OUTPUT_AUDIO"
        echo "MP3 檔案大小: $(du -h "$OUTPUT_AUDIO" | cut -f1)"

        # **可選：刪除 MP4**
        rm -f "$OUTPUT_VIDEO"
    else
        echo "錯誤: MP3 轉換失敗" >&2
        exit 4
    fi
fi

# 儲存影片資訊
echo "$VIDEO_INFO" > "$OUTPUT_DIR/${SAFE_TITLE}.info.json"

echo "影片處理完成！"