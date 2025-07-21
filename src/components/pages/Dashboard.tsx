import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { AppHeader } from '../AppHeader';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Share, 
  Camera, 
  Edit, 
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { User, BadgeInfo, LevelInfo } from '../../types';

interface DashboardProps {
  user: User;
  badges: BadgeInfo[];
  levelInfo: LevelInfo[];
  carbonData: any[];
  rankingData: any[];
  reductionTypes: any[];
  currentChartLabel: string;
  onNavigate: (page: string) => void;
  onShowLoginFlow: () => void;
  onShowBadgeCollection: () => void;
  onShowLevelDetails: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user,
  badges,
  levelInfo,
  carbonData,
  rankingData,
  reductionTypes,
  currentChartLabel,
  onNavigate,
  onShowLoginFlow,
  onShowBadgeCollection,
  onShowLevelDetails,
  onLogout
}) => {
  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader 
          title="마이페이지" 
          user={user}
          onLoginClick={onShowLoginFlow}
          onProfileClick={() => onNavigate('dashboard')}
        />
        
        <div className="p-4 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <UserIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-4">로그인 후 대시보드를 이용하세요</p>
              <Button onClick={onShowLoginFlow}>
                로그인하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getCurrentLevel = (carbonSaved: number) => {
    for (let i = levelInfo.length - 1; i >= 0; i--) {
      if (carbonSaved >= levelInfo[i].carbonThreshold) {
        return levelInfo[i];
      }
    }
    return levelInfo[0];
  };

  const currentLevel = getCurrentLevel(user.carbonSaved);
  const nextLevel = levelInfo.find(level => level.carbonThreshold > user.carbonSaved);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        title="마이페이지" 
        user={user}
        onLoginClick={onShowLoginFlow}
        onProfileClick={() => onNavigate('dashboard')}
      />

      {/* 마이페이지 정보 섹션 */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-gray-600">Lv.{user.level} {currentLevel.name}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl">{user.representativeBadge}</span>
                <span className="text-xs text-gray-500">대표 뱃지</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* 탄소절감 확인 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>탄소절감 현황</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 총 감축량 */}
              <div className="text-center bg-green-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">{user.carbonSaved}kg CO₂</div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  나의 여행 중 총 탄소배출 절감량은 {user.carbonSaved}kg
                  <br />
                  이는 약 {Math.floor(user.carbonSaved / 45)}그루의 나무가 1년동안 흡수하는 양과 같아요 🌳
                  <br />
                  여행 중 대중교통을 이용한 영향이 컸어요
                </p>
              </div>

              {/* 주요 절감 유형 */}
              <div>
                <h4 className="font-semibold mb-3">주요 절감 유형</h4>
                <div className="space-y-2">
                  {reductionTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{type.type}</span>
                      <span className="text-sm font-semibold" style={{ color: type.color }}>
                        {type.amount}kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 기간별 절감 변화 차트 */}
              <div>
                <h4 className="font-semibold mb-3">{currentChartLabel}</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={carbonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="carbon" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        dot={{ fill: '#22c55e' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 현재 뱃지 레벨 표시 */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-4xl mb-2">{currentLevel.icon}</div>
              <p className="text-lg font-semibold mb-2">
                🎉 축하합니다! Lv.{currentLevel.level} {currentLevel.name}로 성장했어요!
              </p>
              {nextLevel && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    다음 레벨까지 {nextLevel.carbonThreshold - user.carbonSaved}kg 남았어요
                  </p>
                  <Progress 
                    value={(user.carbonSaved / nextLevel.carbonThreshold) * 100} 
                    className="h-2"
                  />
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm"
                className="mt-4"
                onClick={onShowLevelDetails}
              >
                뱃지 레벨 자세히 보기
              </Button>
            </CardContent>
          </Card>

          {/* 탄소절감 순위 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span>나의 순위</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                {rankingData.map((data, index) => (
                  <div key={index}>
                    <div className="text-lg font-bold">#{data.rank}</div>
                    <p className="text-xs text-gray-600">{data.category}</p>
                    <p className="text-xs text-gray-500">/{data.total}명</p>
                  </div>
                ))}
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rankingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rank" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 뱃지 수집 현황 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span>뱃지 컬렉션</span>
                </div>
                <span className="text-sm text-gray-600">
                  {badges.filter(b => b.acquired).length}/{badges.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {badges.slice(0, 8).map((badge, index) => (
                  <div 
                    key={index}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center text-2xl ${
                      badge.acquired ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'
                    }`}
                  >
                    {badge.icon}
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onShowBadgeCollection}
              >
                뱃지 수집 현황
              </Button>
            </CardContent>
          </Card>

          {/* 공유 기능 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Share className="w-5 h-5 text-blue-600" />
                <span>공유하기</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Camera className="w-4 h-4 mr-2" />
                탄소절감 리포트 저장
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Share className="w-4 h-4 mr-2" />
                SNS 공유하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};