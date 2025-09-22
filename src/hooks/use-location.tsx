import { useState, useEffect } from "react";

interface LocationData {
  country: string;
  countryCode: string;
  isLoading: boolean;
  error: string | null;
}

export const useLocation = (): LocationData => {
  const [locationData, setLocationData] = useState<LocationData>({
    country: "",
    countryCode: "",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try to get location from IP-based geolocation service
        const response = await fetch("https://ipapi.co/json/");

        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }

        const data = await response.json();

        setLocationData({
          country: data.country_name || "",
          countryCode: data.country_code || "",
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.warn("Location detection failed:", error);

        // Fallback: try to detect from browser language
        const browserLang =
          navigator.language || (navigator as any).userLanguage;
        const isHebrewBrowser =
          browserLang.startsWith("he") || browserLang.includes("he-IL");

        setLocationData({
          country: isHebrewBrowser ? "Israel" : "",
          countryCode: isHebrewBrowser ? "IL" : "",
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Location detection failed",
        });
      }
    };

    detectLocation();
  }, []);

  return locationData;
};
