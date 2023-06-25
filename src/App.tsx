import { useState } from "react";
import { useQuery } from "react-query";
//components
import Item from "../src/Item/Item";
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
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
   );

   console.log(data);

   const getTotalItems = () => null;
   const handleAddToCart = (clickedItem: CartItemType ) => null;
   const handleRemoveFromCart = () => null;

   if (isLoading) return <LinearProgress/>;
   if(error) return <div>Something went wrong...</div>

  return (
    <Wrapper>
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
