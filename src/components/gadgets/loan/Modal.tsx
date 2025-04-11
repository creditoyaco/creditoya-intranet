import { ReactNode } from "react";

interface ModalWrapperProps {
    children: ReactNode;
    onClose: () => void;
}

export const ModalWrapper = ({ children, onClose }: ModalWrapperProps) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Fondo con blur */}
            <div
                className="absolute inset-0 backdrop-blur-sm bg-white/30"
                onClick={onClose}
            ></div>
            {children}
        </div>
    );
};