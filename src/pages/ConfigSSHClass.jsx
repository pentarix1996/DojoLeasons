import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressFlow from '../components/ProgressFlow';
import TerminalSimulator from '../components/TerminalSimulator';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Settings, ShieldAlert, CheckCircle, RotateCcw } from 'lucide-react';

const ConfigSSHClass = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [terminalCompleted, setTerminalCompleted] = useState(false);

    const steps = [
        { title: "Intro: El Manual de la Nave", id: "intro" },
        { title: "Configuración: Puertos", id: "ports" },
        { title: "Configuración: Root", id: "root" },
        { title: "Práctica: Ronda 1", id: "p1" },
        { title: "Práctica: Ronda 2", id: "p2" },
        { title: "Reto Final 1", id: "challenge1" },
        { title: "Resumen", id: "summary" },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setTerminalCompleted(false);
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
            title="Módulo 3: Config SSH"
        >
            {currentStep === 0 && <IntroStep />}
            {currentStep === 1 && <ConfigPortsStep />}
            {currentStep === 2 && <ConfigRootStep />}
            {currentStep === 3 && (
                <PracticeStep
                    round={1}
                />
            )}
            {currentStep === 4 && <Round2Practice />}
            {currentStep === 5 && <FinalChallenge />}
            {currentStep === 6 && <SummaryStep />}
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
            <div className="absolute inset-0 bg-purple-500 blur-[60px] opacity-40"></div>
            <Settings size={80} className="text-purple-400 relative z-10 mx-auto mb-4 animate-spin-slow" />
        </div>

        <h2 className="text-4xl font-bold">El Manual de la Nave</h2>

        <div className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto space-y-6">
            <p>
                Todo Saiyan necesita ajustar su cápsula espacial antes de un viaje. En el mundo de SSH, el "manual de instrucciones" de tu servidor está en un fichero especial.
            </p>
            <div className="bg-white/5 p-6 rounded-xl border-l-4 border-purple-500 text-left">
                <code className="block text-2xl font-mono text-purple-300 mb-2">/etc/ssh/sshd_config</code>
                <p className="italic text-gray-400">
                    "Es como el Panel de Control de la Cámara de Gravedad. Si tocas lo que no debes, ¡puede que no puedas volver a entrar!"
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                    <h4 className="font-bold text-blue-400 mb-1">SSH (Cliente)</h4>
                    <p className="text-sm text-gray-400">Eres tú (el pasajero). Usas el comando `ssh` para viajar.</p>
                </div>
                <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/30">
                    <h4 className="font-bold text-purple-400 mb-1">SSHD (Servidor)</h4>
                    <p className="text-sm text-gray-400">Es la nave (Demonio). Escucha tus peticiones y te deja entrar.</p>
                </div>
            </div>

            <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/30 flex items-start gap-3 text-left">
                <RotateCcw className="text-yellow-500 shrink-0 mt-1" size={20} />
                <div>
                    <h4 className="font-bold text-yellow-500">¿Por qué reiniciar?</h4>
                    <p className="text-sm text-gray-300">
                        Al cambiar la configuración de la nave (`sshd_config`), debes "apagar y encender" el motor (`sshd`) para que los cambios surtan efecto.
                        <br />
                        <span className="text-xs text-gray-500 mt-1 block">Por eso usamos `systemctl restart sshd`. Reiniciar `ssh` (tu cliente) no serviría de nada.</span>
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
);

const ConfigPortsStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-purple-400">Configuración: Puertos</h3>
        <p>
            Por defecto, SSH escucha en el puerto 22. Pero se puede modificar para que escuche en otro puerto.
        </p>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 font-mono text-sm shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-6 bg-gray-800 flex items-center px-2 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-xs text-gray-400">nano /etc/ssh/sshd_config</span>
            </div>
            <div className="mt-6 text-gray-300 space-y-1">
                <p className="text-gray-500"># This is the ssh server system-wide configuration file.</p>
                <p className="text-gray-500"># Port 22</p>
                <p className="text-green-400 font-bold">Port 1234</p>
                <p className="text-gray-500">#AddressFamily any</p>
                <p className="text-gray-500">#ListenAddress 0.0.0.0</p>
            </div>
        </div>

        <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/30 flex items-start gap-3">
            <Zap className="text-yellow-500 shrink-0" />
            <div>
                <h4 className="font-bold text-yellow-500">¡Nueva Coordenada!</h4>
                <p className="text-sm text-gray-300">
                    Para conectarte ahora, debes especificar el nuevo canal de energía:
                    <br />
                    <code className="bg-black/30 px-2 py-1 rounded text-green-300 ml-1">ssh usuario@host -p 1234</code>
                    <br />
                    <span className="text-xs text-gray-400 mt-1 block">
                        (Recuerda reiniciar la nave con <code className="text-yellow-500">sudo systemctl restart sshd</code> para aplicar cambios)
                    </span>
                </p>
            </div>
        </div>
    </div>
);

const ConfigRootStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-red-400">Configuración: Root</h3>
        <p>
            El <strong>Super Saiyan Legendario</strong> (root) tiene poder ilimitado. Por seguridad, a veces se le prohibe entrar directamente. Pero si confías en tu fuerza, puedes permitilo.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 font-mono text-sm">
                <p className="text-gray-500"># LoginGraceTime 2m</p>
                <p className="text-red-400 font-bold">PermitRootLogin yes</p>
                <p className="text-gray-500"># StrictModes yes</p>
            </div>

            <div className="space-y-4">
                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
                    <h4 className="font-bold text-blue-400 flex items-center gap-2">
                        <RotateCcw size={18} /> Reiniciar Sistema
                    </h4>
                    <p className="text-sm text-gray-300 mt-2">
                        Cualquier cambio requiere reiniciar los motores de la nave para que surta efecto:
                    </p>
                    <code className="block bg-black/50 p-2 rounded mt-2 text-green-400 text-center">
                        sudo systemctl restart sshd
                    </code>
                </div>
                <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/30">
                    <p className="text-sm text-gray-300">
                        Ahora puedes entrar como el ser más poderoso:
                        <code className="bg-black/30 px-2 py-1 rounded text-green-300 ml-1">ssh root@host</code>
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const PracticeStep = ({ round, onComplete }) => (
    <div className="space-y-4 h-full flex flex-col">
        <h3 className="text-xl font-bold text-saiyan-orange">Práctica - Ronda {round}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-yellow-400 font-bold block text-lg mb-2">1. Editar Fichero</span>
                <p>Usa <code>nano</code> para abrir la configuración:</p>
                <code className="block bg-black/50 p-2 rounded text-green-400">sudo nano /etc/ssh/sshd_config</code>
                <p className="text-gray-400 text-xs mt-1">Busca "Port" y cámbialo a 1234.</p>
                <p className="text-gray-400 text-xs mt-1">Busca "PermitRootLogin" y cámbialo a "yes".</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-blue-400 font-bold block text-lg mb-2">2. Reiniciar Nave</span>
                <p>Aplica los cambios en el motor:</p>
                <code className="block bg-black/50 p-2 rounded text-green-400">sudo systemctl restart sshd</code>
            </div>
        </div>
    </div>
);

const Round2Practice = () => {
    const [missions, setMissions] = useState([
        { id: 'connect', text: 'Conectar al puerto 1234', completed: false, criteria: (e) => e.type === 'command' && e.full.includes('ssh') && e.full.includes('-p 1234') },
        { id: 'root', text: 'Conectar como root', completed: false, criteria: (e) => e.type === 'ssh_connected' && e.user === 'root' },
        { id: 'whoami', text: 'Verificar identidad (whoami)', completed: false, criteria: (e) => e.type === 'command' && e.command === 'whoami' },
    ]);

    const handleBroadcast = (event) => {
        setMissions(prev => prev.map(m => {
            if (m.completed) return m;
            if (m.criteria(event)) return { ...m, completed: true };
            return m;
        }));
    };

    const allCompleted = missions.every(m => m.completed);

    return (
        <div className="space-y-4 h-full flex flex-col relative">
            <h3 className="text-xl font-bold">Práctica - Ronda 2</h3>

            <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex gap-4 text-sm font-mono overflow-x-auto">
                <div>
                    <span className="text-gray-400">User:</span> <span className="text-teleport-cyan">alumno-saiyan</span>
                </div>
                <div>
                    <span className="text-gray-400">IP Objetiva:</span> <span className="text-teleport-cyan">192.168.1.43</span>
                </div>
                <div>
                    <span className="text-gray-400">Pass:</span> <span className="text-teleport-cyan">1234</span>
                </div>
                <div>
                    <span className="text-gray-400">Port:</span> <span className="text-teleport-cyan">1234</span>
                </div>
            </div>

            <div className="flex-1 min-h-0 relative">
                <TerminalSimulator
                    onBroadcast={handleBroadcast}
                    customEnvironment={{
                        user: 'alumno-saiyan',
                        hostname: 'host'
                    }}
                />
                <AnimatePresence>
                    {allCompleted && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg"
                        >
                            <div className="text-center p-6 bg-gray-900 border-2 border-green-500 rounded-2xl">
                                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                                <h4 className="text-2xl font-bold text-white mb-2">¡ENTRENAMIENTO COMPLETADO!</h4>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
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

const FinalChallenge = () => {
    const [checklist, setChecklist] = useState([
        { id: 1, text: "Conectarse por SSH desde el puerto 4321 sin contraseña", completed: false },
        { id: 2, text: "Conectarse con el usuario 'root'", completed: false },
        { id: 3, text: "Comprobar que eres el usuario 'root'", completed: false },
    ]);

    const toggleItem = (id) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const allCompleted = checklist.every(item => item.completed);

    return (
        <div className="space-y-8 max-w-3xl mx-auto relative">
            <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold text-saiyan-orange">Reto Final 1</h3>
                <p className="text-lg text-gray-300">
                    Demuestra tu poder en el campo de batalla real.
                </p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-wrap justify-center gap-6 text-sm font-mono">
                <div>
                    <span className="text-gray-400">IP:</span> <span className="text-purple-400">192.168.1.43</span>
                </div>
                <div>
                    <span className="text-gray-400">Usuario:</span> <span className="text-purple-400">alumno-saiyan</span>
                </div>
                <div>
                    <span className="text-gray-400">Pass:</span> <span className="text-purple-400">1234</span>
                </div>
                <div>
                    <span className="text-gray-400">Puerto:</span> <span className="text-purple-400">4321</span>
                </div>
            </div>

            <div className="bg-space-black p-8 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(255,140,0,0.1)] relative overflow-hidden">
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
                <AnimatePresence>
                    {allCompleted && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        >
                            <div className="text-center p-8 bg-black/90 border-2 border-saiyan-orange rounded-2xl shadow-[0_0_50px_rgba(255,140,0,0.5)] transform scale-110">
                                <CheckCircle size={80} className="text-saiyan-orange mx-auto mb-4" />
                                <h4 className="text-4xl font-bold text-white mb-2">¡RETO SUPERADO!</h4>
                                <p className="text-gray-300 text-xl">Tu nivel de pelea ha aumentado.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const SummaryStep = () => (
    <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-purple-400">¡Nave Configurada!</h2>
        <p className="text-xl">
            Has aprendido a personalizar los controles de vuelo.
        </p>
        <div className="flex justify-center gap-8 text-left max-w-md mx-auto mt-8">
            <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Fichero: sshd_config</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Puerto: Port XXXX</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Root: PermitRootLogin yes</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Reiniciar: systemctl restart ssh</li>
            </ul>
        </div>
        <Link to="/">
            <button className="mt-8 px-8 py-3 bg-purple-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform">
                Volver al Dojo
            </button>
        </Link>
    </div>
);

export default ConfigSSHClass;
