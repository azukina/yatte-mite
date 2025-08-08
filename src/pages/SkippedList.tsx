import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import sampleTasks from '../data/sampleTasks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrashRestore } from '@fortawesome/free-solid-svg-icons';

    // ---------------------------------------------
    // 🔧 型定義
    // ---------------------------------------------
    type Task = {
    id: string;
    text: string;
    image: string;
    category: string[];
    };

    // ---------------------------------------------
    // 🔧 ローカルストレージからスキップ済みタスクを取得
    // ---------------------------------------------
    const getSkippedTasks = (): string[] => {
    const stored = localStorage.getItem('skippedTasks');
    return stored ? JSON.parse(stored) : [];
    };

    // ---------------------------------------------
    // 📘 削除済みお題一覧ページコンポーネント
    // ---------------------------------------------
    const SkippedList = () => {
    // 🧠 状態管理
    const [skippedTasks, setSkippedTasks] = useState<Task[]>([]);
    const [showConfirm, setShowConfirm] = useState(false); // ✅ モーダル表示制御

    // 🔁 初回読み込み：スキップ済みお題を抽出
    useEffect(() => {
        const skipped = getSkippedTasks();
        const tasks = sampleTasks.filter(task => skipped.includes(task.id));
        setSkippedTasks(tasks);
    }, []);

    // 🔁 削除お題をすべて復活させる
    const handleRestore = () => {
        localStorage.setItem('skippedTasks', JSON.stringify([])); // ローカルストレージ初期化
        setSkippedTasks([]);  // 表示もクリア
        setShowConfirm(false); // モーダル閉じる
    };

    // ---------------------------------------------
    // 📦 レンダリング
    // ---------------------------------------------
    return (
        <div className="App">
        <div className="glass-overlay"></div>

        <div className="skipped-list">
            <h2>削除したお題</h2>

            {/* ✅ モーダル確認ダイアログ */}
            {showConfirm && (
            <div className="modal-overlay">
                <div className="modal">
                <p>
                    削除していたお題が<br />
                    再度ガチャに追加されます。<br />
                    よろしいですか？
                </p>
                <div className="modal-buttons">
                    <button onClick={handleRestore}>はい</button>
                    <button onClick={() => setShowConfirm(false)}>いいえ</button>
                </div>
                </div>
            </div>
            )}

            {/* ✅ 削除復活ボタン */}
            <button onClick={() => setShowConfirm(true)} className="restore-button">
            <FontAwesomeIcon icon={faTrashRestore} /> 削除したお題を復活
            </button>

            {/* ✅ スキップ済みお題の表示 */}
            {skippedTasks.length === 0 ? (
            <p>削除したお題はありません。</p>
            ) : (
            <ul>
                {skippedTasks.map(task => (
                <li key={task.id} className="skipped-task">
                    {task.text}
                </li>
                ))}
            </ul>
            )}
        </div>

        {/* 🔗 戻るリンク */}
        <Link to="/favorites" className="bottom-link">
            <FontAwesomeIcon icon={faArrowLeft} /> 戻る
        </Link>
        </div>
    );
};

export default SkippedList;
