// src/utils/admob.ts
import { Capacitor } from '@capacitor/core';
import { InterstitialAd } from 'admob-plus-cordova';

export const showInterstitial = async () => {
    try {
        if (Capacitor.getPlatform() !== 'android') {
        console.log('📴 Not on Android device, skipping ad');
        return;
        }

        console.log('🎯 showInterstitial called');

        const ad = new InterstitialAd({
        adUnitId: 'ca-app-pub-3940256099942544/1033173712', // テストID
        });

        console.log('📦 Ad instance created');
        await ad.load();
        await ad.show();
    } catch (e) {
        console.error('❌ Ad failed to show:', e);
    }
};

