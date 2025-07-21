import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { AppHeader } from '../AppHeader';
import { 
  MapPin, 
  Leaf, 
  Calculator, 
  Users, 
  TreePine,
  User as UserIcon
} from 'lucide-react';
import { User } from '../../types';

interface HomeProps {
  user: User;
  onNavigate: (page: string) => void;
  onShowOnboarding: () => void;
  onShowLoginFlow: () => void;
}

export const Home: React.FC<HomeProps> = ({ 
  user, 
  onNavigate, 
  onShowOnboarding, 
  onShowLoginFlow 
}) => {
  const banners = [
    { id: 1, title: "새로운 커밋 업데이트! (커밋: COMMIT_SHA)", content: "자전거 타기 미션이 추가되었습니다", color: "bg-green-100" },
    { id: 2, title: "이번 주 챌린지", content: "텀블러 사용하기 챌린지 참여하세요", color: "bg-blue-100" },
    { id: 3, title: "친구 초대 이벤트", content: "친구를 초대하고 특별 뱃지를 받으세요", color: "bg-purple-100" }
  ];

  const routeCards = [
    { 
      id: 1, 
      title: "그루맵 트래킹", 
      description: "생태관광 코스 목록 조회", 
      icon: <MapPin className="w-8 h-8" />,
      page: "routes"
    },
    { 
      id: 2, 
      title: "그루의 발자국", 
      description: "미션 수행", 
      icon: <Leaf className="w-8 h-8" />,
      page: "missions"
    },
    { 
      id: 3, 
      title: "그루미터", 
      description: "탄소배출량 계산", 
      icon: <Calculator className="w-8 h-8" />,
      page: "calculator"
    },
    { 
      id: 4, 
      title: "챌린지 포레스트", 
      description: "다른 유저 미션 결과 조회", 
      icon: <Users className="w-8 h-8" />,
      page: "community"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        user={user}
        onLoginClick={onShowLoginFlow}
        onProfileClick={() => onNavigate('dashboard')}
      />
      
      {/* 히어로 섹션 - 배너 캐러셀 */}
      <div className="bg-white p-4">
        <div className="max-w-md mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <Card className={`${banner.color} border-0`}>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-lg mb-2">{banner.title}</h3>
                      <p className="text-sm text-gray-600">{banner.content}</p>
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
        <div className="max-w-md mx-auto space-y-6">
          {/* 가이드 페이지 버튼 */}
          <Card>
            <CardContent className="p-4">
              <Button 
                onClick={onShowOnboarding}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <TreePine className="w-4 h-4 mr-2" />
                서비스 가이드 보기
              </Button>
            </CardContent>
          </Card>

          {/* 로그인/상태 섹션 */}
          {!user.isLoggedIn ? (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="mb-4">로그인하고 미션을 시작해보세요!</p>
                <Button 
                  onClick={onShowLoginFlow}
                  className="w-full"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  로그인하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">레벨 {user.level} • 탄소절약 {user.carbonSaved}kg</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onNavigate('dashboard')}
                  >
                    마이페이지
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 메인 기능 카드 그룹 - 아이콘 중앙 배치 및 크기 증가 */}
          <div className="grid grid-cols-2 gap-4">
            {routeCards.map((card) => (
              <Card 
                key={card.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onNavigate(card.page)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3 text-green-600">{card.icon}</div>
                  <h3 className="font-semibold mb-1">{card.title}</h3>
                  <p className="text-xs text-gray-600">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};