import React, { Component, ReactNode } from 'react';
import LiquidEther, { LiquidEtherProps } from './LiquidEther';

interface Props extends LiquidEtherProps {
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

class LiquidEtherSafe extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.warn('LiquidEther failed to render (WebGL error):', error.message);
    }

    render() {
        if (this.state.hasError) {
            // Renderizar fallback o nada si WebGL falla
            return this.props.fallback || <div className={this.props.className} style={this.props.style} />;
        }

        try {
            return <LiquidEther {...this.props} />;
        } catch (error) {
            console.warn('LiquidEther render error:', error);
            return this.props.fallback || <div className={this.props.className} style={this.props.style} />;
        }
    }
}

export default LiquidEtherSafe;
