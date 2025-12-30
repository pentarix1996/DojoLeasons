import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressFlow from '../components/ProgressFlow';
import TerminalSimulator from '../components/TerminalSimulator';
import { motion } from 'framer-motion';
import { Zap, WifiOff, Lock, CheckCircle } from 'lucide-react';

const SSHClass = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [terminalCompleted, setTerminalCompleted] = useState(false);

    const steps = [
        { title: "Intro: Teletransportación", id: "intro" },
        { title: "MobaXterm: Tu Nave", id: "mobaxterm" },
        { title: "Práctica: Ronda 1", id: "p1" },
        { title: "Práctica: Ronda 2", id: "p2" },
        { title: "Práctica: Ronda 3", id: "p3" },
        { title: "Diagnóstico de Errores", id: "errors" },
        { title: "Reto Final", id: "real-practice" },
        { title: "Resumen", id: "summary" },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setTerminalCompleted(false); // Reset for next challenge
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    return (
        <ProgressFlow
            steps={steps}
            currentStepIndex={currentStep}
            onNext={handleNext}
            onPrev={handlePrev}
            title="Módulo 1: Protocolo SSH"
        >
            {currentStep === 0 && <IntroStep />}
            {currentStep === 1 && <MobaGuideStep />}
            {currentStep === 2 && (
                <PracticeStep
                    round={1}
                    instructions="Escribe 'ssh alumno@192.168.1.43', acepta la huella con 'yes', e introduce la contraseña."
                    onComplete={() => setTerminalCompleted(true)}
                />
            )}
            {currentStep === 3 && (
                <PracticeStep
                    round={2}
                    instructions="Inténtalo de nuevo con menos ayuda. Recuerda: usuario@servidor"
                    onComplete={() => setTerminalCompleted(true)}
                />
            )}
            {currentStep === 4 && (
                <PracticeStep
                    round={3}
                    instructions="Demuestra que lo dominas. Sin ayuda."
                    onComplete={() => setTerminalCompleted(true)}
                />
            )}
            {currentStep === 5 && <ErrorHandlingStep />}
            {currentStep === 6 && <RealPracticeStep />}
            {currentStep === 7 && <SummaryStep />}
        </ProgressFlow>
    );
};

/* --- Step Components --- */

const IntroStep = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8 text-center"
    >
        <div className="relative inline-block">
            <div className="absolute inset-0 bg-teleport-cyan blur-[60px] opacity-40"></div>
            <Zap size={80} className="text-teleport-cyan relative z-10 mx-auto mb-4 animate-pulse" />
        </div>

        <h2 className="text-4xl font-bold">Teletransportación Instantánea</h2>

        <div className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto space-y-6">
            <p>
                Imagina que estás en clase, pero necesitas usar el ordenador del profesor.
                ¿Te levantas y caminas hacia allí? <strong>¡NO!</strong>
            </p>
            <p>
                Usas <span className="text-teleport-cyan font-bold">SSH (Secure Shell)</span>.
            </p>
            <div className="bg-white/5 p-6 rounded-xl border-l-4 border-teleport-cyan text-left">
                <p className="italic">
                    "SSH es como la técnica de Teletransportación de Goku. Te permite 'entrar' en otro ordenador instantáneamente a través de la red, usando solo tu mente (y un teclado)."
                </p>
            </div>
        </div>
    </motion.div>
);

const MobaGuideStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-teleport-cyan">Conectando con MobaXterm</h3>
        <p>Para esta misión usaremos MobaXterm como nuestra nave espacial (cliente SSH).</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-space-black p-4 rounded-lg border border-white/10">
                <h4 className="font-bold mb-2">Paso 1: Start Local Terminal</h4>
                <p className="text-sm text-gray-400">Abre MobaXterm y busca el botón "Start Local Terminal".</p>
            </div>
            <div className="bg-space-black p-4 rounded-lg border border-white/10">
                <h4 className="font-bold mb-2">Paso 2: El Comando Mágico</h4>
                <code className="block bg-black p-2 rounded text-green-400 font-mono">ssh alumno@192.168.1.43</code>
            </div>
        </div>
    </div>
);

const PracticeStep = ({ round, instructions, onComplete }) => (
    <div className="space-y-4 h-full flex flex-col">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Práctica - Ronda {round}</h3>
            <span className="text-xs uppercase tracking-widest bg-white/10 px-2 py-1 rounded text-teleport-cyan">
                {round === 1 ? 'Guía Completa' : round === 2 ? 'Guía Mínima' : 'Modo Experto'}
            </span>
        </div>

        <p className="text-gray-300">{instructions}</p>

        <div className="flex-1 min-h-0">
            <TerminalSimulator
                stepCriteria={{ type: 'ssh_connected' }}
                onCommandSuccess={onComplete}
            />
        </div>
    </div>
);

const ErrorHandlingStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-error-red">Diagnóstico de Errores</h3>
        <p>A veces, la teletransportación falla. Aquí tienes los 3 diagnósticos más comunes:</p>

        <div className="grid gap-4">
            <ErrorCard
                title="Permission denied"
                cause="Usuario o contraseña incorrectos."
                icon={<Lock className="text-error-red" />}
            />
            <ErrorCard
                title="Connection timed out / No route to host"
                cause="Dirección IP errónea, estás en otra red WiFi, o el Firewall te bloquea."
                icon={<WifiOff className="text-error-red" />}
            />
            <ErrorCard
                title="Se queda esperando..."
                cause="El servidor SSH del profesor está apagado o el puerto 22 está cerrado."
                icon={<Zap className="text-yellow-500" />}
            />
        </div>
    </div>
);

const ErrorCard = ({ title, cause, icon }) => (
    <div className="bg-white/5 p-4 rounded-xl flex items-start gap-4 border border-white/5 hover:border-error-red/50 transition-colors cursor-pointer group">
        <div className="p-3 bg-black/30 rounded-full group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <h4 className="font-mono text-red-300 font-bold mb-1">{title}</h4>
            <p className="text-gray-400 text-sm">{cause}</p>
        </div>
    </div>
);

const RealPracticeStep = () => {
    const [checklist, setChecklist] = useState([
        { id: 1, text: "Conectar: ssh alumno@192.168.1.43", completed: false },
        { id: 2, text: "Listar archivos: ls", completed: false },
        { id: 3, text: "Verificar usuario: whoami", completed: false },
        { id: 4, text: "Crear carpeta: mkdir misiones", completed: false },
        { id: 5, text: "Mover notas: mv notas.txt misiones", completed: false },
        { id: 6, text: "Entrar en carpeta: cd misiones", completed: false },
        { id: 7, text: "Salir: exit", completed: false },
    ]);

    const toggleItem = (id) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold text-saiyan-orange">Reto Final</h3>
                <p className="text-lg text-gray-300">
                    Abre tu terminal real (MobaXterm o CMD). Esta vez no hay simulador.
                    Marca las tareas a medida que las completes en el servidor de verdad.
                </p>
            </div>

            <div className="bg-space-black p-8 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(255,140,0,0.1)]">
                <div className="space-y-4">
                    {checklist.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={false}
                            animate={{ backgroundColor: item.completed ? 'rgba(255, 140, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)' }}
                            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-colors ${item.completed ? 'border-saiyan-orange/50' : 'border-white/5 hover:border-white/20'}`}
                            onClick={() => toggleItem(item.id)}
                        >
                            <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${item.completed ? 'bg-saiyan-orange border-saiyan-orange' : 'border-gray-500'}`}>
                                {item.completed && <CheckCircle size={16} className="text-black" />}
                            </div>
                            <span className={`text-lg font-mono transition-all ${item.completed ? 'text-saiyan-orange line-through opacity-70' : 'text-gray-200'}`}>
                                {item.text}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="text-center text-sm text-gray-500 italic">
                "El verdadero guerrero no necesita simulaciones."
            </div>
        </div>
    );
};



const SummaryStep = () => (
    <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-teleport-cyan">¡Entrenamiento Completado!</h2>
        <p className="text-xl">
            Ahora sabes usar la <span className="text-white font-bold">Teletransportación Digital</span>.
        </p>
        <div className="flex justify-center gap-8 text-left max-w-md mx-auto mt-8">
            <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Comando: ssh usuario@host</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Diagnosticar errores básicos</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Ver el estado del servidor</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Moverte por el servidor</li>
            </ul>
        </div>
        <Link to="/">
            <button className="mt-8 px-8 py-3 bg-teleport-cyan text-black font-bold rounded-full shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-105 transition-transform">
                Volver al Dojo
            </button>
        </Link>
    </div>
);

export default SSHClass;
