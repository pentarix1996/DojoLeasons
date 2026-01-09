import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TerminalSimulator = ({
    initialUser = "alumno",
    initialHost = "laptop-local",
    fileSystem = {
        '/home/alumno': { type: 'dir', children: ['notas.txt'] },
        '/home/alumno/notas.txt': { type: 'file', content: 'Apuntes secretos de la clase de SSH.' },
        '/home/teacher': { type: 'dir', children: [] },
    },
    onCommandSuccess, // Callback when a command matches a passing criteria
    onBroadcast, // Callback for granular events { type: 'event_name', payload: ... }
    stepCriteria, // { command: 'ssh', args: ['user', 'host'] }
    autoFocus = true
}) => {
    const [history, setHistory] = useState([
        { type: 'output', content: `Bienvenido a ${initialHost}. Escribe 'help' si estás perdido.` }
    ]);
    const [currentInput, setCurrentInput] = useState('');
    const [user, setUser] = useState(initialUser);
    const [host, setHost] = useState(initialHost);
    const [isPasswordInput, setIsPasswordInput] = useState(false);
    const [fs, setFs] = useState(fileSystem);
    const [currentPath, setCurrentPath] = useState('/home/alumno');
    const [pendingSSH, setPendingSSH] = useState(null);
    const [keygenState, setKeygenState] = useState(null);
    const [keysGenerated, setKeysGenerated] = useState(false);
    const [keysCopied, setKeysCopied] = useState(false);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    // Focus management
    useEffect(() => {
        if (autoFocus && inputRef.current) inputRef.current.focus();
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, autoFocus]);

    const handleCommand = (cmdStr) => {
        // Special handling for keygen interactive mode which accepts empty input (defaults)
        if (keygenState) {
            handleKeygenInput(cmdStr.trim());
            return;
        }

        const rawCmd = cmdStr.trim();
        if (!rawCmd) return;

        // Add to history
        if (!isPasswordInput) {
            setHistory(prev => [...prev, { type: 'command', content: rawCmd, user, host }]);
        }

        if (isPasswordInput) {
            handlePassword(rawCmd);
            return;
        }

        if (keygenState) {
            handleKeygenInput(rawCmd);
            return;
        }

        const args = rawCmd.split(' ');
        const cmd = args[0].toLowerCase();

        // Check criteria for lesson progression
        if (checkCriteria(cmd, args)) {
            if (onCommandSuccess) onCommandSuccess(rawCmd);
        }

        // Broadcast command event
        if (onBroadcast) {
            onBroadcast({ type: 'command', command: cmd, full: rawCmd });
        }

        switch (cmd) {
            case 'clear':
                setHistory([]);
                break;
            case 'whoami':
                addToOutput(user);
                break;
            case 'ls':
                handleLs(args);
                break;
            case 'ssh':
                handleSSH(args);
                break;
            case 'ssh-keygen':
                handleKeygenStart(args);
                break;
            case 'ssh-copy-id':
                if (!keysGenerated) {
                    addToOutput("ERROR: No identity found. Run 'ssh-keygen' first to generate your keys.");
                    return;
                }
                if (args[1]) {
                    // Check target validation similar to ssh
                    const target = args[1].split('@');
                    if (target.length !== 2 || target[1] !== '192.168.1.43') {
                        addToOutput("ssh-copy-id: connection failed or invalid host");
                        return;
                    }
                    setPendingSSH({ user: target[0], host: target[1], type: 'copy-id' });
                    setIsPasswordInput(true);
                    addToOutput(`${target[0]}@${target[1]}'s password:`, 'text-white');
                } else {
                    addToOutput("usage: ssh-copy-id user@host");
                }
                break;
            case 'yes':
                if (pendingSSH && pendingSSH.awaitingKeyConfirmation) {
                    addToOutput("Warning: Permanently added '192.168.1.43' (ECDSA) to the list of known hosts.");
                    setPendingSSH({ ...pendingSSH, awaitingKeyConfirmation: false });
                    setIsPasswordInput(true);
                    addToOutput(`${pendingSSH.user}@${pendingSSH.host}'s password:`, 'text-white');
                } else {
                    addToOutput("yes: command not found (unless confirming ssh connection)");
                }
                break;
            case 'exit':
                if (host !== initialHost) {
                    addToOutput(`Connection to ${host} closed.`);
                    setHost(initialHost);
                    setUser(initialUser);
                } else {
                    addToOutput("Logout.");
                    // Reset simulator effectively?
                }
                break;
            case 'cd':
                if (args[1]) handleCd(args[1]);
                else handleCd('/home/alumno'); // Default to home
                break;
            case 'cat':
                if (args[1]) handleCat(args[1]);
                else addToOutput("cat: missing operand");
                break;
            case 'mkdir':
                if (args[1]) handleMkdir(args[1]);
                else addToOutput("mkdir: missing operand");
                break;
            case 'mv':
                if (args.length > 2) handleMove(args[1], args[2]);
                else addToOutput("mv: missing source or destination");
                break;
            case 'echo':
                handleEcho(args, rawCmd);
                break;
            default:
                addToOutput(`${cmd}: command not found`);
        }
    };

    const handleEcho = (args, rawCmd) => {
        // Parse for redirect
        if (rawCmd.includes('>>')) {
            const parts = rawCmd.split('>>');
            const content = parts[0].replace(/^echo\s+/, '').replace(/["']/g, '').trim();
            const target = parts[1].trim();

            if (target.includes('authorized_keys')) {
                if (content.length > 10) { // Simple validation that some key was pasted
                    setKeysCopied(true);
                    addToOutput(""); // Silent success like linux
                } else {
                    addToOutput("echo: key seems too short");
                }
                return;
            }
            // Generic append simulation (not really storing for now unless we need to)
            addToOutput("");
        } else {
            // Standard echo
            const content = rawCmd.replace(/^echo\s+/, '').replace(/["']/g, '').trim();
            addToOutput(content);
        }
    };

    const checkCriteria = (cmd, args) => {
        if (!stepCriteria) return false;
        // Simple exact match check for now, can be expanded
        if (stepCriteria.type === 'ssh_success' && user === 'teacher') return true;
        if (stepCriteria.type === 'ssh_connected' && host === '192.168.1.43') return true; // Fix this criteria check
        if (stepCriteria.command === cmd) return true;
        return false;
    };

    const handleSSH = (args) => {
        if (args.length < 2) {
            addToOutput("usage: ssh user@host");
            return;
        }
        const target = args[1].split('@');
        if (target.length !== 2) {
            addToOutput("ssh: could not resolve hostname");
            return;
        }

        const [targetUser, targetHost] = target;

        // Strict validation
        if (targetHost !== '192.168.1.43') { // Hardcoded for this lesson
            addToOutput(`ssh: connect to host ${targetHost} port 22: Connection timed out`);
            return;
        }

        // If keys are copied, login immediately without password
        if (keysCopied) {
            addToOutput(`Authenticated with partial public key.`);
            finishLogin(targetUser, targetHost);
            return;
        }

        setPendingSSH({ user: targetUser, host: targetHost, awaitingKeyConfirmation: true });
        addToOutput("The authenticity of host '192.168.1.43 (192.168.1.43)' can't be established.");
        addToOutput("ECDSA key fingerprint is SHA256:Kp3...5zE.");
        addToOutput("Are you sure you want to continue connecting (yes/no)?", "text-yellow-400 font-bold");
    };

    const handlePassword = (pass) => {
        setIsPasswordInput(false);
        if (pendingSSH) {
            if (pendingSSH.type === 'copy-id') {
                // Handle ssh-copy-id success
                if (pendingSSH.user === 'alumno' || pendingSSH.user === 'alumno-saiyan') { // Allow both
                    addToOutput("");
                    addToOutput(`Number of key(s) added: 1`);
                    addToOutput(`Now try logging into the machine, with:   "ssh '${pendingSSH.user}@${pendingSSH.host}'"`);
                    addToOutput(`and check to make sure that only the key(s) you wanted were added.`);
                    setKeysCopied(true);
                    setPendingSSH(null);

                    if (onCommandSuccess) onCommandSuccess('ssh-copy-id');
                } else {
                    addToOutput("Permission denied (publickey,password).");
                    setPendingSSH(null);
                }
                return;
            }

            // Normal SSH Login
            // Any password works for "simulated" success unless specified
            finishLogin(pendingSSH.user, pendingSSH.host);
        }
    };

    const finishLogin = (targetUser, targetHost) => {
        addToOutput(""); // Spacer
        addToOutput("Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)");
        addToOutput(" * Documentation:  https://help.ubuntu.com");
        addToOutput(`Last login: ${new Date().toUTCString()} from 192.168.1.10`);

        setUser(targetUser);
        setHost(targetHost);
        setPendingSSH(null);

        if (onCommandSuccess && stepCriteria?.type === 'ssh_connected') {
            onCommandSuccess('connected');
        }
        // Broadcast ssh connection event
        if (onBroadcast) {
            onBroadcast({ type: 'ssh_connected', user: targetUser, host: targetHost });
        }
    };

    const handleKeygenStart = (args) => {
        if (args && args[1] && args[1] !== '-t') {
            // Minimal check
        }
        addToOutput("Generating public/private rsa key pair.");
        addToOutput("Enter file in which to save the key (/home/alumno/.ssh/id_rsa):");
        setKeygenState('file');
    };

    const handleKeygenInput = (val) => {
        if (keygenState === 'file') {
            addToOutput(val || "/home/alumno/.ssh/id_rsa"); // Echo default or value
            addToOutput("Enter passphrase (empty for no passphrase):");
            setKeygenState('passphrase');
        } else if (keygenState === 'passphrase') {
            addToOutput(""); // Don't show passphrase
            addToOutput("Enter same passphrase again:");
            setKeygenState('confirm');
        } else if (keygenState === 'confirm') {
            addToOutput("");
            addToOutput("Your identification has been saved in /home/alumno/.ssh/id_rsa");
            addToOutput("Your public key has been saved in /home/alumno/.ssh/id_rsa.pub");
            addToOutput("The key fingerprint is:");
            addToOutput("SHA256:wF5... randomart image ...");
            setKeygenState(null);
            setKeysGenerated(true);

            // Update File System with .ssh and keys
            setFs(prev => {
                const newFs = { ...prev };
                const homePath = '/home/alumno';
                const sshPath = '/home/alumno/.ssh';

                // Create .ssh dir if not exists
                if (!newFs[sshPath]) {
                    newFs[sshPath] = { type: 'dir', children: [] };
                    // Add to home children if not already there
                    if (newFs[homePath] && !newFs[homePath].children.includes('.ssh')) {
                        newFs[homePath].children = [...newFs[homePath].children, '.ssh'];
                    }
                }

                // Add keys to .ssh
                if (!newFs[sshPath].children.includes('id_rsa')) {
                    newFs[sshPath].children = [...newFs[sshPath].children, 'id_rsa', 'id_rsa.pub'];
                    newFs[`${sshPath}/id_rsa`] = { type: 'file', content: 'PRIVATE KEY CONTENT' };
                    newFs[`${sshPath}/id_rsa.pub`] = { type: 'file', content: 'ssh-rsa AAAA...' };
                }

                return newFs;
            });

            if (onCommandSuccess) onCommandSuccess('ssh-keygen-done');
        }
    };

    const handleLs = (args) => {
        const dir = fs[currentPath];
        if (!dir || dir.type !== 'dir') {
            addToOutput(`ls: cannot access '${currentPath}': No such file or directory`);
            return;
        }

        const showHidden = args && args.some(arg => arg.includes('a'));

        let files = dir.children;

        // Filter hidden files unless -a is present
        if (!showHidden) {
            files = files.filter(f => !f.startsWith('.'));
        }

        if (files.length === 0) {
            // Check if it's empty effective list
            // If we filtered everything, show nothing? or just return
        }

        // Simple listing
        const content = files.join('  ');
        addToOutput(content || ''); // Empty string if no visible files
    };

    const handleMkdir = (dirName) => {
        // Prevent complex paths for this simple sim
        if (dirName.includes('/') || dirName.includes('..')) {
            addToOutput("mkdir: complex paths not supported in this lesson");
            return;
        }

        const newPath = `${currentPath}/${dirName}`;
        if (fs[newPath]) {
            addToOutput(`mkdir: cannot create directory '${dirName}': File exists`);
            return;
        }

        const newFs = { ...fs };
        newFs[newPath] = { type: 'dir', children: [] };
        newFs[currentPath] = {
            ...newFs[currentPath],
            children: [...newFs[currentPath].children, dirName]
        };

        setFs(newFs);
        // addToOutput(""); // Silent success like real linux? or feedback? User asked for "appears in ls" so silent is fine/standard
    };

    const handleCd = (path) => {
        if (path === '..') {
            // Simple parent logic
            const parts = currentPath.split('/');
            if (parts.length > 2) { // don't go above root
                parts.pop();
                setCurrentPath(parts.join('/'));
            }
            return;
        }

        // Relative path support
        const targetPath = path.startsWith('/') ? path : `${currentPath}/${path}`;

        if (fs[targetPath] && fs[targetPath].type === 'dir') {
            setCurrentPath(targetPath);
        } else {
            addToOutput(`bash: cd: ${path}: No such file or directory`);
        }
    };

    const handleMove = (src, dest) => {
        // Very basic implementation: rename in current dir or move to subdir
        if (!fs[currentPath].children.includes(src)) {
            addToOutput(`mv: cannot stat '${src}': No such file or directory`);
            return;
        }

        // Check if dest is an existing directory in current path
        const destPath = `${currentPath}/${dest}`;
        if (fs[destPath] && fs[destPath].type === 'dir') {
            // Move to subdir
            setFs(prev => {
                const newFs = { ...prev };
                // Remove from current
                newFs[currentPath].children = newFs[currentPath].children.filter(c => c !== src);
                // Add to dest
                newFs[destPath].children.push(src);
                return newFs;
            });
            return;
        }

        // Assume rename
        setFs(prev => {
            const newFs = { ...prev };
            // Copy keys/values from 'src' entry if it was tracked (it's not fully tracked for files yet except basic check)
            // Just update children list of current dir
            const updatedChildren = newFs[currentPath].children.map(c => c === src ? dest : c);
            newFs[currentPath].children = updatedChildren;
            return newFs;
        });
    };

    const handleCat = (file) => {
        // Resolve path (simple relative or absolute)
        let targetPath = file.startsWith('/') ? file : `${currentPath}/${file}`;

        // Handle .ssh/id_rsa case from home
        if (targetPath.includes('/.ssh/') && !fs[targetPath]) {
            // Maybe user typed cat .ssh/id_rsa from home
            // currentPath = /home/alumno, file = .ssh/id_rsa -> /home/alumno/.ssh/id_rsa
            // Logic above covers it if appended correctly
        }

        // Clean up double slashes just in case
        targetPath = targetPath.replace('//', '/');

        // Check if direct file exists in fs map (e.g. /home/alumno/notas.txt)
        if (fs[targetPath] && fs[targetPath].type === 'file') {
            addToOutput(fs[targetPath].content);
            return;
        }

        // Check if it's a child of current dir (simplified logic used in other handlers)
        const dir = fs[currentPath];
        if (dir && dir.children.includes(file)) {
            // It's in the children list, but maybe we didn't define the full path key for 'notas.txt'?
            // In initial state: '/home/alumno/notas.txt' is defined.
            // But for keys we defined full path keys.

            // Try constructing full path again
            const checkPath = `${currentPath}/${file}`.replace('//', '/');
            if (fs[checkPath] && fs[checkPath].type === 'file') {
                addToOutput(fs[checkPath].content);
                return;
            }
        }

        // Specific hardcode fallback for compatibility if state was slightly off, but new logic should cover it
        if (file === 'notas.txt' && currentPath === '/home/alumno') {
            addToOutput("Contenido de notas.txt: NO OLVIDAR TRAER CUPCAKES");
            return;
        }

        addToOutput(`cat: ${file}: No such file or directory`);
    };

    const addToOutput = (text, className = "text-gray-300") => {
        setHistory(prev => [...prev, { type: 'output', content: text, className }]);
    };

    return (
        <div
            className="bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden font-mono text-sm border border-white/10 w-full max-w-3xl mx-auto flex flex-col h-[500px]"
            onClick={() => inputRef.current?.focus()}
        >
            {/* Terminal Header */}
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-white/5">
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
                    {!isPasswordInput && !keygenState && (
                        <span className="text-green-400 font-bold flex-shrink-0">
                            {user}@{host}:~$
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
