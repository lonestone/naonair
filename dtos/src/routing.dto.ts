export enum RoutingProfile {
  Bike = "bike",
  ElectricBike = "electric_bike",
  Foot = "foot",
}

export type GetCustomRouteQualityInput = {
  points: [number, number][]; // [longitude, latitude]
}
