import { ShelfPosition } from "./ShelfPosition";

export interface DeviceModel {
    deviceId: string,
    deviceType: string,
    buildingName: string,
    createdAt: Date,
    partNumber: string,
    deviceName: string,
    updatedAt: Date,
    numberOfShelfPositions: number,
    shelfPosition:ShelfPosition[]
}