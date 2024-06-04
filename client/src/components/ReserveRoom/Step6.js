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

export default function Step6({ onNext, onBack, providerInfo }) {
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);
	const [currentPaymentMethodId, setCurrentPaymentMethodId] = useState(null);
	const [payments, setPayments] = useState([]);
	const { currentUser } = useAuth();

	useEffect(() => {
		const fetchPayments = async () => {
			const response = await axios.post(
				`http://localhost:3001/get-list-of-payments`,
				{ userId: currentUser.uid },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (response.data) {
				setPayments(response.data);
			}
		};
		fetchPayments();
	}, []);
	const options = {
		mode: "setup",
		currency: "usd",
		paymentMethodCreation: "manual",
	};

	const onSubmit = async () => {
		// TO DO: SEND MESSAGE AND STORE RESERVATION REQUEST
		sendMessage(providerInfo, currentUser);
		onNext();
	};
	console.log(payments && payments.length > 0);

	return (
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
				{payments && payments.cards ? (
					<div>
						<Form.Group>
							<Form.Label>Credit Cards</Form.Label>
							<InputGroup>
								<Form.Select
									value={currentPaymentMethodId}
									onChange={(e) => setCurrentPaymentMethodId(e.target.value)}
								>
									{payments.cards.map((payment) => (
										<option key={payment.id} value={payment.id}>
											**** **** **** {payment.card?.last4}{" "}
											<span className="capitalize">{payment.card?.brand}</span>{" "}
											{payment.card?.exp_month}/{payment.card?.exp_year}
										</option>
									))}
								</Form.Select>
							</InputGroup>
						</Form.Group>
						<Button onClick={onSubmit} type="submit">
							Send Offer
						</Button>
					</div>
				) : (
					<Elements stripe={stripePromise} options={options}>
						<PaymentForm
							isProcessingPayment={isProcessingPayment}
							setIsProcessingPayment={setIsProcessingPayment}
							onNext={onNext}
							provider={providerInfo}
						/>
					</Elements>
				)}
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
	onNext,
	provider,
}) => {
	const stripe = useStripe();
	const elements = useElements();
	const [errorMessage, setErrorMessage] = useState("");
	const { currentUser } = useAuth();

	if (!stripe || !elements) {
		return null;
	}

	const handleReserveRoom = async (event) => {
		event.preventDefault();
		setIsProcessingPayment(true);
		setErrorMessage("");

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
				`http://localhost:3001/create-setup-intent`,
				{ paymentMethodId: paymentMethod.id, userId: currentUser.uid },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const { setupIntentId } = response.data;

			// Confirm the Setup Intent
			if (setupIntentId) {
				await axios.post(
					`http://localhost:3001/confirm-setup-intent`,
					{ setupIntentId, userId: currentUser.uid },
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
			// TO DO: SEND MESSAGE AND STORE RESERVATION REQUEST
			sendMessage(provider, currentUser);

			onNext(); // Navigate to the next step
		}
	};

	return (
		<div>
			<form onSubmit={handleReserveRoom} className="space-y-5">
				<AddressElement options={{ mode: "billing" }} />
				<PaymentElement />
				<Button type="submit" disabled={!stripe || isProcessingPayment}>
					{isProcessingPayment ? "Processing..." : "Reserve"}
				</Button>
				{errorMessage && <div className="error-message">{errorMessage}</div>}
			</form>
		</div>
	);
};

const sendMessage = async (provider, currentUser) => {
	let messageThreadID = new Date().getTime();
	console.log(provider);
	let messageProviderID = provider.userId;
	let messageSeniorID = currentUser.uid;
	let messageText =
	'🧿 Dear Provider: I have setup my CC to be charged to reserve a room in your AFH! Please navigate to <a href="/reservation-response?seniorID=' +
	messageSeniorID +
	"&msgThreadID=" +
	messageThreadID +
	'">this page</a> to approve or deny the request. An approval will charge my CC and mark your room as unavailable.';
	const dbCollection = firestore.collection("messages");
	await dbCollection.add({
		msgDate: Timestamp.now(),
		msgTo: messageProviderID,
		msgFrom: messageSeniorID,
		msgText: messageText,
		msgThreadID: messageThreadID,
		msgNotified: 0,
		msgStatus: 0,
		msgResponseSent: 0,
	});

	console.log('did it work?');

	let currentTimestamp = Timestamp.now();

	let followUpMessage =
		"(System note: We delivered your room reservation to the provider. Check back here for replies. This message will be hidden in the inbox.)";

		const futureTimestamp = new Timestamp(currentTimestamp.seconds + 5, currentTimestamp.nanoseconds);


	await dbCollection.add({
		msgDate: futureTimestamp,
		msgTo: messageSeniorID,
		msgFrom: messageProviderID,
		msgText: followUpMessage,
		msgThreadID: messageThreadID,
		msgNotified: 0,
		msgStatus: 0,
		msgResponseSent: 0,
	});
};
