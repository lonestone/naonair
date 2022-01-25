export const removeUuid = (data: any) => {
  delete data.uuid;
  return data;
};
