import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { Timestamp } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Card, Button } from "react-bootstrap";
import TopNav from "../../components/TopNav";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function ReservationResponse() {
	const location = useLocation();
	const { currentUser } = useAuth();
	const [provider, setProvider] = useState(null);
	const [senior, setSenior] = useState(null);
	const [error, setError] = useState(null);

	const navigate = useNavigate();


	const params = new URLSearchParams(location.search);
	const messageSeniorID = params.get("seniorID");
	const messageThreadID = params.get("msgThreadID");

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_ENDPOINT}/getUser`, {
					params: { userId: messageSeniorID },
				});
				setSenior(response.data);
			} catch (err) {
				setError(err.response ? err.response.data : "Error fetching user data");
			}
		};

		const fetchProviderData = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_ENDPOINT}/getProvider`, {
					params: { providerId: currentUser.uid },
				});
				setProvider(response.data.provider);
			} catch (err) {
				setError(err.response ? err.response.data : "Error fetching user data");
			}
		};

		fetchUserData();
		fetchProviderData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let messageProviderID = currentUser.uid;

	const onAccept = async () => {
    try {
      // Charge the customer
      const res = await axios.post(`${process.env.REACT_APP_ENDPOINT}/charge-customer`, {
        amount: 150000,
        currency: 'usd', // use lowercase 'usd' as per ISO 4217 standard
        userId: messageSeniorID
      });

			// Begin trial for provider
			await axios.post(`${process.env.REACT_APP_ENDPOINT}/create-subscription`, {
				userId: messageProviderID,
				priceId: 'price_1OwXeJIXjP7K0OxqytIC2Ndl',
			});

      // Check if the charge was successful
      if (res.status === 200) {
        const messageText = "CONGRATS! Your room is reserved and we have charged your CC.";
        const dbCollection = firestore.collection("messages");
        await dbCollection.add({
          msgDate: Timestamp.now(),
          msgTo: messageSeniorID,
          msgFrom: messageProviderID,
          msgText: messageText,
          msgThreadID: messageThreadID,
          msgNotified: 0,
          msgStatus: 0,
          msgResponseSent: 0,
        });
        // Mark the room as unavailable (you would add your logic here)
        console.log('Room has been reserved and customer charged successfully.');
      } else {
        console.error('Failed to charge customer:', res.data);
      }
    } catch (error) {
      console.error('Error charging customer:', error.response ? error.response.data : error.message);
    } finally {
			navigate('/reservation-confirmation');
		}
  };


	const onDeny = async () => {
		try {
			const messageText = "SORRY, we cannot approve your request at this time, and your CC was not charged.";
			const dbCollection = firestore.collection("messages");
			await dbCollection.add({
				msgDate: Timestamp.now(),
				msgTo: messageSeniorID,
				msgFrom: messageProviderID,
				msgText: messageText,
				msgThreadID: messageThreadID,
				msgNotified: 0,
				msgStatus: 0,
				msgResponseSent: 0,
			});
		} catch (err) {
			console.error('Error denying request', error.response ? error.response.data : error.message);
		} finally {
			navigate('/reservation-denial');
		}
	};

	if (error) {
		return <div>{error}</div>;
	}

	if (!provider || !senior) {
		return <div>Loading...</div>;
	}


	return (

		<>
			<TopNav />
			<Card>
				<Card.Body>
					{provider.homePhotos && (
	          <img
	          style={{ width: "100%", height: "100%", objectFit: "cover" }}
	          src={provider.homePhotos[0]}
	          alt="Profile pic"
						/>
					)}
	        <Card.Title style={{textAlign: "center"}}>Reservation Request</Card.Title>
					<Card.Text>
						By accepting this request you are agreeing to reserve this room for
						senior resident {senior.displayName} for the move-in day of (date). If you accept,
						you will receive a non-refundable deposit of $1,500 to hold the room
						for this resident. View terms.
					</Card.Text>

					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<Button onClick={onDeny}>Decline</Button>
						<Button onClick={onAccept}>Accept</Button>
					</div>
				</Card.Body>
			</Card>
		</>
	);
}
