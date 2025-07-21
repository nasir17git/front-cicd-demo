# Groot Frontend 배포 가이드 (최신)

## 1. GitHub Actions 자동 배포 설정

### 1-1. 필수 GitHub Secrets
- `SSH_GROOT_KEY`: 서버 접속용 SSH 개인키 (webfactory/ssh-agent에서 사용)

### 1-2. 자동 배포 트리거
- PR 생성/커밋 시 자동 배포
- COMMIT_SHA (3c00407 같은) 입력으로 수동 실행도 가능 (workflow_dispatch)

### 1-3. 배포 자동화 주요 단계
1. 의존성 설치 및 빌드 (`npm ci`, `npm run build`)
2. 빌드 결과 압축(`deploy.tar.gz`)
3. 서버로 전송 및 배포 스크립트 실행
4. 블루/그린 슬롯 전환 및 npx serve로 실행
5. nginx 리로드 및 배포 URL 정상 응답 확인

#### 주요 서버 정보 (고정)
- 서버: `deploy.logonme.click`
- 사용자: `ec2-user`
- 배포 경로: `/home/ec2-user/fe-blue`, `/home/ec2-user/fe-green`
- 로그: `/home/ec2-user/deploy-logs/`, 각 슬롯별 `/home/ec2-user/fe-*/server.log`

---

## 2. 서버 준비

```bash
# 1. 배포 로그 디렉토리 생성
mkdir -p /home/ec2-user/deploy-logs

# 2. 배포 스크립트(deploy.sh) 준비 및 권한 부여
cd /home/ec2-user
# (deploy.sh 파일을 최신 레포에서 복사)
chmod +x deploy.sh
```

---

## 3. 수동 배포 방법

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

## 6. 자주 발생하는 문제

### 6-1. SSH 연결 실패
```bash
# SSH 키 권한 확인
chmod 600 ~/.ssh/your_private_key
chmod 644 ~/.ssh/your_private_key.pub

# 서버 authorized_keys 확인
cat ~/.ssh/authorized_keys
```

### 6-2. 빌드 실패
```bash
npm ci
npm run build
```

### 6-3. 배포 스크립트 실패
```bash
tail -f /home/ec2-user/deploy-logs/deploy_*.log
cd /home/ec2-user
./deploy.sh
```

---

## 7. 기타 참고
- deploy.sh, .github/workflows/deploy.yml 파일을 최신 레포에서 참고하세요.
- nginx 리버스 프록시 설정은 green/blue 도메인에 따라 자동으로 라우팅되도록 구성되어야 합니다.
- 배포 후 실제 서비스 URL: https://green.logonme.click, https://blue.logonme.click 
``` 