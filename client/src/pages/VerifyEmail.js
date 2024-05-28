import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { getAuth, sendEmailVerification } from "firebase/auth";
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

export default function VerifyEmail() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const resendVerificationEmail = async () => {
        const auth = getAuth();
        const userId = localStorage.getItem('localStorageCurrentUserID');
        
        if (!userId) {
            setError("No user ID found in localStorage.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const userDocRef = doc(firestore, "users", userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const user = auth.currentUser;

                if (user && !user.emailVerified) {
                    await sendEmailVerification(user);
                    setMessage("Verification email has been resent. Please check your inbox.");
                } else {
                    setError("User is either not logged in or has already verified their email.");
                }
            } else {
                setError("User document not found.");
            }
        } catch (error) {
            console.error("Error resending verification email:", error);
            setError("Failed to resend verification email.");
        } finally {
            setLoading(false);
        }
    };

    return (
		<>
		<TopNav />

        <div className="contentContainer utilityPage loginPage">
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Verify Your Email</h2>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <p>
                        A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your email.
                    </p>
                    <p>
                        If you did not receive a verification email, you can click the button below to resend.
                    </p>
                    <Button disabled={loading} onClick={resendVerificationEmail}>
                        {loading ? "Resending..." : "Click to Resend Verification Email"}
                    </Button>
                </Card.Body>
            </Card>

            <div class="text-center">
                <p><br></br>Once verified, you may <a href="/login">login</a>.</p>
            </div>

        </div>

        <Footer />
		</>
    );
}
