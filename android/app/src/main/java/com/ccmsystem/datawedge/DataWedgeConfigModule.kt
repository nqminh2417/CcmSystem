package <your_package>.datawedge

import android.content.Intent
import android.os.Bundle
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DataWedgeConfigModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "DataWedgeConfig"

  @ReactMethod
  fun ensureProfile() {
    val profileName = "CCM_PROFILE"
    val scanAction = "${reactContext.packageName}.SCAN" // ví dụ: com.hsdigital.ccmsystem.SCAN

    // MAIN bundle của SET_CONFIG
    val main = Bundle().apply {
      putString("PROFILE_NAME", profileName)
      putString("PROFILE_ENABLED", "true")
      putString("CONFIG_MODE", "CREATE_IF_NOT_EXIST") // idempotent 
    }

    // Associate app + all activities (*) 
    val app = Bundle().apply {
      putString("PACKAGE_NAME", reactContext.packageName)
      putStringArray("ACTIVITY_LIST", arrayOf("*"))
    }
    main.putParcelableArray("APP_LIST", arrayOf(app))

    // 1) BARCODE input: bật scanner
    val barcodeParams = Bundle().apply {
      putString("scanner_selection", "AUTO")          // chọn scanner auto
      putString("scanner_input_enabled", "true")      // bật input
    }
    val barcodePlugin = Bundle().apply {
      putString("PLUGIN_NAME", "BARCODE")             // case-sensitive 
      putString("RESET_CONFIG", "false")
      putBundle("PARAM_LIST", barcodeParams)
    }

    // 2) INTENT output: bật + broadcast
    // Intent action/category/delivery theo cấu hình Intent Output (tutorial Zebra) 
    val intentParams = Bundle().apply {
      putString("intent_output_enabled", "true")
      putString("intent_action", scanAction)
      putString("intent_category", "android.intent.category.DEFAULT")
      putString("intent_delivery", "2") // 2 = Broadcast intent (chuẩn DataWedge)
    }
    val intentPlugin = Bundle().apply {
      putString("PLUGIN_NAME", "INTENT")
      putString("RESET_CONFIG", "false")
      putBundle("PARAM_LIST", intentParams)
    }

    // 3) KEYSTROKE output: tắt để tránh “gõ vào TextInput”
    val keyParams = Bundle().apply {
      putString("keystroke_output_enabled", "false")
    }
    val keystrokePlugin = Bundle().apply {
      putString("PLUGIN_NAME", "KEYSTROKE")
      putString("RESET_CONFIG", "false")
      putBundle("PARAM_LIST", keyParams)
    }

    // Gộp plugins 
    main.putParcelableArray("PLUGIN_CONFIG", arrayOf(barcodePlugin, intentPlugin, keystrokePlugin))

    // Gửi SET_CONFIG: Action + Extra theo TechDocs 
    val i = Intent().apply {
      action = "com.symbol.datawedge.api.ACTION"
      putExtra("com.symbol.datawedge.api.SET_CONFIG", main)
      // (tuỳ chọn) bật trả result để debug, DataWedge sẽ trả mã kết quả 
      putExtra("SEND_RESULT", "true")
      putExtra("COMMAND_IDENTIFIER", "CCM_SET_CONFIG")
    }
    reactContext.sendBroadcast(i)
  }
}
