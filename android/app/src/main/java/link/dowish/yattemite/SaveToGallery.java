package link.dowish.yattemite;

import android.content.ContentValues;
import android.content.Context;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;

import java.io.OutputStream;

public class SaveToGallery {

    public static String save(Context context, byte[] bytes, String fileName) {

        ContentValues values = new ContentValues();
        values.put(MediaStore.Images.Media.DISPLAY_NAME, fileName);
        values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
        values.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_DCIM + "/YATTE_MITE");

        Uri uri = context.getContentResolver().insert(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                values
        );

        try {
            OutputStream out = context.getContentResolver().openOutputStream(uri);
            out.write(bytes);
            out.close();
            return uri.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
