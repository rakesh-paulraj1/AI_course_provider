"use client"
import React from 'react'
import { useReducer } from 'react'
const initialstate={count:0};
interface State {
  count: number;
}

interface Action {
  type: 'increment' | 'decrement';
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
};
const Page1 = () => {
    const [state,dispatch]=useReducer(reducer,initialstate);
    const increaseCount=()=>{
        dispatch({type:'increment'});
    };
    const decreaseCount=()=>{
        dispatch({type:'decrement'});
    };
  return (
    <div>
        <div className="">{state.count}</div>;
<button onClick={increaseCount}>Increase</button>
<button onClick={decreaseCount}>Decrease</button>
    </div>
  )
}

export default Page1