import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { AppHeader } from '../AppHeader';
import { Crown } from 'lucide-react';
import { User, BadgeInfo } from '../../types';

interface BadgeCollectionProps {
  user: User;
  badges: BadgeInfo[];
  onNavigate: (page: string) => void;
  onShowLoginFlow: () => void;
  onBackClick: () => void;
  onSelectBadge: (badge: BadgeInfo) => void;
  onSetRepresentativeBadge: (badgeIcon: string) => void;
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({ 
  user,
  badges,
  onNavigate,
  onShowLoginFlow,
  onBackClick,
  onSelectBadge,
  onSetRepresentativeBadge
}) => {
  const acquiredBadges = badges.filter(badge => badge.acquired);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        title="뱃지 수집 현황" 
        showBackButton={true}
        onBackClick={onBackClick}
        user={user}
        onLoginClick={onShowLoginFlow}
        onProfileClick={() => onNavigate('dashboard')}
      />
      
      <div className="p-4">
        <div className="max-w-md mx-auto">
          {/* 뱃지 그리드 */}
          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge) => (
              <Card 
                key={badge.id}
                className={`cursor-pointer transition-all ${
                  badge.acquired ? 'hover:shadow-lg' : 'opacity-50'
                }`}
                onClick={() => badge.acquired && onSelectBadge(badge)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`text-3xl mb-2 ${!badge.acquired ? 'grayscale' : ''}`}>
                    {badge.icon}
                  </div>
                  <p className="text-xs text-gray-600 break-words">{badge.name}</p>
                  {badge.acquired && user.representativeBadge === badge.icon && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        대표
                      </Badge>
                    </div>
                  )}
                  {badge.acquired && user.representativeBadge !== badge.icon && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs h-6"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onSetRepresentativeBadge(badge.icon);
                      }}
                    >
                      대표 설정
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 통계 */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">획득한 뱃지</span>
                <span className="font-semibold">{acquiredBadges.length}/{badges.length}</span>
              </div>
              <Progress value={(acquiredBadges.length / badges.length) * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};