import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Calendar } from '../ui/calendar';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { 
  CalendarIcon,
  MapPin,
  X,
  Plus,
  Navigation
} from 'lucide-react';
import { User, EcoTourRoute, CalculatorData } from '../../types';

interface CalculatorProps {
  user: User;
  ecoTourRoutes: EcoTourRoute[];
  onNavigate: (page: string) => void;
  onShowLoginFlow: () => void;
}

interface TravelItem {
  id: string;
  type: 'route' | 'course';
  from?: string;
  to?: string;
  course?: EcoTourRoute;
  transport: string;
}

export const Calculator: React.FC<CalculatorProps> = ({ 
  user, 
  ecoTourRoutes, 
  onNavigate, 
  onShowLoginFlow 
}) => {
  const [step, setStep] = useState(1);
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    people: 1,
    routes: [{ from: '', to: '', transport: '' }],
    stays: [{ startDate: null, endDate: null, accommodation: '' }],
    selectedCourses: []
  });
  const [travelItems, setTravelItems] = useState<TravelItem[]>([]);
  const [result, setResult] = useState<number | null>(null);

  // 지역 옵션 리스트
  const locationOptions = [
    { value: 'seoul', label: '서울특별시' },
    { value: 'busan', label: '부산광역시' },
    { value: 'incheon', label: '인천광역시' },
    { value: 'daegu', label: '대구광역시' },
    { value: 'daejeon', label: '대전광역시' },
    { value: 'gwangju', label: '광주광역시' },
    { value: 'ulsan', label: '울산광역시' },
    { value: 'sejong', label: '세종특별자치시' },
    { value: 'gyeonggi', label: '경기도' },
    { value: 'gangwon', label: '강원특별자치도' },
    { value: 'chungbuk', label: '충청북도' },
    { value: 'chungnam', label: '충청남도' },
    { value: 'jeonbuk', label: '전북특별자치도' },
    { value: 'jeonnam', label: '전라남도' },
    { value: 'gyeongbuk', label: '경상북도' },
    { value: 'gyeongnam', label: '경상남도' },
    { value: 'jeju', label: '제주특별자치도' },
    { value: 'suwon', label: '수원시' },
    { value: 'yongin', label: '용인시' },
    { value: 'goyang', label: '고양시' },
    { value: 'changwon', label: '창원시' },
    { value: 'jeonju', label: '전주시' },
    { value: 'cheonan', label: '천안시' },
    { value: 'ansan', label: '안산시' },
    { value: 'anyang', label: '안양시' },
    { value: 'pohang', label: '포항시' },
    { value: 'uijeongbu', label: '의정부시' },
    { value: 'siheung', label: '시흥시' },
    { value: 'pyeongtaek', label: '평택시' },
    { value: 'kimpo', label: '김포시' },
    { value: 'gwangmyeong', label: '광명시' },
    { value: 'gunpo', label: '군포시' },
    { value: 'hanam', label: '하남시' }
  ];

  // 새로운 교통수단 리스트
  const transportOptions = {
    walking: { icon: '🚶', label: '도보' },
    bicycle: { icon: '🚴', label: '자전거' },
    motorcycle: { icon: '🏍️', label: '오토바이' },
    subway: { icon: '🚇', label: '지하철' },
    ktx: { icon: '🚄', label: '기차 (KTX)' },
    train: { icon: '🚆', label: '기차 (일반)' },
    bus: { icon: '🚌', label: '버스' },
    car_gas: { icon: '🚗', label: '승용차 (내연기관)' },
    car_hybrid: { icon: '🚙', label: '승용차 (하이브리드)' },
    car_electric: { icon: '⚡', label: '승용차 (전기차)' },
    airplane: { icon: '✈️', label: '비행기' },
    ship: { icon: '🚢', label: '여객선' }
  };

  const accommodationOptions = [
    { value: 'hotel', label: '호텔' },
    { value: 'guesthouse', label: '게스트하우스' },
    { value: 'pension', label: '펜션' },
    { value: 'camping', label: '캠핑' },
    { value: 'resort', label: '리조트' }
  ];

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getLocationLabel = (value: string) => {
    const location = locationOptions.find(option => option.value === value);
    return location ? location.label : value;
  };

  const calculateCarbonFootprint = () => {
    if (!user.isLoggedIn) {
      onShowLoginFlow();
      return;
    }

    let total = 0;
    
    // 여행 항목별 탄소 배출량 계산
    travelItems.forEach(item => {
      switch(item.transport) {
        case 'walking': total += 0; break;
        case 'bicycle': total += 0; break;
        case 'motorcycle': total += 90; break;
        case 'subway': total += 30; break;
        case 'ktx': total += 25; break;
        case 'train': total += 40; break;
        case 'bus': total += 60; break;
        case 'car_gas': total += 180; break;
        case 'car_hybrid': total += 120; break;
        case 'car_electric': total += 40; break;
        case 'airplane': total += 300; break;
        case 'ship': total += 200; break;
        default: total += 0;
      }
    });
    
    total *= calculatorData.people;
    
    // 숙박에 따른 탄소 배출량 추가
    calculatorData.stays.forEach(stay => {
      if (stay.startDate && stay.endDate) {
        const days = Math.ceil((stay.endDate.getTime() - stay.startDate.getTime()) / (1000 * 60 * 60 * 24));
        switch(stay.accommodation) {
          case 'hotel': total += days * 30; break;
          case 'resort': total += days * 40; break;
          case 'pension': total += days * 20; break;
          case 'guesthouse': total += days * 15; break;
          case 'camping': total += days * 5; break;
        }
      }
    });

    setResult(total);
  };

  const resetCalculator = () => {
    setStep(1);
    setResult(null);
    setTravelItems([]);
    setCalculatorData({
      people: 1,
      routes: [{ from: '', to: '', transport: '' }],
      stays: [{ startDate: null, endDate: null, accommodation: '' }],
      selectedCourses: []
    });
  };

  const addTravelItem = (item: Omit<TravelItem, 'id'>) => {
    const newItem: TravelItem = {
      ...item,
      id: Date.now().toString()
    };
    setTravelItems([...travelItems, newItem]);
  };

  const removeTravelItem = (id: string) => {
    setTravelItems(travelItems.filter(item => item.id !== id));
  };

  const illustrations = {
    1: '👥',
    2: '🗺️',
    3: '🏨'
  };

  if (result !== null) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">
                {result < 50 ? '🌱' : result < 150 ? '🌿' : '🌳'}
              </div>
              <CardTitle>탄소발자국 계산 결과</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl mb-2">{result}kg CO₂</div>
                <p className="text-gray-600">예상 탄소 배출량</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-semibold mb-2">친환경 여행 팁 💡</h3>
                <ul className="text-sm space-y-1">
                  <li>• 대중교통 이용하기</li>
                  <li>• 지역 음식 즐기기</li>
                  <li>• 일회용품 줄이기</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={resetCalculator}
                  variant="outline"
                  className="w-full"
                >
                  다시 계산하기
                </Button>
                <Button 
                  onClick={() => onNavigate('home')}
                  className="w-full"
                >
                  홈으로 돌아가기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 계산 과정 중에는 헤더 없음 (funnel 구조)
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Progress value={(step / 3) * 100} className="mb-4" />
          <h1 className="text-xl mb-2">🧮 그루미터</h1>
          <p className="text-gray-600">여행 탄소배출량을 계산해보세요</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">{illustrations[step as keyof typeof illustrations]}</div>
            <CardTitle>
              {step === 1 && '인원 수'}
              {step === 2 && '이동 경로 & 관광 코스'}
              {step === 3 && '숙박'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm mb-2">여행 인원</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full p-3 border rounded"
                    value={calculatorData.people}
                    onChange={(e) => setCalculatorData({
                      ...calculatorData, 
                      people: parseInt(e.target.value) || 1
                    })}
                  />
                </div>
                <Button 
                  onClick={() => setStep(2)}
                  className="w-full"
                >
                  다음 단계
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-4">
                  {/* 추가된 여행 항목들 표시 */}
                  {travelItems.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">추가된 여행 항목</h4>
                      {travelItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{transportOptions[item.transport as keyof typeof transportOptions]?.icon}</span>
                            <div className="text-sm">
                              {item.type === 'route' ? (
                                <span>{getLocationLabel(item.from || '')} → {getLocationLabel(item.to || '')}</span>
                              ) : (
                                <span>🗺️ {item.course?.name}</span>
                              )}
                              <div className="text-xs text-gray-600">
                                {transportOptions[item.transport as keyof typeof transportOptions]?.label}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTravelItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 직접 경로 추가 */}
                  <RouteForm 
                    locationOptions={locationOptions}
                    transportOptions={transportOptions}
                    onAdd={(from, to, transport) => {
                      addTravelItem({ type: 'route', from, to, transport });
                    }}
                  />

                  {/* 관광 코스 선택 */}
                  <CourseSelector
                    ecoTourRoutes={ecoTourRoutes}
                    transportOptions={transportOptions}
                    onAdd={(course, transport) => {
                      addTravelItem({ type: 'course', course, transport });
                    }}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button 
                    onClick={() => setStep(3)}
                    className="flex-1"
                    disabled={travelItems.length === 0}
                  >
                    다음
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-4">
                  {calculatorData.stays.map((stay, index) => (
                    <div key={index} className="p-4 border rounded space-y-3">
                      <div>
                        <label className="block text-sm mb-2">숙박 기간</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {stay.startDate ? formatDate(stay.startDate) : "체크인"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={stay.startDate || undefined}
                                onSelect={(date: Date | undefined) => {
                                  const newStays = [...calculatorData.stays];
                                  newStays[index].startDate = date || null;
                                  setCalculatorData({...calculatorData, stays: newStays});
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {stay.endDate ? formatDate(stay.endDate) : "체크아웃"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={stay.endDate || undefined}
                                onSelect={(date: Date | undefined) => {
                                  const newStays = [...calculatorData.stays];
                                  newStays[index].endDate = date || null;
                                  setCalculatorData({...calculatorData, stays: newStays});
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-2">숙박 유형</label>
                        <select 
                          className="w-full p-2 border rounded"
                          value={stay.accommodation}
                          onChange={(e) => {
                            const newStays = [...calculatorData.stays];
                            newStays[index].accommodation = e.target.value;
                            setCalculatorData({...calculatorData, stays: newStays});
                          }}
                        >
                          <option value="">숙박 유형 선택</option>
                          {accommodationOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setCalculatorData({
                        ...calculatorData,
                        stays: [...calculatorData.stays, { startDate: null, endDate: null, accommodation: '' }]
                      });
                    }}
                    className="w-full"
                  >
                    숙박 추가
                  </Button>
                  
                  {!user.isLoggedIn && (
                    <div className="bg-blue-50 p-4 rounded text-center">
                      <p className="text-sm mb-3">탄소배출량 계산을 위해 로그인이 필요합니다</p>
                      <Button 
                        onClick={onShowLoginFlow}
                        size="sm"
                        variant="outline"
                      >
                        로그인하기
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button 
                    onClick={calculateCarbonFootprint}
                    className="flex-1"
                    disabled={travelItems.length === 0}
                  >
                    계산하기
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// 직접 경로 입력 컴포넌트 - Select 드롭다운으로 변경
const RouteForm: React.FC<{
  locationOptions: Array<{value: string, label: string}>;
  transportOptions: Record<string, {icon: string, label: string}>;
  onAdd: (from: string, to: string, transport: string) => void;
}> = ({ locationOptions, transportOptions, onAdd }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [transport, setTransport] = useState('');

  const handleAdd = () => {
    if (from && to && transport) {
      onAdd(from, to, transport);
      setFrom('');
      setTo('');
      setTransport('');
    }
  };

  return (
    <div className="p-4 border rounded space-y-3">
      <div className="flex items-center space-x-2 mb-3">
        <Navigation className="w-4 h-4" />
        <h4 className="font-semibold text-sm">직접 경로 추가</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="출발지" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="도착지" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm mb-2">교통수단</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(transportOptions).map(([key, option]) => (
            <button
              key={key}
              className={`p-2 border rounded flex flex-col items-center text-xs ${
                transport === key ? 'bg-green-100 border-green-500' : ''
              }`}
              onClick={() => setTransport(key)}
            >
              <span className="text-lg mb-1">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={handleAdd}
        disabled={!from || !to || !transport}
        className="w-full"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        경로 추가
      </Button>
    </div>
  );
};

// 관광 코스 선택 컴포넌트
const CourseSelector: React.FC<{
  ecoTourRoutes: EcoTourRoute[];
  transportOptions: Record<string, {icon: string, label: string}>;
  onAdd: (course: EcoTourRoute, transport: string) => void;
}> = ({ ecoTourRoutes, transportOptions, onAdd }) => {
  const [selectedCourse, setSelectedCourse] = useState<EcoTourRoute | null>(null);
  const [transport, setTransport] = useState('');

  const handleAdd = () => {
    if (selectedCourse && transport) {
      onAdd(selectedCourse, transport);
      setSelectedCourse(null);
      setTransport('');
    }
  };

  return (
    <div className="p-4 border rounded space-y-3">
      <div className="flex items-center space-x-2 mb-3">
        <MapPin className="w-4 h-4" />
        <h4 className="font-semibold text-sm">관광 코스 선택</h4>
      </div>
      
      <div>
        <label className="block text-sm mb-2">코스</label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {ecoTourRoutes.map((route) => (
            <div 
              key={route.id} 
              className={`p-2 border rounded cursor-pointer transition-colors ${
                selectedCourse?.id === route.id ? 'bg-green-100 border-green-500' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedCourse(route)}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{route.mainImage}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{route.name}</div>
                  <div className="text-xs text-gray-600">{route.location}</div>
                </div>
                <Badge 
                  variant={route.carbonRating === 'low' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {route.carbonRating === 'low' ? '친환경' : '보통'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <div>
          <label className="block text-sm mb-2">교통수단</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(transportOptions).map(([key, option]) => (
              <button
                key={key}
                className={`p-2 border rounded flex flex-col items-center text-xs ${
                  transport === key ? 'bg-green-100 border-green-500' : ''
                }`}
                onClick={() => setTransport(key)}
              >
                <span className="text-lg mb-1">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <Button 
        onClick={handleAdd}
        disabled={!selectedCourse || !transport}
        className="w-full"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        코스 추가
      </Button>
    </div>
  );
};