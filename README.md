# ⚔️ 구구단 용사 (Times Table Hero)

> **8-bit 레트로 도트 픽셀 아트 스타일의 턴제 구구단 교육 RPG 웹게임**  
> 메이플스토리 군단장 보스들의 스킬 공격을 구구단 연산으로 방어하고, 완벽한 타이밍의 **패링(Parry)** 카운터로 보스를 격파하세요!

---

## 🎮 게임 특징 (Key Features)

- **턴제 방어 & 패링 시스템**:
  - 보스가 일반/강력/필살 스킬을 시전하면, 남은 제한시간 내에 구구단 정답을 맞춰야 공격을 방어(Guard)할 수 있습니다.
  - **1.4초 이내 초고속 정답 입력 시 PERFECT PARRY 발동!** (피해량 1.8배 카운터 어택)
- **메이플스토리 군단장 보스 라인업**:
  - Stage 1: 힐라 (Hilla)
  - Stage 2: 반 레온 (Von Leon)
  - Stage 3: 아카이럼 (Arkarium)
  - Stage 4: 매그너스 (Magnus)
  - Stage 5: 검은 마법사 (Black Mage)
- **전술 쉼터 (Campfire Rest)**:
  - 스테이지 클리어 시 캠프파이어 휴식 모달에서 다음 보스 정보와 스킬을 사전 탐색하고, 체력 및 아이템을 정비할 수 있습니다.
- **키보드 단축키 완벽 지원**:
  - `1 ~ 4`: 구구단 선택지 번호 입력
  - `Z, X, C, V`: 물약, 파워소드, 모래시계, 방패 아이템 퀵 사용
  - `Space`: 일시정지 / 캠프 휴식 종료 / 대화 넘기기
- **Firebase 연동 학습자 명예의 전당**:
  - 복잡한 이메일 없이 닉네임과 비밀번호로 간편 회원가입/로그인
  - 실시간 연산 정확도, 콤보, 클리어 타임을 점수로 환산하여 명예의 전당에 랭킹 등록

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite 8
- **Animation & Motion**: Motion (Framer Motion v12)
- **Audio**: Web Audio API 기반 8-bit 치프튠(Chiptune) 사운드 신시사이저
- **Icons**: Lucide React
- **Backend / Database**: Firebase Cloud Firestore & Firebase Authentication

---

## 🚀 시작하기 (Getting Started)

### 1. 패키지 설치
```bash
npm install
```

### 2. 로컬 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000` 접속

### 3. 프로덕션 빌드
```bash
npm run build
```

---

## ⚙️ Firebase 설정 안내 (선택 사항)

실시간 명예의 전당 및 회원가입 기능을 사용하려면 Firebase 프로젝트가 연동되어 있어야 합니다.
1. `firebase-applet-config.json` 파일에 본인의 Firebase Web App 설정(apiKey, projectId, firestoreDatabaseId 등)을 기입합니다.
2. Firebase 콘솔의 **[Authentication]** → **[Sign-in method]**에서 **[이메일/비밀번호 (Email/Password)]** 로그인을 활성화합니다.
3. `firestore.rules` 보안 규칙을 프로젝트에 배포합니다.
