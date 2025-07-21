import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Globe } from 'lucide-react';
import { User } from '../../types';

interface LoginFlowProps {
  onComplete: (userData: Partial<User>) => void;
}

export const LoginFlow: React.FC<LoginFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nickname: '',
    birthYear: '',
    gender: '',
    region: '',
    termsAccepted: false,
    privacyAccepted: false
  });

  const handleSocialLogin = (provider: string) => {
    console.log(`로그인: ${provider}`);
    setStep(2);
  };

  const handleComplete = () => {
    onComplete({
      id: 'user1',
      name: formData.nickname,
      level: 3,
      badges: ['🌱', '♻️', '🚲'],
      carbonSaved: 137.9,
      isLoggedIn: true,
      region: formData.region || '서울시 강남구',
      age: formData.birthYear ? new Date().getFullYear() - parseInt(formData.birthYear) : 28,
      representativeBadge: '🌱',
      bookmarkedRoutes: ['1', '3']
    });
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">🌱 그루 서비스</CardTitle>
          <CardDescription>탄소 절감으로 지구를 지켜요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-3">
                <Button 
                  onClick={() => handleSocialLogin('google')}
                  className="w-full bg-white text-gray-700 border hover:bg-gray-50"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  구글로 시작하기
                </Button>
                <Button 
                  onClick={() => handleSocialLogin('kakao')}
                  className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                >
                  💬 카카오로 시작하기
                </Button>
                <Button 
                  onClick={() => handleSocialLogin('apple')}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  🍎 Apple로 시작하기
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">서비스 이용약관 (필수)</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                    />
                    <span className="text-sm">서비스 이용약관에 동의합니다</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">개인정보 처리방침 (필수)</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={formData.privacyAccepted}
                      onChange={(e) => setFormData({...formData, privacyAccepted: e.target.checked})}
                    />
                    <span className="text-sm">개인정보 처리방침에 동의합니다</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!formData.termsAccepted || !formData.privacyAccepted}
                  className="w-full"
                >
                  다음 단계
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">닉네임 *</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded"
                    value={formData.nickname}
                    onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                    placeholder="닉네임을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">출생년도</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    value={formData.birthYear}
                    onChange={(e) => setFormData({...formData, birthYear: e.target.value})}
                    placeholder="1990"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">성별</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="">선택하세요</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                    <option value="other">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">지역</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    placeholder="서울시 강남구"
                  />
                </div>
                <Button 
                  onClick={handleComplete}
                  disabled={!formData.nickname}
                  className="w-full"
                >
                  가입 완료
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};