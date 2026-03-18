import { useState, useEffect } from 'react';

export const useProgress = () => {
    const [completedConcepts, setCompletedConcepts] = useState(() => {
        const saved = localStorage.getItem('pinee_completed_concepts') || localStorage.getItem('pinee_completed_days');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('pinee_completed_concepts', JSON.stringify(completedConcepts));
    }, [completedConcepts]);

    const completeConcept = (id) => {
        if (!completedConcepts.includes(id)) {
            setCompletedConcepts([...completedConcepts, id]);
        }
    };

    const startFresh = () => {
        setCompletedConcepts([]);
        localStorage.removeItem('pinee_completed_concepts');
        localStorage.removeItem('pinee_completed_days');
    };

    return {
        completedDays: completedConcepts, // Maintain alias for compatibility
        completedConcepts,
        completeDay: completeConcept, // Maintain alias for compatibility
        completeConcept,
        startFresh
    };
};
