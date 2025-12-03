package link.dowish.yattemite;

import android.content.Context;

public class AndroidMediaScanner {
    private final Context context;

    public AndroidMediaScanner(Context context) {
        this.context = context;
    }

    public void scanFile(String path) {
        MediaScanner.scanFile(context, path);
    }
}
