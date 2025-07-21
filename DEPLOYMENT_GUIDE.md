# Groot Frontend 배포 가이드

## 1. GitHub Actions 자동 배포 사용방법

### 1-1. 자동 배포 트리거
- PR 생성/커밋 시 자동 배포 및 PR 코멘트로 접근 정보 전달

### 1-2. 수동 배포 트리거
- Actions 탭에서 COMMIT_SHA (3c00407 같은) 입력으로 수동 실행 가능 및 실행 결과로 접근 정보 확인

### 1-3. 배포 자동화 주요 단계
1. 의존성 설치 및 빌드 (`npm ci`, `npm run build`)
2. 빌드 결과 압축(`deploy.tar.gz`)
3. EC2 서버로 전송 및 서버 내 배포 스크립트 실행 (deploy.sh 참조)
4. 블루/그린 슬롯 전환 및 npx serve로 실행
5. nginx 리로드 및 배포 URL 정상 응답 확인

#### 주요 서버 정보 (고정)
- 서버: `deploy.logonme.click`
- 접근 URL: `https://blue.logonme.click' , `https://green.logonme.click`
- 사용자: `ec2-user`
- 배포 경로: `/home/ec2-user/fe-blue`, `/home/ec2-user/fe-green`
- 배포 로그: `/home/ec2-user/deploy-logs/`, 각 슬롯별 앱로그 `/home/ec2-user/fe-*/server.log`

---

## 2. 배포 파이프라인 재구성

### 2-1. GitHub Secrets 등록
- `SSH_GROOT_KEY`: 서버 접속용 SSH 개인키 (webfactory/ssh-agent에서 사용)

### 2-2. EC2 서버 내 nginx 구성 (reverse proxy)
- 호스트네임(URL) 기반으로 각 port에서 실행중인 서버에게 요청 전달
- HTTP > HTTPS 전환

```
# /etc/nginx/conf.d/fe.conf
# 80 → 443 리디렉션
server {
    listen 80;
    server_name blue.logonme.click green.logonme.click;

    return 301 https://$host$request_uri;
}

# 🔵 Blue Slot
server {
    listen 443 ssl;
    http2 on;
    server_name blue.logonme.click;

    ssl_certificate     /etc/letsencrypt/live/logonme.click/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/logonme.click/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://127.0.0.1:30100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 🟢 Green Slot
server {
    listen 443 ssl;
    http2 on;
    server_name green.logonme.click;

    ssl_certificate     /etc/letsencrypt/live/logonme.click/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/logonme.click/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://127.0.0.1:30200;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2-3. EC2 서버 내 배포환경 구성

```
# 1. 배포 로그 디렉토리 생성
- mkdir -p /home/ec2-user/deploy-logs

# 2. 배포 스크립트(deploy.sh) 준비 및 권한 부여
cd /home/ec2-user
# (deploy.sh 파일을 최신 레포에서 복사)
chmod +x deploy.sh
```

---

## 3. 진짜진짜 수동 배포 방법

```bash
# 1. 로컬에서 빌드
npm ci
npm run build

# 2. 빌드 결과 압축
rm -f deploy.tar.gz
if [ -d build ]; then
  tar -czf deploy.tar.gz -C build .
fi

# 3. 서버로 전송 및 배포
scp deploy.tar.gz ec2-user@deploy.logonme.click:/home/ec2-user/
ssh ec2-user@deploy.logonme.click "cd /home/ec2-user && ./deploy.sh"
```

---

## 4. 블루그린 배포 구조
- **blue 슬롯**: 30100 포트, `/home/ec2-user/fe-blue`
- **green 슬롯**: 30200 포트, `/home/ec2-user/fe-green`
- 배포 시 현재 슬롯 반대편에 배포 후, DEPLOY_SLOT 파일로 상태 전환
- npx serve로 실행, nginx 리버스 프록시 reload
- 도메인: green.logonme.click, blue.logonme.click (슬롯별)

---

## 5. 모니터링 및 문제 해결

### 5-1. 배포 로그 확인
```bash
tail -f /home/ec2-user/deploy-logs/deploy_*.log
ls -la /home/ec2-user/deploy-logs/
```

### 5-2. 각 슬롯별 서버 로그
```bash
tail -f /home/ec2-user/fe-green/server.log
tail -f /home/ec2-user/fe-blue/server.log
```

### 5-3. 프로세스/포트 확인
```bash
ps aux | grep serve
lsof -i :30100
lsof -i :30200
```

### 5-4. nginx 설정/상태
```bash
sudo nginx -T
sudo systemctl status nginx
```

---

## 6. FAQ
### 지금 배포되어있는게 뭔지 어떻게 알 수 있나요?
- 상단 Actions 탭에서 가장 최근에 실행된 2개의 workflow 결과를 봐주시면 됩니다
