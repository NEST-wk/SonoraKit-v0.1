import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LiquidEther from '../components/LiquidEther';
import AnimatedContent from '../components/AnimatedContent';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        if (formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    username: formData.username
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                navigate('/login');
            } else {
                alert(data.message || 'Error al registrarse');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión. Asegúrate de que el backend esté corriendo.');
        }
    }, [formData, navigate]);

    const handleBackClick = useCallback(() => {
        navigate('/');
    }, [navigate]);

    const handleLoginClick = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    const liquidEtherProps = useMemo(() => ({
        className: "register-background",
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
        className: "register-animated-wrapper"
    }), []);

    return (
        <div className="register-container">
            <LiquidEther {...liquidEtherProps} />
                viscous={30}
                iterationsViscous={32}
                iterationsPoisson={32}
            <LiquidEther {...liquidEtherProps} />

            <AnimatedContent {...animatedContentProps}>
                <div className="register-content">
                    <button 
                        className="back-button"
                        onClick={handleBackClick}
                        aria-label="Volver"
                    >
                        ← Volver
                    </button>

                    <h1 className="register-title">Crear Cuenta</h1>
                    <p className="register-subtitle">
                        Únete a SonoraKit y comienza a usar IA personalizable
                    </p>

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-group">
                            <label htmlFor="username">Nombre de usuario</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Ingresa tu nombre de usuario"
                                required
                            />
                        </div>

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
                                placeholder="Mínimo 6 caracteres"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmar contraseña</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirma tu contraseña"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-full">
                            Registrarse
                        </button>

                        <p className="login-link">
                            ¿Ya tienes cuenta?{' '}
                            <button
                                type="button"
                                onClick={handleLoginClick}
                                className="link-button"
                            >
                                Inicia sesión
                            </button>
                        </p>
                    </form>
                </div>
            </AnimatedContent>
        </div>
    );
};

export default React.memo(RegisterPage);
