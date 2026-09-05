import { env } from "@/lib/env"

export interface GooglePlaceResult {
  placeId: string
  name: string
  address: string
  rating?: number
  reviews?: number
  mapsUri?: string
  lat?: number
  lng?: number
}

export const googlePlacesApi = {
  /**
   * Search for a business using Google Places API (Text Search)
   */
  async searchBusiness(query: string): Promise<GooglePlaceResult[]> {
    if (!env.GOOGLE_MAPS_API_KEY) {
      console.warn("GOOGLE_MAPS_API_KEY is missing. Returning mock data.")
      return [
        { placeId: "mock_1", name: `${query} (Mock)`, address: "123 Mock St", rating: 4.5, reviews: 100 },
        { placeId: "mock_2", name: `${query} Cafe (Mock)`, address: "456 Fake Ave", rating: 4.8, reviews: 320 }
      ]
    }

    try {
      // Using Places API (New) - Text Search
      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.location",
        },
        body: JSON.stringify({
          textQuery: query,
        }),
      })

      if (!res.ok) {
        throw new Error(`Google API returned ${res.status}`)
      }

      const data = await res.json()
      
      if (!data.places) return []

      return data.places.map((place: any) => ({
        placeId: place.id,
        name: place.displayName?.text || "",
        address: place.formattedAddress || "",
        rating: place.rating,
        reviews: place.userRatingCount,
        mapsUri: place.googleMapsUri,
        lat: place.location?.latitude,
        lng: place.location?.longitude,
      }))
    } catch (error) {
      console.error("Google Places Search Error:", error)
      return []
    }
  },

  /**
   * Validate and fetch full details for a Place ID
   */
  async getPlaceDetails(placeId: string) {
    if (!env.GOOGLE_MAPS_API_KEY || placeId.startsWith("mock_")) {
      return {
        placeId,
        name: "Mock Location",
        address: "123 Mock St",
        rating: 4.5,
        reviews: 100,
        mapsUri: "https://maps.google.com/?cid=mock",
        writeReviewUri: "https://search.google.com/local/writereview?placeid=" + placeId,
        lat: 0,
        lng: 0,
      }
    }

    try {
      const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
        method: "GET",
        headers: {
          "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "id,displayName,formattedAddress,rating,userRatingCount,googleMapsUri,location",
        }
      })

      if (!res.ok) {
        throw new Error(`Google API returned ${res.status}`)
      }

      const place = await res.json()

      return {
        placeId: place.id,
        name: place.displayName?.text || "",
        address: place.formattedAddress || "",
        rating: place.rating,
        reviews: place.userRatingCount,
        mapsUri: place.googleMapsUri,
        // The standard way to link to the review dialog requires the Place ID
        writeReviewUri: `https://search.google.com/local/writereview?placeid=${place.id}`,
        lat: place.location?.latitude,
        lng: place.location?.longitude,
        raw: place
      }
    } catch (error) {
      console.error("Google Place Details Error:", error)
      throw new Error("Failed to validate Google Place")
    }
  }
}
