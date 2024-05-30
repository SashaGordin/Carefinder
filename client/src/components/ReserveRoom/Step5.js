import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import {
	Elements,
	CardElement,
	useStripe,
	useElements,
  AddressElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_TEST_PUBLIC_KEY);

export default function Step5({ onNext, onBack, calendlyLink }) {
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);
	const options = {
		mode: "setup",
		currency: "usd",
		paymentMethodCreation: "manual",
	};
	return (
		<>
			<Card>
				<Card.Body>
					<Card.Title style={{ textAlign: "center" }}>
						Reserve the room
					</Card.Title>
					<div>
						To secure the room and ensure it is held for you, a non-refundable
						deposit of $1,500 is required. This deposit confirms your commitment
						to booking care with the home and provider.
					</div>
					<Elements
						stripe={stripePromise}
						options={options}
						style={{ color: "white" }}
					>
						<PaymentForm
							isProcessingPayment={isProcessingPayment}
							setIsProcessingPayment={setIsProcessingPayment}
						/>
					</Elements>
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<Button onClick={onBack}>Back</Button>
					</div>
					<div style={{ textAlign: "center" }}>
						You won't be charged until the reservation is confirmed.
					</div>
				</Card.Body>
			</Card>
		</>
	);
}

const PaymentForm = ({ isProcessingPayment, setIsProcessingPayment }) => {
	const stripe = useStripe();
	const elements = useElements();

	if (!stripe || !elements) {
		return null;
	}

	const handleReserveRoom = async (event) => {
		event.preventDefault();
		setIsProcessingPayment(true);

		try {
			const response = await axios.post(
				`http://localhost:3001/create-reservation`,
				{
					headers: {
						"Content-Type": "application/json",
					},
					// Include any necessary data for the reservation request
				}
			);

			const { clientSecret } = response.data;

			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: elements.getElement(CardElement),
					billing_details: {
						// Include billing details if needed
					},
				},
			});

			if (result.error) {
				// Handle payment error
				console.error(result.error.message);
			} else {
				// Payment successful, but the reservation is not confirmed yet
				console.log("Payment successful, waiting for host confirmation.");
			}
		} catch (error) {
			console.error("Error creating reservation:", error);
		} finally {
			setIsProcessingPayment(false);
		}
	};

	return (
		<div>
			<form onSubmit={handleReserveRoom} className="space-y-5">
				<AddressElement options={{ mode: "billing" }} />
				<PaymentElement />
				<Button type="submit" disabled={!stripe || isProcessingPayment}>
					Save
				</Button>
				{/* {errorMessage && <div className="error-message">{errorMessage}</div>} */}
			</form>
		</div>
	);
};
