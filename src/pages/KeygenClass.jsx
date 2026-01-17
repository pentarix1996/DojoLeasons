import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressFlow from '../components/ProgressFlow';
import TerminalSimulator from '../components/TerminalSimulator';
import MissionTerminal from '../components/MissionTerminal';
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

/* --- Command Logic Helpers --- */

const getSSHKeygenCommand = () => {
    return (args, { addToOutput, setInteractiveState, setInputPrompt, setFs, broadcast, state }) => {
        addToOutput("Generating public/private rsa key pair.");
        addToOutput("Enter file in which to save the key (/home/alumno-saiyan/.ssh/id_rsa):");
        if (setInputPrompt) setInputPrompt("");

        const context = {
            step: 'file',
            fs: state.fs
        };

        setInteractiveState({
            type: 'keygen',
            handler: (input, tools) => {
                if (context.step === 'file') {
                    // Default path usage logic
                    const path = input.trim() || "/home/alumno-saiyan/.ssh/id_rsa";
                    tools.addToOutput(path);
                    tools.addToOutput("Enter passphrase (empty for no passphrase):");
                    context.step = 'passphrase';
                } else if (context.step === 'passphrase') {
                    tools.addToOutput(""); // Hide output
                    tools.addToOutput("Enter same passphrase again:");
                    context.step = 'confirm';
                } else if (context.step === 'confirm') {
                    tools.addToOutput("");
                    tools.addToOutput("Your identification has been saved in /home/alumno-saiyan/.ssh/id_rsa");
                    tools.addToOutput("Your public key has been saved in /home/alumno-saiyan/.ssh/id_rsa.pub");
                    tools.addToOutput("The key fingerprint is:");
                    tools.addToOutput("SHA256:wF5... randomart image ...");

                    // Update FS
                    const newFs = { ...tools.state.fs }; // Access latest state via tools if possible or use context ref if updated
                    const sshPath = '/home/alumno-saiyan/.ssh';

                    // Create .ssh directory if needed (mock)
                    // Simplified: Assume we just add the files to state or simpler logic
                    // We need to properly manipulate the FS structure which is: { path: { type, children?, content? } }

                    // Create .ssh directory and add to parent children
                    const homePath = '/home/alumno-saiyan';
                    if (!newFs[sshPath]) {
                        newFs[sshPath] = { type: 'dir', children: [] };
                        if (newFs[homePath]) {
                            const newCh = [...(newFs[homePath].children || [])];
                            if (!newCh.includes('.ssh')) newCh.push('.ssh');
                            newFs[homePath] = { ...newFs[homePath], children: newCh };
                        }
                    }

                    // Add keys
                    newFs[sshPath] = { type: 'dir', children: ['id_rsa', 'id_rsa.pub'] };
                    newFs[`${sshPath}/id_rsa`] = { type: 'file', content: 'PRIVATE KEY CONTENT' };
                    newFs[`${sshPath}/id_rsa.pub`] = { type: 'file', content: 'ssh-rsa AAAA...alumno-saiyan@laptop' };

                    tools.setFs(newFs);
                    tools.setInteractiveState(null);
                    if (tools.setInputPrompt) tools.setInputPrompt(null);
                    if (tools.broadcast) tools.broadcast({ type: 'command', command: 'ssh-keygen-done' }); // Helper event
                }
            }
        });
    };
};

const getSSHCopyIdCommand = () => {
    return (args, { addToOutput, setInteractiveState, setIsPasswordInput, state, broadcast: initialBroadcast }) => {
        // Validation: Check if keys exist
        const hasKeys = state.fs['/home/alumno-saiyan/.ssh/id_rsa.pub'];
        if (!hasKeys) {
            addToOutput("ERROR: No identity found. Run 'ssh-keygen' first to generate your keys.");
            return;
        }

        if (args.length < 2) {
            addToOutput("usage: ssh-copy-id user@host");
            return;
        }

        const target = args[1].split('@');
        if (target[1] !== '192.168.1.43') {
            addToOutput("ssh-copy-id: connection failed or invalid host");
            return;
        }

        const targetUser = target[0];
        const targetHost = target[1];

        setIsPasswordInput(true);
        addToOutput(`${targetUser}@${targetHost}'s password:`, 'text-white');

        setInteractiveState({
            type: 'password_prompt',
            handler: (pass, tools) => {
                tools.setIsPasswordInput(false);
                if (pass === 'root') { // Hardcoded correct password
                    tools.addToOutput("");
                    tools.addToOutput(`Number of key(s) added: 1`);
                    tools.addToOutput(`Now try logging into the machine, with: "ssh '${targetUser}@${targetHost}'"`);
                    tools.addToOutput(`and check to make sure that only the key(s) you wanted were added.`);

                    // DIRECT FIX: Update FS to simulate installed keys on remote
                    tools.setFs(prev => ({
                        ...prev,
                        '/remote/installed': { type: 'file', content: 'marker' }
                    }));

                    // Broadcast success for mission tracking
                    if (tools.broadcast) tools.broadcast({ type: 'keys_copied' });

                    tools.setInteractiveState(null);
                } else {
                    tools.addToOutput("Permission denied (publickey,password).");
                    tools.setInteractiveState(null);
                }
            }
        });
    };
};

const getSmartSSHCommand = (keysCopied = false) => {
    // We need to know if keys are copied.
    // In a real app we'd check the "remote fs" state.
    // Here we can rely on a prop or check if we are passing a "keysCopied" flag via closure or state check.
    // Problem: "keysCopied" state is usually inside the component.
    // Solution: The command factory can accept a getter or we assume 'keys_copied' event sets a flag in the parent component, 
    // but the command logic runs inside the generic terminal.
    // BETTER: The terminal state could hold "remote state".
    // FOR NOW: We'll assume if the command `ssh-copy-id` succeeded, we can set a flag `keys_installed` in the `fs` or a special hidden file?
    // OR: We simply check if `ssh-copy-id` was called in history? No.

    // Simplest: Let MissionTerminal manage "server state" and pass it? Too complex.
    // Let's use a closure variable if we define these inside the component.
    // But I'm defining them outside.

    // Hack: We can write to a hidden "remote" file in FS to simulate state.
    // e.g. /remote/authorized_keys

    return (args, { addToOutput, setInteractiveState, setIsPasswordInput, setUser, setHost, state, broadcast }) => {
        if (args.length < 2) {
            addToOutput("usage: ssh user@host");
            return;
        }

        const target = args[1].split('@');
        const [targetUser, targetHost] = target;

        if (targetHost !== '192.168.1.43') {
            addToOutput(`ssh: connect to host ${targetHost} port 22: Connection timed out`);
            return;
        }

        // Check if authorized_keys exists in "remote" (simulated by checking if we copied keys)
        // We can check if a special marker file exists in our local FS for this simulation or logic
        // Let's use the simplest approach: The component using this will verify state.
        // Actually, we can check `state.fs['/remote/authorized_keys']` if we decide to store it there.
        const isAuthorized = state.fs['/remote/installed'];

        if (isAuthorized) {
            addToOutput("Authenticated with partial public key.");
            // Method 'key' signals passwordless entry
            finishLogin(targetUser, targetHost, { addToOutput, setUser, setHost, broadcast, setInteractiveState }, 'key');
            return;
        }

        // Fallback to password
        addToOutput(`(Public key not found or not authorized)`);
        addToOutput(`${targetUser}@${targetHost}'s password:`, 'text-white');
        setIsPasswordInput(true);

        setInteractiveState({
            type: 'password',
            handler: (pass, tools) => {
                tools.setIsPasswordInput(false);
                if (pass === 'root') {
                    finishLogin(targetUser, targetHost, tools, 'password');
                } else {
                    tools.addToOutput("Permission denied.");
                    tools.setInteractiveState(null);
                }
            }
        });
    };
};

const finishLogin = (user, host, tools, method = 'password') => {
    tools.addToOutput("");
    tools.addToOutput("Welcome to Ubuntu 22.04.3 LTS");
    tools.setUser(user);
    tools.setHost(host);
    tools.setInteractiveState(null);
    if (tools.broadcast) tools.broadcast({ type: 'ssh_connected', user, host, method });
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

        <div className="mt-8 bg-white/5 p-6 rounded-xl border border-white/10 max-w-2xl mx-auto font-mono text-sm leading-relaxed">
            <h4 className="text-center text-lg font-bold text-saiyan-gold mb-4">La Prueba Matemática (RSA Simplificado)</h4>
            <div className="grid grid-cols-2 gap-4 border-b border-gray-700 pb-4 mb-4">
                <div>
                    <span className="text-gray-400 block">Clave Pública (e, n)</span>
                    <span className="text-saiyan-gold">e = 3, n = 33</span>
                </div>
                <div>
                    <span className="text-gray-400 block">Clave Privada (d, n)</span>
                    <span className="text-teleport-cyan">d = 7, n = 33</span>
                </div>
            </div>

            <div className="space-y-3">
                <p><span className="text-gray-400">1. Servidor manda prueba (m):</span> <span className="text-white font-bold">4</span></p>

                <p>
                    <span className="text-gray-400">2. Cliente firma con Privada:</span><br />
                    s = mᵈ mod n = 4⁷ mod 33 = 16384 mod 33 = <span className="text-teleport-cyan font-bold">16</span>
                </p>

                <p>
                    <span className="text-gray-400">3. Servidor verifica con Pública:</span><br />
                    v = sᵉ mod n = 16³ mod 33 = 4096 mod 33 = <span className="text-saiyan-gold font-bold">4</span>
                </p>

                <div className="mt-4 text-center bg-green-500/20 p-2 rounded border border-green-500/50">
                    <span className="text-green-400 font-bold">¡Éxito! (4 == 4) -&gt; "Pase usted"</span>
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
                    <p className="mt-2">Number of key(s) added: 1</p>
                </div>
            </div>

            <div className="bg-space-black p-6 rounded-xl border border-white/10 opacity-75 hover:opacity-100 transition-opacity">
                <h4 className="text-xl font-bold text-red-400 mb-2">Opción B: La forma manual</h4>
                <p className="text-gray-300 mb-4">Alternativa manual.</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400 font-mono">
                    <li>Copiar contenido de <span className="text-white">id_rsa.pub</span> (pública)</li>
                    <li>Conectarse al servidor: <span className="text-white">ssh usuario@ip</span></li>
                    <li>Crear carpeta: <span className="text-white">mkdir -p ~/.ssh</span></li>
                    <li>Editar archivo: <span className="text-white">nano ~/.ssh/authorized_keys</span></li>
                    <li>Pegar la clave pública y guardar (Ctrl+O, Enter, Ctrl+X)</li>
                </ol>
            </div>
        </div>
    </div>
);

const Round1Step = () => {
    // Shared logic for state tracking (marker for passwordless auth)
    const sshCopyId = (args, tools) => {
        getSSHCopyIdCommand()(args, {
            ...tools,
            broadcast: (e) => {
                if (e.type === 'keys_copied') {
                    tools.setFs(prev => ({ ...prev, '/remote/installed': { type: 'file', content: 'marker' } }));
                }
                if (tools.broadcast) tools.broadcast(e);
            }
        });
    };

    const sshCmd = getSmartSSHCommand();

    return (
        <div className="space-y-4 h-full flex flex-col">
            <h3 className="text-xl font-bold text-saiyan-gold">Práctica: Ronda 1 - El Ritual de Iniciación</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-400 mb-2">
                <div className="bg-white/5 p-2 rounded border border-white/10">
                    <span className="text-red-400 font-bold block mb-1">1. Intento Fallido</span>
                    Prueba <code>ssh alumno-saiyan@192.168.1.43</code>. Te pedirá contraseña.
                </div>
                <div className="bg-white/5 p-2 rounded border border-white/10">
                    <span className="text-yellow-400 font-bold block mb-1">2. El Ritual (KeyGen)</span>
                    <code>ssh-keygen</code> (Enter a todo)
                    <br /><code>ssh-copy-id alumno-saiyan@192.168.1.43</code>
                </div>
                <div className="bg-white/5 p-2 rounded border border-white/10">
                    <span className="text-green-400 font-bold block mb-1">3. Super Saiyan</span>
                    Vuelve a conectarte. ¡Sin contraseña!
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <TerminalSimulator
                    initialUser="alumno-saiyan"
                    initialPath="/home/alumno-saiyan"
                    fileSystem={{
                        '/home/alumno-saiyan': { type: 'dir', children: [] }
                    }}
                    customCommands={{
                        'ssh-keygen': getSSHKeygenCommand(),
                        'ssh-copy-id': sshCopyId,
                        'ssh': sshCmd
                    }}
                />
            </div>
        </div>
    );
};

const Round2Practice = () => {
    // Determine state
    // We need to track if ssh-copy-id happened to unlock passwordless ssh.
    // We can do this by handling 'keys_copied' event and updating a local Ref or state that modifies the 'ssh' command passed down.
    // OR: we modify the FS state in 'ssh-copy-id' command to include a marker file, and 'ssh' command checks it.
    // Let's use the Marker File approach in `getSSHCopyIdCommand`.

    // I need to wrap the commands to close over the marker logic?
    // The `getSSHCopyIdCommand` I wrote above broadcasts 'keys_copied'.
    // I can stick to FS modification:
    // in `getSSHCopyIdCommand`: context.setFs(prev => ({...prev, '/remote/installed': true}))
    // But `setFs` is local. Ideally `ssh-copy-id` affects the REMOTE host. 
    // Since we are simulating, we can just treat the local FS as holding state for the simulation session.

    // Enhanced copy-id command
    const sshCopyId = (args, tools) => {
        // reuse base logic but add FS update
        getSSHCopyIdCommand()(args, {
            ...tools,
            broadcast: (e) => {
                if (e.type === 'keys_copied') {
                    // Set marker
                    tools.setFs(prev => ({ ...prev, '/remote/installed': { type: 'file', content: 'marker' } }));
                }
                if (tools.broadcast) tools.broadcast(e);
            }
        });
    };

    const missions = [
        { id: 'keygen', text: 'Generar claves', completed: false, criteria: (e) => e.type === 'command' && e.command.includes('ssh-keygen') },
        { id: 'pub', text: 'Ver clave pública', completed: false, criteria: (e) => e.type === 'command' && e.command === 'cat' && e.full.includes('id_rsa.pub') },
        { id: 'priv', text: 'Ver clave privada', completed: false, criteria: (e) => e.type === 'command' && e.command === 'cat' && (e.full.includes('id_rsa') && !e.full.includes('.pub')) },
        { id: 'copy', text: 'Enviar claves', completed: false, criteria: (e) => e.type === 'keys_copied' },
        { id: 'connect', text: 'Conectar sin password', completed: false, criteria: (e) => e.type === 'ssh_connected' && e.method === 'key' }, // Strict check for passwordless
        // The criterion 'ssh_connected' just means connected. The user knows if they typed a password or not.
        // If we want strict check, we'd need 'ssh_connected_key' event.
        { id: 'whoami', text: 'Ver quien eres', completed: false, criteria: (e) => e.type === 'command' && e.command === 'whoami' },
        { id: 'exit', text: 'Salir', completed: false, criteria: (e) => e.type === 'command' && e.command === 'exit' },
    ];

    const credentials = {
        usuario: 'alumno-saiyan',
        contraseña: 'root',
        ip: '192.168.1.43'
    };

    // Custom ssh command that checks the marker
    const sshCmd = getSmartSSHCommand();

    return (
        <MissionTerminal
            title="Práctica: Ronda 2"
            subtitle="Maestría KeyGen"
            initialMissions={missions}
            credentials={credentials}
            initialUser="alumno-saiyan"
            initialPath="/home/alumno-saiyan"
            initialState={{
                fileSystem: {
                    '/home/alumno-saiyan': { type: 'dir', children: [] }
                }
            }}
            customCommands={{
                'ssh-keygen': getSSHKeygenCommand(),
                'ssh-copy-id': sshCopyId,
                'ssh': sshCmd
            }}
        />
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
                    <span className="text-gray-400">Contraseña:</span> <span className="text-teleport-cyan">root</span>
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
                    <span className="text-gray-400">Contraseña:</span> <span className="text-teleport-cyan">root</span>
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
