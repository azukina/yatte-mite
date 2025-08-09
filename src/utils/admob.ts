// src/utils/admob.ts
import { Capacitor } from '@capacitor/core';
import { AdMobPlus, InterstitialAd } from '@admob-plus/capacitor';

let interstitial: InterstitialAd | null = null;
let isLoaded = false;
let isLoading = false;
let listenersBound = false;

// 2回に1回だけ表示（永続化しておく）
const getCount = () => Number(localStorage.getItem('adShowCount') ?? '0');
const setCount = (n: number) => localStorage.setItem('adShowCount', String(n));

export const initAdMob = () => {
  if (Capacitor.getPlatform() !== 'android') return;

  document.addEventListener('deviceready', async () => {
    try {
      await AdMobPlus.start();

      interstitial = new InterstitialAd({
        adUnitId: 'ca-app-pub-3940256099942544/1033173712', // テストID
      });

      if (!listenersBound) {
        AdMobPlus.addListener('interstitial.load', () => {
          isLoaded = true;
          isLoading = false;
          console.log('✅ interstitial loaded');
        });
        AdMobPlus.addListener('interstitial.loadfail', (e) => {
          isLoaded = false;
          isLoading = false;
          console.error('⚠️ load fail:', e);
        });
        AdMobPlus.addListener('interstitial.dismiss', () => {
          console.log('🚪 dismissed -> preload next');
          isLoaded = false;
          void preload();
        });
        AdMobPlus.addListener('interstitial.showfail', (e) => {
          console.error('⚠️ show fail:', e);
        });
        listenersBound = true;
      }

      // 起動時にプリロード
      void preload();
    } catch (e) {
      console.error('❌ AdMob init failed:', e);
    }
  });
};

const preload = async () => {
  if (!interstitial || isLoaded || isLoading) return;
  try {
    isLoading = true;
    console.log('📦 interstitial.load()');
    await interstitial.load();
  } catch (e) {
    isLoading = false;
    console.error('❌ preload failed:', e);
  }
};

// 戻り値: 表示したら true / スキップや未ロードなら false
export const showInterstitial = async (): Promise<boolean> => {
  if (!interstitial) return false;

  // 2回に1回だけ表示（奇数回はスキップ）
  const next = getCount() + 1;
  setCount(next);
  if (next % 2 === 1) {
    console.log('↩️ 2回に1回ルール: 今回はスキップ');
    // 次のチャンスのために仕込んどく
    void preload();
    return false;
  }

  // すぐ出せないなら今回は出さず、次に備える（“待ち”を作らない）
  if (!isLoaded) {
    console.log('⏳ not loaded yet -> preload and skip this time');
    void preload();
    return false;
  }

  try {
    await interstitial.show();
    isLoaded = false;
    // 次のためにまたプリロード
    void preload();
    return true;
  } catch (e) {
    console.error('❌ show failed:', e);
    // 失敗時も次に備える
    void preload();
    return false;
  }
};
