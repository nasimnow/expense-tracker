const captalizeSentance = (sentance: string): string => {
  return sentance.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
};

export default captalizeSentance;
