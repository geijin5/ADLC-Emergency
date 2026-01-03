export default {
  expo: {
    name: "ADLC Emergency Services",
    slug: "adlc-emergency",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#1e40af"
    },
    plugins: [
      "expo-notifications",
      "expo-location"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.adlc.emergency"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#1e40af"
      },
      package: "com.adlc.emergency",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiUrl: process.env.API_URL || "https://adlc-backend.onrender.com",
      mapboxToken: process.env.MAPBOX_TOKEN || "",
      wsUrl: process.env.WS_URL || "wss://adlc-backend.onrender.com"
    }
  }
};

