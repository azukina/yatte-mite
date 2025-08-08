import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sampleTasks from '../data/sampleTasks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

// ---------------------------------------------
// 🔧 Task 型定義（sampleTasks の構造に合わせる）
// ---------------------------------------------
type Task = {
  id: string;
  text: string;
  image: string;
  category: string[];
};

// ---------------------------------------------
// 🔧 ローカルストレージ取得関数（型付き）
// ---------------------------------------------
const getFavorites = (): string[] => {
  const stored = localStorage.getItem('favoriteTasks');
  return stored ? JSON.parse(stored) : [];
};

const getSkipped = (): string[] => {
  const stored = localStorage.getItem('skippedTasks');
  return stored ? JSON.parse(stored) : [];
};

// ---------------------------------------------
// 📘 お気に入り一覧ページコンポーネント
// ---------------------------------------------
const FavoriteList = () => {
  // 🧠 状態管理（string[]）
  const [favorites, setFavorites] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);

  // 🔁 初回のみローカルストレージから取得
  useEffect(() => {
    setFavorites(getFavorites());
    setSkipped(getSkipped());
  }, []);

  // 📌 有効なお気に入りだけ抽出（スキップ済みは除外）＆新しい順に並べ替え
  const reversedFavorites = [...favorites].reverse(); // 新しい順

  const favoriteTasks: Task[] = reversedFavorites
    .map(favId =>
      sampleTasks.find(
        task => task.id.toString() === favId && !skipped.includes(task.id.toString())
      )
    )
    .filter((task): task is Task => !!task); // null除去＋型ガード

  // ---------------------------------------------
  // 📦 レンダリング
  // ---------------------------------------------
  return (
    <div className="App">
      <div className="glass-overlay"></div>

      <div className="favorite-list">
        <h2>お気に入り一覧</h2>

        {favoriteTasks.length === 0 ? (
          <p>お気に入りはまだありません。</p>
        ) : (
          <ul>
            {favoriteTasks.map(task => (
              <li
                key={task.id}
                onClick={() => (window.location.href = `/task/${task.id}`)}
              >
                <div
                  className="favorite-task"
                  style={{ backgroundImage: `url(${task.image})` }}
                >
                  <div className="overlay" />
                  <div className="text">{task.text}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔗 削除したお題一覧ページへのリンク */}
      <Link to="/skipped" className="skipped-link">
        削除したお題一覧
      </Link>

      {/* 🔗 ホームへ戻るリンク */}
      <Link to="/" className="bottom-link">
        <FontAwesomeIcon icon={faStar} /> HOME
      </Link>
    </div>
  );
};

export default FavoriteList;
