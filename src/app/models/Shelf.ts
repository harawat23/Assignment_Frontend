import { DeviceModel } from "./Device";

export interface ShelfModel{
    partNumber: string,
    shelfName: string,
    shelfId: string,
    createdAt: Date,
    updatedAt: Date,
    device: DeviceModel | null
}