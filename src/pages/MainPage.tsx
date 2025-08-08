import { useState, useEffect } from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserFriends, faStar, faTrashAlt, faRedo } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import loadingMessages from '../utils/loadingMessages';
import sampleTasks from '../data/sampleTasks';

import { showInterstitial } from '../utils/admob';

// ---------------------------------------------
// 🔧 Task 型（sampleTasks の構造に合わせて定義）
// ---------------------------------------------
type Task = {
id: string;
text: string;
image: string;
category: string[];
};

// ---------------------------------------------
// 📘 メインページコンポーネント
// ---------------------------------------------
function MainPage() {

    // --------------------------------
// 🔧 状態管理（State）
// --------------------------------
const [person, setPerson] = useState<'ひとり' | 'ふたり'>('ひとり');
const [task, setTask] = useState<Task | null>(null);
const [isPlaying, setIsPlaying] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [loadingMessage, setLoadingMessage] = useState('');
const [isFavorite, setIsFavorite] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);

// --------------------------------
// ▶ スタート処理（お題表示）
// --------------------------------
const startTask = () => {
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    setLoadingMessage(loadingMessages[randomIndex]);
    setIsLoading(true);

    const skipped = getSkippedTasks();
    const favorites = getFavorites();

    const filteredTasks = sampleTasks.filter(
    t =>
        t.category.includes(person) &&
        !skipped.includes(t.id) &&
        !favorites.includes(t.id.toString())
    );

    if (filteredTasks.length === 0) {
    setLoadingMessage('すべてのお題を削除またはお気に入り済みです。');
    return;
    }

    const randomTask = filteredTasks[Math.floor(Math.random() * filteredTasks.length)];

    setTimeout(() => {
    setTask(randomTask);
    setIsPlaying(true);
    setIsLoading(false);
    }, 5000);
};

// --------------------------------
// 🔁 再挑戦（リセット）
// --------------------------------
const goBack = () => {
    console.log('📢 goBack called');
    showInterstitial(); // ← ここで広告表示
    setIsPlaying(false);
    setTask(null);
};

// --------------------------------
// 🗑 スキップ機能
// --------------------------------
const getSkippedTasks = (): string[] => {
    const stored = localStorage.getItem('skippedTasks');
    return stored ? JSON.parse(stored) : [];
};

const addSkippedTask = (id: string) => {
    const skipped = getSkippedTasks();
    if (!skipped.includes(id)) {
    skipped.push(id);
    localStorage.setItem('skippedTasks', JSON.stringify(skipped));
    }
};

const handleSkip = () => {
    if (task?.id) addSkippedTask(task.id);
    setIsPlaying(false);
    setTask(null);
};

// --------------------------------
// ⭐ お気に入り機能
// --------------------------------
const getFavorites = (): string[] => {
    const stored = localStorage.getItem('favoriteTasks');
    return stored ? JSON.parse(stored) : [];
};

const toggleFavorite = (id: string) => {
    const favorites = getFavorites();
    let updated: string[];

    if (favorites.includes(id)) {
    updated = favorites.filter(favId => favId !== id);
    setIsFavorite(false);
    } else {
    updated = [...favorites, id.toString()];
    setIsFavorite(true);
    }

    localStorage.setItem('favoriteTasks', JSON.stringify(updated));
};

useEffect(() => {
    if (task?.id) {
    const favorites = getFavorites();
    setIsFavorite(favorites.includes(task.id.toString()));
    }
}, [task]);

// --------------------------------
// 📦 レンダリング
// --------------------------------
return (
    <div className="App">
    <div className="glass-overlay"></div>

    {/* 🔒 スキップ確認モーダル */}
    {showConfirm && (
        <div className="modal-overlay">
        <div className="modal">
            <p>今後このお題は出なくなりますが、<br />よろしいですか？</p>
            <div className="modal-buttons">
            <button
                onClick={() => {
                if (task?.id) addSkippedTask(task.id);
                setShowConfirm(false);
                setIsPlaying(false);
                setTask(null);
                }}
            >
                はい
            </button>
            <button onClick={() => setShowConfirm(false)}>いいえ</button>
            </div>
        </div>
        </div>
    )}

    {/* 🔄 ローディング or メイン or お題 */}
    {isLoading ? (
        <p className="loading-text">{loadingMessage}</p>
    ) : !isPlaying ? (
        <>
        {/* 🏠 トップ画面 */}
        <p className="logo-top">
            まだやったことのないことを、<br />今日やってみる。<br />
            脳に、小さなシワが刻まれる体験。<br />
            いつも通りの今日が、特別になる。
        </p>
        <h2>
            <img src="/logo.png" alt="YATTE MITE！ロゴ" className="logo" />
        </h2>

        {/* 🧑‍🤝‍🧑 人数選択 */}
        <div className={`${!isPlaying ? 'show-buttons' : ''}`}>
            {!isPlaying && (
            <div className="button-group">
                <button
                className={person === 'ひとり' ? 'select-button active' : 'select-button'}
                onClick={() => setPerson('ひとり')}
                >
                <FontAwesomeIcon icon={faUser} />
                <span>ひとり</span>
                </button>
                <button
                className={person === 'ふたり' ? 'select-button active' : 'select-button'}
                onClick={() => setPerson('ふたり')}
                >
                <FontAwesomeIcon icon={faUserFriends} />
                <span>ふたり</span>
                </button>
            </div>
            )}
        </div>


        {/* 🚀 スタート */}
        <button className="ready-btn" onClick={startTask}>
            Are you ready?
        </button>

        {/* ⭐ お気に入りリンク */}
        <Link to="/favorites" className="bottom-link">
            <FontAwesomeIcon icon={faStar} /> お気に入り一覧
        </Link>
        </>
    ) : (
        <>
        {/* 🎯 お題表示 */}
        <h2>
            <img src="/logo.png" alt="YATTE MITE！ロゴ" className="logo" />
        </h2>

        <div className="cheki cheki-animated">
            <div
            className="cheki-photo"
            style={{ backgroundImage: `url(${task?.image || '/default.jpg'})` }}
            ></div>
            <div className="cheki-text">{task?.text}</div>
        </div>

        <div className="action-buttons">
            <button
            className={`action-button favorite ${isFavorite ? 'favorited' : ''}`}
            onClick={() => task?.id && toggleFavorite(task.id)}
            >
            <FontAwesomeIcon icon={faStar} />
            </button>
            <button className="action-button skip" onClick={() => setShowConfirm(true)}>
            <FontAwesomeIcon icon={faTrashAlt} />
            </button>
            <button className="action-button retry" onClick={goBack}>
            <FontAwesomeIcon icon={faRedo} />
            </button>
        </div>
        </>
    )}
    </div>
);
}

export default MainPage;
