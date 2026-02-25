import { Shelf } from "./Shelf"

export interface ShelfPosition{
    shelfPosId: string,
    createdAt: Date,
    deviceId: string,
    updatedAt: Date,
    shelfOutput: Shelf
}