import React, { useState } from 'react';
import ProgressFlow from '../components/ProgressFlow';
import TerminalSimulator from '../components/TerminalSimulator';
import { motion } from 'framer-motion';
import { Shield, Key, Lock, Zap } from 'lucide-react';
import ZoomableImage from '../components/ZoomableImage';

const KeygenClass = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [terminalState, setTerminalState] = useState(null);

    const steps = [
        { title: "Intro: Modo Super Saiyan", id: "intro" },
        { title: "Llaves: Pública vs Privada", id: "keys" },
        { title: "Generar Ki (ssh-keygen)", id: "keygen" },
        { title: "Copiar Energía (ssh-copy-id)", id: "copy" },
        { title: "Prueba Final", id: "final" },
        { title: "Resumen", id: "summary" },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setTerminalState(null);
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
            title="Módulo 2: Autenticación KeyGen"
        >
            {currentStep === 0 && <IntroStep />}
            {currentStep === 1 && <KeysVisualStep />}
            {currentStep === 2 && (
                <PracticeStep
                    title="Generando tus Llaves"
                    instructions="Ejecuta el comando 'ssh-keygen'. Presiona Enter para dejar las opciones por defecto (vacías)."
                    criteria={{ command: 'ssh-keygen' }}
                    onSuccess={() => setTerminalState('finished')}
                />
            )}
            {currentStep === 3 && (
                <PracticeStep
                    title="Instalando la Llave Pública"
                    instructions="Usa 'ssh-copy-id alumno@192.168.1.43' para enviar tu llave pública al servidor."
                    criteria={{ command: 'ssh-copy-id' }}
                    onSuccess={() => setTerminalState('finished')}
                />
            )}
            {currentStep === 4 && (
                <PracticeStep
                    title="Entrada Triunfal"
                    instructions="Ahora conéctate con 'ssh alumno@192.168.1.43'. ¡No debería pedirte contraseña!"
                    criteria={{ type: 'ssh_connected' }} // Assuming terminal simulates successful auth without password if key logic was simulated, or just allows it.
                    onSuccess={() => setTerminalState('finished')}
                />
            )}
            {currentStep === 5 && <SummaryStep />}
        </ProgressFlow>
    );
};

/* --- Step Components --- */

const IntroStep = () => (
    <div className="text-center space-y-8">
        <div className="relative inline-block">
            <div className="absolute inset-0 bg-saiyan-gold blur-[80px] opacity-50 animate-pulse"></div>
            <Shield size={100} className="text-saiyan-gold relative z-10 mx-auto mb-4" />
        </div>

        <h2 className="text-4xl font-bold text-saiyan-gold">Modo Super Saiyan</h2>

        <div className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto space-y-6">
            <p>
                Hasta ahora eras un guerrero normal: cada vez que querías entrar, tenías que decir la contraseña ("Sésamo ábrete").
            </p>
            <p>
                Pero un <strong>Super Saiyan</strong> no pide permiso.
            </p>
            <div className="bg-saiyan-gold/10 p-6 rounded-xl border-l-4 border-saiyan-gold text-left">
                <p className="italic text-saiyan-gold">
                    "Con las llaves SSH, tu ordenador y el servidor se reconocen mutuamente (criptografía). Entras sin escribir nada."
                </p>
            </div>

            <div className="mt-6 max-w-lg mx-auto">
                <ZoomableImage src="/ssh_keys.jpg" alt="SSH Key Authentication Diagram" />
                <p className="text-sm text-gray-500 mt-2">Esquema de autenticación con Llaves</p>
            </div>
        </div>
    </div>
);

const KeysVisualStep = () => (
    <div className="space-y-8">
        <h3 className="text-2xl font-bold text-center">La Pareja Sagrada</h3>
        <div className="grid md:grid-cols-2 gap-8 items-center justify-center">
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-space-black p-6 rounded-xl border border-white/10 text-center space-y-4"
            >
                <Key size={50} className="mx-auto text-saiyan-gold" />
                <h4 className="text-xl font-bold text-saiyan-gold">Llave Pública</h4>
                <p className="text-sm text-gray-400">
                    (id_rsa.pub)
                </p>
                <p>Es como un <strong>Candado</strong>.</p>
                <p className="text-gray-400 text-sm">
                    Se la das a todo el mundo (al servidor). "Pon este candado en tu puerta".
                </p>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-space-black p-6 rounded-xl border border-white/10 text-center space-y-4"
            >
                <Key size={50} className="mx-auto text-teleport-cyan" />
                <h4 className="text-xl font-bold text-teleport-cyan">Llave Privada</h4>
                <p className="text-sm text-gray-400">
                    (id_rsa)
                </p>
                <p>Es la <strong>Llave Maestra</strong>.</p>
                <p className="text-gray-400 text-sm">
                    NUNCA sale de tu bolsillo (tu ordenador). Solo tú puedes abrir el candado.
                </p>
            </motion.div>
        </div>
    </div>
);

const PracticeStep = ({ title, instructions, criteria, onSuccess }) => (
    <div className="space-y-4 h-full flex flex-col">
        <h3 className="text-xl font-bold text-saiyan-gold">{title}</h3>
        <p className="text-gray-300">{instructions}</p>

        <div className="flex-1 min-h-0">
            <TerminalSimulator
                stepCriteria={criteria}
                onCommandSuccess={onSuccess}
            />
        </div>
    </div>
);

const SummaryStep = () => (
    <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-saiyan-gold">¡Nivel Super Saiyan Alcanzado!</h2>
        <p className="text-xl">
            Ya no necesitas contraseñas. Eres pura energía.
        </p>

        <div className="bg-space-black p-6 rounded-xl max-w-lg mx-auto text-left space-y-4 font-mono text-sm border border-white/10">
            <div className="flex items-center gap-2">
                <span className="text-green-500">➜</span>
                <span>ssh-keygen -t rsa</span>
                <span className="text-gray-500 text-xs ml-auto">(Crear llaves)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-green-500">➜</span>
                <span>ssh-copy-id usuario@ip</span>
                <span className="text-gray-500 text-xs ml-auto">(Instalar candado)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-green-500">➜</span>
                <span>ssh usuario@ip</span>
                <span className="text-gray-500 text-xs ml-auto">(Entrar volando)</span>
            </div>
        </div>
    </div>
);

export default KeygenClass;
