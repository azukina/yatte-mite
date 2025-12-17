import { useEffect, useRef } from "react";
import { CameraPreview } from "@capacitor-community/camera-preview";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { useLocation, useNavigate } from "react-router-dom";
import "./CameraPage.css";

const CameraPage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  // ★ Android 側の GallerySaver を呼ぶための関数
  const saveToGallery = async (base64: string, fileName: string) => {
    const pureBase64 = base64.replace("data:image/jpeg;base64,", "");
    return await (window as any).GallerySaver.saveImage(pureBase64, fileName);
  };

  const fromPlaying = location.state?.fromPlaying === true;
  const passedTask = location.state?.task || null;
  const taskText = passedTask?.text || "お題";

  const handleBack = () => {
    if (fromPlaying) {
      navigate("/", {
        state: {
          fromCamera: true,
          task: passedTask
        }
      });
    } else {
      navigate(-1);
    }
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    console.log("GallerySaver:", (window as any).GallerySaver);

    const start = async () => {
      try {
        await CameraPreview.start({
          parent: "camera-container",
          className: "camera-preview",
          position: "rear",
          disableAudio: true,
          toBack: true,
        });
      } catch (e) {
        console.log("Camera start error:", e);
      }
    };

    start();

    return () => {
      CameraPreview.stop();
    };
  }, []);

  const handleShot = async () => {
    const result = await CameraPreview.capture({ quality: 90 });
    const base64Camera = "data:image/jpeg;base64," + result.value;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1080;
    const H = 2400;

    canvas.width = W;
    canvas.height = H;

    // ---- 背景（比率維持で描画）----
    const bg = await loadImage(base64Camera);

    const imgW = bg.width;
    const imgH = bg.height;

    const canvasRatio = W / H;
    const imgRatio = imgW / imgH;

    let drawW, drawH, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
      drawH = H;
      drawW = H * imgRatio;
      offsetX = (W - drawW) / 2;
      offsetY = 0;
    } else {
      drawW = W;
      drawH = W / imgRatio;
      offsetX = 0;
      offsetY = (H - drawH) / 2;
    }

    ctx.drawImage(bg, offsetX, offsetY, drawW, drawH);

    // ---- hand.png ----
    const frame = await loadImage("/frames/hand.png");
    ctx.drawImage(frame, 0, 0, W, H);

    // ---- 撮影中のテキスト位置を取得 ----
    const textElem = document.querySelector(".card-text") as HTMLElement;
    const rect = textElem.getBoundingClientRect();

    // ---- 画面→Canvas の比率 ----
    const scaleX = W / window.innerWidth;
    const scaleY = H / window.innerHeight;

    // ---- Canvas上の座標に変換 ----
    const drawX = (rect.left + rect.width / 2) * scaleX;
    const offsetPx = 4;
    const drawY = (rect.top + rect.height * 0.6 + offsetPx) * scaleY;

    // 撮影中の配置と同じ比率を使用する（top: 71%）
    const textY = H * 0.71;

    // ---- フォントロード ----
    await document.fonts.load("48px 'Zen Kurenaido'");
    const fontSize = W * 0.05;

    // ---- お題テキスト（撮影時と完全一致）----
    ctx.font = `${fontSize}px 'Zen Kurenaido'`;
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText(taskText, W / 2, textY);

    const mergedBase64 = canvas.toDataURL("image/jpeg", 0.9);
    const fileName = `yatemite_${Date.now()}.jpg`;

    const resultUri = await saveToGallery(mergedBase64, fileName);
    console.log("Saved to gallery:", resultUri);

    alert("保存しました！");
  };

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

      <button className="back-button" onClick={handleBack}>
        ← 戻る
      </button>

      <div id="camera-container"></div>

      <div className="overlay">
        <div className="hand-wrapper">
          <img src="/frames/hand.png" className="hand-frame" />
          <div className="card-text">{taskText}</div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <button className="camera-button" onClick={handleShot}></button>
    </div>
  );
};

export default CameraPage;
