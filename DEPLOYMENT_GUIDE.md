# 탄소프로토 배포 가이드

## GitHub Actions 설정

### 1. GitHub Secrets 설정

GitHub 저장소의 Settings → Secrets and variables → Actions에서 다음 시크릿을 설정하세요:

#### 필수 Secrets:
- `SSH_PRIVATE_KEY`: 서버 접속용 SSH 개인키
- `SERVER_HOST`: 서버 IP 주소 또는 도메인
- `SERVER_USER`: 서버 사용자명 (예: ec2-user)

### 2. SSH 키 생성 및 설정

```bash
# SSH 키 생성 (로컬에서)
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions

# 공개키를 서버에 등록
ssh-copy-id -i ~/.ssh/github_actions.pub ec2-user@YOUR_SERVER_IP

# 개인키를 GitHub Secrets에 등록
cat ~/.ssh/github_actions
```

### 3. 서버 준비

```bash
# 서버에서 deploy.sh 스크립트 준비
cd /home/ec2-user
chmod +x deploy.sh

# 로그 디렉토리 생성
mkdir -p /home/ec2-user/deploy-logs
```

## 배포 프로세스

### 1. 자동 배포 (GitHub Actions)
- `main` 또는 `develop` 브랜치에 푸시하면 자동 배포
- 빌드 → 압축 → SCP 전송 → 배포 스크립트 실행

### 2. 수동 배포
```bash
# 로컬에서 빌드 후 수동 전송
npm run build
tar -czf deploy.tar.gz -C build .
scp deploy.tar.gz ec2-user@YOUR_SERVER_IP:/home/ec2-user/
ssh ec2-user@YOUR_SERVER_IP "cd /home/ec2-user && ./deploy.sh"
```

## 모니터링

### 배포 로그 확인
```bash
# 최신 배포 로그
tail -f /home/ec2-user/deploy-logs/deploy_*.log

# 모든 배포 로그
ls -la /home/ec2-user/deploy-logs/
```

### 프로세스 확인
```bash
# 실행 중인 프로세스
ps aux | grep serve

# 포트 사용 확인
lsof -i :30100
lsof -i :30200
```

### nginx 설정 확인
```bash
# nginx 설정 테스트
sudo nginx -T

# nginx 상태 확인
sudo systemctl status nginx
```

## 블루그린 배포

- **Green 슬롯**: 포트 30100
- **Blue 슬롯**: 포트 30200
- 자동으로 현재 슬롯에 따라 다음 슬롯으로 배포
- nginx 리버스 프록시 자동 설정

## 문제 해결

### 1. SSH 연결 실패
```bash
# SSH 키 권한 확인
chmod 600 ~/.ssh/github_actions
chmod 644 ~/.ssh/github_actions.pub

# 서버에서 authorized_keys 확인
cat ~/.ssh/authorized_keys
```

### 2. 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm ci
npm run build
```

### 3. 배포 스크립트 실패
```bash
# 로그 확인
tail -f /home/ec2-user/deploy-logs/deploy_*.log

# 수동 실행
cd /home/ec2-user
./deploy.sh
``` 