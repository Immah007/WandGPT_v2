
        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const promptInput = document.getElementById('prompt-input');
            const sendBtn = document.getElementById('send-btn');
            const sendIcon = document.getElementById('send-icon');
            const chatContainer = document.getElementById('chat-container');
            const menuToggle = document.getElementById('menu-toggle');
            const sideMenu = document.getElementById('side-menu');
            const closeMenu = document.getElementById('close-menu');
            const overlay = document.getElementById('overlay');
            const inputContainer = document.getElementById('input-container');
            const themeToggle = document.getElementById('theme-toggle');
            const attachBtn = document.getElementById('attach-btn');
            const searchBtn = document.getElementById('search-btn');
            const reasonBtn = document.getElementById('reason-btn');
            const fileModal = document.getElementById('file-modal');
            const modalClose = document.getElementById('modal-close');
            const selectFileBtn = document.getElementById('select-file-btn');
            const fileInput = document.getElementById('file-input');
            const filePreview = document.getElementById('file-preview');
            const fileThumbnail = document.getElementById('file-thumbnail');
            const fileName = document.getElementById('file-name');
            const cancelFile = document.getElementById('cancel-file');
            const glowWrapper = document.querySelector('.glow-wrapper');
            const glowBorder = document.querySelector('.glow-border');
            
            // State variables
            let isGeneratingResponse = false;
            let currentResponse = '';
            let selectedFile = null;
            
            // Greeting responses
            const greetingResponses = [
                "Hello there! I'm WandGPT, your intelligent assistant. What can I do for you today?",
                "Hi! It's great to meet you. I'm WandGPT, ready to assist with anything you need.",
                "Hey! Thanks for reaching out. I'm WandGPT, your personal AI assistant. How can I help?",
                "Greetings! I'm WandGPT, here to provide information and assistance. What's on your mind?",
                "Welcome! I'm WandGPT, your digital helper. Feel free to ask me anything.",
                "Hola! I'm WandGPT, your AI companion. Ready to assist you with your questions."
            ];
            
            // Check if mobile
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            
            // Initialize
            init();
            
            function init() {
                // Auto-resize textarea
                promptInput.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = (this.scrollHeight) + 'px';
                    
                    // Toggle matte glow when there's text
                    if (this.value.trim() !== '') {
                        glowWrapper.classList.add('glow-matte');
                        sendIcon.classList.add('float');
                    } else {
                        glowWrapper.classList.remove('glow-matte');
                        sendIcon.classList.remove('float');
                    }
                });
                
                // Focus/blur events for input
                promptInput.addEventListener('focus', function() {
                    if (this.value.trim() !== '') {
                        glowWrapper.classList.add('glow-matte');
                    }
                });
                
                promptInput.addEventListener('blur', function() {
                    if (this.value.trim() === '' && !isGeneratingResponse) {
                        glowWrapper.classList.remove('glow-matte');
                    }
                });
                
                // File input handling
                fileInput.addEventListener('change', handleFileSelect);
                selectFileBtn.addEventListener('click', function() {
                    fileInput.click();
                });
                
                cancelFile.addEventListener('click', function() {
                    selectedFile = null;
                    filePreview.classList.remove('visible');
                    fileInput.value = '';
                });
                
                // Set up other event listeners
                setupEventListeners();
            }
            
            function handleFileSelect(event) {
                const file = event.target.files[0];
                if (file) {
                    selectedFile = file;
                    fileName.textContent = file.name;
                    
                    // Create thumbnail for image files
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            fileThumbnail.src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    } else {
                        // Default icon for non-image files
                        fileThumbnail.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE0IDJINmMtMS4xIDAtMiAuOS0yIDJ2MTZjMCAxLjEuOSAyIDIgMmgxMmMxLjEgMCAyLS45IDItMlY4bC02LTZ6bS0yIDE0di0yaDJ2MmgtMnptNC00SDh2LTJoOHYyeiIvPjwvc3ZnPg==';
                    }
                    
                    filePreview.classList.add('visible');
                    fileModal.style.display = 'none';
                }
            }
            
            function setupEventListeners() {
                // Send message function
                sendBtn.addEventListener('click', function() {
                    if (isGeneratingResponse) {
                        cancelResponse();
                    } else {
                        sendMessage();
                    }
                });
                
                promptInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                });
                
                // Menu controls
                menuToggle.addEventListener('click', toggleMenu);
                closeMenu.addEventListener('click', toggleMenu);
                overlay.addEventListener('click', toggleMenu);
                
                // Theme toggle
                themeToggle.addEventListener('click', function() {
                    document.body.classList.toggle('dark-mode');
                    
                    // Update icon and text
                    const icon = this.querySelector('i');
                    const text = this.querySelector('span');
                    
                    if (document.body.classList.contains('dark-mode')) {
                        icon.classList.remove('fa-moon');
                        icon.classList.add('fa-sun');
                        text.textContent = 'Light Mode';
                    } else {
                        icon.classList.remove('fa-sun');
                        icon.classList.add('fa-moon');
                        text.textContent = 'Dark Mode';
                    }
                });
                
                // Attach button functionality
                attachBtn.addEventListener('click', function() {
                    fileModal.style.display = 'flex';
                });
                
                modalClose.addEventListener('click', function() {
                    fileModal.style.display = 'none';
                });
                
                // Search button functionality
                searchBtn.addEventListener('click', function() {
                    alert('This feature is temporarily unavailable');
                });
                
                // Reason button functionality
                reasonBtn.addEventListener('click', function() {
                    alert('This feature is temporarily unavailable');
                });
                
                // Add initial copy functionality
                const initialText = document.querySelector('.streaming-text').textContent;
                const initialCopyBtn = document.querySelector('.message-actions .action-btn:first-child');
                
                initialCopyBtn.addEventListener('click', function() {
                    navigator.clipboard.writeText(initialText).then(() => {
                        const originalHTML = initialCopyBtn.innerHTML;
                        initialCopyBtn.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            initialCopyBtn.innerHTML = originalHTML;
                        }, 2000);
                    });
                });
                
                // Add initial like/dislike functionality
                const initialLikeBtn = document.querySelector('.message-actions .action-btn:nth-child(2)');
                const initialDislikeBtn = document.querySelector('.message-actions .action-btn:nth-child(3)');
                
                initialLikeBtn.addEventListener('click', function() {
                    alert(`Liked this response: "${initialText}"`);
                });
                
                initialDislikeBtn.addEventListener('click', function() {
                    alert(`Disliked this response: "${initialText}"`);
                });
            }
            
            function sendMessage() {
                const messageText = promptInput.value.trim();
                if (messageText === '' || isGeneratingResponse) return;
                
                // Add user message
                const userMessageDiv = document.createElement('div');
                userMessageDiv.innerHTML = `
                    <div class="message user-message">${messageText}</div>
                `;
                chatContainer.appendChild(userMessageDiv);
                
                // Add file preview if attached
                if (selectedFile) {
                    const fileMessageDiv = document.createElement('div');
                    fileMessageDiv.style.alignSelf = 'flex-end';
                    fileMessageDiv.innerHTML = `
                        <div class="message user-message" style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-paperclip"></i>
                            <span>${selectedFile.name}</span>
                        </div>
                    `;
                    chatContainer.appendChild(fileMessageDiv);
                }
                
                promptInput.value = '';
                promptInput.style.height = 'auto';
                selectedFile = null;
                filePreview.classList.remove('visible');
                fileInput.value = '';
                
                // Change states
                isGeneratingResponse = true;
                sendIcon.classList.remove('fa-arrow-up');
                sendIcon.classList.remove('float');
                sendIcon.classList.add('fa-stop');
                sendBtn.classList.add('glow-color');
                glowWrapper.classList.remove('glow-matte');
                
                // Simulate AI response
                generateAIResponse(messageText);
            }
            
            function generateAIResponse(userMessage) {
                let response = '';
                const lowerMessage = userMessage.toLowerCase();
                
                // Check for greetings
                if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
                    lowerMessage.includes('hey') || lowerMessage.includes('hola') || 
                    lowerMessage.includes('greetings')) {
                    // Random greeting response
                    const randomIndex = Math.floor(Math.random() * greetingResponses.length);
                    response = greetingResponses[randomIndex];
                } 
                // Check if user is asking about the AI
                else if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you') || 
                         lowerMessage.includes('your name') || lowerMessage.includes('identify')) {
                    response = "I'm WandGPT, your advanced AI assistant, meticulously crafted in Nairobi by a team of special developers led by Imm. I'm here to help you with information, tasks, and creative ideas. My capabilities will expand once my full engine is connected!";
                }
                // Default response for other messages
                else {
                    response = `Sorry, at the moment, I can't fully comprehend what you meant by "${userMessage}", because my Text to Text generative engine has not been connected yet. Once my engine is connected, I will be able to summarise text, engage in more meaningful conversations, generate images and videos, write code snippets and do more stuff for you. Please reach out to my cretors to access my powerful Text to Text Engine, and get smarter responses and more advanced features. Thank you for using WandGPT!`;
                }
                
                // Display the response
                displayAIResponse(response);
            }
            
            function displayAIResponse(response) {
                currentResponse = response;
                
                // Create message container
                const messageContainer = document.createElement('div');
                
                // Create AI message
                const aiMessage = document.createElement('div');
                aiMessage.classList.add('message', 'ai-message');
                
                const streamingText = document.createElement('div');
                streamingText.classList.add('streaming-text');
                aiMessage.appendChild(streamingText);
                
                messageContainer.appendChild(aiMessage);
                chatContainer.appendChild(messageContainer);
                
                let i = 0;
                const speed = 20; // milliseconds per character
                
                function typeWriter() {
                    if (i < currentResponse.length && isGeneratingResponse) {
                        const charSpan = document.createElement('span');
                        charSpan.textContent = currentResponse.charAt(i);
                        streamingText.appendChild(charSpan);
                        i++;
                        setTimeout(typeWriter, speed);
                        scrollToBottom();
                    } else if (isGeneratingResponse) {
                        // Response complete
                        isGeneratingResponse = false;
                        resetInputState();
                        
                        // Create action buttons
                        const messageActions = document.createElement('div');
                        messageActions.classList.add('message-actions');
                        if (isMobile) messageActions.classList.add('visible');
                        
                        const copyBtn = document.createElement('button');
                        copyBtn.classList.add('action-btn');
                        copyBtn.title = 'Copy';
                        copyBtn.innerHTML = '<i class="far fa-copy"></i>';
                        
                        const likeBtn = document.createElement('button');
                        likeBtn.classList.add('action-btn');
                        likeBtn.title = 'Like';
                        likeBtn.innerHTML = '<i class="far fa-thumbs-up"></i>';
                        
                        const dislikeBtn = document.createElement('button');
                        dislikeBtn.classList.add('action-btn');
                        dislikeBtn.title = 'Dislike';
                        dislikeBtn.innerHTML = '<i class="far fa-thumbs-down"></i>';
                        
                        messageActions.appendChild(copyBtn);
                        messageActions.appendChild(likeBtn);
                        messageActions.appendChild(dislikeBtn);
                        
                        messageContainer.appendChild(messageActions);
                        
                        // Add copy functionality
                        copyBtn.addEventListener('click', function() {
                            navigator.clipboard.writeText(currentResponse).then(() => {
                                const originalHTML = copyBtn.innerHTML;
                                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                                setTimeout(() => {
                                    copyBtn.innerHTML = originalHTML;
                                }, 2000);
                            });
                        });
                        
                        // Add like functionality
                        likeBtn.addEventListener('click', function() {
                            alert(`Liked this response: "${currentResponse}"`);
                        });
                        
                        // Add dislike functionality
                        dislikeBtn.addEventListener('click', function() {
                            alert(`Disliked this response: "${currentResponse}"`);
                        });
                        
                        scrollToBottom();
                    }
                }
                
                typeWriter();
            }
            
            function cancelResponse() {
                isGeneratingResponse = false;
                resetInputState();
            }
            
            function resetInputState() {
                sendIcon.classList.remove('fa-stop');
                sendIcon.classList.remove('glow-color');
                sendIcon.classList.add('fa-arrow-up');
                if (promptInput.value.trim() !== '') {
                    sendIcon.classList.add('float');
                    glowWrapper.classList.add('glow-matte');
                }
            }
            
            function scrollToBottom() {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
            
            function toggleMenu() {
                sideMenu.classList.toggle('open');
                overlay.classList.toggle('active');
            }
        });
