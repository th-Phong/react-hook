import React, { useReducer, useCallback, useMemo, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clear,
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === "REMOVE_INGREDIENT") {
      dispatch({ type: "DELETE", id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === "ADD_INGREDIENT") {
      dispatch({
        type: "ADD",
        ingredient: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, isLoading, error, reqIdentifier]);

  // const [userIngredients, setUserIngredient] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch(
  //     "https://react-hook-update-878d7-default-rtdb.firebaseio.com/ingredients.json"
  //   )
  //     .then((response) => {
  //       response.json();
  //       setIsLoading(false);
  //     })
  //     .then((responseData) => {
  //       const loadedIngredients = [];
  //       for (const key in responseData) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount,
  //         });
  //       }
  //       setUserIngredient(loadedIngredients);
  //     });
  // }, []);

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        "https://react-hook-update-878d7-default-rtdb.firebaseio.com/ingredients.json",
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENT"
      );
      // dispatchHttp({ type: "SEND" });
      // fetch(
      //   "https://react-hook-update-878d7-default-rtdb.firebaseio.com/ingredients.json",
      //   {
      //     method: "POST",
      //     body: JSON.stringify(ingredient),
      //     headers: { "Content-Type": "application/json" },
      //   }
      // )
      //   .then((response) => {
      //     dispatchHttp({ type: "RESPONSE" });
      //     return response.json();
      //   })
      //   .then((responseData) => {
      //     // setUserIngredient((prevIngredient) => [
      //     //   ...prevIngredient,
      //     //   { id: responseData.name, ...ingredient },
      //     // ]);
      //     dispatch({
      //       type: "ADD",
      //       ingredient: { id: responseData.name, ...ingredient },
      //     });
      //   });
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      // dispatchHttp({ type: "SEND" });
      sendRequest(
        `https://react-hook-update-878d7-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
        "DELETE",
        null,
        ingredientId,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  // const clearError = useCallback(() => {
  //   // dispatchHttp({ type: "CLEAR" });
  // }, []);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredient(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [removeIngredientHandler, userIngredients]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
