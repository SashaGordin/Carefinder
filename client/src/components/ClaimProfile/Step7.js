import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";

const Step7 = ({ onNext }) => {
	const iconStyle = { color: "#B3B3B3", fontSize: "16px", flexShrink: 0 }; // Fixed size for icons

	return (
		<Card style={{ backgroundColor: "#1D1D1D", color: "#FFFFFF", borderRadius: "16px", padding: "20px", maxWidth: "400px", margin: "auto" }}>
			<Card.Body>
				<Card.Title style={{ fontWeight: "bold", color: "#FF6EC7", fontSize: "20px" }}>Subscription</Card.Title>
				<Card.Text style={{ fontWeight: "bold", fontSize: "28px" }}>$100/month</Card.Text>
				<Card.Text style={{ color: "#F5A623", fontSize: "16px", fontWeight: "bold" }}>24 month subscription</Card.Text>
				<Card.Text style={{ fontWeight: "bold", color: "#C0C0C0", fontSize: "14px" }}>Max amount $2,400 per successful booking</Card.Text>
				<Card.Text style={{ fontSize: "12px", color: "#C0C0C0", marginBottom: "16px" }}>
					We operate on a performance-based model, ensuring you only pay when our efforts successfully land a resident in your home. This means your investment in marketing directly translates into tangible results.
				</Card.Text>
				<Card.Text style={{ fontWeight: "bold", color: "#C0C0C0", fontSize: "14px" }}>Pro's:</Card.Text>
				<div style={{ display: "flex", alignItems: "center", margin: "8px 0", gap: "5px" }}>
					<FaCheckCircle style={iconStyle} />
					<span style={{ fontSize: "14px", flexGrow: 1 }}>No commission</span>
				</div>
				<div style={{ display: "flex", alignItems: "center", margin: "8px 0", gap: "5px" }}>
					<FaCheckCircle style={iconStyle} />
					<span style={{ fontSize: "14px", flexGrow: 1 }}>Spread your payments over 24 months, reducing financial strain</span>
				</div>
				<div style={{ display: "flex", alignItems: "center", margin: "8px 0", gap: "5px" }}>
					<FaCheckCircle style={iconStyle} />
					<span style={{ fontSize: "14px", flexGrow: 1 }}>Start paying only after the resident has stayed for at least 30 days</span>
				</div>
				<div style={{ display: "flex", alignItems: "center", margin: "8px 0", gap: "5px" }}>
					<FaCheckCircle style={iconStyle} />
					<span style={{ fontSize: "14px", flexGrow: 1 }}>Payments stop if the resident leaves, moves out, or passes away</span>
				</div>
				<Button variant="primary" onClick={onNext} style={{ backgroundColor: "#FF6EC7", border: "none", borderRadius: "8px", marginTop: "24px", width: "100%", padding: "10px 0" }}>
					OK
				</Button>
			</Card.Body>
			<Card.Footer style={{ backgroundColor: "#1D1D1D", border: "none", color: "#C0C0C0", fontSize: "12px", textAlign: "center" }}>
				You won’t be charged until you have landed a resident who stays more than 30 days. We use third party tools (stripe) to facilitate transactions. Your information is secure.
			</Card.Footer>
		</Card>
	);
};

export default Step7;
