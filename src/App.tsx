import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  CheckCircle,
  Home,
  MapPin,
  Camera,
  Users,
  User as UserIcon,
} from "lucide-react";
import { Home as HomePage } from "./components/pages/Home";
import { OnboardingGuide } from "./components/pages/OnboardingGuide";
import { LoginFlow } from "./components/pages/LoginFlow";
import { Missions } from "./components/pages/Missions";
import { Calculator } from "./components/pages/Calculator";
import { Results } from "./components/pages/Results";
import { Routes } from "./components/pages/Routes";
import { Dashboard } from "./components/pages/Dashboard";
import { BadgeCollection } from "./components/pages/BadgeCollection";
import { User, BadgeInfo } from "./types";
import {
  missions,
  ecoTourRoutes,
  badges,
  levelInfo,
  carbonData,
  rankingData,
  reductionTypes,
  chartLabels,
} from "./data";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    level: 1,
    badges: [],
    carbonSaved: 0,
    isLoggedIn: false,
    region: "서울시 강남구",
    age: 28,
    representativeBadge: "🌱",
    bookmarkedRoutes: [],
  });

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLoginFlow, setShowLoginFlow] = useState(false);
  const [showBadgeCollection, setShowBadgeCollection] =
    useState(false);
  const [selectedBadge, setSelectedBadge] =
    useState<BadgeInfo | null>(null);
  const [showLevelDetails, setShowLevelDetails] =
    useState(false);

  // 랜덤 그래프 라벨
  const [currentChartLabel] = useState(
    chartLabels[Math.floor(Math.random() * chartLabels.length)],
  );

  const handleUserLogin = (userData: Partial<User>) => {
    setUser({ ...user, ...userData });
    setShowLoginFlow(false);
    setCurrentPage("home");
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setCurrentPage("home");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setUser({
      id: "",
      name: "",
      level: 1,
      badges: [],
      carbonSaved: 0,
      isLoggedIn: false,
      region: "서울시 강남구",
      age: 28,
      representativeBadge: "🌱",
      bookmarkedRoutes: [],
    });
    setCurrentPage("home");
  };

  const handleToggleBookmark = (routeId: string) => {
    if (!user.isLoggedIn) {
      setShowLoginFlow(true);
      return;
    }

    const currentBookmarks = user.bookmarkedRoutes || [];
    const isBookmarked = currentBookmarks.includes(routeId);

    if (isBookmarked) {
      setUser({
        ...user,
        bookmarkedRoutes: currentBookmarks.filter(
          (id) => id !== routeId,
        ),
      });
    } else {
      setUser({
        ...user,
        bookmarkedRoutes: [...currentBookmarks, routeId],
      });
    }
  };

  const handleSetRepresentativeBadge = (badgeIcon: string) => {
    setUser({ ...user, representativeBadge: badgeIcon });
  };

  // 뱃지 상세 모달
  const BadgeDetailModal = () => (
    <Dialog
      open={!!selectedBadge}
      onOpenChange={() => setSelectedBadge(null)}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="text-center">
            <div className="text-6xl mb-4">
              {selectedBadge?.icon}
            </div>
            <DialogTitle className="text-lg">
              {selectedBadge?.name}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">뱃지 설명</h4>
            <p className="text-sm text-gray-600">
              {selectedBadge?.description}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">획득 조건</h4>
            <p className="text-sm text-gray-600">
              {selectedBadge?.condition}
            </p>
          </div>
          {selectedBadge?.acquired && (
            <div>
              <h4 className="font-semibold mb-2">획득일자</h4>
              <p className="text-sm text-gray-600">
                {selectedBadge?.acquiredDate}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  // 레벨 상세 모달
  const LevelDetailModal = () => (
    <Dialog
      open={showLevelDetails}
      onOpenChange={setShowLevelDetails}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>레벨 시스템</DialogTitle>
          <DialogDescription>
            탄소절감량에 따른 레벨 정보
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {levelInfo.map((level) => (
            <div
              key={level.level}
              className={`flex items-center p-3 rounded-lg border ${
                user.carbonSaved >= level.carbonThreshold
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="text-2xl mr-3">{level.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  Lv.{level.level} {level.name}
                </p>
                <p className="text-xs text-gray-600">
                  {level.carbonThreshold === 700
                    ? "700kg+"
                    : `~${level.carbonThreshold}kg`}
                </p>
              </div>
              {user.carbonSaved >= level.carbonThreshold && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  // 하단 네비게이션 바 표시 여부 확인
  const showBottomNavigation = !showOnboarding && !showLoginFlow && !showBadgeCollection;

  // 메인 네비게이션
  const renderPage = () => {
    // 하단 네비게이션 바가 표시될 때 bottom padding 추가
    const pageWrapperClass = showBottomNavigation ? "pb-20" : "";

    if (showOnboarding) {
      return (
        <div className={pageWrapperClass}>
          <OnboardingGuide
            onComplete={handleOnboardingComplete}
          />
        </div>
      );
    }

    if (showLoginFlow) {
      return (
        <div className={pageWrapperClass}>
          <LoginFlow onComplete={handleUserLogin} />
        </div>
      );
    }

    if (showBadgeCollection) {
      return (
        <div className={pageWrapperClass}>
          <BadgeCollection
            user={user}
            badges={badges}
            onNavigate={handleNavigate}
            onShowLoginFlow={() => setShowLoginFlow(true)}
            onBackClick={() => setShowBadgeCollection(false)}
            onSelectBadge={setSelectedBadge}
            onSetRepresentativeBadge={
              handleSetRepresentativeBadge
            }
          />
        </div>
      );
    }

    switch (currentPage) {
      case "home":
        return (
          <div className={pageWrapperClass}>
            <HomePage
              user={user}
              onNavigate={handleNavigate}
              onShowOnboarding={() => setShowOnboarding(true)}
              onShowLoginFlow={() => setShowLoginFlow(true)}
            />
          </div>
        );
      case "missions":
        return (
          <div className={pageWrapperClass}>
            <Missions
              user={user}
              missions={missions}
              onNavigate={handleNavigate}
              onShowLoginFlow={() => setShowLoginFlow(true)}
            />
          </div>
        );
      case "calculator":
        return (
          <div className={pageWrapperClass}>
            <Calculator
              user={user}
              ecoTourRoutes={ecoTourRoutes}
              onNavigate={handleNavigate}
              onShowLoginFlow={() => setShowLoginFlow(true)}
            />
          </div>
        );
      case "results":
      case "community":
        return (
          <div className={pageWrapperClass}>
            <Results
              user={user}
              onNavigate={handleNavigate}
              onShowLoginFlow={() => setShowLoginFlow(true)}
            />
          </div>
        );
      case "dashboard":
        return (
          <div className={pageWrapperClass}>
            <Dashboard
              user={user}
              badges={badges}
              levelInfo={levelInfo}
              carbonData={carbonData}
              rankingData={rankingData}
              reductionTypes={reductionTypes}
              currentChartLabel={currentChartLabel}
              onNavigate={handleNavigate}
              onShowLoginFlow={() => setShowLoginFlow(true)}
              onShowBadgeCollection={() =>
                setShowBadgeCollection(true)
              }
              onShowLevelDetails={() => setShowLevelDetails(true)}
              onLogout={handleLogout}
            />
          </div>
        );
      case "routes":
        return (
          <div className={pageWrapperClass}>
            <Routes
              user={user}
              ecoTourRoutes={ecoTourRoutes}
              onNavigate={handleNavigate}
              onShowLoginFlow={() => setShowLoginFlow(true)}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        );
      default:
        return (
          <div className={pageWrapperClass}>
            <HomePage
              user={user}
              onNavigate={handleNavigate}
              onShowOnboarding={() => setShowOnboarding(true)}
              onShowLoginFlow={() => setShowLoginFlow(true)}
            />
          </div>
        );
    }
  };

  return (
    <div className="font-sans">
      {renderPage()}

      {/* 하단 네비게이션 바 - 5개 탭으로 확장 */}
      {showBottomNavigation && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {/* 홈 */}
            <button
              onClick={() => handleNavigate("home")}
              className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors ${
                currentPage === "home"
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">홈</span>
            </button>

            {/* 생태관광 */}
            <button
              onClick={() => handleNavigate("routes")}
              className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors ${
                currentPage === "routes"
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-xs">생태관광</span>
            </button>

            {/* 인증 - CTA 스타일 (가운데 배치) */}
            <button
              onClick={() => handleNavigate("missions")}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-full transition-all shadow-lg ${
                currentPage === "missions"
                  ? "bg-green-600 text-white transform scale-105"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              <Camera className="w-6 h-6" />
              <span className="text-xs font-medium">
                인증
              </span>
            </button>

            {/* 커뮤니티 */}
            <button
              onClick={() => handleNavigate("results")}
              className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors ${
                currentPage === "results" ||
                currentPage === "community"
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">커뮤니티</span>
            </button>

            {/* 마이 */}
            <button
              onClick={() => handleNavigate("dashboard")}
              className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors ${
                currentPage === "dashboard"
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-xs">마이</span>
            </button>
          </div>
        </div>
      )}

      {/* 모달들 */}
      <BadgeDetailModal />
      <LevelDetailModal />
    </div>
  );
};

export default App;