import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LiquidEther from '../components/LiquidEther';
import AnimatedContent from '../components/AnimatedContent';
import './LoginPage.css';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validaciones básicas
        if (formData.password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Guardar usuario en localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                // Redirigir al chat
                navigate('/chat');
            } else {
                alert(data.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión. Asegúrate de que el backend esté corriendo.');
        }
    }, [formData, navigate]);

    const handleBackClick = useCallback(() => {
        navigate('/');
    }, [navigate]);

    const handleRegisterClick = useCallback(() => {
        navigate('/register');
    }, [navigate]);

    const liquidEtherProps = useMemo(() => ({
        className: "login-background",
        colors: ['#5227FF', '#FF9FFC', '#B19EEF'],
        mouseForce: 15,
        cursorSize: 80,
        isViscous: false,
        viscous: 20,
        iterationsViscous: 16,
        iterationsPoisson: 16,
        resolution: 0.3,
        isBounce: false,
        autoDemo: true,
        autoSpeed: 0.4,
        autoIntensity: 1.8,
        takeoverDuration: 0.25,
        autoResumeDelay: 3000,
        autoRampDuration: 0.6
    }), []);

    const animatedContentProps = useMemo(() => ({
        distance: 150,
        direction: 'horizontal' as const,
        reverse: false,
        duration: 1.2,
        ease: "bounce.out",
        initialOpacity: 0.2,
        animateOpacity: true,
        scale: 1.1,
        threshold: 0.2,
        delay: 0.3,
        className: "login-animated-wrapper"
    }), []);

    return (
        <div className="login-container">
            <LiquidEther {...liquidEtherProps} />

            <AnimatedContent {...animatedContentProps}>
                <div className="login-content">
                    <button 
                        className="back-button"
                        onClick={handleBackClick}
                        aria-label="Volver"
                    >
                        ← Volver
                    </button>

                    <h1 className="login-title">Iniciar Sesión</h1>
                    <p className="login-subtitle">
                        Accede a tu cuenta de SonoraKit
                    </p>

                    <div className="demo-credentials">
                        <p><strong>Usuarios de prueba:</strong></p>
                        <p>📧 admin@sonorakit.com / admin123</p>
                        <p>📧 demo@sonorakit.com / demo123</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Ingresa tu contraseña"
                                required
                                minLength={6}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-full">
                            Iniciar Sesión
                        </button>

                        <p className="register-link">
                            ¿No tienes cuenta?{' '}
                            <button
                                type="button"
                                onClick={handleRegisterClick}
                                className="link-button"
                            >
                                Regístrate
                            </button>
                        </p>
                    </form>
                </div>
            </AnimatedContent>
        </div>
    );
};

export default React.memo(LoginPage);
