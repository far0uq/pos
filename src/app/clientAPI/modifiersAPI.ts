export const getCleanedModifierForItem = (
  productID: string,
  itemModifierRecord: Map<string, string[]>,
  modifierNames: Map<string, string>
) => {
  const itemModifiers = itemModifierRecord.get(productID);
  if (!itemModifiers) return [];
  const cleanedModifiers = itemModifiers.map((modifier) => ({
    value: modifier,
    label: modifierNames.get(modifier) as string,
  }));
  return cleanedModifiers;
};

export const getCleanedModifierForTotal = (
  modifiers: Map<string, number>,
  cartLength: number,
  modifierNames: Map<string, string>
) => {
  console.log(cartLength);
  console.log(modifiers);
  const modifierArray = Array.from(modifiers);
  if (modifierArray.length === 0) return [];

  const cleanedModifiers = [];
  for (let modifier of modifierArray) {
    if (modifier[1] === cartLength) {
      cleanedModifiers.push({
        value: modifier[0],
        label: modifierNames.get(modifier[0]) as string,
      });
    }
  }
  console.log(cleanedModifiers);
  return cleanedModifiers;
};
