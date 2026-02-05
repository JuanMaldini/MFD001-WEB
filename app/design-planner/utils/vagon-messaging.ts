
/**
 * Vagon.io Messaging Utility
 * Reference: https://docs.vagon.io/streams/integrations/client-side-communication/javascript-sdk
 */

export function emitUIInteraction(payload: any): void {
    if (typeof window !== 'undefined' && window.vagon) {
        console.log("[Vagon] Sending UI Interaction:", JSON.stringify(payload));
        window.vagon.emitUIInteraction(payload);
    } else {
        console.warn("[Vagon] SDK not initialized or window not available");
    }
}

export function emitCommand(command: string): void {
    if (typeof window !== 'undefined' && window.vagon) {
        console.log("[Vagon] Sending Command:", command);
        window.vagon.emitCommand(command);
    } else {
        console.warn("[Vagon] SDK not initialized or window not available");
    }
}

/**
 * Standard dynamic command for the application.
 * Follows Vagon's direct payload structure.
 */
export function sendDynamicCommand(category: string, action: string, value: any): void {
    const payload = {
        Category: category,
        Action: action,
        Value: value
    };
    emitUIInteraction(payload);
}

export function setQuality(quality: "standard" | "moderate" | "high"): void {
    if (typeof window !== 'undefined' && window.vagon) {
        window.vagon.setQuality?.(quality);
    }
}

export function resizeFrame(): void {
    if (typeof window !== 'undefined' && window.vagon) {
        window.vagon.resizeFrame?.();
    }
}

export function setGameMode(enabled: boolean): void {
    if (typeof window !== 'undefined' && window.vagon) {
        if (enabled) window.vagon.enableGameMode?.();
        else window.vagon.disableGameMode?.();
    }
}

export function setVolume(volume: number): void {
    if (typeof window !== 'undefined' && window.vagon) {
        window.vagon.setVideoVolume?.(volume);
    }
}
