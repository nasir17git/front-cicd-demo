#!/bin/bash
set -e

# 로그 파일 설정
LOG_DIR="/home/ec2-user/deploy-logs"
mkdir -p $LOG_DIR
LOG_FILE="$LOG_DIR/deploy_$(date +%Y%m%d_%H%M%S).log"

# 로그 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "=== Groot Frontend 블루그린 배포 시작 ==="

# 현재 슬롯 확인 // 없으면 green으로 간주, blue로 시작 
if [ -f /home/ec2-user/DEPLOY_SLOT ]; then
  CURRENT_SLOT=$(cat /home/ec2-user/DEPLOY_SLOT)
else
  CURRENT_SLOT="green"
fi

# 다음 슬롯 결정
if [ "$CURRENT_SLOT" == "blue" ]; then
  NEXT_SLOT="green"
  NEXT_PORT=30200
else
  NEXT_SLOT="blue"
  NEXT_PORT=30100
fi

log "현재 슬롯: $CURRENT_SLOT"
log "다음 슬롯: $NEXT_SLOT (포트: $NEXT_PORT)"

APP_DIR="/home/ec2-user/fe-$NEXT_SLOT"

# 새 코드 반영
log "앱 디렉토리 정리: $APP_DIR"
rm -rf $APP_DIR
mkdir -p $APP_DIR

log "배포 파일 압축 해제"
tar -xzf /home/ec2-user/deploy.tar.gz -C $APP_DIR

# 해당 슬롯 프로세스만 중지
log "기존 프로세스 중지 시작"
if pgrep -f "serve -s $APP_DIR -l $NEXT_PORT"; then
  log "포트 $NEXT_PORT에서 실행 중인 프로세스 중지"
  pkill -f "serve -s $APP_DIR -l $NEXT_PORT"
  sleep 2
fi

log "새 버전 실행 시작"
nohup npx serve -s $APP_DIR -l $NEXT_PORT > $APP_DIR/server.log 2>&1 &
SERVE_PID=$!
log "serve 프로세스 PID: $SERVE_PID"

# 프로세스 시작 확인
sleep 3
if ps -p $SERVE_PID > /dev/null; then
  log "새 버전 실행 성공"
else
  log "ERROR: 새 버전 실행 실패"
  exit 1
fi

# 슬롯 기록
echo "$NEXT_SLOT" > /home/ec2-user/DEPLOY_SLOT
log "슬롯 정보 업데이트: $NEXT_SLOT"

# nginx 설정 확인 및 업데이트
sudo nginx -s reload >> $LOG_FILE 2>&1
log "nginx 설정 리로드"

log "=== 배포 완료: $NEXT_SLOT ($NEXT_PORT) ==="
log "접속 URL: http://localhost:$NEXT_PORT"
log "로그 파일: $LOG_FILE"

echo "배포 완료: $NEXT_SLOT ($NEXT_PORT)"
echo "로그 파일: $LOG_FILE"


