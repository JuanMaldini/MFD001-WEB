
export interface VagonCommand {
    [key: string]: any;
}

export interface VagonResponse {
    [key: string]: any;
}

declare global {
    interface Window {
        vagon: {
            emitUIInteraction: (payload: any) => void;
            emitCommand: (command: string) => void;
            onResponse: (callback: (response: any) => void) => void;
            sendApplicationMessage: (message: any) => void;
            isConnected: () => boolean;
            setQuality: (quality: string) => void;
            resizeFrame: () => void;
            enableGameMode: () => void;
            disableGameMode: () => void;
            setVideoVolume: (volume: number) => void;
        };
    }
}
