export default (originalText: string) =>
  originalText.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
