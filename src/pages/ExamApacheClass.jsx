import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trophy, Server, Terminal, Database, Globe } from 'lucide-react';

const ExamApacheClass = () => {
    const [checklist, setChecklist] = useState([
        { id: 1, text: "Conectar a la máquina por SSH", completed: false },
        { id: 2, text: "Instalar el servicio Apache (apache2)", completed: false },
        { id: 3, text: "Instalar MySQL Server y crear BBDD/Usuario para WordPress", completed: false },
        { id: 4, text: "Instalar PHP y las dependencias de Wordpress", completed: false },
        { id: 5, text: "Instalar WordPress y configurarlo para servirlo en Apache sobre /var/www/alumno6", completed: false },
        { id: 6, text: "Log: Mostrar IPs únicas que han accedido (sort | uniq)", completed: false },
        { id: 7, text: "Log: Ver horas de acceso de la IP 192.168.1.14", completed: false },
        { id: 8, text: "Log: Contar cuántos errores 404 hay (grep | wc -l)", completed: false },
        { id: 9, text: "Log: Identificar User Agents (navegadores) usados (cut)", completed: false },
        { id: 10, text: "Log: Ordenar peticiones por endpoint solicitado", completed: false },
    ]);

    const toggleItem = (id) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const allCompleted = checklist.every(item => item.completed);

    return (
        <div className="min-h-screen bg-space-black text-white p-8 pt-24 font-sans selection:bg-saiyan-orange selection:text-black">
            {/* Background Effect */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="max-w-4xl mx-auto space-y-12 relative z-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 bg-saiyan-orange/20 rounded-full mb-4 border border-saiyan-orange/50 shadow-[0_0_30px_rgba(255,140,0,0.3)]"
                    >
                        <Trophy size={64} className="text-saiyan-orange" />
                    </motion.div>
                    <h1 className="text-5xl font-extrabold tracking-tight">
                        Examen 01: <span className="text-transparent bg-clip-text bg-gradient-to-r from-saiyan-orange to-red-600">Apache Warrior</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Demuestra que eres un verdadero administrador de sistemas.
                        Configura un servidor web completo y analiza sus huellas.
                    </p>
                </div>

                {/* Credentials Card */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                    <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
                        <Terminal size={20} /> Credenciales de Acceso
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-sm">
                        <div className="bg-black/40 p-3 rounded border-l-4 border-blue-500">
                            <span className="block text-gray-500 text-xs uppercase font-bold">Host / IP</span>
                            <span className="text-blue-400 text-lg">exam01-apache.net</span>
                        </div>
                        <div className="bg-black/40 p-3 rounded border-l-4 border-green-500">
                            <span className="block text-gray-500 text-xs uppercase font-bold">Usuario</span>
                            <span className="text-green-400 text-lg">alumno</span>
                        </div>
                        <div className="bg-black/40 p-3 rounded border-l-4 border-purple-500">
                            <span className="block text-gray-500 text-xs uppercase font-bold">Contraseña</span>
                            <span className="text-purple-400 text-lg">1234</span>
                        </div>
                    </div>
                    <br />
                    <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
                        <Terminal size={20} /> Librerías PHP necesarias
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-sm">
                        <div className="bg-black/40 p-3 rounded border-l-4 border-blue-500">
                            <span className="text-blue-400 text-lg">libapache2-mod-php</span>
                        </div>
                        <div className="bg-black/40 p-3 rounded border-l-4 border-green-500">
                            <span className="text-green-400 text-lg">php-mysql</span>
                        </div>
                        <div className="bg-black/40 p-3 rounded border-l-4 border-purple-500">
                            <span className="text-purple-400 text-lg">php-xml</span>
                        </div>
                        <div className="bg-black/40 p-3 rounded border-l-4 border-blue-500">
                            <span className="text-blue-400 text-lg">php-curl</span>
                        </div>
                        <div className="bg-black/40 p-3 rounded border-l-4 border-green-500">
                            <span className="text-green-400 text-lg">php-mbstring</span>
                        </div>
                        <div className="bg-black/40 p-3 rounded border-l-4 border-purple-500">
                            <span className="text-purple-400 text-lg">php-zip</span>
                        </div>
                        <div className="bg-black/40 p-3 rounded border-l-4 border-blue-500">
                            <span className="text-blue-400 text-lg">php-gd</span>
                        </div>
                        <div className="bg-black/40 p-3 rounded border-l-4 border-green-500">
                            <span className="text-green-400 text-lg">php-soap</span>
                        </div>
                        <div className="bg-black/40 p-3 rounded border-l-4 border-purple-500">
                            <span className="text-purple-400 text-lg">php-intl</span>
                        </div>
                    </div>
                </div>

                {/* Missions List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold">Misiones</h2>
                        <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-full text-saiyan-orange border border-saiyan-orange/30">
                            {checklist.filter(i => i.completed).length} / {checklist.length} Completadas
                        </span>
                    </div>

                    <div className="grid gap-4">
                        {checklist.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={false}
                                onClick={() => toggleItem(item.id)}
                                className={`
                                    relative p-5 rounded-xl cursor-pointer border transition-all duration-300 group
                                    ${item.completed
                                        ? 'bg-saiyan-orange/10 border-saiyan-orange/50'
                                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'}
                                `}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`
                                        mt-1 w-6 h-6 rounded border flex items-center justify-center transition-colors
                                        ${item.completed ? 'bg-saiyan-orange border-saiyan-orange' : 'border-gray-500 group-hover:border-white'}
                                    `}>
                                        {item.completed && <CheckCircle size={16} className="text-black" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-lg font-medium transition-colors ${item.completed ? 'text-saiyan-orange line-through opacity-70' : 'text-gray-200'}`}>
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Victory Modal Overlay */}
                <AnimatePresence>
                    {allCompleted && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.8, y: 50 }}
                                animate={{ scale: 1, y: 0 }}
                                className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border-2 border-saiyan-orange shadow-[0_0_80px_rgba(255,140,0,0.4)] max-w-md text-center relative overflow-hidden"
                            >
                                {/* Confetti/Glow Effect */}
                                <div className="absolute inset-0 bg-saiyan-orange/10 blur-3xl rounded-full"></div>

                                <div className="relative z-10 space-y-6">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, ease: "backOut" }}
                                        className="inline-block"
                                    >
                                        <Trophy size={80} className="text-saiyan-orange drop-shadow-[0_0_15px_rgba(255,140,0,0.8)]" />
                                    </motion.div>

                                    <div>
                                        <h2 className="text-4xl font-extrabold text-white mb-2">¡EXAMEN SUPERADO!</h2>
                                        <p className="text-gray-400">Has demostrado tu valía, Administrador.</p>
                                    </div>

                                    <Link to="/">
                                        <button className="w-full py-4 bg-saiyan-orange text-black font-bold text-lg rounded-xl hover:scale-105 hover:shadow-[0_0_30px_rgba(255,140,0,0.5)] transition-all duration-300">
                                            Volver al Dojo
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default ExamApacheClass;
