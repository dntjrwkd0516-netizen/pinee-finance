import React, { useState } from 'react';
import { useProgress } from './hooks/useProgress';
import { categories, getTotalConcepts } from './data/curriculum';
import WelcomeScreen from './components/WelcomeScreen';
import ConceptList from './components/ConceptList';
import LearningSession from './components/LearningSession';
import './index.css';

function App() {
    const { completedDays, completeDay } = useProgress();
    const [screen, setScreen] = useState('welcome'); // 'welcome', 'category', 'learning'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedConcept, setSelectedConcept] = useState(null);

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setScreen('category');
    };

    const handleSelectConcept = (concept) => {
        setSelectedConcept(concept);
        setScreen('learning');
    };

    const handleBackToHome = () => {
        setScreen('welcome');
        setSelectedCategory(null);
    };

    const handleBackToCategory = () => {
        setScreen('category');
    };

    return (
        <div className="app-container fade-in">
            {screen === 'welcome' && (
                <WelcomeScreen
                    categories={categories}
                    onSelectCategory={handleSelectCategory}
                    onSelectConcept={handleSelectConcept}
                    completedCount={completedDays.length}
                    totalConcepts={getTotalConcepts()}
                />
            )}
            
            {screen === 'category' && selectedCategory && (
                <ConceptList
                    category={selectedCategory}
                    completedConcepts={completedDays}
                    onSelectConcept={handleSelectConcept}
                    onBack={handleBackToHome}
                />
            )}

            {screen === 'learning' && selectedConcept && (
                <LearningSession
                    concept={selectedConcept}
                    onSelectConcept={handleSelectConcept}
                    onComplete={() => {
                        completeDay(selectedConcept.id);
                        if (selectedCategory) {
                            setScreen('category');
                        } else {
                            setScreen('welcome');
                        }
                    }}
                    onExit={() => {
                        if (selectedCategory) {
                            setScreen('category');
                        } else {
                            setScreen('welcome');
                        }
                    }}
                />
            )}

            {completedDays.length === getTotalConcepts() && screen === 'welcome' && (
                <div className="glass-card" style={{marginTop: '20px'}}>
                    <h2>🎉 모든 과정을 완료했어요!</h2>
                    <p>핀이와 함께한 멋진 여정이었어요. 금융 지식의 고수가 되신 것을 축하드립니다!</p>
                </div>
            )}
        </div>
    );
}

export default App;
