import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, CheckCircle2, Trophy, Sparkles, Loader2, PlusCircle } from 'lucide-react';
import { generateAdvancedConcepts } from '../services/claudeApi';

const ConceptList = ({ category, completedConcepts, onSelectConcept, onBack }) => {
    const [extraConcepts, setExtraConcepts] = useState([]);
    const [loadingAdvanced, setLoadingAdvanced] = useState(false);

    const handleGenerateAdvanced = async () => {
        setLoadingAdvanced(true);
        try {
            const newConcepts = await generateAdvancedConcepts(category.name);
            setExtraConcepts(prev => [...prev, ...newConcepts]);
        } catch (error) {
            console.error("Failed to generate advanced concepts:", error);
            alert("심화 학습 주제를 생성하는 데 실패했습니다. 다시 시도해 주세요.");
        } finally {
            setLoadingAdvanced(false);
        }
    };

    const allConcepts = [...category.concepts, ...extraConcepts];

    return (
        <div className="fade-in" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', paddingBottom: '60px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <button 
                    onClick={onBack}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#94a3b8', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        fontSize: '16px',
                        padding: '8px 0'
                    }}
                >
                    <ArrowLeft size={20} /> 뒤로가기
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px' }}>{category.emoji}</span>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>{category.name}</h2>
                </div>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {allConcepts.map((concept, index) => {
                    const isCompleted = completedConcepts.includes(concept.id);
                    const isAI = concept.level >= 4;
                    return (
                        <div 
                            key={concept.id + index}
                            onClick={() => onSelectConcept(concept)}
                            style={{
                                background: 'rgba(26, 26, 46, 0.6)',
                                backdropFilter: 'blur(20px)',
                                border: `1px solid ${isCompleted ? '#00ff8840' : 'rgba(255, 255, 255, 0.1)'}`,
                                borderRadius: '20px',
                                padding: '20px 24px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderColor: isAI && !isCompleted ? 'rgba(124, 58, 237, 0.3)' : undefined
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.transform = 'translateX(5px)';
                                if (!isCompleted) e.currentTarget.style.borderColor = isAI ? 'rgba(124, 58, 237, 0.6)' : 'rgba(255, 255, 255, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(26, 26, 46, 0.6)';
                                e.currentTarget.style.transform = 'translateX(0)';
                                if (!isCompleted) e.currentTarget.style.borderColor = isAI ? 'rgba(124, 58, 237, 0.3)' : 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ 
                                    width: '32px', 
                                    height: '32px', 
                                    borderRadius: '50%', 
                                    backgroundColor: isCompleted ? '#00ff8820' : 'rgba(255, 255, 255, 0.05)', 
                                    color: isCompleted ? '#00ff88' : '#475569',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}>
                                    {isCompleted ? <CheckCircle2 size={18} /> : index + 1}
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: isCompleted ? '#00ff88' : 'white' }}>
                                            {concept.name}
                                        </h4>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <span style={{ 
                                                fontSize: '10px', 
                                                padding: '2px 6px', 
                                                borderRadius: '4px', 
                                                backgroundColor: concept.level >= 4 ? '#7c3aed20' : concept.level === 3 ? '#ef444420' : concept.level === 2 ? '#f59e0b20' : '#06b6d420',
                                                color: concept.level >= 4 ? '#a78bfa' : concept.level === 3 ? '#ef4444' : concept.level === 2 ? '#f59e0b' : '#06b6d4',
                                                fontWeight: 'bold'
                                            }}>
                                                LV.{concept.level}
                                            </span>
                                            {isAI && (
                                                <span style={{ 
                                                    fontSize: '10px', 
                                                    padding: '2px 6px', 
                                                    borderRadius: '4px', 
                                                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                                    color: '#00ff88',
                                                    fontWeight: 'bold'
                                                }}>
                                                    AI 생성
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>{concept.summary}</p>
                                </div>
                            </div>
                            <ChevronRight size={20} color="#475569" />
                        </div>
                    );
                })}
            </div>

            {/* Infinite Learning Button */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button
                    onClick={handleGenerateAdvanced}
                    disabled={loadingAdvanced}
                    style={{
                        width: '100%',
                        padding: '20px',
                        background: 'rgba(124, 58, 237, 0.1)',
                        border: '1px dashed rgba(124, 58, 237, 0.4)',
                        borderRadius: '24px',
                        color: '#a78bfa',
                        fontWeight: 'bold',
                        cursor: loadingAdvanced ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (!loadingAdvanced) {
                            e.currentTarget.style.background = 'rgba(124, 58, 237, 0.2)';
                            e.currentTarget.style.borderColor = '#7c3aed';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!loadingAdvanced) {
                            e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.4)';
                        }
                    }}
                >
                    {loadingAdvanced ? (
                        <>
                            <Loader2 size={20} className="spin" /> 심화 주제 분석 중...
                        </>
                    ) : (
                        <>
                            <PlusCircle size={20} /> 🔄 심화 학습 생성하기
                        </>
                    )}
                </button>
            </div>

            {/* Completion Card */}
            {completedConcepts.filter(id => category.concepts.some(c => c.id === id)).length === category.concepts.length && (
                <div style={{ 
                    marginTop: '32px', 
                    background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 214, 136, 0.1) 100%)',
                    border: '1px solid #00ff8840',
                    borderRadius: '24px',
                    padding: '24px',
                    textAlign: 'center'
                }}>
                    <Trophy size={32} color="#00ff88" style={{ marginBottom: '12px' }} />
                    <h3 style={{ margin: '0 0 8px 0', color: '#00ff88' }}>카테고리 마스터!</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>이 분야의 모든 핵심 개념을 섭렵하셨습니다.</p>
                </div>
            )}
        </div>
    );
};

export default ConceptList;
