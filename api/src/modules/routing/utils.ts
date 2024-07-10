export const getMostCommonValue = (values: number[]) => {
  const mostCommonValue = values
    .sort(
      (a, b) =>
        values.filter((v) => v === a).length -
        values.filter((v) => v === b).length,
    )
    .pop();

  return mostCommonValue;
};
