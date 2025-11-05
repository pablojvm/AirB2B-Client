import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PaymentIntent from "../components/PaymentIntent";
import service from "../services/service.config";

function PaymentPage() {
  const { bookingId } = useParams()
  const [productDetails, setProductDetails] = useState(null)
  const [showPaymentIntent, setShowPaymentIntent] = useState(false)

  useEffect(() => {
      getDetails();
    }, []);


    const getDetails = async () => {
        try {
            const response = await service.get(`booking/${bookingId}`)
            setProductDetails(response.data.booking)
        } catch(error){
            console.error()
        }
    }

  return (
    <div>
        <h1>Pagina de pago</h1>
        <div>
  { 
    showPaymentIntent === false
    ? <button onClick={() => setShowPaymentIntent(true)}>Purchase</button> 
    : <PaymentIntent productDetails={productDetails}/> 
  }
</div>
    </div>
  )
}

export default PaymentPage;
