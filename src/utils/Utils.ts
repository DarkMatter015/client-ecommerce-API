export const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getItemCountText = (count: number): string => {
  return count === 1 ? "1 item" : `${count} itens`;
};

export const scrollIntoView = (id: string): void => {
  const element = document.getElementById(id);
  if (element) element.scrollIntoView({ behavior: "smooth" });
};