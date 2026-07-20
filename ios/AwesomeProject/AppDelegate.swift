import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "AwesomeProject"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    // Prevent iCloud backup of app data
    self.excludeAppDataFromBackup()

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  private func excludeAppDataFromBackup() {
    let fileManager = FileManager.default
    guard let documentDirectory = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first else {
      return
    }
    
    do {
      var resourceValues = URLResourceValues()
      resourceValues.isExcludedFromBackup = true
      var documentDirectoryWithValues = documentDirectory
      try documentDirectoryWithValues.setResourceValues(resourceValues)
    } catch {
      print("Failed to exclude app data from backup: \(error)")
    }
  }
}
