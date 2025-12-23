import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/chat');
    };

    return (
        <div className="profile-page">
            {/* Header/Navbar */}
            <div className="profile-navbar">
                <button className="back-button" onClick={handleBack}>
                    ← Volver al Chat
                </button>
                <h1 className="profile-title">Mi Perfil</h1>
                <div></div>
            </div>

            {/* Main Content */}
            <div className="profile-main">
                {/* Sidebar con Avatar y Stats */}
                <aside className="profile-sidebar">
                    <div className="profile-card">
                        <div className="profile-avatar-large">👤</div>
                        <h2 className="profile-username">Usuario</h2>
                        <p className="profile-email-text">user@example.com</p>
                        <div className="profile-badge">Miembro desde Dic 2025</div>
                    </div>

                    <div className="stats-card">
                        <h3>Estadísticas</h3>
                        <div className="stat-item">
                            <span className="stat-label">Conversaciones</span>
                            <span className="stat-value">24</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Mensajes enviados</span>
                            <span className="stat-value">156</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Tiempo activo</span>
                            <span className="stat-value">12h 45m</span>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <div className="profile-content-area">
                    {/* Resumen/Dashboard */}
                    <section className="dashboard-section">
                        <h2>Resumen de Cuenta</h2>
                        <div className="dashboard-grid">
                            <div className="dashboard-card">
                                <div className="card-icon">💬</div>
                                <div className="card-content">
                                    <h3>Última Conversación</h3>
                                    <p>Hace 2 horas</p>
                                </div>
                            </div>
                            <div className="dashboard-card">
                                <div className="card-icon">🤖</div>
                                <div className="card-content">
                                    <h3>Modelo Actual</h3>
                                    <p>GPT-4</p>
                                </div>
                            </div>
                            <div className="dashboard-card">
                                <div className="card-icon">⚡</div>
                                <div className="card-content">
                                    <h3>API Key</h3>
                                    <p>Configurada</p>
                                </div>
                            </div>
                            <div className="dashboard-card">
                                <div className="card-icon">🎯</div>
                                <div className="card-content">
                                    <h3>Estado</h3>
                                    <p className="status-active">Activo</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Información Personal */}
                    <section className="info-section">
                        <h2>Información Personal</h2>
                        <div className="info-grid">
                            <div className="info-field">
                                <label>Nombre Completo</label>
                                <input type="text" defaultValue="Usuario" placeholder="Tu nombre" />
                            </div>
                            <div className="info-field">
                                <label>Nombre de Usuario</label>
                                <input type="text" defaultValue="usuario123" placeholder="Tu usuario" />
                            </div>
                            <div className="info-field">
                                <label>Correo Electrónico</label>
                                <input type="email" defaultValue="user@example.com" placeholder="tu@email.com" />
                            </div>
                            <div className="info-field">
                                <label>Teléfono</label>
                                <input type="tel" placeholder="+52 555 123 4567" />
                            </div>
                        </div>
                    </section>

                    {/* Seguridad */}
                    <section className="security-section">
                        <h2>Seguridad</h2>
                        <div className="security-items">
                            <div className="security-item">
                                <div className="security-info">
                                    <h3>Contraseña</h3>
                                    <p>Última actualización: Hace 30 días</p>
                                </div>
                                <button className="action-btn">Cambiar</button>
                            </div>
                            <div className="security-item">
                                <div className="security-info">
                                    <h3>Autenticación de Dos Factores</h3>
                                    <p>Agrega una capa extra de seguridad</p>
                                </div>
                                <button className="action-btn secondary">Activar</button>
                            </div>
                        </div>
                    </section>

                    {/* Acciones */}
                    <div className="actions-bar">
                        <button className="save-btn-main">Guardar Cambios</button>
                        <button className="cancel-btn-main" onClick={handleBack}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
