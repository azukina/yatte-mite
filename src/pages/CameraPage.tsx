import { useEffect } from "react";
import { CameraPreview } from "@capacitor-community/camera-preview";
import "./CameraPage.css";

const CameraPage = () => {

  // カメラ開始＆停止
  useEffect(() => {
    const startCamera = async () => {
      await CameraPreview.start({
        parent: "camera-container",
        className: "camera-preview",
        position: "rear",
        disableAudio: true,
        toBack: true, // カメラを背景に配置
      });
    };

    startCamera();

    return () => {
      CameraPreview.stop();
    };
  }, []);

  const handleShot = async () => {
    const result = await CameraPreview.capture();
    console.log("撮影データ(base64)", result.value);
  };

  return (
    <div className="camera-page">

      {/* カメラのプレビュー */}
      <div id="camera-container"></div>

      {/* オーバーレイ（フレーム類） */}
      <div className="overlay">

        {/* 手のフレーム（PNG） */}
        <img src="/frames/hand.png" className="hand-frame" />

        {/* お題カード枠（後で動的に差し替え可能） */}
        <div className="card-frame">
          <div className="card-text">お題が入る場所</div>
        </div>

      </div>

      {/* 撮影ボタン */}
      <button className="camera-button" onClick={handleShot}>●</button>
    </div>
  );
};

export default CameraPage;
