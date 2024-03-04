export default function getVariablesFromEquation(equation: string): string[] {
  const variables = new Set();

  // const regex = /([a-zA-Z]\w*)/gm;


  console.log("EQUATION", equation, equation.split(/[\+\-\*\/\(\)]/g))

  const parsedVariation = equation.split(/[\+\-\*\/\(\)]/g).filter((item) => {
    console.log("VARIABLE ITEM", item)

    return item && !(+item)
  });


  parsedVariation.forEach((item) => {
    variables.add(item);
  });

  return Array.from(variables) as string[];
}