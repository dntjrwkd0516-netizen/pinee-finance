import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Trophy, Target, Lightbulb, BookOpen, Sparkles, Loader2, RotateCcw, Send, User, MessageCircle } from 'lucide-react';
import { generateConceptContent, askPinee } from '../services/claudeApi';
import { getAllConcepts } from '../data/curriculum';

const RELATED_CONCEPTS_MAP = {
    '복리의 마법': ['예금 vs 적금', 'CMA 통장', '인플레이션 대응'],
    '주식이란?': ['ETF 투자', '배당주 투자', '재무제표 보기'],
    '인플레이션': ['기준금리란?', '금리와 내 저축', 'CPI 물가지수'],
    '전세 vs 월세': ['청약 기초', '등기부등본 읽기', '전세 사기 예방'],
    'CMA 통장': ['예금 vs 적금', '비상금 설계', '복리의 마법'],
    'ETF 투자': ['배당주 투자', '분산투자 원칙', '포트폴리오 리밸런싱'],
};

const LearningSession = ({ concept, onComplete, onExit, onSelectConcept, nextConceptName }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("🤖 핀이가 공부하는 중...");
    const [content, setContent] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [error, setError] = useState(null);

    // Chat states
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [isAsking, setIsAsking] = useState(false);

    // Quiz sub-states
    const [quizAttempt, setQuizAttempt] = useState(0);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const data = await generateConceptContent(concept.name, concept.summary, (msg) => setStatusMessage(msg));
            setContent(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch concept content:", err);
            setError("콘텐츠를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
            setLoading(false);
        }
    };

    useEffect(() => {
        setStep(1);
        setChatMessages([]);
        setChatInput("");
        fetchContent();
    }, [concept]);

    const handleSendQuestion = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || isAsking) return;

        const question = chatInput.trim();
        setChatInput("");
        setChatMessages(prev => [...prev, { role: 'user', text: question }]);
        setIsAsking(true);

        try {
            const answer = await askPinee(concept.name, question);
            setChatMessages(prev => [...prev, { role: 'pinee', text: answer }]);
        } catch (err) {
            console.error("Failed to ask Pinee:", err);
            setChatMessages(prev => [...prev, { role: 'pinee', text: "미안해요, 지금은 대답하기가 조금 힘들어요. 다시 물어봐주시겠어요?" }]);
        } finally {
            setIsAsking(false);
        }
    };

    const handleRefresh = () => {
        if (!window.confirm("현재 콘텐츠를 삭제하고 새로 생성하시겠습니까?")) return;
        localStorage.removeItem("cache_" + concept.name);
        setContent(null);
        setStep(1);
        setQuizAttempt(0);
        setShowAnswer(false);
        setSelectedOption(null);
        setChatMessages([]);
        fetchContent();
    };

    const nextStep = () => setStep(prev => prev + 1);

    const handleQuizOption = (index) => {
        if (showAnswer) return;
        
        const currentQuiz = content.quiz;
        setSelectedOption(index);
        setShowAnswer(true);

        const newAttemptCount = quizAttempt + 1;
        setQuizAttempt(newAttemptCount);

        if (index !== currentQuiz.correct_index) {
            const wrongConcepts = JSON.parse(localStorage.getItem('wrong_concepts') || '[]');
            if (!wrongConcepts.includes(concept.name)) {
                localStorage.setItem('wrong_concepts', JSON.stringify([...wrongConcepts, concept.name]));
            }
            const stats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');
            stats[concept.name] = newAttemptCount;
            localStorage.setItem('quiz_stats', JSON.stringify(stats));
        }
    };

    const retryQuiz = () => {
        setSelectedOption(null);
        setShowAnswer(false);
    };

    const renderChat = () => {
        return (
            <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                <form onSubmit={handleSendQuestion} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="핀이에게 질문하기..."
                        disabled={isAsking}
                        style={{
                            flex: 1,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '10px 16px',
                            color: 'white',
                            fontSize: '0.9rem'
                        }}
                    />
                    <button 
                        type="submit" 
                        disabled={isAsking || !chatInput.trim()}
                        style={{
                            background: 'var(--primary)',
                            border: 'none',
                            borderRadius: '12px',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            opacity: (isAsking || !chatInput.trim()) ? 0.5 : 1
                        }}
                    >
                        {isAsking ? <Loader2 size={18} className="spin" /> : <Send size={18} color="white" />}
                    </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {chatMessages.map((msg, i) => (
                        <div key={i} style={{ 
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            background: msg.role === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(0, 255, 163, 0.1)',
                            border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0, 255, 163, 0.2)',
                            fontSize: '0.9rem',
                            lineHeight: '1.5'
                        }}>
                            {msg.role === 'pinee' ? `🤖 ${msg.text}` : msg.text}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderRelatedConcepts = () => {
        const relatedNames = RELATED_CONCEPTS_MAP[concept.name] || [];
        const allConcepts = getAllConcepts();
        const relatedObjects = relatedNames
            .map(name => allConcepts.find(c => c.name === name))
            .filter(Boolean);

        if (relatedObjects.length === 0) {
            // Fallback: 2-3 other concepts from same category
            const fallback = allConcepts
                .filter(c => c.category === concept.category && c.name !== concept.name)
                .slice(0, 2);
            relatedObjects.push(...fallback);
        }

        if (relatedObjects.length === 0) return null;

        return (
            <div style={{ marginTop: '32px' }}>
                <p style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageCircle size={16} /> 더 알아볼까요?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {relatedObjects.map((rc, i) => (
                        <button 
                            key={i} 
                            className="quiz-option" 
                            style={{ textAlign: 'left', padding: '16px 20px' }}
                            onClick={() => onSelectConcept(rc)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{rc.name}</span>
                                <ChevronRight size={16} color="var(--text-muted)" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="learning-session" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div className="pinee-avatar pinee-float" style={{ fontSize: '64px', marginBottom: '24px' }}>🤖</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 'bold' }}>
                    <Loader2 className="spin" size={24} />
                    <span>{statusMessage}</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-card">
                <h2>⚠️ 오류 발생</h2>
                <p>{error}</p>
                <button className="btn" style={{ marginTop: '20px' }} onClick={onExit}>홈으로 돌아가기</button>
            </div>
        );
    }

    const renderStep = () => {
        switch (step) {
            case 1: // Hook
                return (
                    <div className="glass-card fade-in">
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Sparkles size={16} /> STEP 1 · 시작하기
                        </span>
                        <h2 style={{ marginTop: '16px', fontSize: '1.5rem', lineHeight: '1.4' }}>{content.hook}</h2>
                        {renderChat()}
                        <button className="btn" style={{ marginTop: '32px' }} onClick={nextStep}>
                            다음 <ChevronRight style={{ float: 'right' }} />
                        </button>
                    </div>
                );
            case 2: // Metaphor
                return (
                    <div className="glass-card fade-in">
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>STEP 2 · 쉬운 비유</span>
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                                <Lightbulb size={20} /> <strong>어떤 느낌인가요?</strong>
                            </div>
                            <p style={{ marginBottom: '24px', lineHeight: '1.6', fontSize: '1.1rem' }}>{content.metaphor}</p>
                        </div>
                        {renderChat()}
                        <button className="btn" style={{ marginTop: '32px' }} onClick={nextStep}>이해했어요! <ChevronRight style={{ float: 'right' }} /></button>
                    </div>
                );
            case 3: // Core
                return (
                    <div className="glass-card fade-in">
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>STEP 3 · 핵심 개념</span>
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary)' }}>
                                <BookOpen size={20} /> <strong>본격적으로 알아봐요</strong>
                            </div>
                            <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>{content.core.explanation}</p>

                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                                {content.core.points.map((pt, i) => (
                                    <p key={i} style={{ fontSize: '0.95rem', marginBottom: i === content.core.points.length - 1 ? 0 : '12px', display: 'flex', gap: '8px' }}>
                                        <span>📌</span> {pt}
                                    </p>
                                ))}
                            </div>
                        </div>
                        {renderChat()}
                        <button className="btn" style={{ marginTop: '24px' }} onClick={nextStep}>다음 <ChevronRight style={{ float: 'right' }} /></button>
                    </div>
                );
            case 4: // Quizzes
                const currentQuiz = content.quiz;
                const isCorrect = selectedOption === currentQuiz.correct_index;

                return (
                    <div className="glass-card fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>STEP 4 · 퀴즈 타임</span>
                        </div>
                        
                        <h3 style={{ marginBottom: '24px', fontSize: '1.2rem', lineHeight: '1.4' }}>{currentQuiz.question}</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {currentQuiz.choices.map((opt, i) => {
                                let style = {};
                                if (showAnswer) {
                                    if (i === currentQuiz.correct_index) {
                                        style = { background: 'rgba(0, 255, 163, 0.2)', borderColor: 'var(--primary)' };
                                    } else if (selectedOption === i) {
                                        style = { background: 'rgba(255, 100, 100, 0.2)', borderColor: '#ff6464' };
                                    } else {
                                        style = { opacity: 0.5 };
                                    }
                                }
                                return (
                                    <div
                                        key={i}
                                        className={`quiz-option ${selectedOption === i ? 'selected' : ''}`}
                                        style={style}
                                        onClick={() => handleQuizOption(i)}
                                    >
                                        {opt}
                                    </div>
                                );
                            })}
                        </div>
                        
                        {showAnswer && (
                            <div className="fade-in" style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                <p style={{ fontWeight: 'bold', color: isCorrect ? 'var(--primary)' : '#ff6464', marginBottom: '8px' }}>
                                    {isCorrect ? '✅ 정답이에요!' : '❌ 아쉬워요!'}
                                </p>
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-main)' }}>{currentQuiz.explanation}</p>
                                
                                <div style={{ marginTop: '16px' }}>
                                    {isCorrect ? (
                                        <button className="btn" onClick={nextStep}>
                                            학습 마무리하기 <ChevronRight style={{ float: 'right' }} />
                                        </button>
                                    ) : (
                                        <button className="btn btn-secondary" onClick={retryQuiz}>
                                            다시 풀기 <RotateCcw size={16} style={{ float: 'right' }} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                        {renderChat()}
                    </div>
                );
            case 5: // Tip & Completion
                return (
                    <div className="glass-card fade-in">
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <Trophy size={48} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
                            <h2>🎉 오늘도 수고했어요!</h2>
                        </div>
                        
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--primary)' }}>
                                <Target size={18} /> <strong>실생활 꿀팁</strong>
                            </div>
                            <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{content.tip}</p>
                        </div>

                        {nextConceptName && (
                            <div style={{ background: 'rgba(0, 255, 163, 0.05)', border: '1px dashed var(--primary)', padding: '20px', borderRadius: '16px', marginBottom: '32px' }}>
                                <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>다음 학습 내용</p>
                                <p style={{ fontSize: '1.1rem' }}>{nextConceptName}</p>
                            </div>
                        )}

                        <button className="btn" onClick={onComplete}>학습 완료하고 홈으로</button>

                        {renderRelatedConcepts()}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="learning-session">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <button onClick={onExit} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ArrowLeft size={18} /> 나가기
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={handleRefresh} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                        <RotateCcw size={14} /> 새로고침
                    </button>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        LEVEL {concept.level} · <strong>{concept.name}</strong>
                    </div>
                </div>
            </div>

            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '32px' }}>
                <div
                    style={{
                        width: `${(step / 5) * 100}%`,
                        height: '100%',
                        background: 'var(--primary)',
                        borderRadius: '2px',
                        transition: 'width 0.4s ease'
                    }}
                />
            </div>

            {renderStep()}
        </div>
    );
};

export default LearningSession;
