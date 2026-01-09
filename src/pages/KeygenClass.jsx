import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressFlow from '../components/ProgressFlow';
import TerminalSimulator from '../components/TerminalSimulator';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Lock, Zap, CheckCircle } from 'lucide-react';
import ZoomableImage from '../components/ZoomableImage';

const KeygenClass = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { title: "Intro: Modo Super Saiyan", id: "intro" },
        { title: "Llaves: Pública vs Privada", id: "keys" },
        { title: "Pasar Llave Pública", id: "copy-id" },
        { title: "Práctica: Ronda 1", id: "round1" },
        { title: "Práctica: Ronda 2", id: "round2" },
        { title: "Reto Final 1", id: "reto1" },
        { title: "Reto Final 2", id: "reto2" },
        { title: "Resumen", id: "summary" },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
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
            {currentStep === 2 && <CopyIdStep />}
            {currentStep === 3 && <Round1Step />}
            {currentStep === 4 && <Round2Practice />}
            {currentStep === 5 && <RetoFinal1Step />}
            {currentStep === 6 && <RetoFinal2Step />}
            {currentStep === 7 && <SummaryStep />}
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

        <div className="mt-8 bg-black/30 p-6 rounded-xl border border-white/10">
            <h4 className="text-xl font-bold text-center mb-6 text-purple-400">¿Cómo sabe el servidor que soy yo? (Matemáticas Saiyan)</h4>

            <div className="grid md:grid-cols-2 gap-8 text-sm">
                <div className="space-y-6">
                    <div>
                        <p className="font-bold text-gray-300 mb-2">Imaginemos estas claves (muy pequeñas):</p>
                        <div className="bg-black/50 p-3 rounded font-mono text-xs space-y-1">
                            <p className="text-saiyan-gold">Clave Pública (e, n): e=3, n=33</p>
                            <p className="text-teleport-cyan">Clave Privada (d, n): d=7, n=33</p>
                        </div>
                    </div>

                    <div>
                        <p className="font-bold text-white mb-2">1. El servidor envía un reto</p>
                        <div className="bg-black/50 p-3 rounded border-l-2 border-red-500">
                            Reto (m) = 4
                        </div>
                    </div>

                    <div>
                        <p className="font-bold text-white mb-2">2. El cliente firma (con Privada)</p>
                        <div className="bg-black/50 p-3 rounded border-l-2 border-teleport-cyan font-mono text-xs space-y-1">
                            <p>s = m^d mod n</p>
                            <p>s = 4^7 mod 33</p>
                            <p className="text-gray-500">4^7 = 16384</p>
                            <p>16384 mod 33 = <span className="text-teleport-cyan font-bold text-sm">16</span></p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 italic">Firma enviada = 16</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <p className="font-bold text-white mb-2">3. El servidor verifica (con Pública)</p>
                        <div className="bg-black/50 p-3 rounded border-l-2 border-saiyan-gold font-mono text-xs space-y-1">
                            <p>v = s^e mod n</p>
                            <p>v = 16^3 mod 33</p>
                            <p className="text-gray-500">16^3 = 4096</p>
                            <p>4096 mod 33 = <span className="text-saiyan-gold font-bold text-sm">4</span></p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 italic">Resultado = 4</p>
                    </div>

                    <div>
                        <p className="font-bold text-white mb-2">4. Comparación Final</p>
                        <div className="bg-green-500/10 p-4 rounded border border-green-500/30 space-y-2">
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span>Resultado Verificación:</span>
                                <strong className="text-white">4</strong>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span>Reto Original:</span>
                                <strong className="text-white">4</strong>
                            </div>
                            <div className="pt-2 text-green-400 font-bold flex items-center gap-2 justify-center text-base">
                                <CheckCircle size={20} />
                                Coinciden → acceso concedido
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const CopyIdStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-saiyan-gold">Pasar Llave Pública</h3>

        <div className="space-y-4">
            <div className="bg-space-black p-6 rounded-xl border border-white/10">
                <h4 className="text-xl font-bold text-green-400 mb-2">Opción A: La forma fácil (ssh-copy-id)</h4>
                <p className="text-gray-300 mb-4">
                    Este comando mágico copia tu llave pública al servidor automáticamente.
                </p>
                <div className="font-mono text-sm bg-black p-4 rounded text-gray-300 overflow-x-auto">
                    <p><span className="text-green-500">$</span> ssh-copy-id usuario@servidor</p>
                    <p className="text-gray-500 my-2"># Te pedirá la contraseña del usuario remoto UNA ÚNICA VEZ</p>
                    <p className="text-gray-500">/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed</p>
                    <p className="text-gray-500">/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys</p>
                    <p className="text-white">usuario@servidor's password:</p>
                    <p className="text-yellow-400 mt-2">Number of key(s) added: 1</p>
                    <p className="mt-2">Now try logging into the machine, with:   "ssh 'usuario@servidor'"</p>
                    <p>and check to make sure that only the key(s) you wanted were added.</p>
                </div>
            </div>

            <div className="bg-space-black p-6 rounded-xl border border-white/10">
                <h4 className="text-xl font-bold text-blue-400 mb-2">Opción B: La forma manual (A mano)</h4>
                <p className="text-gray-300 mb-4">
                    Si no tienes <code>ssh-copy-id</code> (ej. en Windows antiguo), tienes que hacerlo tú mismo:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                    <li>Copias el contenido de tu llave pública: <code>cat ~/.ssh/id_rsa.pub</code></li>
                    <li>Te conectas al servidor (con contraseña): <code>ssh usuario@servidor</code></li>
                    <li>Creas la carpeta .ssh si no existe: <code>mkdir -p ~/.ssh</code></li>
                    <li>Pegas tu llave en el archivo de autorizados:</li>
                </ol>
                <div className="font-mono text-sm bg-black p-3 rounded text-gray-300 mt-2 overflow-x-auto">
                    echo "tu-llave-publica-ssh-rsa-AAAA..." &gt;&gt; ~/.ssh/authorized_keys
                </div>
            </div>
        </div>
    </div>
);

const Round1Step = () => (
    <div className="space-y-4 h-full flex flex-col">
        <h3 className="text-xl font-bold text-saiyan-gold">Práctica: Ronda 1 - El Ritual de Iniciación</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-400 mb-2">
            <div className="bg-white/5 p-2 rounded border border-white/10">
                <span className="text-red-400 font-bold block mb-1">1. Intento Fallido</span>
                Prueba <code>ssh alumno-saiyan@192.168.1.43</code>. Te pedirá contraseña (aún eres mortal).
            </div>
            <div className="bg-white/5 p-2 rounded border border-white/10">
                <span className="text-yellow-400 font-bold block mb-1">2. El Ritual (KeyGen)</span>
                <code>ssh-keygen</code> (Enter a todo)
                <br /><code>ssh-copy-id alumno-saiyan@192.168.1.43</code>
            </div>
            <div className="bg-white/5 p-2 rounded border border-white/10">
                <span className="text-green-400 font-bold block mb-1">3. Super Saiyan</span>
                Vuelve a <code>ssh alumno-saiyan@192.168.1.43</code>. ¡Entrarás sin contraseña!
            </div>
        </div>

        <div className="flex-1 min-h-0">
            <TerminalSimulator
                initialUser="alumno-saiyan"
                stepCriteria={{ type: 'ssh_connected' }} // Just loosely tracking success if they log in
            />
        </div>
    </div>
);

const Round2Practice = () => {
    const [missions, setMissions] = useState([
        { id: 'keygen', text: 'Generar claves', completed: false, criteria: (e) => e.type === 'command' && e.command.includes('ssh-keygen') },
        { id: 'pub', text: 'Ver clave pública', completed: false, criteria: (e) => e.type === 'command' && e.command === 'cat' && e.full.includes('id_rsa.pub') },
        { id: 'priv', text: 'Ver clave privada', completed: false, criteria: (e) => e.type === 'command' && e.command === 'cat' && (e.full.includes('id_rsa') && !e.full.includes('.pub')) },
        { id: 'copy', text: 'Enviar claves', completed: false, criteria: (e) => e.type === 'command' && e.command === 'ssh-copy-id' },
        { id: 'connect', text: 'Conectar sin password', completed: false, criteria: (e) => e.type === 'ssh_connected' },
        { id: 'whoami', text: 'Ver quien eres', completed: false, criteria: (e) => e.type === 'command' && e.command === 'whoami' },
        { id: 'exit', text: 'Salir', completed: false, criteria: (e) => e.type === 'command' && e.command === 'exit' },
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
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">Práctica: Ronda 2</h3>
                <span className="text-xs uppercase tracking-widest bg-yellow-500/20 px-2 py-1 rounded text-yellow-500">
                    Maestría KeyGen
                </span>
            </div>

            {/* Credential Legend */}
            <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex gap-6 text-sm font-mono overflow-x-auto">
                <div>
                    <span className="text-gray-400">Usuario:</span> <span className="text-teleport-cyan">alumno-saiyan</span>
                </div>
                <div>
                    <span className="text-gray-400">Contraseña:</span> <span className="text-teleport-cyan">1234</span>
                </div>
                <div>
                    <span className="text-gray-400">IP:</span> <span className="text-teleport-cyan">192.168.1.43</span>
                </div>
            </div>

            <div className="flex-1 min-h-0 relative">
                <TerminalSimulator
                    initialUser="alumno-saiyan"
                    onBroadcast={handleBroadcast}
                />

                <AnimatePresence>
                    {allCompleted && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg"
                        >
                            <div className="text-center p-6 bg-space-black border-2 border-green-500 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="inline-block mb-4"
                                >
                                    <CheckCircle size={64} className="text-green-500" />
                                </motion.div>
                                <h4 className="text-3xl font-bold text-white mb-2">¡RONDA COMPLETADA!</h4>
                                <p className="text-gray-300">Has dominado la simulación.</p>
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

const RetoFinal1Step = () => {
    const [checklist, setChecklist] = useState([
        { id: 1, text: "Generar claves", completed: false },
        { id: 2, text: "Ver claves creadas", completed: false },
        { id: 3, text: "Enviar claves al servidor", completed: false },
        { id: 4, text: "Conectar sin contraseña", completed: false },
        { id: 5, text: "Verificar identidad", completed: false },
        { id: 6, text: "Salir", completed: false },
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
                <h3 className="text-3xl font-bold text-saiyan-orange">Reto Final 1: ssh-copy-id</h3>
                <p className="text-lg text-gray-300">
                    Abre tu terminal real. Usa lo aprendido para configurar el acceso sin contraseña en tu servidor local de pruebas.
                </p>
            </div>

            <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex gap-6 text-sm font-mono overflow-x-auto">
                <div>
                    <span className="text-gray-400">Usuario:</span> <span className="text-teleport-cyan">alumno-saiyan</span>
                </div>
                <div>
                    <span className="text-gray-400">Contraseña:</span> <span className="text-teleport-cyan">1234</span>
                </div>
                <div>
                    <span className="text-gray-400">IP Objetiva:</span> <span className="text-teleport-cyan">192.168.1.43</span>
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
                                <motion.div
                                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.8 }}
                                    className="inline-block mb-4"
                                >
                                    <CheckCircle size={80} className="text-saiyan-orange" />
                                </motion.div>
                                <h4 className="text-4xl font-bold text-white mb-2">¡RETO 1 COMPLETADO!</h4>
                                <p className="text-gray-300 text-xl">Conexión automática dominada.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const RetoFinal2Step = () => {
    const [checklist, setChecklist] = useState([
        { id: 1, text: "Generar nuevas claves (si es necesario)", completed: false },
        { id: 2, text: "Copiar contenido de clave pública", completed: false },
        { id: 3, text: "Conectar con contraseña", completed: false },
        { id: 4, text: "Crear directorio .ssh si es necesario", completed: false },
        { id: 5, text: "Crear archivo 'authorized_keys' dentro de .ssh si es necesario", completed: false },
        { id: 6, text: "Añadir clave a authorized_keys", completed: false },
        { id: 7, text: "Salir y probar conexión sin contraseña", completed: false },
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
                <h3 className="text-3xl font-bold text-red-500">Reto Final 2: Modo Manual</h3>
                <p className="text-lg text-gray-300">
                    Ahora hazlo "a mano", si estuvieras en un sistema sin ssh-copy-id.
                </p>
            </div>

            <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex gap-6 text-sm font-mono overflow-x-auto">
                <div>
                    <span className="text-gray-400">Usuario:</span> <span className="text-teleport-cyan">alumno-saiyan</span>
                </div>
                <div>
                    <span className="text-gray-400">Contraseña:</span> <span className="text-teleport-cyan">1234</span>
                </div>
                <div>
                    <span className="text-gray-400">IP Objetiva:</span> <span className="text-teleport-cyan">192.168.1.43</span>
                </div>
            </div>

            <div className="bg-space-black p-8 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(239,68,68,0.1)] relative overflow-hidden">
                <div className="space-y-4">
                    {checklist.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={false}
                            animate={{ backgroundColor: item.completed ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.02)' }}
                            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-colors ${item.completed ? 'border-red-500/50' : 'border-white/5 hover:border-white/20'}`}
                            onClick={() => toggleItem(item.id)}
                        >
                            <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${item.completed ? 'bg-red-500 border-red-500' : 'border-gray-500'}`}>
                                {item.completed && <CheckCircle size={16} className="text-black" />}
                            </div>
                            <span className={`text-lg font-mono transition-all ${item.completed ? 'text-red-400 line-through opacity-70' : 'text-gray-200'}`}>
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
                            <div className="text-center p-8 bg-black/90 border-2 border-red-500 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.5)] transform scale-110">
                                <motion.div
                                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.8 }}
                                    className="inline-block mb-4"
                                >
                                    <CheckCircle size={80} className="text-red-500" />
                                </motion.div>
                                <h4 className="text-4xl font-bold text-white mb-2">¡MAESTRO TOTAL!</h4>
                                <p className="text-gray-300 text-xl">Nadie te puede detener ahora.</p>
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
        <h2 className="text-3xl font-bold text-saiyan-gold">¡Nivel Super Saiyan Alcanzado!</h2>
        <p className="text-xl">
            Ya no necesitas contraseñas. Eres pura energía.
        </p>

        <div className="flex justify-center gap-8 text-left max-w-md mx-auto mt-8">
            <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Crear llaves (ssh-keygen)</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Copiar llave al servidor (ssh-copy-id)</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Entender authorized_keys</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Conectar sin contraseña</li>
            </ul>
        </div>

        <Link to="/">
            <button className="mt-8 px-8 py-3 bg-saiyan-gold text-black font-bold rounded-full shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-105 transition-transform">
                Volver al Dojo
            </button>
        </Link>
    </div>
);

export default KeygenClass;
