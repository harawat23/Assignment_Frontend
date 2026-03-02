export const API_BASE_URL="http://localhost:8080";

export const API_ENDPOINTS ={
    device:{
        byId: (id: string)=> `${API_BASE_URL}/device/${id}`,
        save:`${API_BASE_URL}/device/save`,
        updateById:(id:string)=>`${API_BASE_URL}/device/${id}`,
        deleteById:(id:string)=> `${API_BASE_URL}/device/${id}`,
        getDevices:(pageNum:number)=>`${API_BASE_URL}/device/fetchAll/${pageNum}`
    },
    shelf:{
        byId: (id:string)=> `${API_BASE_URL}/shelf/${id}`,
        save: `${API_BASE_URL}/shelf/save`,
        deleteById: (id: string)=>`${API_BASE_URL}/shelf/delete/${id}`,
        updateById: (id:string)=>`${API_BASE_URL}/shelf/update/${id}`,
        getShelfs:(pageNum:number)=>`${API_BASE_URL}/shelf/fetchAll/${pageNum}`
    },
    shelfPosition:{
        byId:(id:number)=>`${API_BASE_URL}/shelfposition/${id}`,
        save:`${API_BASE_URL}/shelfposition/save`,
        deleteById:(id:string)=>`${API_BASE_URL}/shelfposition/delete/${id}`,
        attachShelf:(shelfPositionId:string,shelfId:string)=>`${API_BASE_URL}/shelfposition/attachshelf/${shelfPositionId}/${shelfId}`,
        detachShelf:(shelfPositionId:string,shelfId:string)=>`${API_BASE_URL}/shelfposition/detachshelf/${shelfPositionId}/${shelfId}`,
        getShelfPositions:(pageNum:number)=>`${API_BASE_URL}/shelfposition/fetchAll/${pageNum}`
    }
};