import { Mission, EcoTourRoute, BadgeInfo, LevelInfo } from './types';

export const missions: Mission[] = [
  {
    id: '1',
    title: '다회용기 사용하기',
    category: '일상',
    description: '일회용 포장지 대신 다회용기를 사용해보세요',
    carbonSaving: 2.5,
    image: '🥘',
    completed: false
  },
  {
    id: '2',
    title: '자전거로 이동하기',
    category: '교통',
    description: '짧은 거리는 자전거로 이동해보세요',
    carbonSaving: 5.0,
    image: '🚲',
    completed: false
  },
  {
    id: '3',
    title: '대중교통 이용하기',
    category: '교통',
    description: '자가용 대신 지하철이나 버스를 이용해보세요',
    carbonSaving: 8.2,
    image: '🚇',
    completed: false
  },
  {
    id: '4',
    title: '텀블러 사용하기',
    category: '일상',
    description: '일회용 컵 대신 개인 텀블러를 사용해보세요',
    carbonSaving: 1.8,
    image: '☕',
    completed: false
  },
  {
    id: '5',
    title: '도보로 이동하기',
    category: '교통',
    description: '가까운 거리는 걸어서 이동해보세요',
    carbonSaving: 3.5,
    image: '🚶',
    completed: false
  }
];

// 미션 결과 관련 Mock 데이터
export interface MissionResult {
  id: string;
  image: string;
  category: string;
  missionId: string;
  missionTitle: string;
  location: string;
  coordinates: { lat: number; lng: number };
  badges: string[];
  likes: number;
  date: string;
  author: string;
  authorProfile: string;
  content: string;
  photos: string[];
}

export const missionResults: MissionResult[] = [
  {
    id: '1',
    image: '🥘',
    category: '일상',
    missionId: '1',
    missionTitle: '다회용기 사용하기',
    location: '서울시 강남구 역삼동',
    coordinates: { lat: 37.5665, lng: 126.9780 },
    badges: ['친환경 달인'],
    likes: 15,
    date: '2025-01-05',
    author: '그린러버',
    authorProfile: '👤',
    content: '오늘은 다회용기를 사용해서 음식을 포장했어요! 일회용 포장지 대신 집에서 가져온 용기를 사용하니 환경에도 도움이 되고 마음도 뿌듯하네요.',
    photos: ['📸', '📷', '🖼️']
  },
  {
    id: '2',
    image: '🚲',
    category: '교통',
    missionId: '2',
    missionTitle: '자전거로 이동하기',
    location: '서울시 서초구 서초동',
    coordinates: { lat: 37.4833, lng: 127.0322 },
    badges: [],
    likes: 8,
    date: '2025-01-03',
    author: '바이크맨',
    authorProfile: '👥',
    content: '자전거로 출근했습니다. 날씨도 좋고 운동도 되어서 일석이조!',
    photos: ['🚴', '🌤️']
  },
  {
    id: '3',
    image: '🥘',
    category: '일상',
    missionId: '1',
    missionTitle: '다회용기 사용하기',
    location: '서울시 강남구 논현동',
    coordinates: { lat: 37.5112, lng: 127.0234 },
    badges: ['에코 워리어'],
    likes: 12,
    date: '2025-01-04',
    author: '제로웨이스트',
    authorProfile: '🌱',
    content: '점심 도시락을 다회용기에 포장해왔어요. 카페에서도 텀블러 사용하고 있습니다!',
    photos: ['🍱', '☕']
  },
  {
    id: '4',
    image: '🚇',
    category: '교통',
    missionId: '3',
    missionTitle: '대중교통 이용하기',
    location: '서울시 강남구 역삼동',
    coordinates: { lat: 37.5665, lng: 126.9780 },
    badges: [],
    likes: 6,
    date: '2025-01-02',
    author: '지하철왕',
    authorProfile: '🚊',
    content: '오늘도 지하철로 출근! 차 없이도 잘 다니고 있어요.',
    photos: ['🚇']
  },
  {
    id: '5',
    image: '🥘',
    category: '일상',
    missionId: '1',
    missionTitle: '다회용기 사용하기',
    location: '서울시 강남구 삼성동',
    coordinates: { lat: 37.5140, lng: 127.0565 },
    badges: ['친환경 달인'],
    likes: 9,
    date: '2025-01-01',
    author: '컨테이너맨',
    authorProfile: '📦',
    content: '새해 첫날부터 다회용기 사용! 올해는 더 열심히 환경보호 실천하겠습니다.',
    photos: ['🎊', '🥘', '♻️']
  },
  {
    id: '6',
    image: '☕',
    category: '일상',
    missionId: '4',
    missionTitle: '텀블러 사용하기',
    location: '서울시 강남구 역삼동',
    coordinates: { lat: 37.5665, lng: 126.9780 },
    badges: [],
    likes: 4,
    date: '2025-01-06',
    author: '커피애호가',
    authorProfile: '☕',
    content: '매일 텀블러로 커피 마시기! 카페에서 할인도 받고 좋아요.',
    photos: ['☕', '💚']
  },
  {
    id: '7',
    image: '🚶',
    category: '교통',
    missionId: '5',
    missionTitle: '도보로 이동하기',
    location: '서울시 강남구 논현동',
    coordinates: { lat: 37.5112, lng: 127.0234 },
    badges: ['건강지킴이'],
    likes: 7,
    date: '2025-01-05',
    author: '워킹맨',
    authorProfile: '👟',
    content: '오늘은 걸어서 마트까지! 운동도 되고 환경도 보호하고~',
    photos: ['🚶', '🛒']
  }
];

export const ecoTourRoutes: EcoTourRoute[] = [
  {
    id: '1',
    name: '문경새재 벚꽃길',
    location: '경북 문경시',
    region: '문경',
    description: '아름다운 벚꽃이 만개하는 역사 깊은 고갯길입니다.',
    detailedDescription: '문경새재는 조선시대부터 이어져 온 역사적인 통로로, 매년 4월이면 벚꽃이 만개하여 환상적인 풍경을 자아냅니다. 새재 옛길을 따라 걸으며 자연과 역사를 동시에 느낄 수 있는 특별한 코스입니다.',
    mainImage: '🌸',
    detailImages: ['🌸', '🏔️', '🚶', '📷'],
    carbonRating: 'low',
    viewCount: 15420,
    category: '문화유산',
    activities: ['트레킹', '사진촬영', '역사탐방', '자연관찰'],
    difficulty: 'easy',
    duration: '2-3시간',
    season: '봄'
  },
  {
    id: '2',
    name: '주왕산 국립공원',
    location: '경북 청송군',
    region: '청송',
    description: '기암절벽과 폭포의 절경을 감상할 수 있는 명산입니다.',
    detailedDescription: '주왕산은 대한민국의 12번째 국립공원으로 지정된 곳으로, 기암괴석과 깊은 계곡, 맑은 폭포가 어우러진 천혜의 자연경관을 자랑합니다. 특히 주산지의 왕벚나무와 기암절벽의 조화는 절경 중의 절경입니다.',
    mainImage: '🏔️',
    detailImages: ['🏔️', '💧', '🌲', '🪨'],
    carbonRating: 'low',
    viewCount: 23150,
    category: '국립공원',
    activities: ['등산', '폭포감상', '자연관찰', '힐링'],
    difficulty: 'medium',
    duration: '4-6시간',
    season: '사계절'
  },
  {
    id: '3',
    name: '안동 하회마을',
    location: '경북 안동시',
    region: '안동',
    description: '전통 한옥과 낙동강이 어우러진 세계문화유산입니다.',
    detailedDescription: '안동 하회마을은 600년 전통의 씨족마을로 유네스코 세계문화유산에 등재된 곳입니다. 낙동강이 마을을 휘돌아 흐르는 지형과 조선시대 전통가옥이 그대로 보존되어 있어 한국의 전통문화를 체험할 수 있습니다.',
    mainImage: '🏘️',
    detailImages: ['🏘️', '🏛️', '🌊', '🎭'],
    carbonRating: 'low',
    viewCount: 18900,
    category: '문화유산',
    activities: ['문화체험', '전통가옥관람', '탈춤공연관람', '강변산책'],
    difficulty: 'easy',
    duration: '3-4시간',
    season: '사계절'
  },
  {
    id: '4',
    name: '경주 불국사·석굴암',
    location: '경북 경주시',
    region: '경주',
    description: '신라 천년의 역사가 살아있는 불교문화 유적지입니다.',
    detailedDescription: '불국사와 석굴암은 신라 천년의 불교예술이 집약된 세계문화유산입니다. 토함산 자락에 위치한 이곳은 아름다운 자연경관과 함께 찬란한 신라문화를 경험할 수 있는 특별한 공간입니다.',
    mainImage: '🏯',
    detailImages: ['🏯', '🗿', '🌲', '⛩️'],
    carbonRating: 'medium',
    viewCount: 31200,
    category: '문화유산',
    activities: ['문화재관람', '템플스테이', '산책', '명상'],
    difficulty: 'easy',
    duration: '2-3시간',
    season: '사계절'
  },
  {
    id: '5',
    name: '울릉도·독도',
    location: '경북 울릉군',
    region: '울릉도',
    description: '신비로운 화산섬의 절경과 우리나라 최동단 영토입니다.',
    detailedDescription: '울릉도는 약 250만 년 전 화산활동으로 형성된 화산섬으로, 독특한 지형과 청정한 자연환경을 자랑합니다. 독도와 함께 우리나라 최동단의 영토로서 역사적 의미도 큽니다.',
    mainImage: '🏝️',
    detailImages: ['🏝️', '🌊', '⛰️', '🐟'],
    carbonRating: 'high',
    viewCount: 12800,
    category: '해안',
    activities: ['섬투어', '해안산책', '독도관람', '해산물맛보기'],
    difficulty: 'medium',
    duration: '1-2일',
    season: '봄·여름·가을'
  }
];

export const badges: BadgeInfo[] = [
  {
    id: '1',
    name: '친환경 달인',
    icon: '🌱',
    description: '일상에서 친환경 실천을 꾸준히 하는 달인',
    condition: '일상 미션 10회 완료',
    acquired: true,
    acquiredDate: '2024-12-15'
  },
  {
    id: '2',
    name: '에코 워리어',
    icon: '♻️',
    description: '환경보호를 위해 적극적으로 행동하는 전사',
    condition: '모든 카테고리 미션 각 5회씩 완료',
    acquired: true,
    acquiredDate: '2024-12-20'
  },
  {
    id: '3',
    name: '그린 트래블러',
    icon: '🚞',
    description: '친환경 교통수단을 선호하는 여행자',
    condition: '교통 미션 15회 완료',
    acquired: false
  },
  {
    id: '4',
    name: '제로 웨이스트',
    icon: '🗂️',
    description: '쓰레기 제로를 실천하는 환경지킴이',
    condition: '일회용품 줄이기 미션 20회 완료',
    acquired: false
  },
  {
    id: '5',
    name: '카본 세이버',
    icon: '💨',
    description: '탄소 절약의 달인',
    condition: '누적 탄소절약량 100kg 달성',
    acquired: true,
    acquiredDate: '2025-01-01'
  },
  {
    id: '6',
    name: '건강지킴이',
    icon: '💪',
    description: '걷기와 자전거를 사랑하는 건강한 실천가',
    condition: '도보/자전거 미션 25회 완료',
    acquired: true,
    acquiredDate: '2024-12-25'
  },
  {
    id: '7',
    name: '지구지킴이',
    icon: '🌍',
    description: '지구를 사랑하는 진정한 환경보호자',
    condition: '총 미션 100회 완료',
    acquired: false
  },
  {
    id: '8',
    name: '미션 마스터',
    icon: '🏆',
    description: '모든 미션을 정복한 마스터',
    condition: '모든 종류의 미션 완료',
    acquired: false
  }
];

export const levelInfo: LevelInfo[] = [
  {
    level: 1,
    name: '새싹 여행자',
    icon: '🌱',
    carbonThreshold: 0
  },
  {
    level: 2,
    name: '푸른 탐험가',
    icon: '🌿',
    carbonThreshold: 50
  },
  {
    level: 3,
    name: '숲의 수호자',
    icon: '🌳',
    carbonThreshold: 150
  },
  {
    level: 4,
    name: '자연의 친구',
    icon: '🌲',
    carbonThreshold: 300
  },
  {
    level: 5,
    name: '지구의 희망',
    icon: '🌍',
    carbonThreshold: 700
  }
];

// 대시보드용 차트 데이터
export const carbonData = [
  { month: '7월', carbon: 45 },
  { month: '8월', carbon: 52 },
  { month: '9월', carbon: 38 },
  { month: '10월', carbon: 65 },
  { month: '11월', carbon: 48 },
  { month: '12월', carbon: 73 },
  { month: '1월', carbon: 89 }
];

export const rankingData = [
  { category: '전체', rank: 147, total: 2543 },
  { category: '지역', rank: 23, total: 456 },
  { category: '연령대', rank: 8, total: 89 }
];

export const reductionTypes = [
  { type: '대중교통 이용', amount: 45, color: '#22c55e' },
  { type: '도보/자전거', amount: 28, color: '#3b82f6' },
  { type: '일회용품 절약', amount: 16, color: '#f59e0b' }
];

// A/B 테스트용 차트 라벨들
export const chartLabels = [
  '월별 탄소절약량 변화',
  '나의 그린 점수 추이',
  '친환경 실천 리포트',
  '탄소발자국 감소 현황'
];