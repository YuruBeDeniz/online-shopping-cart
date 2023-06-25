import { useState } from "react";
import { useQuery } from "react-query";
//components
import Item from "./Item/Item";
import Cart from "./Cart/Cart";
import { Drawer } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon  from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";
// Styles
import { Wrapper, StyledButton } from './App.styles';

//types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};


//fetching API function
const getProducts = async (): Promise<CartItemType[]> => 
  await (await fetch("https://fakestoreapi.com/products")).json();


function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
   );

   console.log(data);

   const getTotalItems = (items: CartItemType[]) => 
    items.reduce((acc: number, item) => acc + item.amount, 0)

   const handleAddToCart = (clickedItem: CartItemType ) => {
    setCartItems(prev => {
      // we need to check whether this product is already in our list or not
      const isItemInCart = prev.find(item => item.id === clickedItem.id)
      if(isItemInCart) {
        //if yes then increase its amount by one and update state with new array of products 
        return prev.map(item => (
          item.id === clickedItem.id
          ? { ...item, amount: item.amount + 1 }
          : item
        ))
      }
      //if the item is first time added
      return [...prev, { ...clickedItem, amount: 1 }]
    })
   };

   const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => (
      prev.reduce((acc, item) => {
        if(item.id === id) {
          //if the amount is 1 we remove the item and only return accumulator
          if(item.amount === 1 ) return acc;
          return [...acc, { ...item, amount: item.amount - 1 }]
        } else {
          return [...acc, item]
        }
      }, [] as CartItemType[])
    ))
   };

   if (isLoading) return <LinearProgress/>;
   if(error) return <div>Something went wrong...</div>

  return (
    <Wrapper>
      <Drawer anchor='right' open={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <Cart 
          cartItems={cartItems} 
          addToCart={handleAddToCart} 
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setIsCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      {/* We are using the grid component here so that it will be responsive */}
      <Grid container spacing={3}>
        {data?.map((item: CartItemType) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
}

export default App;

//use react-query to fetch our data and we can use our return type of data we get back
//with useQuery as this use query is generic. then we have a query key ("products")
//and a function
