import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { AppHeader } from '../AppHeader';
import { Filter, Heart, ChevronRight, MapPin } from 'lucide-react';
import { User, MissionResult } from '../../types';

interface ResultsProps {
  user: User;
  onNavigate: (page: string) => void;
  onShowLoginFlow: () => void;
}

export const Results: React.FC<ResultsProps> = ({ 
  user, 
  onNavigate, 
  onShowLoginFlow 
}) => {
  const [activeTab, setActiveTab] = useState('my');
  const [selectedResult, setSelectedResult] = useState<MissionResult | null>(null);

  // Mock 데이터 - 실제로는 props로 받아와야 함
  const mockResults: MissionResult[] = [
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
      author: user.isLoggedIn ? user.name : '익명',
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
    }
  ];

  // 같은 미션을 수행한 다른 사람들의 결과
  const getSameMissionResults = (currentResult: MissionResult): MissionResult[] => {
    const sameMissionResults = [
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
      }
    ];
    
    return sameMissionResults.filter(result => 
      result.missionId === currentResult.missionId && result.id !== currentResult.id
    );
  };

  // 같은 위치에서 수행한 다른 사람들의 결과
  const getNearbyLocationResults = (currentResult: MissionResult): MissionResult[] => {
    const nearbyResults = [
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
      }
    ];

    // 같은 동(구체적 위치)에서 수행한 미션들을 필터링
    return nearbyResults.filter(result => {
      const currentLocationParts = currentResult.location.split(' ');
      const resultLocationParts = result.location.split(' ');
      const currentDong = currentLocationParts[currentLocationParts.length - 1];
      const resultDong = resultLocationParts[resultLocationParts.length - 1];
      
      return currentDong === resultDong && result.id !== currentResult.id;
    });
  };

  if (selectedResult) {
    const sameMissionResults = getSameMissionResults(selectedResult);
    const nearbyLocationResults = getNearbyLocationResults(selectedResult);

    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader 
          title="미션 결과 상세" 
          showBackButton={true}
          onBackClick={() => setSelectedResult(null)}
          user={user}
          onLoginClick={onShowLoginFlow}
          onProfileClick={() => onNavigate('dashboard')}
        />
        
        <div className="p-4">
          <div className="max-w-md mx-auto space-y-6">
            {/* 상세 정보 카드 */}
            <Card>
              <CardContent className="p-4 space-y-4">
                {/* 작성자 정보 상단 배치 */}
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                  <div className="text-2xl">{selectedResult.authorProfile}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedResult.author}</h3>
                    <p className="text-sm text-gray-600">레벨 1 • {selectedResult.location}</p>
                  </div>
                  <div className="text-xs text-gray-500">{selectedResult.date}</div>
                </div>

                {/* 미션 정보 */}
                <div className="text-center">
                  <div className="text-6xl mb-2">{selectedResult.image}</div>
                  <Badge className="mb-2">{selectedResult.category}</Badge>
                  <h4 className="font-semibold">{selectedResult.missionTitle}</h4>
                </div>

                {/* 인증 사진 - 내용보다 상단으로 이동 */}
                {selectedResult.photos && selectedResult.photos.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">인증 사진</h4>
                    <div className="flex space-x-2 justify-center">
                      {selectedResult.photos.map((photo, index) => (
                        <div key={index} className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                          {photo}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 미션 수행 내용 */}
                <div className="bg-gray-100 p-4 rounded">
                  <p>{selectedResult.content}</p>
                </div>

                {/* 하단 정보 */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedResult.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>{selectedResult.likes}</span>
                  </div>
                </div>

                {/* 획득한 뱃지 */}
                {selectedResult.badges.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">획득한 뱃지</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedResult.badges.map((badge: string, index: number) => (
                        <Badge key={index} variant="secondary">{badge}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 같은 미션 챌린지 섹션 - 더보기 버튼 제거 */}
            {sameMissionResults.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">같은 미션 챌린지</h3>
                <div className="grid grid-cols-1 gap-3">
                  {sameMissionResults.map((result) => (
                    <Card key={result.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">{result.image}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold">{result.author}</p>
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Heart className="w-3 h-3" />
                                <span>{result.likes}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{result.location}</p>
                            <p className="text-xs text-gray-700 line-clamp-2">{result.content}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 인근 위치 챌린지 섹션 - 더보기 버튼 제거 */}
            {nearbyLocationResults.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">인근 위치 챌린지</h3>
                <div className="grid grid-cols-1 gap-3">
                  {nearbyLocationResults.map((result) => (
                    <Card key={result.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">{result.image}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold">{result.author}</p>
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Heart className="w-3 h-3" />
                                <span>{result.likes}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="outline" className="text-xs">{result.category}</Badge>
                              <p className="text-xs text-gray-600">{result.missionTitle}</p>
                            </div>
                            <p className="text-xs text-gray-700 line-clamp-2">{result.content}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        title="미션 결과" 
        user={user}
        onLoginClick={onShowLoginFlow}
        onProfileClick={() => onNavigate('dashboard')}
      />
      
      <div className="bg-white p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="my">나의 결과</TabsTrigger>
            <TabsTrigger value="community">커뮤니티</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-4">
        <div className="max-w-md mx-auto">
          {!user.isLoggedIn && activeTab === 'my' ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="mb-4">로그인 후 나의 미션 결과를 확인하세요</p>
                <Button onClick={onShowLoginFlow}>
                  로그인하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center space-x-2 mb-4">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-1" />
                  필터
                </Button>
                <Button variant="outline" size="sm">
                  정렬
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {mockResults.map((result) => (
                  <Card 
                    key={result.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedResult(result)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">{result.image}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{result.category}</Badge>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Heart className="w-4 h-4" />
                              <span>{result.likes}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{result.location}</p>
                          {activeTab === 'community' && (
                            <p className="text-sm font-semibold mb-1">{result.author}</p>
                          )}
                          <p className="text-xs text-gray-500">{result.date}</p>
                          {result.badges.length > 0 && (
                            <div className="mt-2">
                              {result.badges.map((badge, index) => (
                                <Badge key={index} variant="secondary" className="text-xs mr-1">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};