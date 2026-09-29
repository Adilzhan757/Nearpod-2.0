export type SlideType = 
  | 'content'
  | 'time_to_climb'
  | 'draw_it'
  | 'collaborate_board'
  | 'vr_field_trip'
  | 'open_ended'
  | 'matching_pairs'
  | 'poll';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizSlideData {
  question: string;
  options: QuizOption[];
  timeLimitSec: number;
  points: number;
}

export interface DrawItSlideData {
  prompt: string;
  backgroundImageUrl?: string;
  instructions: string;
}

export interface CollaborateNote {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  color: 'yellow' | 'blue' | 'pink' | 'green';
  likes: number;
  timestamp: string;
}

export interface CollaborateBoardData {
  topic: string;
  description: string;
  notes: CollaborateNote[];
}

export interface VRHotspot {
  id: string;
  xPercent: number;
  yPercent: number;
  title: string;
  description: string;
}

export interface VRFieldTripData {
  locationName: string;
  panoramicImageUrl: string;
  description: string;
  hotspots: VRHotspot[];
}

export interface OpenEndedData {
  prompt: string;
  sampleAnswer?: string;
  allowAudioSubmission?: boolean;
}

export interface MatchingPairItem {
  id: string;
  term: string;
  definition: string;
}

export interface MatchingPairsData {
  instruction: string;
  pairs: MatchingPairItem[];
}

export interface ContentSlideData {
  title: string;
  subtitle?: string;
  bodyText: string;
  bulletPoints?: string[];
  imageUrl?: string;
  audioNarration?: string;
}

export interface PollSlideData {
  question: string;
  options: string[];
}

export interface Slide {
  id: string;
  type: SlideType;
  title: string;
  durationMin?: number;
  content?: ContentSlideData;
  quiz?: QuizSlideData;
  drawIt?: DrawItSlideData;
  collaborate?: CollaborateBoardData;
  vr?: VRFieldTripData;
  openEnded?: OpenEndedData;
  matching?: MatchingPairsData;
  poll?: PollSlideData;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  slidesCount: number;
  durationMin: number;
  thumbnailUrl: string;
  author: string;
  rating: number;
  playCount: number;
  code: string;
  slides: Slide[];
}

export interface Student {
  id: string;
  name: string;
  score: number;
  joinedAt: string;
  isOnline: boolean;
  avatarSeed: string;
  drawings?: Record<string, string>; // slideId -> dataUrl
  quizAnswers?: Record<string, string>; // slideId -> optionId
  openAnswers?: Record<string, string>; // slideId -> text
}

export interface LiveSessionState {
  lessonId: string;
  lessonTitle: string;
  roomCode: string;
  currentSlideIndex: number;
  isStudentPaced: boolean;
  students: Student[];
  collaborateNotes: Record<string, CollaborateNote[]>; // slideId -> notes
  hideStudentNames: boolean;
}
