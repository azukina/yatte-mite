package link.dowish.yattemite;

import android.content.Context;
import android.media.MediaScannerConnection;
import android.net.Uri;

public class MediaScanner {

    public static void scanFile(Context context, String path) {
        MediaScannerConnection.scanFile(
                context,
                new String[]{ path },
                null,
                new MediaScannerConnection.OnScanCompletedListener() {
                    @Override
                    public void onScanCompleted(String s, Uri uri) {
                        // スキャン完了ログ
                        System.out.println("MediaScanner completed: " + s);
                        System.out.println("scanFile called path: " + path);
                    }
                }
        );
    }
}
