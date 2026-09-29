import React, { useState } from 'react';
import { Lesson, Slide, SlideType } from '../../types/nearpod';
import { 
  Plus, 
  Sparkles, 
  Trash2, 
  Copy, 
  Save, 
  Play, 
  Layers, 
  Check, 
  FileText, 
  PenTool, 
  Compass, 
  Trophy, 
  MessageSquare, 
  HelpCircle,
  Puzzle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface LessonEditorProps {
  initialLesson?: Lesson;
  onSaveLesson: (lesson: Lesson) => void;
  onLaunchLesson: (lesson: Lesson) => void;
  isKazakh: boolean;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({
  initialLesson,
  onSaveLesson,
  onLaunchLesson,
  isKazakh,
}) => {
  const [title, setTitle] = useState(initialLesson?.title || (isKazakh ? 'Жаңа интерактивті сабақ' : 'New Interactive Lesson'));
  const [description, setDescription] = useState(initialLesson?.description || '');
  const [subject, setSubject] = useState(initialLesson?.subject || 'Жаратылыстану');
  const [grade, setGrade] = useState(initialLesson?.grade || '7-сынып');
  const [slides, setSlides] = useState<Slide[]>(initialLesson?.slides || [
    {
      id: 'slide-1',
      type: 'content',
      title: isKazakh ? 'Кіріспе слайд' : 'Intro Slide',
      content: {
        title: isKazakh ? 'Сабақтың тақырыбы' : 'Lesson Topic',
        subtitle: isKazakh ? 'Мақсаты мен күтілетін нәтижелер' : 'Objectives and Goals',
        bodyText: isKazakh ? 'Бұл сабақта біз негізгі ұғымдармен танысамыз және интерактивті жаттығулар орындаймыз.' : 'In this lesson we will explore key concepts and complete interactive challenges.',
        bulletPoints: [
          isKazakh ? 'Бірінші негізгі қағида' : 'First foundational principle',
          isKazakh ? 'Екінші маңызды тұжырым' : 'Second core hypothesis'
        ]
      }
    }
  ]);

  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isAddingSlideModal, setIsAddingSlideModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedSlide = slides[selectedSlideIndex] || slides[0];

  const handleAddSlide = (type: SlideType) => {
    const newId = 'slide-' + Date.now();
    let newSlide: Slide;

    switch (type) {
      case 'content':
        newSlide = {
          id: newId,
          type: 'content',
          title: isKazakh ? 'Ақпараттық слайд' : 'Content Slide',
          content: {
            title: isKazakh ? 'Жаңа бөлім' : 'New Section',
            bodyText: isKazakh ? 'Түсіндірме мәтінді осында жазыңыз.' : 'Enter explanation text here.',
            bulletPoints: [isKazakh ? 'Негізгі факт 1' : 'Key takeaway 1']
          }
        };
        break;
      case 'time_to_climb':
        newSlide = {
          id: newId,
          type: 'time_to_climb',
          title: isKazakh ? 'Time to Climb викторинасы' : 'Time to Climb Quiz',
          quiz: {
            question: isKazakh ? 'Сұрақты осында жазыңыз?' : 'Write your quiz question here?',
            timeLimitSec: 30,
            points: 1000,
            options: [
              { id: 'opt-1', text: isKazakh ? 'Дұрыс жауап' : 'Correct Option', isCorrect: true },
              { id: 'opt-2', text: isKazakh ? 'Қате жауап 1' : 'Distractor 1', isCorrect: false },
              { id: 'opt-3', text: isKazakh ? 'Қате жауап 2' : 'Distractor 2', isCorrect: false },
              { id: 'opt-4', text: isKazakh ? 'Қате жауап 3' : 'Distractor 3', isCorrect: false }
            ]
          }
        };
        break;
      case 'draw_it':
        newSlide = {
          id: newId,
          type: 'draw_it',
          title: isKazakh ? 'Draw It тапсырмасы' : 'Draw It Activity',
          drawIt: {
            prompt: isKazakh ? 'Оқушылар нені салуы немесе белгілеуі керек?' : 'What should students draw or annotate?',
            instructions: isKazakh ? 'Қалам түстерін қолданып белгілеңіз.' : 'Use the colored pens to label.'
          }
        };
        break;
      case 'collaborate_board':
        newSlide = {
          id: newId,
          type: 'collaborate_board',
          title: isKazakh ? 'Collaborate Board тақтасы' : 'Collaborate Board',
          collaborate: {
            topic: isKazakh ? 'Ой бөлісу тақырыбы' : 'Brainstorming Topic',
            description: isKazakh ? 'Оқушылар өз стикерлерін осы тақырып бойынша жабыстырады.' : 'Students will post sticky notes on this prompt.',
            notes: []
          }
        };
        break;
      case 'vr_field_trip':
        newSlide = {
          id: newId,
          type: 'vr_field_trip',
          title: isKazakh ? '360° VR Саяхат' : 'VR Field Trip',
          vr: {
            locationName: isKazakh ? 'Табиғат ғажаптары' : 'Natural Wonders',
            panoramicImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
            description: isKazakh ? '360 градусқа айналдырып көріңіз' : 'Pan 360 degrees to explore',
            hotspots: []
          }
        };
        break;
      default:
        newSlide = {
          id: newId,
          type: 'open_ended',
          title: isKazakh ? 'Ашық сұрақ' : 'Open Ended Question',
          openEnded: {
            prompt: isKazakh ? 'Оқушыларға рефлексия сұрағы' : 'Reflection question for students',
            allowAudioSubmission: true
          }
        };
    }

    setSlides([...slides, newSlide]);
    setSelectedSlideIndex(slides.length);
    setIsAddingSlideModal(false);
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    const updated = slides.filter((_, i) => i !== index);
    setSlides(updated);
    setSelectedSlideIndex(Math.max(0, index - 1));
  };

  const handleDuplicateSlide = (index: number) => {
    const slideToCopy = slides[index];
    const copied: Slide = {
      ...JSON.parse(JSON.stringify(slideToCopy)),
      id: 'slide-' + Date.now(),
      title: `${slideToCopy.title} (Көшірме)`
    };
    const updated = [...slides];
    updated.splice(index + 1, 0, copied);
    setSlides(updated);
    setSelectedSlideIndex(index + 1);
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= slides.length) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setSlides(updated);
    setSelectedSlideIndex(target);
  };

  // AI Lesson Generator
  const handleGenerateAiLesson = () => {
    if (!aiTopic.trim()) return;
    setIsGeneratingAi(true);

    setTimeout(() => {
      const generatedSlides: Slide[] = [
        {
          id: 'ai-s1',
          type: 'content',
          title: `Кіріспе: ${aiTopic}`,
          content: {
            title: `${aiTopic} негіздері`,
            subtitle: 'Интерактивті оқу модулі',
            bodyText: `${aiTopic} тақырыбы заманауи ғылым мен білімде ерекше маңызға ие. Төмендегі негізгі ұғымдарды мұқият оқып шығыңыз.`,
            bulletPoints: [
              'Негізгі анықтамасы мен мағынасы',
              'Қолданылу салалары мен мысалдары',
              'Болашақтағы даму келешегі'
            ]
          }
        },
        {
          id: 'ai-s2',
          type: 'draw_it',
          title: `Draw It: ${aiTopic} сұлбасын сызыңыз`,
          drawIt: {
            prompt: `Берілген өріске ${aiTopic} тақырыбы бойынша негізгі сұлбаны немесе ассоциациялық картаны сызыңыз.`,
            instructions: 'Түрлі-түсті маркерлерді қолданыңыз.'
          }
        },
        {
          id: 'ai-s3',
          type: 'time_to_climb',
          title: 'Time to Climb: Білімді тексеру',
          quiz: {
            question: `${aiTopic} тақырыбына қатысты ең маңызды қағида қайсысы?`,
            timeLimitSec: 30,
            points: 1000,
            options: [
              { id: 'opt-a', text: 'Жүйелілік пен дәлелділік қағидаты', isCorrect: true },
              { id: 'opt-b', text: 'Кездейсоқ болжамдар жиынтығы', isCorrect: false },
              { id: 'opt-c', text: 'Тек теориялық сипаттама', isCorrect: false },
              { id: 'opt-d', text: 'Қолданысы жоқ ережелер', isCorrect: false }
            ]
          }
        },
        {
          id: 'ai-s4',
          type: 'collaborate_board',
          title: 'Collaborate Board: Ой бөлісу',
          collaborate: {
            topic: `${aiTopic} біздің күнделікті өмірімізге қалай әсер етеді?`,
            description: 'Өз пікіріңізді стикерге қысқаша жазып қалдырыңыз.',
            notes: [
              {
                id: 'ai-n1',
                authorName: 'Айбек Д.',
                content: 'Бұл ұғымды дұрыс түсіну жаңа инновациялар жасауға көмектеседі.',
                color: 'blue',
                likes: 4,
                timestamp: 'Жаңа ғана'
              }
            ]
          }
        },
        {
          id: 'ai-s5',
          type: 'open_ended',
          title: 'Қорытынды рефлексия',
          openEnded: {
            prompt: `Бүгінгі ${aiTopic} тақырыбы бойынша ең қызықты болған ақпаратты жазыңыз.`,
            allowAudioSubmission: true
          }
        }
      ];

      setTitle(`${aiTopic} (Интерактивті сабақ)`);
      setSlides(generatedSlides);
      setSelectedSlideIndex(0);
      setIsGeneratingAi(false);
      setAiTopic('');
    }, 1200);
  };

  const handleSave = () => {
    const fullLesson: Lesson = {
      id: initialLesson?.id || 'lesson-' + Date.now(),
      title,
      description,
      subject,
      grade,
      slidesCount: slides.length,
      durationMin: slides.length * 4,
      thumbnailUrl: initialLesson?.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      author: isKazakh ? 'Сіздің профиліңіз' : 'Your Profile',
      rating: 5.0,
      playCount: 1,
      code: initialLesson?.code || 'STUD' + Math.floor(10 + Math.random() * 89),
      slides
    };

    onSaveLesson(fullLesson);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex flex-col">
      {/* Studio Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider font-mono">
                Nearpod Studio · {isKazakh ? 'Сабақ құрастырушы' : 'Lesson Builder'}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-bold font-display text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none transition-colors px-1 -ml-1 rounded"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> {isKazakh ? 'Сақталды!' : 'Saved!'}
            </span>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isKazakh ? 'Сақтау' : 'Save'}</span>
          </button>

          <button
            onClick={() => {
              handleSave();
              const fullLesson: Lesson = {
                id: initialLesson?.id || 'lesson-' + Date.now(),
                title,
                description,
                subject,
                grade,
                slidesCount: slides.length,
                durationMin: slides.length * 4,
                thumbnailUrl: initialLesson?.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
                author: isKazakh ? 'Сіздің профиліңіз' : 'Your Profile',
                rating: 5.0,
                playCount: 1,
                code: initialLesson?.code || 'STUD' + Math.floor(10 + Math.random() * 89),
                slides
              };
              onLaunchLesson(fullLesson);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>{isKazakh ? 'Осы сабақты бастау' : 'Teach Now'}</span>
          </button>
        </div>
      </div>

      {/* AI Assistant Quick Generator Banner */}
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-sky-100 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-900">
            <Sparkles className="w-4 h-4 text-sky-600 animate-spin-slow" />
            <span>
              {isKazakh ? 'Nearpod AI Сабақ Генераторы: Тақырыпты жазыңыз, толық интерактивті сабақ дайын болады' : 'Nearpod AI Lesson Generator: Type any topic to auto-build an interactive lesson deck'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder={isKazakh ? 'Мысалы: Фотосинтез, Ғарыш, Бөлшектер...' : 'e.g. Photosynthesis, Ancient Rome...'}
              className="px-3 py-1.5 text-xs bg-white border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500 w-full sm:w-64"
            />
            <button
              onClick={handleGenerateAiLesson}
              disabled={isGeneratingAi || !aiTopic.trim()}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shrink-0 flex items-center gap-1"
            >
              {isGeneratingAi ? (isKazakh ? 'Құрылуда...' : 'Generating...') : (isKazakh ? 'AI сабақ жасау' : 'Generate')}
            </button>
          </div>
        </div>
      </div>

      {/* Studio Workspace: Slide Thumbnails on Left, Editor in Center */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left 4 Cols: Slide Deck Column */}
        <div className="md:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              {isKazakh ? 'Слайдтар реті' : 'Slide Deck'} ({slides.length})
            </span>
            <button
              onClick={() => setIsAddingSlideModal(true)}
              className="flex items-center gap-1 px-3 py-1 bg-sky-600 text-white hover:bg-sky-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isKazakh ? 'Слайд қосу' : 'Add Slide'}</span>
            </button>
          </div>

          {/* Slides List */}
          <div className="space-y-2 max-h-[65vh] overflow-y-auto custom-scrollbar pr-1">
            {slides.map((s, idx) => {
              const isSelected = selectedSlideIndex === idx;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSlideIndex(idx)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-sky-500 ring-2 ring-sky-200 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-800 truncate font-display">
                        {s.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">
                        {s.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleMoveSlide(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveSlide(idx, 'down')}
                      disabled={idx === slides.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicateSlide(idx)}
                      className="p-1 text-slate-400 hover:text-sky-600"
                      title={isKazakh ? 'Көшіру' : 'Duplicate'}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(idx)}
                      disabled={slides.length <= 1}
                      className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-20"
                      title={isKazakh ? 'Жою' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Selected Slide Live Form Editor */}
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider font-mono">
                  {selectedSlide.type.toUpperCase()} · {isKazakh ? 'Слайдты өңдеу' : 'Editing Slide'} #{selectedSlideIndex + 1}
                </span>
              </div>
            </div>

            {/* Slide Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {isKazakh ? 'Слайд тақырыбы' : 'Slide Title'}
              </label>
              <input
                type="text"
                value={selectedSlide.title}
                onChange={(e) => {
                  const updated = [...slides];
                  updated[selectedSlideIndex].title = e.target.value;
                  setSlides(updated);
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Specific fields depending on slide type */}
            {selectedSlide.type === 'content' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {isKazakh ? 'Негізгі тақырып' : 'Heading'}
                  </label>
                  <input
                    type="text"
                    value={selectedSlide.content?.title || ''}
                    onChange={(e) => {
                      const updated = [...slides];
                      if (updated[selectedSlideIndex].content) {
                        updated[selectedSlideIndex].content!.title = e.target.value;
                      }
                      setSlides(updated);
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-sky-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {isKazakh ? 'Түсіндірме мәтіні' : 'Body Text'}
                  </label>
                  <textarea
                    rows={4}
                    value={selectedSlide.content?.bodyText || ''}
                    onChange={(e) => {
                      const updated = [...slides];
                      if (updated[selectedSlideIndex].content) {
                        updated[selectedSlideIndex].content!.bodyText = e.target.value;
                      }
                      setSlides(updated);
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-sky-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {selectedSlide.type === 'draw_it' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {isKazakh ? 'Сурет салу тапсырмасының сұрағы' : 'Drawing Prompt'}
                  </label>
                  <textarea
                    rows={3}
                    value={selectedSlide.drawIt?.prompt || ''}
                    onChange={(e) => {
                      const updated = [...slides];
                      if (updated[selectedSlideIndex].drawIt) {
                        updated[selectedSlideIndex].drawIt!.prompt = e.target.value;
                      }
                      setSlides(updated);
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-sky-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {selectedSlide.type === 'time_to_climb' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {isKazakh ? 'Викторина сұрағы' : 'Quiz Question'}
                  </label>
                  <input
                    type="text"
                    value={selectedSlide.quiz?.question || ''}
                    onChange={(e) => {
                      const updated = [...slides];
                      if (updated[selectedSlideIndex].quiz) {
                        updated[selectedSlideIndex].quiz!.question = e.target.value;
                      }
                      setSlides(updated);
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-sky-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    {isKazakh ? 'Жауап нұсқалары (Дұрысын белгілеңіз):' : 'Options (Mark the correct one):'}
                  </span>
                  {selectedSlide.quiz?.options.map((opt, oIdx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct-option"
                        checked={opt.isCorrect}
                        onChange={() => {
                          const updated = [...slides];
                          if (updated[selectedSlideIndex].quiz) {
                            updated[selectedSlideIndex].quiz!.options.forEach((o, i) => {
                              o.isCorrect = i === oIdx;
                            });
                          }
                          setSlides(updated);
                        }}
                        className="accent-emerald-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...slides];
                          if (updated[selectedSlideIndex].quiz) {
                            updated[selectedSlideIndex].quiz!.options[oIdx].text = e.target.value;
                          }
                          setSlides(updated);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-sky-500 focus:bg-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSlide.type === 'collaborate_board' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {isKazakh ? 'Ой бөлісу тақырыбы' : 'Board Prompt'}
                  </label>
                  <textarea
                    rows={3}
                    value={selectedSlide.collaborate?.topic || ''}
                    onChange={(e) => {
                      const updated = [...slides];
                      if (updated[selectedSlideIndex].collaborate) {
                        updated[selectedSlideIndex].collaborate!.topic = e.target.value;
                      }
                      setSlides(updated);
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-sky-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>{isKazakh ? 'Өзгерістер автоматты түрде дайындалады' : 'Changes staged in browser'}</span>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold"
            >
              {isKazakh ? 'Сабақты сақтау' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Add Slide Type Modal */}
      {isAddingSlideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-lg font-bold font-display text-slate-900">
                {isKazakh ? 'Жаңа слайд немесе интерактивті тапсырма таңдаңыз' : 'Add Content or Interactive Activity'}
              </h3>
              <button
                onClick={() => setIsAddingSlideModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleAddSlide('content')}
                className="p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 flex flex-col items-center text-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-display">
                    {isKazakh ? 'Слайд' : 'Slide'}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {isKazakh ? 'Мәтін, сурет, бейне' : 'Text, image, media'}
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleAddSlide('time_to_climb')}
                className="p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 flex flex-col items-center text-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-display">
                    Time to Climb
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {isKazakh ? 'Ойын түріндегі викторина' : 'Gamified quiz race'}
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleAddSlide('draw_it')}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex flex-col items-center text-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-display">
                    Draw It
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {isKazakh ? 'Сурет салу және белгілеу' : 'Drawing canvas'}
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleAddSlide('collaborate_board')}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 flex flex-col items-center text-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-display">
                    Collaborate Board
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {isKazakh ? 'Стикерлермен ой бөлісу' : 'Sticky brainstorm'}
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleAddSlide('vr_field_trip')}
                className="p-4 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 flex flex-col items-center text-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-display">
                    VR 360° Field Trip
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {isKazakh ? 'Виртуалды саяхат' : 'Virtual field trip'}
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleAddSlide('open_ended')}
                className="p-4 rounded-xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50/50 flex flex-col items-center text-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-display">
                    {isKazakh ? 'Ашық сұрақ' : 'Open Ended'}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {isKazakh ? 'Рефлексия мен пікір' : 'Student reflection'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
