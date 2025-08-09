declare namespace admob {
    class InterstitialAd {
        constructor(opts: { adUnitId: string });
        load(): Promise<void>;
        show(): Promise<void>;
        on(
        event: string,
        callback: (...args: any[]) => void
        ): void;
    }
    function start(): Promise<void>;
}
