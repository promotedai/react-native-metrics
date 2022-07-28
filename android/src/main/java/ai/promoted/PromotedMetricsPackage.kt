package ai.promoted

import android.app.Application
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager


class PromotedMetricsPackage : ReactPackage {
  constructor() {
    configDependencies = null
  }

  constructor(application: Application, clientConfigBuilder: ClientConfig.Builder) {
    configDependencies = ConfigDependencies(application, clientConfigBuilder)
  }

  data class ConfigDependencies(
    val application: Application,
    val clientConfigBuilder: ClientConfig.Builder
  )

  private val configDependencies: ConfigDependencies?

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(PromotedMetricsModule(configDependencies, reactContext))
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return emptyList()
  }
}
