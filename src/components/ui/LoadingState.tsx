import React from 'react';

/**
 * Props for the LoadingState component.
 *
 * @property progress Loading progress as a percentage (0-100).
 *   @default 0
 * @property message Custom loading message to display.
 *   @default '로드 중 | Loading...'
 * @property stage Current loading stage, determines the stage-specific message.
 *   Possible values:
 *     - 'assets': Loading game assets
 *     - 'audio': Initializing audio system
 *     - 'initialization': Preparing game
 *     - 'complete': Loading complete
 *   @default 'initialization'
 */
export interface LoadingStateProps {
  /**
   * Loading progress as a percentage (0-100)
   * @default 0
   */
  readonly progress?: number;

  /**
   * Custom loading message to display
   * @default '로드 중 | Loading...'
   */
  readonly message?: string;

  /**
   * Current loading stage, determines the stage-specific message
   * - assets: Loading game assets
   * - audio: Initializing audio system
   * - initialization: Preparing game
   * - complete: Loading complete
   * @default 'initialization'
   */
  readonly stage?: 'assets' | 'audio' | 'initialization' | 'complete';
}

/**
 * LoadingState component with progress indication.
 * Provides user feedback during asset loading and initialization with Korean/English bilingual support.
 * 
 * @example
 * ```tsx
 * <LoadingState
 *   progress={50}
 *   message="로드 중 | Loading..."
 *   stage="audio"
 * />
 * ```
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

  const progressValue = Math.min(100, Math.max(0, progress));

  return (
    <div
      className="loading-state"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Loading progress: ${progressValue}%`}
      data-testid="loading-state"
    >
      <div className="loading-state__logo">
        <svg
          width="150"
          height="150"
          viewBox="0 0 150 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Black Trigram Logo"
        >
          {/* Black Trigram Symbol */}
          <rect x="50" y="30" width="20" height="90" fill="#00ffff" />
          <rect x="80" y="30" width="20" height="90" fill="#ffd700" />
        </svg>
      </div>

      <h1 className="loading-state__title">
        흑괘 | BLACK TRIGRAM
      </h1>

      <div
        className="loading-state__progress"
        role="progressbar"
        aria-valuenow={progressValue}
        aria-valuemin={0}
        aria-valuemax={100}
        data-testid="loading-progress-bar"
      >
        <div
          className="loading-state__progress-bar"
          style={{ width: `${progressValue}%` }}
        />
      </div>

      <p className="loading-state__stage">
        {stageText[stage]}
      </p>

      {message && (
        <p className="loading-state__message">
          {message}
        </p>
      )}

      <div
        className="loading-state__spinner"
        aria-label="Loading spinner"
      />
    </div>
  );
};
