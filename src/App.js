import React, { useState } from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js'
import axios from 'axios';

import "bootswatch/dist/superhero/bootstrap.min.css";
import './App.css';


const stripePromise = loadStripe('pk_test_DJKokWStFI2H4V6WSFE3bhOJ002sI3UkT6');

const CheckoutForm = () => {

  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    });
    setLoading(true);

    if (!error) {
      const { id } = paymentMethod;

      try {
        const { data } = await axios.post('http://Localhost:3001/api/checkout', {
          id,
          amount: 10000
        });

        console.log(data);

        elements.getElement(CardElement).clear();
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
      
    }

  };

  console.log(!stripe || loading);

  return ( 
  
  <form onSubmit={handleSubmit} className="card card-body"> 
    
    <img src="https://resource.logitechg.com/content/dam/gaming/en/products/g935/g935-hero.png" alt="Logitech Headset" className="img-fluid" />

    <h3 className="text-center my-2">Price: $100</h3>

    <div className="form-group">
      <CardElement className="form-control"/>
    </div>
    <button disabled={ !stripe } className="btn btn-success">
      { loading ? (
          <div className="spinner-border text-light" role="status">
            <span className="sr-only">Loading...</span>
        </div>
      ) : (
        "Buy"
      )}      
    </button>
  </form>
  );
};

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <CheckoutForm/>
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
