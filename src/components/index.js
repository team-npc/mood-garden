/**
 * Component Index
 * Centralized exports for all Mood Garden components
 */

// Core Components
export { default as Navigation } from './Navigation';
export { default as Plant } from './Plant';
export { default as PlantStages } from './PlantStages';
export { default as JournalEntry } from './JournalEntry';
export { default as MoodSelector } from './MoodSelector';
export { default as StreakCounter } from './StreakCounter';
export { default as DailyPrompt } from './DailyPrompt';
export { default as JournalList } from './JournalList';

// Feature Components
export { default as AmbientSoundscape } from './AmbientSoundscape';
export { default as ParticleSystem, useParticles } from './ParticleSystem';
export { default as AchievementSystem, useAchievements } from './AchievementSystem';
export { default as PlantSpecies, usePlantSpecies } from './PlantSpecies';
export { default as PhotoJournaling, usePhotoJournaling } from './PhotoJournaling';
export { default as MoodTimeline } from './MoodTimeline';
export { default as FocusMode } from './FocusMode';
export { default as ThemeSystem, useTheme, ThemeProvider } from './ThemeSystem';
export { default as WeatherIntegration, useWeather, WeatherProvider } from './WeatherIntegration';
export { default as DailyChallenges, useChallenges, ChallengeProvider } from './DailyChallenges';
export { default as VoiceJournaling, useSpeechRecognition, useAudioRecorder } from './VoiceJournaling';
export { default as DrawingCanvas, useCanvas } from './DrawingCanvas';
export { default as SeasonalEvents, useSeason, SeasonalProvider } from './SeasonalEvents';
export { default as WidgetDashboard, WIDGET_TYPES, useDashboard } from './WidgetDashboard';
export { default as AnonymousGallery, useGallery } from './AnonymousGallery';
export { default as PlantCustomizationStudio, usePlantCustomization } from './PlantCustomizationStudio';
export { default as AIWritingCoach, useWritingAnalysis } from './AIWritingCoach';

// Analytics & Insights
export { default as MoodStatsDashboard } from './MoodStatsDashboard';

// Entry Management
export { default as SmartCollections } from './SmartCollections';
export { default as ImportEntries } from './ImportEntries';
export { default as EntryRecommendations } from './EntryRecommendations';
export { default as GardenSnapshotExport } from './GardenSnapshotExport';
export { default as ReflectionMode } from './ReflectionMode';
export { default as ScheduledReminders } from './ScheduledReminders';
export { default as ShareEntryModal, ShareEntryButton } from './ShareEntryModal';

// Phase 2: Advanced Features (21 New Components)
export { default as GardenEcosystem } from './GardenEcosystem';
export { default as GratitudePrompts } from './GratitudePrompts';
export { default as BreathingExercises } from './BreathingExercises';
export { default as CrisisSupport } from './CrisisSupport';
export { default as TimeCapsule } from './TimeCapsule';
export { default as SeasonalEventsNew } from './SeasonalEventsNew';
export { default as PlantCompanions } from './PlantCompanions';
export { default as DailyQuestsNew } from './DailyQuestsNew';
export { default as MoodConstellations } from './MoodConstellations';
export { default as AIMoodInsights } from './AIMoodInsights';
export { default as DreamJournal } from './DreamJournal';
export { default as MoodCorrelations } from './MoodCorrelations';
export { default as SmartWritingCoach } from './SmartWritingCoach';
export { default as MoodPostcards } from './MoodPostcards';
export { default as CommunityChallenges } from './CommunityChallenges';
export { default as GrowthTimelapse } from './GrowthTimelapse';
export { default as MoodMusicPlaylist } from './MoodMusicPlaylist';
export { default as AnonymousGarden } from './AnonymousGarden';
export { default as AccountabilityPartners } from './AccountabilityPartners';

// Phase 3: UI Enhancement Components
export { default as WidgetSystem, WidgetContainer, WIDGET_CATALOG } from './WidgetSystem';
export { default as RichTextEditor, MarkdownPreview, FormattingToolbar, SmartSuggestions } from './RichTextEditor';
export { default as EnhancedPlantCustomization } from './EnhancedPlantCustomization';
export { default as SocialHub } from './SocialHub';
export { default as PremiumThemes, PREMIUM_THEMES } from './PremiumThemes';
export { default as Gamification, ACHIEVEMENTS, RARITY_COLORS } from './Gamification';

// Utilities
export { detectEmotion, getMoodSuggestion, useEmotionDetection } from '../utils/emotionDetection';

// Accessibility Components
export { 
  default as AccessibilityPanel, 
  AccessibilityProvider, 
  useAccessibility,
  SkipToContent,
  AccessibleButton,
  LiveRegion,
} from './AccessibilitySuite';

// UI Components
export { default as ToastSystem, ToastProvider, useToast } from './ToastSystem';
export { 
  default as PremiumUI,
  SkeletonCard,
  SkeletonList,
  SkeletonText,
  EmptyState,
  LoadingSpinner,
  PremiumCard,
  GlowButton,
} from './PremiumUI';
export { default as MentalHealthResources } from './MentalHealthResources';

// Error Handling
export { default as ErrorBoundary, withErrorBoundary, AsyncBoundary } from './ErrorBoundary';

// Lazy Loading
export { 
  GardenLoader,
  InlineLoader,
  LazyPages,
  LazyComponents,
  SuspenseWrapper,
  PageLoader,
  ComponentLoader,
  CardSkeleton,
  createLazyComponent,
  useRoutePreload,
  useLazyLoad,
  LazyImage,
} from './LazyLoading';
