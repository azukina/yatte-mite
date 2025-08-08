import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import sampleTasks from "../data/sampleTasks";

    // ---------------------------------------------
    // 🔧 ローカルストレージ操作ユーティリティ
    // ---------------------------------------------
    const getFavorites = (): string[] => {
    const stored = localStorage.getItem("favoriteTasks");
    return stored ? JSON.parse(stored) : [];
    };

    const addSkippedTask = (id: string) => {
    const skippedStored = localStorage.getItem("skippedTasks");
    const skipped: string[] = skippedStored ? JSON.parse(skippedStored) : [];

    if (!skipped.includes(id)) {
        skipped.push(id);
        localStorage.setItem("skippedTasks", JSON.stringify(skipped));
    }

    // ✅ スキップされたお題はお気に入りからも削除
    const favStored = localStorage.getItem("favoriteTasks");
    const favorites: string[] = favStored ? JSON.parse(favStored) : [];

    const updatedFavorites = favorites.filter(favId => favId !== id);
    localStorage.setItem("favoriteTasks", JSON.stringify(updatedFavorites));
    };

    // ---------------------------------------------
    // 📘 Task 詳細ページ
    // ---------------------------------------------
    const TaskDetailPage = () => {
    // 🔁 URLパラメータ・ナビゲーション取得
    const { id } = useParams(); // string型
    const navigate = useNavigate();

    // 📌 対象お題を取得
    const task = sampleTasks.find(t => t.id.toString() === id);

    // 🧠 状態管理
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);

    // 初期化：お気に入り取得
    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    // ❌ 該当タスクがなければエラー表示
    if (!task) return <p>お題が見つかりませんでした。</p>;

    // ⭐ お気に入り判定
    const isFavorite = favorites.includes(task.id.toString());

    // ⭐ お気に入りの追加・削除切替
    const toggleFavorite = (id: string) => {
        const updated = isFavorite
        ? favorites.filter(favId => favId !== id)
        : [...favorites, id];

        localStorage.setItem("favoriteTasks", JSON.stringify(updated));
        setFavorites(updated);
    };

    // ---------------------------------------------
    // 📦 JSX レンダリング
    // ---------------------------------------------
    return (
        <div className="App">
        <div className="glass-overlay"></div>

        {/* ✅ お題削除モーダル */}
        {showConfirm && (
            <div className="modal-overlay">
            <div className="modal">
                <p>
                今後このお題は出なくなりますが、<br />
                よろしいですか？
                </p>
                <div className="modal-buttons">
                <button
                    onClick={() => {
                    if (id) addSkippedTask(id);
                    setShowConfirm(false);
                    navigate("/favorites");
                    }}
                >
                    はい
                </button>
                <button onClick={() => setShowConfirm(false)}>いいえ</button>
                </div>
            </div>
            </div>
        )}

        {/* ✅ ロゴ */}
        <h2>
            <img src="/logo.png" alt="YATTE MITE！ロゴ" className="logo" />
        </h2>

        {/* ✅ チェキ風表示 */}
        <div className="cheki cheki-animated">
            <div
            className="cheki-photo"
            style={{
                backgroundImage: `url(${task.image || "/default.jpg"})`,
            }}
            ></div>
            <div className="cheki-text">{task.text}</div>
        </div>

        {/* ✅ アクションボタン */}
        <div className="action-buttons">
            <button
            className={`action-button favorite ${isFavorite ? "favorited" : ""}`}
            onClick={() => toggleFavorite(task.id)}
            >
            <FontAwesomeIcon icon={faStar} />
            </button>

            <button
            className="action-button skip"
            onClick={() => setShowConfirm(true)}
            >
            <FontAwesomeIcon icon={faTrashAlt} />
            </button>
        </div>

        {/* ✅ 戻るリンク */}
        <Link to="/favorites" className="bottom-link">
            <FontAwesomeIcon icon={faArrowLeft} /> 戻る
        </Link>
        </div>
    );
};

export default TaskDetailPage;
