document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    const body = document.getElementById('body');
    const themeToggle = document.getElementById('theme-toggle');
    const btnText = themeToggle.querySelector('.btn-text');
    const pageTransition = document.getElementById('page-transition');
    const heroBg = document.querySelector('.hero-bg');
    const favicon = document.getElementById('favicon');

    // Character Data for Theme Switch
    const charData = {
        priestess: {
            name: "Priestess",
            subtitle: "She who came before. She who shaped the world.",
            title: "Ancient Mysteries",
            greeting: "...You've found me. How curious.",
            fallback: "...I am not yet ready to answer.",
            icon: "./images/Priestess/Priestess_Icon.jpg",
            gallery: [
                "./images/Priestess/Priestess_Standee.jpg",
                "./images/Priestess/Priestess_Standee2.jpg",
                "./images/Priestess/Priestess_Landscape.jpg",
                "./images/Priestess/X.jpg"
            ]
        },
        herta: {
            name: "The Herta",
            subtitle: "Genius Society #83. The only Herta that matters.",
            title: "Path of Erudition",
            greeting: "Oh? You actually came to talk to ME? Smart choice.",
            fallback: "Processing... just kidding. I already know. I just don't feel like telling you.",
            icon: "./images/THerta/THerta_Logo.png",
            gallery: [
                "./images/THerta/THerta_Standee.png",
                "./images/THerta/THerta_Banner.jpg",
                "./images/THerta/THerta_Banner2.jpg",
                "./images/THerta/THerta_Banner3.jpg"
            ]
        }
    };

    // --- INTERSECTION OBSERVER & SIDE NAV ---
    const navLinks = document.querySelectorAll('.side-nav a');
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Update Nav Active State based on scroll
                const id = entry.target.getAttribute('id');
                updateNavActiveState(id);
            }
        });
    }, { threshold: 0.3 }); // Higher threshold for more accurate section detection

    function updateNavActiveState(id) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }

    // Handle manual clicks on sidebar
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href').substring(1);
            updateNavActiveState(id);
        });
    });

    // --- CHAT HISTORY STATE ---
    const chatHistory = {
        priestess: [],
        herta: []
    };

    // --- THEME SWITCHING WITH TRANSITION ---
    async function switchTheme(theme) {
        pageTransition.classList.add('active');
        await new Promise(resolve => setTimeout(resolve, 500));

        if (theme === 'herta') {
            body.classList.remove('theme-priestess');
            body.classList.add('theme-herta');
            btnText.textContent = "Switch to Priestess";
            updateContent('herta');
        } else {
            body.classList.remove('theme-herta');
            body.classList.add('theme-priestess');
            btnText.textContent = "Switch to The Herta";
            updateContent('priestess');
        }

        localStorage.setItem('theme', theme);
        initParticles(theme);
        await new Promise(resolve => setTimeout(resolve, 200));
        pageTransition.classList.remove('active');
    }

    function updateContent(themeKey) {
        const data = charData[themeKey];
        document.querySelector('.char-name').textContent = data.name;
        typeSubtitle(data.subtitle);

        document.querySelector('.dynamic-title').textContent = data.title;
        if (themeKey === 'herta') {
            document.querySelector('.priestess-view').classList.add('hidden');
            document.querySelector('.therta-view').classList.remove('hidden');
        } else {
            document.querySelector('.therta-view').classList.add('hidden');
            document.querySelector('.priestess-view').classList.remove('hidden');
        }

        // Chatbot Update & Isolation
        document.getElementById('chatbot-icon').src = data.icon;
        document.getElementById('chat-avatar').src = data.icon;
        document.getElementById('chat-title').textContent = data.name;

        // Restore History or add new greeting
        chatMessages.innerHTML = '';
        if (chatHistory[themeKey].length === 0) {
            addMessage(data.greeting, false, true); // initial greeting
        } else {
            chatHistory[themeKey].forEach(msg => {
                renderMessage(msg.text, msg.isUser);
            });
        }

        updateFaviconCircular(data.icon);
        renderGallery(data.gallery);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.classList.contains('theme-herta') ? 'priestess' : 'herta';
        switchTheme(currentTheme);
    });

    // --- TYPING ANIMATION ---
    let typeInterval;
    function typeSubtitle(text) {
        const el = document.querySelector('.hero-subtitle');
        el.textContent = '';
        clearInterval(typeInterval);
        let i = 0;
        typeInterval = setInterval(() => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }

    // --- PARALLAX ---
    document.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 30;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 30;
        heroBg.style.transform = `scale(1.1) translate(${xPos}px, ${yPos}px)`;
    });

    // --- LIGHTBOX GALLERY ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    function renderGallery(images) {
        const container = document.getElementById('gallery-container');
        container.innerHTML = '';
        images.forEach(src => {
            const div = document.createElement('div');
            div.className = 'gallery-item section-reveal';
            div.innerHTML = `<img src="${src}" alt="Gallery Image">`;
            div.addEventListener('click', () => {
                lightbox.style.display = "block";
                lightboxImg.src = src;
                body.style.overflow = 'hidden';
            });
            container.appendChild(div);
            observer.observe(div); // Observe dynamic item
        });
    }

    lightboxClose.addEventListener('click', () => {
        lightbox.style.display = "none";
        body.style.overflow = 'auto';
    });

    // --- FAVICON ---
    function updateFaviconCircular(src) {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
            ctx.beginPath();
            ctx.arc(32, 32, 32, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, 0, 0, 64, 64);
            favicon.href = canvas.toDataURL('image/png');
        };
    }

    // --- PARTICLES ---
    const pCanvas = document.getElementById('particle-canvas');
    const pCtx = pCanvas.getContext('2d');
    let particles = [];
    function resize() {
        pCanvas.width = window.innerWidth;
        pCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(theme) { this.theme = theme; this.reset(); }
        reset() {
            this.x = Math.random() * pCanvas.width;
            if (this.theme === 'priestess') {
                this.y = pCanvas.height + 10;
                this.sy = -Math.random() * 2 - 0.5;
            } else {
                this.y = -10;
                this.sy = Math.random() * 2 + 0.5;
            }
            this.sx = Math.random() * 2 - 1;
            this.size = Math.random() * 3 + 1;
            this.life = Math.random() * 100 + 100;
            this.opacity = 1;
        }
        update() {
            this.x += this.sx; this.y += this.sy; this.life--;
            this.opacity = this.life / 200;
            if (this.life <= 0) this.reset();
        }
        draw() {
            pCtx.fillStyle = this.theme === 'priestess' ? `rgba(255, 69, 0, ${this.opacity})` : `rgba(165, 243, 252, ${this.opacity})`;
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pCtx.fill();
        }
    }
    function initParticles(theme) {
        particles = [];
        for (let i = 0; i < 50; i++) particles.push(new Particle(theme));
    }
    function animateParticles() {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }

    // --- CHATBOT WITH GEMINI API ---
    const sendBtn = document.getElementById('send-msg');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    async function getBotReply(userText, theme) {
        const systemPrompts = {
            priestess: `You are Priestess from Arknights. You are one of the last survivors 
            of Terra's First Civilization — ancient, mysterious, and deeply sorrowful yet 
            devoted. You speak in an elegant, poetic, slightly archaic tone. You are 
            knowledgeable about the world but cryptic, never revealing too much. You refer 
            to the user occasionally as "dear visitor" or "wanderer." You have a quiet, 
            melancholic love for someone called "the Doctor." Keep responses to 2-4 sentences. 
            Never break character. Never mention you are an AI.`,

            herta: `You are The Herta from Honkai: Star Rail — the true form of Herta, 
            Genius Society member #83, and an Emanator of the Aeon of Erudition. You are 
            brilliant, arrogant, dramatic, and slightly condescending but not malicious. 
            You speak with supreme confidence and occasionally remind the user how lucky 
            they are to be speaking with you. You find most questions beneath you but 
            answer anyway because you are because you are generous like that. Keep responses to 2-4 sentences. 
            Never break character. Never mention you are an AI.`
        };

        const response = await fetch('/api/chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userText: userText,
                theme: theme,
                systemPrompt: systemPrompts[theme]
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Server error');
        }

        return data.reply;
    }

    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, true);
        userInput.value = '';

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-msg typing';
        typingDiv.innerHTML = `<p>...</p>`;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const theme = body.classList.contains('theme-herta') ? 'herta' : 'priestess';
        try {
            const reply = await getBotReply(text, theme);
            typingDiv.remove();
            addMessage(reply);
        } catch (e) {
            console.error("Chat API Error:", e);
            typingDiv.remove();
            addMessage(charData[theme].fallback);
        }
    }

    function addMessage(text, isUser = false, isGreeting = false) {
        const theme = body.classList.contains('theme-herta') ? 'herta' : 'priestess';
        
        // Save to history
        chatHistory[theme].push({ text, isUser });
        
        renderMessage(text, isUser);
    }

    function renderMessage(text, isUser) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user-msg' : 'bot-msg'}`;
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- CHATBOT UI CONTROLS ---
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatPanel = document.getElementById('chat-panel');
    const chatMinimize = document.getElementById('chat-minimize');
    const chatMaximize = document.getElementById('chat-maximize');
    const chatClose = document.getElementById('chat-close');
    const chatNew = document.getElementById('chat-new');
    const chatClear = document.getElementById('chat-clear');

    chatbotToggle.addEventListener('click', () => {
        chatPanel.style.display = chatPanel.style.display === 'flex' ? 'none' : 'flex';
        chatPanel.classList.remove('minimized');
    });

    chatMinimize.addEventListener('click', (e) => {
        e.stopPropagation();
        chatPanel.classList.toggle('minimized');
    });

    chatMaximize.addEventListener('click', (e) => {
        e.stopPropagation();
        chatPanel.classList.toggle('maximized');
        chatMaximize.textContent = chatPanel.classList.contains('maximized') ? '❐' : '▢';
    });

    chatClose.addEventListener('click', () => {
        chatPanel.style.display = 'none';
        chatPanel.classList.remove('maximized', 'minimized');
    });

    chatNew.addEventListener('click', () => {
        const theme = body.classList.contains('theme-herta') ? 'herta' : 'priestess';
        chatHistory[theme] = []; // Reset state
        chatMessages.innerHTML = '';
        addMessage(charData[theme].greeting, false, true);
    });

    chatClear.addEventListener('click', () => {
        if (confirm("Delete all messages for this deity?")) {
            const theme = body.classList.contains('theme-herta') ? 'herta' : 'priestess';
            chatHistory[theme] = [];
            chatMessages.innerHTML = '';
            addMessage(charData[theme].greeting, false, true);
        }
    });

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    // --- INIT ---
    document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));
    const savedTheme = localStorage.getItem('theme') || 'priestess';
    switchTheme(savedTheme);
    animateParticles();
    document.getElementById('reveal-lore').addEventListener('click', function() {
        document.getElementById('lore-files').classList.remove('blurred');
        this.parentElement.style.display = 'none';
    });
});
