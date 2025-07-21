import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { AppHeader } from '../AppHeader';
import { 
  MapPin, 
  Eye, 
  Bookmark, 
  ChevronRight, 
  Mountain, 
  Trees, 
  Waves,
  Calculator as CalculatorIcon,
  Share
} from 'lucide-react';
import { User, EcoTourRoute } from '../../types';

interface RoutesProps {
  user: User;
  ecoTourRoutes: EcoTourRoute[];
  onNavigate: (page: string) => void;
  onShowLoginFlow: () => void;
  onToggleBookmark: (routeId: string) => void;
}

export const Routes: React.FC<RoutesProps> = ({ 
  user, 
  ecoTourRoutes, 
  onNavigate, 
  onShowLoginFlow,
  onToggleBookmark
}) => {
  const [selectedRoute, setSelectedRoute] = useState<EcoTourRoute | null>(null);
  const [filteredRoutes, setFilteredRoutes] = useState<EcoTourRoute[]>(ecoTourRoutes);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // 배너 데이터
  const promotionBanners = [
    {
      id: 1,
      title: "🌸 봄 특별 이벤트",
      subtitle: "문경새재 벚꽃축제",
      description: "4월 벚꽃이 만개하는 문경새재에서 특별한 추억을 만들어보세요",
      bgColor: "from-pink-400 to-rose-500",
      featured: true
    },
    {
      id: 2,
      title: "🏔️ 주왕산 탐방",
      subtitle: "어드민 추천 코스",
      description: "기암절벽과 폭포의 절경을 감상해보세요",
      bgColor: "from-blue-400 to-cyan-500",
      featured: false
    },
    {
      id: 3,
      title: "🌳 생태관광 주간",
      subtitle: "특별 할인 혜택",
      description: "경북 생태관광지를 더욱 저렴하게 즐기세요",
      bgColor: "from-green-400 to-emerald-500",
      featured: false
    }
  ];

  // 필터링 함수
  const handleFilter = (category: string) => {
    setSelectedFilter(category);
    if (category === 'all') {
      setFilteredRoutes(ecoTourRoutes);
    } else {
      setFilteredRoutes(ecoTourRoutes.filter(route => route.category === category));
    }
  };

  if (selectedRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader 
          title={selectedRoute.name}
          showBackButton={true}
          onBackClick={() => setSelectedRoute(null)}
          user={user}
          onLoginClick={onShowLoginFlow}
          onProfileClick={() => onNavigate('dashboard')}
        />
        
        <div className="relative">
          {/* 메인 이미지 */}
          <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center relative">
            <div className="text-8xl">{selectedRoute.mainImage}</div>
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{selectedRoute.viewCount.toLocaleString()}</span>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="p-4 space-y-6">
            <div className="max-w-md mx-auto space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">{selectedRoute.location}</span>
                    </div>
                  </div>
                  <Button
                    variant={user.bookmarkedRoutes?.includes(selectedRoute.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => onToggleBookmark(selectedRoute.id)}
                    className="ml-2"
                  >
                    {user.bookmarkedRoutes?.includes(selectedRoute.id) ? (
                      <Bookmark className="w-4 h-4 fill-current" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* 태그들 */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{selectedRoute.category}</Badge>
                  <Badge variant="outline">{selectedRoute.difficulty}</Badge>
                  <Badge variant="outline">{selectedRoute.duration}</Badge>
                  <Badge variant="outline">{selectedRoute.season}</Badge>
                  <Badge 
                    variant={selectedRoute.carbonRating === 'low' ? 'default' : 'secondary'}
                  >
                    {selectedRoute.carbonRating === 'low' ? '친환경' : '일반'}
                  </Badge>
                </div>
              </div>

              {/* 간단 설명 */}
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedRoute.description}</p>
                </CardContent>
              </Card>

              {/* 상세 설명 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">상세 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{selectedRoute.detailedDescription}</p>
                  
                  {/* 체험 활동 */}
                  <div>
                    <h4 className="font-semibold mb-2">체험 가능한 활동</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoute.activities.map((activity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 상세 이미지 갤러리 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">갤러리</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedRoute.detailImages.map((image, index) => (
                      <div 
                        key={index}
                        className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center text-2xl"
                      >
                        {image}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 친환경 포인트 */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700">🌱 친환경 포인트</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-green-700">
                    <li>• 대중교통으로 접근 가능</li>
                    <li>• 자연 보전지역 포함</li>
                    <li>• 지역 커뮤니티 지원</li>
                    <li>• 탄소 저감 여행 코스</li>
                  </ul>
                </CardContent>
              </Card>

              {/* 액션 버튼들 */}
              <div className="space-y-2">
                <Button 
                  className="w-full"
                  onClick={() => onNavigate('calculator')}
                >
                  <CalculatorIcon className="w-4 h-4 mr-2" />
                  이 코스로 탄소배출량 계산
                </Button>
                <Button variant="outline" className="w-full">
                  <Share className="w-4 h-4 mr-2" />
                  코스 공유하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        title="경북 생태관광" 
        user={user}
        onLoginClick={onShowLoginFlow}
        onProfileClick={() => onNavigate('dashboard')}
      />
      
      {/* 부제목 */}
      <div className="bg-white px-4 pb-2">
        <div className="max-w-md mx-auto">
          <p className="text-gray-600 text-sm">경북의 아름다운 생태관광 코스를 찾아보세요</p>
        </div>
      </div>
      
      {/* 프로모션 배너 */}
      <div className="p-4 pb-2">
        <div className="max-w-md mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {promotionBanners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <Card className={`bg-gradient-to-r ${banner.bgColor} text-white overflow-hidden`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-1">{banner.title}</h3>
                          <h4 className="text-sm font-medium mb-2 opacity-90">{banner.subtitle}</h4>
                          <p className="text-sm opacity-80 leading-relaxed">{banner.description}</p>
                        </div>
                        {banner.featured && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            인기
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* 필터 버튼들 */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <Button 
              variant={selectedFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleFilter('all')}
            >
              전체
            </Button>
            <Button 
              variant={selectedFilter === '산림' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleFilter('산림')}
            >
              <Trees className="w-4 h-4 mr-1" />
              산림
            </Button>
            <Button 
              variant={selectedFilter === '국립공원' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleFilter('국립공원')}
            >
              <Mountain className="w-4 h-4 mr-1" />
              국립공원
            </Button>
            <Button 
              variant={selectedFilter === '문화유산' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleFilter('문화유산')}
            >
              문화유산
            </Button>
            <Button 
              variant={selectedFilter === '해안' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleFilter('해안')}
            >
              <Waves className="w-4 h-4 mr-1" />
              해안
            </Button>
          </div>

          {/* 코스 목록 */}
          <div className="space-y-4">
            {filteredRoutes.map((route) => (
              <Card 
                key={route.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelectedRoute(route)}
              >
                <CardContent className="p-0">
                  <div className="flex">
                    {/* 이미지 영역 */}
                    <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-3xl flex-shrink-0">
                      {route.mainImage}
                    </div>
                    
                    {/* 정보 영역 */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{route.name}</h3>
                          <div className="flex items-center space-x-1 mb-2">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span className="text-sm text-gray-600">{route.location}</span>
                          </div>
                        </div>
                        
                        {/* 북마크 버튼 */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onToggleBookmark(route.id);
                          }}
                          className="p-1 h-auto"
                        >
                          {user.bookmarkedRoutes?.includes(route.id) ? (
                            <Bookmark className="w-4 h-4 text-blue-600 fill-current" />
                          ) : (
                            <Bookmark className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{route.description}</p>
                      
                      {/* 하단 정보 */}
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="text-xs">{route.category}</Badge>
                          <Badge 
                            variant={route.carbonRating === 'low' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {route.carbonRating === 'low' ? '친환경' : '일반'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{route.viewCount.toLocaleString()}</span>
                          </div>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 결과가 없을 때 */}
          {filteredRoutes.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-600">해당 카테고리의 코스가 없습니다.</p>
                <Button 
                  variant="outline" 
                  onClick={() => handleFilter('all')}
                  className="mt-4"
                >
                  전체 코스 보기
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};