import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LiquidEther from '../components/LiquidEther';
import './LandingPage.css';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleRegisterClick = useCallback(() => {
        navigate('/register');
    }, [navigate]);

    const handleLoginClick = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    const liquidEtherProps = useMemo(() => ({
        className: "landing-background",
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

    return (
        <div className="landing-container">
            <LiquidEther {...liquidEtherProps} />

            <div className="landing-content">
                <h1 className="landing-title">SonoraKit</h1>
                <p className="landing-subtitle">
                    Tu asistente de IA personalizable. Usa cualquier modelo de lenguaje con tu propia API key.
                </p>

                <div className="landing-actions">
                    <button className="btn btn-primary" onClick={handleRegisterClick}>
                        Comenzar
                    </button>
                    <button className="btn btn-secondary" onClick={handleLoginClick}>
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(LandingPage);
