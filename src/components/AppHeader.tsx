import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Bell, ArrowLeft } from 'lucide-react';
import { User } from '../types';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  user: User;
  onLoginClick: () => void;
  onProfileClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBackButton = false, 
  onBackClick,
  user,
  onLoginClick,
  onProfileClick
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* 왼쪽 영역 */}
        <div className="flex items-center space-x-3">
          {showBackButton ? (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBackClick}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🌱</div>
              <span className="text-lg font-bold text-green-600">그루</span>
            </div>
          )}
        </div>

        {/* 중앙 영역 - 페이지 타이틀 */}
        {title && (
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
          </div>
        )}

        {/* 오른쪽 영역 */}
        <div className="flex items-center space-x-2">
          {user.isLoggedIn && (
            <>
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
              <Avatar 
                className="w-8 h-8 cursor-pointer"
                onClick={onProfileClick}
              >
                <AvatarFallback className="text-sm">{user.name[0] || 'U'}</AvatarFallback>
              </Avatar>
            </>
          )}
          {!user.isLoggedIn && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onLoginClick}
              className="text-green-600"
            >
              로그인
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};