import { useEffect, useRef } from "react";
import { CameraPreview } from "@capacitor-community/camera-preview";
import { Filesystem, Directory } from "@capacitor/filesystem";
import "./CameraPage.css";

const CameraPage = () => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      await CameraPreview.start({
        parent: "camera-container",
        className: "camera-preview",
        position: "rear",
        disableAudio: true,
        toBack: true,
      });
    };

    startCamera();
    return () => CameraPreview.stop();
  }, []);

  const handleShot = async () => {
    const result = await CameraPreview.capture({ quality: 90 });
    const base64Camera = "data:image/jpeg;base64," + result.value;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1080;  // 手持ちフレームの幅に合わせる
    const H = 2400;  // 素材が1080×2400ならこれで統一

    canvas.width = W;
    canvas.height = H;

    // ---- ① 背景（カメラ画像） ----
    const bg = await loadImage(base64Camera);
    ctx.drawImage(bg, 0, 0, W, H);

    // ---- ② hand.png（フレーム） ----
    const frame = await loadImage("/frames/hand.png");
    ctx.drawImage(frame, 0, 0, W, H);

    // ---- ③ お題テキスト ----
    ctx.font = "bold 48px sans-serif";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText("お題が入る場所", W / 2, 1800); // ← yellow zone に合わせて調整

    // ---- ④ JPEG化 ----
    const mergedBase64 = canvas.toDataURL("image/jpeg", 0.9);

    // ---- ⑤ Android のギャラリーへ保存 ----
    await Filesystem.writeFile({
      path: `yatemite_${Date.now()}.jpg`,
      data: mergedBase64.replace("data:image/jpeg;base64,", ""),
      directory: Directory.External,   // ★ Android ギャラリーに出る
    });

    alert("保存しました！");
  };

  // 画像読み込みのユーティリティ
  const loadImage = (src: string) => {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.src = src;
    });
  };

  return (
    <div className="camera-page">

      <div id="camera-container"></div>

      <div className="overlay">
        <div className="hand-wrapper">
          <img src="/frames/hand.png" className="hand-frame" />
          <div className="card-text">お題が入る場所</div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <button className="camera-button" onClick={handleShot}></button>
    </div>
  );
};

export default CameraPage;
