
export const getAll = (categories: POICategory[]) => {
    return POIs.filter(pois => {
      return categories.includes(pois.category);
    });
  };
  
  export const getOne = (id: number) => {
    return POIs[id];
  };