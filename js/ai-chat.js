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
                <div class="ai-chat-actions">
                    <button class="ai-chat-action-button" id="aiChatGenerateReport" aria-label="Generate Report">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Generate Report</span>
                    </button>
                    <button class="ai-chat-action-button secondary" id="aiChatNewCalculation" aria-label="Start New Calculation">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Start New Calculation</span>
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
        this.generateReportButton = document.getElementById('aiChatGenerateReport');
        this.newCalculationButton = document.getElementById('aiChatNewCalculation');

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

        // Generate Report button
        this.generateReportButton.addEventListener('click', () => this.generateReport());

        // New Calculation button
        this.newCalculationButton.addEventListener('click', () => this.startNewCalculation());
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

        if (role === 'user') {
            avatar.textContent = '👤';
        } else {
            // Use high-quality logo for AI assistant
            const logoImg = document.createElement('img');
            logoImg.src = 'android-chrome-192x192.png';
            logoImg.alt = 'ZenCalcs';
            logoImg.style.width = '24px';
            logoImg.style.height = '24px';
            logoImg.style.borderRadius = '4px';
            avatar.appendChild(logoImg);
        }

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
        // Enhanced formatting with headings, subheadings, lists, and icons
        let formatted = text
            // Convert ### Subheadings to h4
            .replace(/^### (.+)$/gm, '<h4 class="message-subheading">$1</h4>')
            // Convert ## Headings to h3
            .replace(/^## (.+)$/gm, '<h3 class="message-heading">$1</h3>')
            // Convert # Main Headings to h3 (same as ##)
            .replace(/^# (.+)$/gm, '<h3 class="message-heading">$1</h3>')
            // Convert **bold** to strong
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Convert bullet points with proper icons
            .replace(/^- (.+)$/gm, '<div class="message-bullet">• $1</div>')
            // Convert numbered lists
            .replace(/^\d+\. (.+)$/gm, '<div class="message-numbered">$1</div>')
            // Convert line breaks
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

    async generateReport() {
        if (this.conversationHistory.length === 0) {
            this.addMessage('assistant', 'There are no calculations to report yet. Please start a conversation first.');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Please generate a comprehensive calculation report based on our conversation. Include: 1) A title "ZenCalcs Calculation Report", 2) Today\'s date, 3) Professional executive summary, 4) All inputs provided, 5) All calculation results with clear sections and headings, 6) Key insights and recommendations. Format with ## for main headings and ### for subheadings. Make it professional and suitable for PDF export.',
                    conversationHistory: this.conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.hideLoading();

            // Generate and download PDF
            this.downloadReportAsPDF(data.response);

            // Show confirmation message
            this.addMessage('assistant', '📊 Your calculation report has been generated and downloaded as a PDF file.');

        } catch (error) {
            console.error('Error generating report:', error);
            this.hideLoading();
            this.addMessage('assistant', 'Sorry, I encountered an error generating the report. Please try again later.');
        }
    }

    downloadReportAsPDF(reportContent) {
        // Load html2pdf library dynamically if not already loaded
        if (typeof html2pdf === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = () => this.createPDF(reportContent);
            document.head.appendChild(script);
        } else {
            this.createPDF(reportContent);
        }
    }

    createPDF(reportContent) {
        // Convert markdown-style formatting to HTML
        const formattedContent = this.formatReportForPDF(reportContent);

        // Create a temporary container for the PDF content
        const pdfContainer = document.createElement('div');
        pdfContainer.style.padding = '40px';
        pdfContainer.style.fontFamily = 'Arial, sans-serif';
        pdfContainer.style.fontSize = '12px';
        pdfContainer.style.lineHeight = '1.6';
        pdfContainer.style.color = '#2D3748';
        pdfContainer.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2C5F6F; padding-bottom: 20px;">
                <h1 style="color: #2C5F6F; font-size: 24px; margin: 0;">ZenCalcs</h1>
                <p style="color: #1E40AF; font-size: 14px; margin: 5px 0;">Calculation Report</p>
            </div>
            ${formattedContent}
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 10px; color: #6B7280;">
                <p>Generated by ZenCalcs AI Assistant • https://zencalcs.com</p>
            </div>
        `;

        // PDF options
        const opt = {
            margin: 0.5,
            filename: `ZenCalcs-Report-${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Generate and download PDF
        html2pdf().set(opt).from(pdfContainer).save();
    }

    formatReportForPDF(text) {
        // Enhanced formatting specifically for PDF output
        let formatted = text
            // Convert ## Headings to h2
            .replace(/^## (.+)$/gm, '<h2 style="color: #2C5F6F; font-size: 18px; margin: 20px 0 10px 0; border-bottom: 2px solid #E5E7EB; padding-bottom: 5px;">$1</h2>')
            // Convert ### Subheadings to h3
            .replace(/^### (.+)$/gm, '<h3 style="color: #1E40AF; font-size: 14px; margin: 15px 0 8px 0; font-weight: 600;">$1</h3>')
            // Convert **bold** to strong
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #2C5F6F;">$1</strong>')
            // Convert bullet points
            .replace(/^- (.+)$/gm, '<div style="margin: 5px 0 5px 20px;">• $1</div>')
            // Convert numbered lists
            .replace(/^\d+\. (.+)$/gm, '<div style="margin: 5px 0 5px 20px;">$1</div>')
            // Convert line breaks
            .replace(/\n\n/g, '</p><p style="margin: 10px 0;">')
            .replace(/\n/g, '<br>');

        return `<div style="line-height: 1.6;">${formatted}</div>`;
    }

    startNewCalculation() {
        if (this.conversationHistory.length > 0) {
            const confirmClear = confirm('Are you sure you want to start a new calculation? This will clear the current conversation.');
            if (!confirmClear) return;
        }

        // Clear conversation history
        this.conversationHistory = [];

        // Clear messages except welcome
        this.messagesContainer.innerHTML = '';

        // Show welcome message
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'ai-chat-welcome';
        welcomeDiv.innerHTML = `
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
        `;
        this.messagesContainer.appendChild(welcomeDiv);

        // Clear input
        this.input.value = '';
        this.input.style.height = 'auto';
    }
}

// Initialize the chat assistant when the script loads
const zenCalcsChat = new AIChatAssistant();
