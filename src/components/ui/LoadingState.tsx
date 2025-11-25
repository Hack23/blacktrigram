import React from 'react';

export interface LoadingStateProps {
  readonly progress?: number;
  readonly message?: string;
  readonly stage?: 'assets' | 'audio' | 'initialization' | 'complete';
}

/**
 * LoadingState component with progress indication
 * Provides user feedback during asset loading and initialization
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  progress = 0,
  message = '로드 중 | Loading...',
  stage = 'initialization',
}) => {
  const stageText = {
    assets: '자산 로드 중 | Loading Assets',
    audio: '오디오 초기화 | Initializing Audio',
    initialization: '게임 준비 중 | Preparing Game',
    complete: '완료 | Complete',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000a12 0%, #001a25 100%)',
        color: '#ffffff',
        fontFamily: "'Noto Sans KR', sans-serif",
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '150px',
          height: '150px',
          marginBottom: '2rem',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        <svg
          width="150"
          height="150"
          viewBox="0 0 150 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Black Trigram Symbol */}
          <rect x="50" y="30" width="20" height="90" fill="#00ffff" />
          <rect x="80" y="30" width="20" height="90" fill="#ffd700" />
        </svg>
      </div>

      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#ffd700',
          marginBottom: '2rem',
          textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          animation: 'glow 2s ease-in-out infinite',
        }}
      >
        흑괘 | BLACK TRIGRAM
      </h1>

      <div
        style={{
          width: '300px',
          height: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '1rem',
          border: '1px solid rgba(0, 255, 255, 0.3)',
        }}
      >
        <div
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #00ffff, #ffd700)',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px #00ffff',
          }}
        />
      </div>

      <p
        style={{
          fontSize: '1.2rem',
          color: '#ffffff',
          marginBottom: '0.5rem',
        }}
      >
        {stageText[stage]}
      </p>

      {message && (
        <p
          style={{
            fontSize: '0.9rem',
            color: '#b3b3b3',
            marginTop: '0.5rem',
          }}
        >
          {message}
        </p>
      )}

      <div
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(0, 255, 255, 0.3)',
          borderTopColor: '#00ffff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginTop: '2rem',
        }}
      />

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 0.8;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
          }
          @keyframes glow {
            0%, 100% {
              text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            }
            50% {
              text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
            }
          }
        `}
      </style>
    </div>
  );
};
