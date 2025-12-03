package link.dowish.yattemite;

import android.os.Bundle;
import android.webkit.JavascriptInterface;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private AndroidMediaScanner mediaScanner;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mediaScanner = new AndroidMediaScanner(this);

        // ✔ 既存：MediaScanner インターフェイス
        this.bridge.getWebView().addJavascriptInterface(
                new MediaScannerJSInterface(),
                "AndroidMediaScanner"
        );

        // ✔ 追加：ギャラリー保存インターフェイス
        this.bridge.getWebView().addJavascriptInterface(
                new GallerySaveJSInterface(),
                "GallerySaver"
        );
    }

    // ============================
    // MediaScanner 用インターフェイス
    // ============================
    private class MediaScannerJSInterface {
        @JavascriptInterface
        public void scanFile(String path) {
            mediaScanner.scanFile(path);
        }
    }

    // ============================
    // ギャラリー保存用インターフェイス
    // ============================
    private class GallerySaveJSInterface {
        @JavascriptInterface
        public String saveImage(String base64, String fileName) {
            byte[] bytes = android.util.Base64.decode(base64, android.util.Base64.DEFAULT);
            return SaveToGallery.save(MainActivity.this, bytes, fileName);
        }
    }
}
