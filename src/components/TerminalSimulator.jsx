import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TerminalSimulator = ({
    initialUser = "alumno",
    initialHost = "laptop-local",
    fileSystem = {
        '/home/alumno': { type: 'dir', children: ['notas.txt'] },
        '/home/alumno/notas.txt': { type: 'file', content: 'Apuntes secretos de la clase de SSH.' },
    },
    customCommands = {}, // { commandName: (args, setHistory, scope) => void }
    onCommandSuccess,
    onBroadcast,
    autoFocus = true,
    initialPath = "/home/alumno"
}) => {
    const [history, setHistory] = useState([
        { type: 'output', content: `Bienvenido a ${initialHost}. Escribe 'help' si estás perdido.` }
    ]);
    const [currentInput, setCurrentInput] = useState('');
    const [user, setUser] = useState(initialUser);
    const [host, setHost] = useState(initialHost);
    const [isPasswordInput, setIsPasswordInput] = useState(false);
    const [fs, setFs] = useState({ ...fileSystem });
    const [currentPath, setCurrentPath] = useState(initialPath);
    const [inputPrompt, setInputPrompt] = useState(null); // Overrides standard prompt if set
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    // To handle interactive commands (like ssh password or keygen interaction)
    const [interactiveState, setInteractiveState] = useState(null);

    // Focus management
    useEffect(() => {
        if (autoFocus && inputRef.current) inputRef.current.focus();
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, autoFocus]);

    const addToOutput = (text, className = "text-gray-300") => {
        setHistory(prev => [...prev, { type: 'output', content: text, className }]);
    };

    const handleCommand = (cmdStr) => {
        // Broadcast raw command event always
        if (onBroadcast) {
            onBroadcast({ type: 'raw_input', content: cmdStr });
        }

        // Handle interactive states (password, keygen flow, etc.)
        if (interactiveState) {
            // Let the interactive handler deal with it
            if (interactiveState.handler) {
                interactiveState.handler(cmdStr, {
                    addToOutput,
                    setInteractiveState,
                    setIsPasswordInput,
                    setUser,
                    setHost,
                    setFs,
                    setInputPrompt, // Pass this
                    broadcast: onBroadcast,
                    state: { user, host, fs, currentPath }
                });
            }
            return;
        }

        const rawCmd = cmdStr.trim();
        if (!rawCmd) return;

        // Add to history
        setHistory(prev => [...prev, { type: 'command', content: rawCmd, user, host }]);

        const args = rawCmd.split(' ');
        const cmd = args[0].toLowerCase();

        // Broadcast parsed command
        if (onBroadcast) {
            onBroadcast({ type: 'command', command: cmd, full: rawCmd, args, user, host });
        }

        if (onCommandSuccess) onCommandSuccess(rawCmd);

        // Check Custom Commands First
        if (customCommands[cmd]) {
            customCommands[cmd](args, {
                addToOutput,
                setFs,
                setCurrentPath,
                setUser,
                setHost,
                setInteractiveState,
                setIsPasswordInput,
                setInputPrompt, // Pass this
                broadcast: onBroadcast,
                state: { user, host, fs, currentPath }
            });
            return;
        }

        // Built-in commands
        switch (cmd) {
            case 'clear':
                setHistory([]);
                break;
            case 'whoami':
                addToOutput(user);
                break;
            case 'pwd':
                addToOutput(currentPath);
                break;
            case 'ls':
                handleLs(args);
                break;
            case 'cd':
                handleCd(args[1] || '/home/alumno');
                break;
            case 'mkdir':
                handleMkdir(args[1]);
                break;
            case 'touch':
                handleTouch(args[1]);
                break;
            case 'cat':
                handleCat(args[1]);
                break;
            case 'echo':
                handleEcho(rawCmd);
                break;
            case 'mv':
                handleMove(args[1], args[2]);
                break;
            case 'help':
                addToOutput("Comandos disponibles: ls, cd, mkdir, touch, cat, echo, mv, clear, whoami, exit. " + Object.keys(customCommands).join(", "));
                break;
            case 'exit':
                if (host !== initialHost) {
                    addToOutput(`Connection to ${host} closed.`);
                    setHost(initialHost);
                    setUser(initialUser);
                } else {
                    addToOutput("Logout.");
                }
                break;
            default:
                addToOutput(`${cmd}: command not found`);
        }
    };

    /* --- Built-in Handlers --- */

    const handleLs = (args) => {
        const dir = fs[currentPath];
        if (!dir || dir.type !== 'dir') {
            addToOutput(`ls: cannot access '${currentPath}': No such file or directory`);
            return;
        }

        const showHidden = args && args.some(arg => arg.includes('a'));
        let files = dir.children || [];

        if (!showHidden) {
            files = files.filter(f => !f.startsWith('.'));
        }

        const content = files.join('  ');
        addToOutput(content || '');
    };

    const handleCd = (path) => {
        if (!path) return;

        if (path === '..') {
            const parts = currentPath.split('/');
            if (parts.length > 2) {
                parts.pop();
                setCurrentPath(parts.join('/'));
            }
            return;
        }

        const targetPath = path.startsWith('/') ? path : `${currentPath}/${path}`.replace('//', '/');

        if (fs[targetPath] && fs[targetPath].type === 'dir') {
            setCurrentPath(targetPath);
        } else {
            addToOutput(`bash: cd: ${path}: No such file or directory`);
        }
    };

    const handleMkdir = (dirName) => {
        if (!dirName) {
            addToOutput("mkdir: missing operand");
            return;
        }
        if (dirName.includes('/') || dirName.includes('..')) {
            // Basic sim limitation
            addToOutput("mkdir: complex paths not fully supported in simulation");
            return;
        }

        const newPath = `${currentPath}/${dirName}`;
        if (fs[newPath]) {
            addToOutput(`mkdir: cannot create directory '${dirName}': File exists`);
            return;
        }

        const newFs = { ...fs };
        newFs[newPath] = { type: 'dir', children: [] };
        if (newFs[currentPath]) {
            newFs[currentPath] = {
                ...newFs[currentPath],
                children: [...(newFs[currentPath].children || []), dirName]
            };
        }
        setFs(newFs);
    };

    const handleTouch = (fileName) => {
        if (!fileName) return;
        const filePath = `${currentPath}/${fileName}`;
        if (!fs[filePath]) {
            const newFs = { ...fs };
            newFs[filePath] = { type: 'file', content: '' };
            if (newFs[currentPath]) {
                newFs[currentPath].children = [...(newFs[currentPath].children || []), fileName];
            }
            setFs(newFs);
        }
    };

    const handleCat = (file) => {
        if (!file) {
            addToOutput("cat: missing operand");
            return;
        }

        // Resolve path
        let targetPath = file.startsWith('/') ? file : `${currentPath}/${file}`;
        targetPath = targetPath.replace('//', '/');

        // Check if direct file exists
        if (fs[targetPath] && fs[targetPath].type === 'file') {
            addToOutput(fs[targetPath].content);
            return;
        }

        // Fallback check in children of current dir to be safe
        const dir = fs[currentPath];
        if (dir && dir.children && dir.children.includes(file)) {
            // Maybe path key is simpler?
            // Actually if it's in children, it should be in fs keys if maintained correctly.
            // But let's check just in case we missed a normalized key
        }

        addToOutput(`cat: ${file}: No such file or directory`);
    };

    const handleEcho = (rawCmd) => {
        // Simple echo
        let content = rawCmd.replace(/^echo\s+/, '').trim();

        // Handle redirect >>
        if (content.includes('>>')) {
            const parts = content.split('>>');
            const textToAppend = parts[0].replace(/["']/g, '').trim();
            const targetFile = parts[1].trim();

            // Allow custom Logic to intercept THIS specific echo via customCommands if needed? 
            // Or just implement basic append here.

            // For now, let's implement basic append to FS
            // BUT, for things like 'authorized_keys', we usually want to trigger an event or logic
            if (onBroadcast) {
                onBroadcast({ type: 'file_append', file: targetFile, content: textToAppend });
            }

            // Standard behavior: silently succeed (or creating file)
            addToOutput("");
            return;
        }

        addToOutput(content.replace(/["']/g, ''));
    };

    const handleMove = (src, dest) => {
        // Simplified mv
        if (!src || !dest) {
            addToOutput("mv: missing operand");
            return;
        }
        // Not fully implementing mv logic for this generic sim unless needed
        addToOutput("mv: simulation limited");
    };


    return (
        <div
            className="bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden font-mono text-sm border border-white/10 w-full h-full flex flex-col"
            onClick={() => inputRef.current?.focus()}
        >
            {/* Terminal Header */}
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-white/5 shrink-0">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-gray-400 text-xs ml-4 flex-1 text-center">
                    {user}@{host}: {currentPath === '/home/alumno' ? '~' : currentPath}
                </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar scroll-smooth">
                <AnimatePresence>
                    {history.map((entry, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-1"
                        >
                            {entry.type === 'command' ? (
                                <div className="flex gap-2">
                                    <span className="text-green-400 font-bold">{entry.user}@{entry.host}:~$</span>
                                    <span className="text-white">{entry.content}</span>
                                </div>
                            ) : (
                                <div className={`whitespace-pre-wrap ${entry.className || 'text-gray-300'}`}>
                                    {entry.content}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Input Line */}
                <div className="flex gap-2 mt-2">
                    {!isPasswordInput && (
                        <span className="text-green-400 font-bold flex-shrink-0">
                            {inputPrompt !== null ? inputPrompt : `${user}@${host}:~$`}
                        </span>
                    )}
                    {isPasswordInput && (
                        <span className="text-yellow-400 font-bold flex-shrink-0">
                            password:
                        </span>
                    )}
                    <input
                        ref={inputRef}
                        type={isPasswordInput ? "password" : "text"}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleCommand(currentInput);
                                setCurrentInput('');
                            }
                        }}
                        className="bg-transparent border-none outline-none text-white w-full caret-white"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />
                </div>
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default TerminalSimulator;
