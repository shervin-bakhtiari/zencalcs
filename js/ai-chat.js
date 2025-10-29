/**
 * ZenCalcs AI Chat Assistant
 * Vanilla JavaScript implementation for static sites
 */

class AIChatAssistant {
    constructor() {
        this.conversationHistory = [];
        this.isOpen = false;
        this.isLoading = false;
        this.apiEndpoint = '/.netlify/functions/ai-chat';

        this.init();
    }

    init() {
        // Create chat elements when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createChatElements());
        } else {
            this.createChatElements();
        }
    }

    createChatElements() {
        // Create chat button
        const chatButton = document.createElement('button');
        chatButton.className = 'ai-chat-button';
        chatButton.setAttribute('aria-label', 'Open AI Chat Assistant');
        chatButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        `;
        chatButton.addEventListener('click', () => this.toggleChat());

        // Create chat modal
        const chatModal = document.createElement('div');
        chatModal.className = 'ai-chat-modal';
        chatModal.innerHTML = `
            <div class="ai-chat-header">
                <div class="ai-chat-header-content">
                    <div class="ai-chat-header-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div class="ai-chat-header-text">
                        <h3>AI Calculation Assistant</h3>
                        <p>Powered by Claude</p>
                    </div>
                </div>
                <button class="ai-chat-close" aria-label="Close chat">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="ai-chat-messages" id="aiChatMessages">
                <div class="ai-chat-welcome">
                    <div class="ai-chat-welcome-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h4>Welcome to ZenCalcs AI Assistant</h4>
                    <p>Ask me anything - financial, health, math, or any other calculations!</p>
                    <div class="ai-chat-suggestions">
                        <div class="ai-chat-suggestion" data-suggestion="Calculate monthly payment for a $600,000 mortgage at 5.3% for 25 years">
                            💰 Mortgage payment calculation
                        </div>
                        <div class="ai-chat-suggestion" data-suggestion="What's 15% of $3,450?">
                            🧮 Quick percentage calculation
                        </div>
                        <div class="ai-chat-suggestion" data-suggestion="I'm 35, female, 5'6, 165 lbs. Calculate my BMI and daily calorie needs">
                            🏃 Health & fitness calculations
                        </div>
                        <div class="ai-chat-suggestion" data-suggestion="Help me calculate the area of a triangle with sides 5, 7, and 8">
                            📐 Geometry problem
                        </div>
                    </div>
                </div>
            </div>
            <div class="ai-chat-input-container">
                <div class="ai-chat-input-wrapper">
                    <textarea
                        id="aiChatInput"
                        class="ai-chat-input"
                        placeholder="Ask me to calculate something..."
                        rows="1"
                    ></textarea>
                    <button class="ai-chat-send-button" id="aiChatSend" aria-label="Send message">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Append to body
        document.body.appendChild(chatButton);
        document.body.appendChild(chatModal);

        // Store references
        this.chatButton = chatButton;
        this.chatModal = chatModal;
        this.messagesContainer = document.getElementById('aiChatMessages');
        this.input = document.getElementById('aiChatInput');
        this.sendButton = document.getElementById('aiChatSend');

        // Attach event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Close button
        const closeButton = this.chatModal.querySelector('.ai-chat-close');
        closeButton.addEventListener('click', () => this.toggleChat());

        // Send button
        this.sendButton.addEventListener('click', () => this.sendMessage());

        // Input field - Enter to send, Shift+Enter for new line
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.input.addEventListener('input', () => {
            this.input.style.height = 'auto';
            this.input.style.height = Math.min(this.input.scrollHeight, 100) + 'px';
        });

        // Suggestion clicks
        this.messagesContainer.addEventListener('click', (e) => {
            const suggestion = e.target.closest('.ai-chat-suggestion');
            if (suggestion) {
                const text = suggestion.getAttribute('data-suggestion');
                this.input.value = text;
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatModal.classList.toggle('open');
        this.chatButton.classList.toggle('open');

        if (this.isOpen) {
            this.input.focus();
        }
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isLoading) return;

        // Clear input
        this.input.value = '';
        this.input.style.height = 'auto';

        // Remove welcome message if it exists
        const welcomeMsg = this.messagesContainer.querySelector('.ai-chat-welcome');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }

        // Add user message
        this.addMessage('user', message);

        // Add loading indicator
        this.showLoading();

        // Prepare conversation history
        const conversationHistory = this.conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        try {
            // Call API
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Remove loading indicator
            this.hideLoading();

            // Add assistant response
            this.addMessage('assistant', data.response);

            // Update conversation history
            this.conversationHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: data.response }
            );

        } catch (error) {
            console.error('Error sending message:', error);
            this.hideLoading();
            this.addMessage('assistant', 'Sorry, I encountered an error. Please try again later.');
        }
    }

    addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-chat-message ${role}`;

        const avatar = document.createElement('div');
        avatar.className = 'ai-chat-message-avatar';
        avatar.textContent = role === 'user' ? '👤' : '🤖';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'ai-chat-message-content';

        // Format the content (simple markdown-like formatting)
        contentDiv.innerHTML = this.formatMessage(content);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Simple formatting: **bold** and line breaks
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        return formatted;
    }

    showLoading() {
        this.isLoading = true;
        this.sendButton.disabled = true;

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'ai-chat-loading';
        loadingDiv.id = 'aiChatLoading';
        loadingDiv.innerHTML = `
            <div class="ai-chat-loading-avatar"></div>
            <div class="ai-chat-loading-dots">
                <div class="ai-chat-loading-dot"></div>
                <div class="ai-chat-loading-dot"></div>
                <div class="ai-chat-loading-dot"></div>
            </div>
        `;

        this.messagesContainer.appendChild(loadingDiv);
        this.scrollToBottom();
    }

    hideLoading() {
        this.isLoading = false;
        this.sendButton.disabled = false;

        const loadingDiv = document.getElementById('aiChatLoading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }
}

// Initialize the chat assistant when the script loads
const zenCalcsChat = new AIChatAssistant();
