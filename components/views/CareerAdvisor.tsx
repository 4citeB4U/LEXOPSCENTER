
import React, { useState } from 'react';
import { db } from '../../services/db';
import { generateCareerBlueprint } from '../../services/geminiService';
import type { Goal, Research, CareerBlueprint, SuggestedGoal } from '../../types';
import CUE from '../../services/cueRuntime';
import { CareerBlueprint } from '../../types';
import { Brain, ExternalLink, Check, Plus } from 'lucide-react';

// --- Reusable Icons ---
const BrainIcon = () => <Brain className="w-5 h-5" />;
const LinkIcon = () => <ExternalLink className="w-4 h-4" />;
const CheckIcon = () => <Check className="w-4 h-4" />;
const PlusIcon = () => <Plus className="w-4 h-4" />;

// --- Sub-Components ---

const GoalGenerator: React.FC<{ suggestedGoals: SuggestedGoal[] }> = ({ suggestedGoals }) => {
    const [selectedGoals, setSelectedGoals] = useState<SuggestedGoal[]>(suggestedGoals);

    const handleToggleGoal = (goal: SuggestedGoal) => {
        setSelectedGoals(prev => 
            prev.some(g => g.title === goal.title)
                ? prev.filter(g => g.title !== goal.title)
                : [...prev, goal]
        );
    };

    const handleAddGoals = async () => {
        if (selectedGoals.length === 0) return;

        const newGoals: Goal[] = selectedGoals.map(sg => ({
            id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'not_started',
            links: {},
            ...sg
        }));

        await db.goals.bulkAdd(newGoals);
        CUE.tts.speak(`Locked in. I've added ${newGoals.length} new goals to your Magna Carta.`);
        setSelectedGoals([]); // Clear after adding
    };

    return (
        <div className="bg-slate-900/50 p-4 rounded-lg mt-6 border border-border-color">
            <h3 className="text-lg font-bold text-white mb-3">Suggested Goals</h3>
            <div className="space-y-2 mb-4">
                {suggestedGoals.map((goal, i) => (
                    <div key={i} onClick={() => handleToggleGoal(goal)} className="flex items-center gap-3 p-2 bg-slate-800 rounded-md cursor-pointer hover:bg-slate-700/50">
                        <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${selectedGoals.some(g => g.title === goal.title) ? 'bg-accent-fuchsia border-accent-fuchsia' : 'border-slate-600'}`}>
                            {selectedGoals.some(g => g.title === goal.title) && <CheckIcon />}
                        </div>
                        <div>
                            <p className="font-semibold text-white text-sm">{goal.title}</p>
                            <p className="text-xs text-slate-400">{goal.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleAddGoals} disabled={selectedGoals.length === 0} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold bg-accent-fuchsia text-white hover:opacity-90 transition-colors disabled:opacity-50">
                <PlusIcon /> Add {selectedGoals.length} Goal(s) to Magna Carta
            </button>
        </div>
    );
};


const CareerBlueprintDisplay: React.FC<{ blueprint: CareerBlueprint }> = ({ blueprint }) => {
    const renderPlanItems = (items: CareerBlueprint['education_pathway']) => (
        <ul className="space-y-2">
            {items.map((item, i) => <li key={i} className="text-sm text-slate-300">- {item.title}: {item.description}</li>)}
        </ul>
    );

    return (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-3">
            <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-headings:font-semibold prose-headings:text-lg">
                <h4>Key Responsibilities</h4>
                <ul>{blueprint.key_responsibilities.map((item, i) => <li key={i}>{item}</li>)}</ul>

                <h4>Required Skills</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div><strong>Hard Skills:</strong><ul>{blueprint.required_skills.hard.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
                    <div><strong>Soft Skills:</strong><ul>{blueprint.required_skills.soft.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
                </div>

                <h4>Educational Pathway</h4>
                {renderPlanItems(blueprint.education_pathway)}

                <h4>Extracurricular Activities</h4>
                {renderPlanItems(blueprint.extracurricular_activities)}

                <h4>Community Service</h4>
                {renderPlanItems(blueprint.community_service)}

                <h4>College Recommendations</h4>
                <ul className="space-y-2">
                    {blueprint.college_recommendations.map((rec, i) => (
                        <li key={i}>
                            <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline font-bold">{rec.name}</a>: {rec.reasoning}
                        </li>
                    ))}
                </ul>
            </div>
            <GoalGenerator suggestedGoals={blueprint.suggested_goals} />
        </div>
    );
};


const CareerAdvisor: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [activeBlueprint, setActiveBlueprint] = useState<CareerBlueprint | null>(null);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isAnalyzing) return;

        setIsAnalyzing(true);
        setError('');
        setActiveBlueprint(null);
        CUE.tts.speak(`Analyzing career path for ${query}. This may take a moment.`);

        try {
            const blueprint = await generateCareerBlueprint(query, `User is exploring the career of a ${query}.`);
            
            const newResearch: Research = {
                id: `res_career_${Date.now()}`,
                query: `Career Analysis: ${query}`,
                createdAt: new Date().toISOString(),
                result: blueprint,
                type: 'career_analysis',
                links: {}
            };

            await db.research.add(newResearch);
            setActiveBlueprint(blueprint);
            CUE.tts.speak(`Analysis complete. Here is the blueprint for becoming a ${query}.`);

        } catch (err: any) {
            console.error("Career analysis failed:", err);
            const errorMessage = "Sorry, I encountered an error during the analysis. Please try again.";
            setError(errorMessage);
            CUE.tts.speak(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const renderContent = () => {
        if (isAnalyzing) {
            return (
                <div className="flex justify-center items-center h-48">
                    <div className="flex items-center gap-3 text-slate-300">
                        <div className="lex-console-thinking-ring border-t-accent-fuchsia w-8 h-8 !border-2"></div>
                        <span>Analyzing career trajectory...</span>
                    </div>
                </div>
            );
        }
        
        if (error) {
            return (
                 <div className="text-center text-warning-red py-8">
                    <p>{error}</p>
                </div>
            )
        }
        
        if (activeBlueprint) {
            return <CareerBlueprintDisplay blueprint={activeBlueprint} />;
        }

        return (
            <div className="text-center text-slate-400 py-8">
                <p>What career path should I analyze for you?</p>
            </div>
        );
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-border-color">
            <h2 className="text-xl font-bold text-white mb-4">Career Blueprint</h2>

            <form onSubmit={handleAnalyze} className="flex gap-4 mb-6">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={(e) => CUE.context.setDictationTarget(e.target)}
                    onBlur={() => CUE.context.setDictationTarget(null)}
                    placeholder="e.g., Doctor, Software Engineer, Graphic Designer"
                    className="flex-grow bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-fuchsia"
                    disabled={isAnalyzing}
                />
                <button 
                    type="submit"
                    disabled={isAnalyzing || !query.trim()}
                    className="flex items-center gap-3 px-6 py-3 rounded-lg font-semibold bg-accent-fuchsia text-white hover:opacity-90 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    <BrainIcon/>
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </button>
            </form>

            {renderContent()}
        </div>
    );
};

export default CareerAdvisor;
