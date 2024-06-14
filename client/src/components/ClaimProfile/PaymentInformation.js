import React, { useState, useEffect } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../../contexts/AuthContext";
import { firestore } from "../../firebase";
import { Timestamp } from "firebase/firestore";

import {
	Elements,
	PaymentElement,
	AddressElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_TEST_PUBLIC_KEY);

export default function PaymentInformation({
	onFinish,
	setProviderInfo,
	onBack,
	provider,
}) {
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);

	const options = {
		mode: "setup",
		currency: "usd",
		paymentMethodCreation: "manual",
	};

	console.log("initial providerInfo: ", provider);

	return (
		<Card>
			<Card.Body>
				<Card.Title style={{ textAlign: "center" }}>
					Payment Information
				</Card.Title>
				{/* <div>
					To secure the room and ensure it is held for you, a non-refundable
					deposit of $1,500 is required. This deposit confirms your commitment
					to booking care with the home and provider.
				</div> */}

				<Elements stripe={stripePromise} options={options}>
					<PaymentForm
						isProcessingPayment={isProcessingPayment}
						setIsProcessingPayment={setIsProcessingPayment}
						onFinish={onFinish}
						provider={provider}
						setProviderInfo={setProviderInfo}
					/>
				</Elements>

				<div style={{ textAlign: "center" }}>
					You won't be charged until the reservation is confirmed.
				</div>
			</Card.Body>
		</Card>
	);
}

const PaymentForm = ({
	isProcessingPayment,
	setIsProcessingPayment,
	onFinish,
	provider,
	setProviderInfo,
}) => {
	const stripe = useStripe();
	const elements = useElements();
	const [errorMessage, setErrorMessage] = useState("");
	const [updateInProgress, setUpdateInProgress] = useState(false);

	useEffect(() => {
		if (updateInProgress) {
			console.log("provider: ", provider);
			onFinish();
			setUpdateInProgress(false);
		}
	}, [provider, updateInProgress]);

	if (!stripe || !elements) {
		return null;
	}

	const handleReserveRoom = async (event) => {
		event.preventDefault();
		setIsProcessingPayment(true);
		setErrorMessage("");
		let setupIntentId, customerId;
		try {
			// Trigger form validation and wallet collection
			const { error: submitError } = await elements.submit();
			if (submitError) {
				setErrorMessage(submitError.message);
				return;
			}

			// Create payment method using the elements.
			const { error, paymentMethod } = await stripe.createPaymentMethod({
				elements,
			});

			if (error) {
				setErrorMessage(error.message ?? "An error occurred.");
				return;
			}

			// Create Setup Intent on your server
			const response = await axios.post(
				`${process.env.REACT_APP_ENDPOINT}/create-provider-setup-intent`,
				{
					paymentMethodId: paymentMethod.id,
					displayName: provider.displayName,
					email: provider.email,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			setupIntentId = response.data.setupIntentId;
			customerId = response.data.customerId;

			// Confirm the Setup Intent
			if (setupIntentId) {
				await axios.post(
					`${process.env.REACT_APP_ENDPOINT}/confirm-provider-setup-intent`,
					{ setupIntentId, customerId },
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
			}
		} catch (error) {
			console.error("Error creating Setup Intent:", error);
			setErrorMessage(
				"An error occurred while processing your payment. Please try again."
			);
		} finally {
			setIsProcessingPayment(false);
			// console.log(provider);
			const newProviderInfo = {
				...provider,
				setupIntentId,
				customerId,
			};
			setProviderInfo(newProviderInfo);
			setUpdateInProgress(true);
		}
	};

	return (
		<div>
			<form onSubmit={handleReserveRoom} className="space-y-5">
				<AddressElement options={{ mode: "billing" }} />
				<PaymentElement />
				<Button type="submit" disabled={!stripe || isProcessingPayment}>
					{isProcessingPayment ? "Processing..." : "Submit"}
				</Button>
				{errorMessage && <div className="error-message">{errorMessage}</div>}
			</form>
		</div>
	);
};
