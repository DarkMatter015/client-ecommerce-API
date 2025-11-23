import type { IFreightResponse, IItem } from "@/commons/types/types";
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface CartContextType {
  cartItems?: IItem[];
  cartMetrics?: { totalItems: number; total: number; freightValue: number};
  addItem: (item: IItem) => void;
  deleteItem: (item: IItem) => void;
  handleUpdateQuantity: (id: number, newQuantity: number) => void;
  cleanCart: () => void;
  freight: IFreightResponse | null;
  onSetFreight: (freight: IFreightResponse) => void;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext({} as CartContextType);

const CART_ITEMS = "cartItems";

export function CartProvider({ children }: CartProviderProps) {
  const savedItems = localStorage.getItem(CART_ITEMS);

  const [cartItems, setCartItems] = useState(
    savedItems ? JSON.parse(savedItems) : []
  );

  const [freight, setFreight] = useState<IFreightResponse | null>(null);

  useEffect(() => {
    localStorage.setItem(CART_ITEMS, JSON.stringify(cartItems));
  }, [cartItems]);

  const cartMetrics = useMemo(() => {
    const totalItems = cartItems.reduce(
      (sum: number, item: IItem) => sum + item.quantity,
      0
    );
    const total = cartItems.reduce(
      (sum: number, item: IItem) => sum + (item.totalPrice || 0),
      0
    );
    // TODO: ADICIONAR CAMPO DE CEP PARA CALCULAR FRETE COM OS PRODUTOS DO CARRINHO
    const freightValue = freight?.price || 0;
    // const total = subtotal - descontos + frete;

    // return { totalItems, subtotal, descontos, frete, total };
    return { totalItems, total, freightValue };
  }, [cartItems, freight]);

  const calculateTotalPrice = (item: IItem) => {
    return item.product.price * item.quantity;
  };

  const addItem = (item: IItem) => {
    const existingItem = cartItems.find(
      (i: IItem) => i.product.id === item.product.id
    );
    if (existingItem) {
      setCartItems((prev: IItem[]) => {
        return prev.map((i: IItem) => {
          if (i.product.id === item.product.id) {
            return {
              ...i,
              quantity: i.quantity + item.quantity,
              totalPrice: i.product.price * (i.quantity + item.quantity),
            };
          }
          return i;
        });
      });
      return;
    }
    setCartItems((prev: IItem[]) => {
      const newItem = {
        id: prev.length + 1,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          urlImage: item.product.urlImage,
          category: item.product.category,
        },
        totalPrice: calculateTotalPrice(item),
        quantity: item.quantity,
      };
      return [...prev, newItem];
    });
  };

  const deleteItem = (item: IItem) => {
    setCartItems((prev: IItem[]) => {
      return prev.filter((i: IItem) => i.id !== item.id);
    });
  };

  const cleanCart = () => {
    setCartItems([]);
    setFreight(null);
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev: IItem[]) =>
      prev.map((item: IItem) =>
        item.id === id
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: item.product.price * newQuantity,
            }
          : item
      )
    );
  };

  const onSetFreight = (freight: IFreightResponse) => {
    setFreight(freight);
    console.log(freight);
    
  };

  return (
    <CartContext
      value={{
        cartItems,
        cartMetrics,
        addItem,
        deleteItem,
        handleUpdateQuantity,
        cleanCart,
        freight,
        onSetFreight
      }}
    >
      {children}
    </CartContext>
  );
}

export { CartContext };
