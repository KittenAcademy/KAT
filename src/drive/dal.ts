export const getTagsFromFileName = (fileName: string) => {
  let retval = fileName
    .replace(/\.[^/.]+$/, "")
    .split("_")
    .map((item) => item.trim().toLowerCase());
  retval = retval.filter(function (elem, pos) {
    return retval.indexOf(elem) == pos;
  });
  return retval;
};
