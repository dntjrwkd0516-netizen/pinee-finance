import React, { useState, useEffect } from 'react';
import { Sparkles, Info, Loader2, TrendingUp, BookOpen } from 'lucide-react';
import { generateTrendTopics } from '../services/claudeApi';

const WelcomeScreen = ({ categories, onSelectCategory, onSelectConcept, completedCount, totalConcepts }) => {
    const [activeTab, setActiveTab] = useState('study'); // 'study' | 'trend'
    const [trends, setTrends] = useState([]);
    const [loadingTrends, setLoadingTrends] = useState(false);
    
    const progressPercent = Math.round((completedCount / totalConcepts) * 100);

    const fetchTrends = async () => {
        setLoadingTrends(true);
        try {
            const data = await generateTrendTopics();
            setTrends(data);
        } catch (error) {
            console.error("Failed to fetch trends:", error);
        } finally {
            setLoadingTrends(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'trend') {
            fetchTrends();
        }
    }, [activeTab]);

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#0a0a0f', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'flex-start', 
            padding: '60px 20px', 
            color: 'white', 
            fontFamily: 'Pretendard, sans-serif', 
            position: 'relative', 
            overflowX: 'hidden' 
        }}>
            {/* Background Glows */}
            <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40%', height: '40%', backgroundColor: '#7c3aed', opacity: 0.05, filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
            <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '40%', height: '40%', backgroundColor: '#00ff88', opacity: 0.05, filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                    fontSize: '64px', 
                    marginBottom: '16px', 
                    filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.4))',
                    animation: 'pinee-float 3s ease-in-out infinite'
                }}>🤖</div>
                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px', whiteSpace: 'nowrap' }}>
                    금융 길잡이 핀이예요 👋
                </h1>
                
                {/* Tab Switcher */}
                <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    padding: '6px', 
                    borderRadius: '16px', 
                    marginTop: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    width: 'fit-content',
                    margin: '24px auto 0'
                }}>
                    <button 
                        onClick={() => setActiveTab('study')}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '12px',
                            border: 'none',
                            background: activeTab === 'study' ? '#00ff88' : 'transparent',
                            color: activeTab === 'study' ? '#0a0a0f' : '#94a3b8',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <BookOpen size={18} /> 📚 학습
                    </button>
                    <button 
                        onClick={() => setActiveTab('trend')}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '12px',
                            border: 'none',
                            background: activeTab === 'trend' ? '#7c3aed' : 'transparent',
                            color: activeTab === 'trend' ? 'white' : '#94a3b8',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <TrendingUp size={18} /> 🔥 트렌드
                    </button>
                </div>
            </div>

            {activeTab === 'study' ? (
                <>
                    {/* Overall Progress */}
                    <div style={{ 
                        marginBottom: '40px', 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        padding: '12px 24px', 
                        borderRadius: '100px', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        zIndex: 1
                    }}>
                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>전체 학습 진행도</div>
                        <div style={{ width: '100px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', position: 'relative' }}>
                            <div style={{ 
                                position: 'absolute', 
                                left: 0, 
                                top: 0, 
                                height: '100%', 
                                width: `${progressPercent}%`, 
                                backgroundColor: '#00ff88', 
                                borderRadius: '3px', 
                                boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)' 
                            }}></div>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#00ff88' }}>{progressPercent}%</div>
                    </div>

                    {/* Category Grid */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                        gap: '16px', 
                        width: '100%', 
                        maxWidth: '800px', 
                        zIndex: 1 
                    }}>
                        {categories.map((cat) => (
                            <div 
                                key={cat.id}
                                onClick={() => onSelectCategory(cat)}
                                style={{
                                    background: 'rgba(26, 26, 46, 0.6)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '24px',
                                    padding: '32px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.borderColor = cat.color;
                                    e.currentTarget.style.boxShadow = `0 10px 30px -10px ${cat.color}40`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{cat.emoji}</div>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{cat.name}</h3>
                                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.4' }}>
                                    {cat.concepts.length}개의 금융 핵심 개념
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div style={{ width: '100%', maxWidth: '600px', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {loadingTrends ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '40px' }}>
                            <Loader2 className="spin" color="#7c3aed" size={40} />
                            <p style={{ color: '#94a3b8' }}>지금 가장 핫한 경제 키워드를 가져오는 중...</p>
                        </div>
                    ) : (
                        trends.map((trend) => (
                            <div 
                                key={trend.id}
                                style={{
                                    background: 'rgba(26, 26, 46, 0.6)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '24px',
                                    padding: '24px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ flex: 1, marginRight: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{trend.name}</h3>
                                        <span style={{ 
                                            fontSize: '10px', 
                                            background: 'rgba(124, 58, 237, 0.2)', 
                                            color: '#c084fc', 
                                            padding: '2px 8px', 
                                            borderRadius: '100px',
                                            fontWeight: 'bold'
                                        }}>
                                            {trend.category}
                                        </span>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{trend.summary}</p>
                                </div>
                                <button 
                                    onClick={() => onSelectConcept(trend)}
                                    style={{
                                        background: '#7c3aed',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '12px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(124, 58, 237, 0.4)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    학습하기
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Footer Disclaimer */}
            <div style={{ 
                marginTop: '64px', 
                fontSize: '13px', 
                color: '#475569', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                zIndex: 1
            }}>
                <Sparkles size={14} /> AI가 생성한 교육용 콘텐츠입니다. 실제 투자 시 전문가와 상담하세요.
            </div>
        </div>
    );
};

export default WelcomeScreen;
