import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, ChevronRight } from 'lucide-react';

const ProgressFlow = ({
    steps,
    currentStepIndex,
    onNext,
    onPrev,
    title,
    children
}) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] min-h-[calc(100vh-100px)] gap-6">
            {/* Sidebar Progress Steps */}
            <div className="glass-panel p-6 h-fit top-24 sticky">
                <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">{title}</h2>
                <div className="space-y-4">
                    {steps.map((step, idx) => {
                        const isCompleted = idx < currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                            <div
                                key={idx}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isCurrent ? 'bg-teleport-cyan/10 border border-teleport-cyan/30' :
                                    isCompleted ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle className="text-terminal-green w-5 h-5 flex-shrink-0" />
                                ) : isCurrent ? (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        <Circle className="text-teleport-cyan w-5 h-5 flex-shrink-0 fill-teleport-cyan/20" />
                                    </motion.div>
                                ) : (
                                    <Circle className="w-5 h-5 flex-shrink-0" />
                                )}
                                <span className={`text-sm font-medium ${isCurrent ? 'text-white' : ''}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col">
                <div className="flex-1 glass-panel p-8 relative overflow-hidden">
                    {children}
                </div>

                {/* Navigation Controls */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={onPrev}
                        disabled={currentStepIndex === 0}
                        className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-medium"
                    >
                        Anterior
                    </button>

                    <button
                        onClick={currentStepIndex === steps.length - 1 ? () => navigate('/') : onNext}
                        className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${currentStepIndex === steps.length - 1
                            ? 'bg-terminal-green text-black hover:bg-green-400 shadow-[0_0_20px_rgba(0,255,65,0.3)]'
                            : 'bg-teleport-cyan hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                            }`}
                    >
                        {currentStepIndex === steps.length - 1 ? "Finalizar" : "Siguiente"}
                        {currentStepIndex === steps.length - 1 ? <CheckCircle size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgressFlow;
