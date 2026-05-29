import React, { useState } from 'react';
import axios from 'axios';

function App() {
  // State to store the donation amount entered by the user
  const [amount, setAmount] = useState('');
  // State to track loading status during the payment process
  const [loading, setLoading] = useState(false);

  /**
   * Function to handle the donation process
   * 1. Calls the backend to create an order
   * 2. Opens the Razorpay checkout popup
   */
  const handleDonate = async () => {
    // Validate that an amount is entered
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Send the amount to the backend to create a Razorpay order
      const response = await axios.post('http://localhost:5000/create-order', {
        amount: Number(amount),
      });

      const data = response.data;

      // Check if window.Razorpay is loaded from index.html
      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // Step 2: Configure Razorpay checkout options
      const options = {
        key: "rzp_test_SblOacDmUEmet0", // Automatically updated from your backend .env
        amount: data.amount,
        currency: data.currency,
        name: "Donation Project",
        description: "Test Transaction",
        order_id: data.id,
        handler: function (response) {
          console.log("Payment Success Response:", response);
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
          setAmount('');
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#646cff",
        },
      };

      const rzp1 = new window.Razorpay(options);
      
      rzp1.on('payment.failed', function (response) {
        console.error("Payment Process Failed:", response.error);
        alert(`Payment Failed! Reason: ${response.error.description}`);
      });

      rzp1.open();

    } catch (error) {
      console.error("Error initiating donation:", error);
      
      // Handle cases where the backend returns an error message
      const errorMsg = error.response?.data?.error || error.message;
      alert(`Backend Error: ${errorMsg}\n\nPlease check if your Razorpay keys are correct in the backend .env file.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Support Our Cause</h1>
      <div className="card">
        <h3>Make a Donation</h3>
        <p>Enter the amount you wish to donate (in INR)</p>
        
        {/* Input field for custom donation amount */}
        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
        />

        {/* Donate button */}
        <button onClick={handleDonate} disabled={loading}>
          {loading ? 'Processing...' : 'Donate Now'}
        </button>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#888' }}>
        <p>Note: You need to replace the Razorpay Key ID in App.jsx and .env file.</p>
      </div>
    </div>
  );
}

export default App;
