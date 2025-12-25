import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkVeil from '../components/DarkVeil';
import MinimalMenu from '../components/MinimalMenu';
import { useTheme } from '../hooks/useTheme';
import Logo from '../assets/logos/file.svg';
import './ChatPage.css';

// API URL - usa la variable de entorno o localhost como fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    lastUpdated: Date;
}

interface ModelConfig {
    provider: string;
    model: string;
    apiKey: string;
}

interface Provider {
    id: string;
    name: string;
}

interface Model {
    id: string;
    name: string;
}

const ChatPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentTheme } = useTheme();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [modelConfig, setModelConfig] = useState<ModelConfig>({
        provider: '',
        model: '',
        apiKey: ''
    });
    const [providers, setProviders] = useState<Provider[]>([]);
    const [availableModels, setAvailableModels] = useState<Model[]>([]);
    const [loadingModels, setLoadingModels] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Cargar conversaciones guardadas al iniciar
    useEffect(() => {
        const savedConversations = localStorage.getItem('conversations');
        if (savedConversations) {
            const parsed = JSON.parse(savedConversations);
            // Convertir strings de fecha a objetos Date
            const conversationsWithDates = parsed.map((conv: any) => ({
                ...conv,
                lastUpdated: new Date(conv.lastUpdated),
                messages: conv.messages.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }))
            }));
            setConversations(conversationsWithDates);
            
            // Cargar la última conversación
            if (conversationsWithDates.length > 0) {
                const lastConv = conversationsWithDates[0];
                setCurrentConversationId(lastConv.id);
                setMessages(lastConv.messages);
            }
        }
    }, []);

    // Guardar conversación actual cuando cambian los mensajes
    useEffect(() => {
        if (messages.length > 0) {
            saveCurrentConversation();
        }
    }, [messages]);

    const saveCurrentConversation = () => {
        if (messages.length === 0) return;

        const title = messages[0]?.content.slice(0, 50) || 'Nueva conversación';
        
        const updatedConversations = [...conversations];
        const existingIndex = updatedConversations.findIndex(c => c.id === currentConversationId);

        const conversation: Conversation = {
            id: currentConversationId || Date.now().toString(),
            title,
            messages,
            lastUpdated: new Date()
        };

        if (existingIndex >= 0) {
            updatedConversations[existingIndex] = conversation;
        } else {
            updatedConversations.unshift(conversation);
            setCurrentConversationId(conversation.id);
        }

        setConversations(updatedConversations);
        localStorage.setItem('conversations', JSON.stringify(updatedConversations));
    };

    const loadConversation = (conversationId: string) => {
        const conv = conversations.find(c => c.id === conversationId);
        if (conv) {
            setCurrentConversationId(conv.id);
            setMessages(conv.messages);
        }
    };

    const deleteConversation = (conversationId: string) => {
        const updatedConversations = conversations.filter(c => c.id !== conversationId);
        setConversations(updatedConversations);
        localStorage.setItem('conversations', JSON.stringify(updatedConversations));
        
        if (currentConversationId === conversationId) {
            setCurrentConversationId(null);
            setMessages([]);
        }
    };

    const startNewConversation = () => {
        setCurrentConversationId(null);
        setMessages([]);
    };

    useEffect(() => {
        // Verificar si hay configuración guardada
        const savedConfig = localStorage.getItem('modelConfig');
        if (savedConfig) {
            setModelConfig(JSON.parse(savedConfig));
        } else {
            setShowConfig(true);
        }

        // Cargar proveedores
        fetchProviders();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Cargar modelos cuando cambia el proveedor
    useEffect(() => {
        if (modelConfig.provider) {
            fetchModels(modelConfig.provider);
        } else {
            setAvailableModels([]);
        }
    }, [modelConfig.provider]);

    const fetchProviders = async () => {
        try {
            const response = await fetch(`${API_URL}/api/providers`);
            if (!response.ok) throw new Error('Error al cargar proveedores');
            const data = await response.json();
            setProviders(data.providers || []);
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
            // Fallback: usar lista estática si el backend no responde
            setProviders([
                { id: "openai", name: "OpenAI" },
                { id: "anthropic", name: "Anthropic (Claude)" },
                { id: "google", name: "Google (Gemini)" },
                { id: "mistral", name: "Mistral AI" },
                { id: "cohere", name: "Cohere" },
                { id: "groq", name: "Groq" },
                { id: "openrouter", name: "OpenRouter" }
            ]);
        }
    };

    const fetchModels = async (provider: string) => {
        setLoadingModels(true);
        try {
            const response = await fetch(`${API_URL}/api/models/${provider}`);
            if (!response.ok) throw new Error('Error al cargar modelos');
            const data = await response.json();
            setAvailableModels(data.models || []);
        } catch (error) {
            console.error('Error al cargar modelos:', error);
            setAvailableModels([]);
        } finally {
            setLoadingModels(false);
        }
    };

    const handleSendMessage = useCallback(async () => {
        if (!inputMessage.trim() || isLoading) return;

        if (!modelConfig.apiKey) {
            alert('Por favor configura tu API key primero');
            setShowConfig(true);
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Formatear el historial para el backend (solo role y content)
            const formattedHistory = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMessage,
                    config: modelConfig,
                    history: formattedHistory
                })
            });

            if (!response.ok) throw new Error('Error en la respuesta');

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al comunicarse con el modelo. Verifica tu configuración.');
        } finally {
            setIsLoading(false);
        }
    }, [inputMessage, isLoading, modelConfig, messages]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const handleSaveConfig = useCallback(() => {
        if (!modelConfig.apiKey || !modelConfig.provider || !modelConfig.model) {
            alert('Por favor completa todos los campos');
            return;
        }
        localStorage.setItem('modelConfig', JSON.stringify(modelConfig));
        setShowConfig(false);
    }, [modelConfig]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('modelConfig');
        navigate('/');
    }, [navigate]);

    const handleViewProfile = useCallback(() => {
        navigate('/profile');
    }, [navigate]);

    return (
        <div className="chat-page">
            {/* Sidebar */}
            <aside className="chat-sidebar">
                <div className="sidebar-header">
                    <img src={Logo} alt="SonoraKit Logo" className="sidebar-logo" />
                </div>

                <div className="sidebar-content">
                    <button className="sidebar-btn" onClick={startNewConversation}>
                        + Nueva Conversación
                    </button>

                    <div className="conversations-list">
                        <h3 className="conversations-title">Historial</h3>
                        {conversations.length === 0 ? (
                            <p className="empty-conversations">No hay conversaciones guardadas</p>
                        ) : (
                            conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    className={`conversation-item ${currentConversationId === conv.id ? 'active' : ''}`}
                                >
                                    <button
                                        className="conversation-btn"
                                        onClick={() => loadConversation(conv.id)}
                                        title={conv.title}
                                    >
                                        {conv.title}
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('¿Eliminar esta conversación?')) {
                                                deleteConversation(conv.id);
                                            }
                                        }}
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <button className="sidebar-btn" onClick={() => setShowConfig(true)}>
                        ⚙️ Configuración
                    </button>
                </div>

                <div className="sidebar-footer">
                    <div className="profile-section">
                        <button
                            className="profile-btn"
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        >
                            <div className="profile-icon">👤</div>
                            <div className="profile-info">
                                <span className="profile-name">Usuario</span>
                                <span className="profile-email">user@example.com</span>
                            </div>
                            <span className="dropdown-arrow">{showProfileDropdown ? '▲' : '▼'}</span>
                        </button>

                        {showProfileDropdown && (
                            <div className="profile-dropdown">
                                <button className="dropdown-item" onClick={handleViewProfile}>
                                    👁️ Ver Perfil
                                </button>
                                <button className="dropdown-item logout" onClick={handleLogout}>
                                    🚪 Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="chat-main">
                {/* Background DarkVeil */}
                <div className="chat-background">
                    <DarkVeil {...currentTheme.darkVeil} />
                </div>

                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <h3>¡Bienvenido a SonoraKit!</h3>
                            <p>Comienza una conversación con tu modelo de IA</p>
                        </div>
                    ) : (
                        messages.map(message => (
                            <div key={message.id} className={`message ${message.role}`}>
                                <div className="message-content">
                                    {message.content}
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="message assistant">
                            <div className="message-content loading">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-container">
                    <textarea
                        className="chat-input"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe tu mensaje..."
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        className="send-button"
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                    >
                        Enviar
                    </button>
                </div>
            </main>

            {/* Config Modal */}
            {showConfig && (
                <div className="modal-overlay" onClick={() => setShowConfig(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Configuración del Modelo</h2>

                        <div className="form-group">
                            <label>Proveedor</label>
                            <select
                                value={modelConfig.provider}
                                onChange={(e) => setModelConfig(prev => ({
                                    ...prev,
                                    provider: e.target.value,
                                    model: '' // Reset model when provider changes
                                }))}
                            >
                                <option value="">Selecciona un proveedor</option>
                                {providers?.map(provider => (
                                    <option key={provider.id} value={provider.id}>
                                        {provider.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Modelo</label>
                            <select
                                value={modelConfig.model}
                                onChange={(e) => setModelConfig(prev => ({ ...prev, model: e.target.value }))}
                                disabled={!modelConfig.provider || loadingModels}
                            >
                                <option value="">
                                    {!modelConfig.provider
                                        ? 'Primero selecciona un proveedor'
                                        : loadingModels
                                            ? 'Cargando modelos...'
                                            : 'Selecciona un modelo'}
                                </option>
                                {availableModels?.map(model => (
                                    <option key={model.id} value={model.id}>
                                        {model.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>API Key</label>
                            <input
                                type="password"
                                value={modelConfig.apiKey}
                                onChange={(e) => setModelConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                                placeholder="Ingresa tu API key"
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowConfig(false)}>
                                Cancelar
                            </button>
                            <button className="btn btn-primary" onClick={handleSaveConfig}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Menú minimalista */}
            <MinimalMenu
                onNavigateToProfile={handleViewProfile}
                showProfileOption={true}
                showChatOption={false}
            />
        </div>
    );
};

export default React.memo(ChatPage);
