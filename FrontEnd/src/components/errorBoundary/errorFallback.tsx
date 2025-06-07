import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button/button';
import './errorFallbak.scss';

interface Props {
    children: React.ReactNode;
    fallback?: React.ComponentType<FallbackProps>;
}

const DefaultFallback: React.FC<FallbackProps> = ({
    error,
    resetErrorBoundary
}) => (
    <div role="alert" className="error-fallback">
        <h2>Something went wrong:</h2>
        <pre className="whitespace-pre-wrap">{error.message}</pre>
        <Button onClick={resetErrorBoundary} type="danger">
            Try again
        </Button>
    </div>
);

const ErrorBoundaryWrapper: React.FC<Props> = ({
    children,
    fallback = DefaultFallback
}) => {
    const navigate = useNavigate();

    return (
        <ErrorBoundary
            FallbackComponent={fallback}
            onReset={() => {
                navigate('/');
            }}
        >
            {children}
        </ErrorBoundary>
    );
};

export default ErrorBoundaryWrapper;
