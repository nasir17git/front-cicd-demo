import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AppHeader } from '../AppHeader';
import { MapPin, Camera, ChevronRight } from 'lucide-react';
import { User, Mission } from '../../types';

interface MissionsProps {
  user: User;
  missions: Mission[];
  onNavigate: (page: string) => void;
  onShowLoginFlow: () => void;
}

export const Missions: React.FC<MissionsProps> = ({ 
  user, 
  missions, 
  onNavigate, 
  onShowLoginFlow 
}) => {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missionStep, setMissionStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [missionContent, setMissionContent] = useState('');
  const [newBadge, setNewBadge] = useState<string | null>(null);

  const handleMissionStart = (mission: Mission) => {
    if (!user.isLoggedIn) {
      onShowLoginFlow();
      return;
    }
    setSelectedMission(mission);
    setMissionStep(1);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && uploadedImages.length < 3) {
      setUploadedImages([...uploadedImages, `placeholder-image-${files.length}`]);
    }
  };

  const completeMission = () => {
    if (selectedMission) {
      if (selectedMission.category === '일상' && Math.random() > 0.5) {
        setNewBadge('친환경 달인 🌱');
      }
      setMissionStep(4);
    }
  };

  const resetMission = () => {
    setSelectedMission(null);
    setMissionStep(1);
    setUploadedImages([]);
    setMissionContent('');
    setNewBadge(null);
  };

  if (selectedMission) {
    // 미션 수행 중에는 헤더 없음 (funnel 구조)
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          {missionStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedMission.title}</CardTitle>
                <CardDescription>{selectedMission.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded">
                  <div className="text-4xl mb-2">{selectedMission.image}</div>
                  <p className="text-sm text-green-600">위치 인증이 필요합니다</p>
                </div>
                <Button 
                  onClick={() => setMissionStep(2)}
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  GPS 인증하기
                </Button>
              </CardContent>
            </Card>
          )}

          {missionStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>위치 인증</CardTitle>
                <CardDescription>현재 위치에서 미션을 수행하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="text-sm">지도 영역</p>
                    <p className="text-xs text-gray-500">서울시 강남구 역삼동</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm">📍 {selectedMission.title} - 역삼동</p>
                </div>
                <Button 
                  onClick={() => setMissionStep(3)}
                  className="w-full"
                >
                  위치 인증 완료
                </Button>
              </CardContent>
            </Card>
          )}

          {missionStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>미션 인증</CardTitle>
                <CardDescription>사진과 내용을 업로드하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">인증 사진 (최대 3장)</label>
                  <div className="space-y-2">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                        <Camera className="w-6 h-6 text-gray-400" />
                      </div>
                    ))}
                    {uploadedImages.length < 3 && (
                      <label className="block w-full h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400">
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <div className="flex items-center justify-center h-full">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                      </label>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2">미션 수행 내용 (최대 500자)</label>
                  <textarea 
                    className="w-full p-3 border rounded h-32 resize-none"
                    value={missionContent}
                    onChange={(e) => setMissionContent(e.target.value)}
                    placeholder="미션을 어떻게 수행했는지 알려주세요"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{missionContent.length}/500</p>
                </div>
                <Button 
                  onClick={completeMission}
                  disabled={uploadedImages.length === 0 || !missionContent.trim()}
                  className="w-full"
                >
                  미션 완료하기
                </Button>
              </CardContent>
            </Card>
          )}

          {missionStep === 4 && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-xl mb-2">미션 완료!</h2>
                  <p className="text-gray-600 mb-4">
                    {selectedMission.carbonSaving}kg의 탄소를 절약했습니다
                  </p>
                  {newBadge && (
                    <div className="bg-yellow-50 p-4 rounded mb-4">
                      <h3 className="font-semibold mb-2">새로운 뱃지 획득! 🏆</h3>
                      <Badge variant="secondary">{newBadge}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Button 
                onClick={() => onNavigate('results')}
                className="w-full"
              >
                나의 미션 결과 보기
              </Button>
              <Button 
                variant="outline"
                onClick={resetMission}
                className="w-full"
              >
                다른 미션 수행하기
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        title="그루의 발자국" 
        user={user}
        onLoginClick={onShowLoginFlow}
        onProfileClick={() => onNavigate('dashboard')}
      />
      
      <div className="p-4">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <p className="text-gray-600">탄소 절감 미션을 수행해보세요</p>
          </div>
          
          <div className="space-y-4">
            {missions.map((mission) => (
              <Card 
                key={mission.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleMissionStart(mission)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{mission.image}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{mission.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{mission.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{mission.category}</Badge>
                        <span className="text-xs text-green-600">
                          탄소절약 {mission.carbonSaving}kg
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};