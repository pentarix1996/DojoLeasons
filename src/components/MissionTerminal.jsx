import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import TerminalSimulator from './TerminalSimulator';

const MissionTerminal = ({
    initialMissions = [],
    initialState = {},
    credentials = {},
    title = "Práctica - Ronda 2",
    subtitle = "Misión Táctica",
    successMessage = "¡MISIÓN CUMPLIDA!",
    successSubmessage = "Has dominado la simulación.",
    onComplete,
    ...props
}) => {
    const [missions, setMissions] = useState(initialMissions);
    const [allCompleted, setAllCompleted] = useState(false);

    useEffect(() => {
        const completed = missions.every(m => m.completed);
        setAllCompleted(completed);
        if (completed && onComplete) onComplete();
    }, [missions, onComplete]);

    const handleBroadcast = (event) => {
        setMissions(prev => prev.map(m => {
            if (m.completed) return m;
            if (m.criteria && m.criteria(event)) return { ...m, completed: true };
            return m;
        }));
    };

    return (
        <div className="space-y-4 h-full flex flex-col relative">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{title}</h3>
                {subtitle && (
                    <span className="text-xs uppercase tracking-widest bg-yellow-500/20 px-2 py-1 rounded text-yellow-500">
                        {subtitle}
                    </span>
                )}
            </div>

            {/* Credential Legend */}
            {credentials && (
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex gap-6 text-sm font-mono overflow-x-auto">
                    {Object.entries(credentials).map(([key, value]) => (
                        <div key={key}>
                            <span className="text-gray-400 capitalize">{key}:</span> <span className="text-teleport-cyan">{value}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex-1 min-h-0 relative">
                <TerminalSimulator
                    {...initialState}
                    {...props}
                    onBroadcast={handleBroadcast}
                />

                {/* Visual Feedback Overlay */}
                <AnimatePresence>
                    {allCompleted && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg"
                        >
                            <div className="text-center p-6 bg-[#1e1e1e] border-2 border-green-500 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="inline-block mb-4"
                                >
                                    <CheckCircle size={64} className="text-green-500" />
                                </motion.div>
                                <h4 className="text-3xl font-bold text-white mb-2">{successMessage}</h4>
                                <p className="text-gray-300">{successSubmessage}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Active Missions Panel */}
            <div className={`grid grid-cols-2 ${missions.length > 4 ? 'md:grid-cols-4' : 'md:grid-cols-' + missions.length} gap-2 mt-2`}>
                {missions.map(m => (
                    <div
                        key={m.id}
                        className={`p-2 rounded border text-center text-xs transition-colors ${m.completed
                            ? 'bg-green-500/20 border-green-500 text-green-300'
                            : 'bg-black/40 border-white/10 text-gray-500'
                            }`}
                    >
                        <div className="mb-1">
                            {m.completed ? <CheckCircle size={16} className="mx-auto" /> : <div className="w-4 h-4 mx-auto rounded-full border border-gray-600" />}
                        </div>
                        {m.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MissionTerminal;
