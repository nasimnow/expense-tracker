const getUniqueColor = (str: string) => {
  if (str == "repaid") return "#08a600";
  if (str == "loan") return "#c40427";
  if (str == "salary") return "#d67900";

  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
};

export default getUniqueColor;
