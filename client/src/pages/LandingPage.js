import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import Accordion from "react-bootstrap/Accordion";
import YoutubeEmbed from "../components/YoutubeEmbed";

export default function LandingPage() {
	const [query, setQuery] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const handleSearch = () => {
		const trimmedQuery = query.trim();
		const isZipCode = /^\d{5}$/.test(trimmedQuery);
		const hasCityAndState = /\w+,\s*\w{2}/.test(trimmedQuery);

		if (isZipCode || hasCityAndState) {
			setErrorMessage(""); // Clear any previous error message
			const encodedQuery = encodeURIComponent(trimmedQuery);
			navigate(`/client-dashboard?refLookup=${encodedQuery}`);
		} else {
			setErrorMessage(
				"Please enter a valid city and state (e.g., City, State) or a valid 5-digit zipcode."
			);
		}
	};

	const listStyle = { listStyleType: "none", padding: 0 };
	const listItemStyle = {
		position: "relative",
		paddingLeft: "40px",
		marginBottom: "20px",
	};

	return (
		<>
			<TopNav />

			<div className="homeRow1 homeTopBackground">
				<div className="contentContainer">
					<div className="left60">
						<h2>
							Adult Family Homes,<br></br>King County, WA
						</h2>
						<p style={{ textShadow: "2px 2px 0 black" }}>
							The easy way to reserve a room and book care within an Adult
							Family Home for 24/7 senior care.
						</p>

						<div className="homeLookup">
							<input
								type="text"
								placeholder="Search city, zip code, etc."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
							<button onClick={handleSearch}>Search</button>
						</div>

						{errorMessage && (
							<div
								style={{
									color: "red",
									marginTop: "10px",
									textAlign: "left",
									fontSize: "14px",
								}}
							>
								{errorMessage}
							</div>
						)}
					</div>

					<div className="right40">&nbsp;</div>

					<div className="clear"></div>
				</div>
			</div>

			<div className="homeRow2 CFblackBackground">
				<div className="contentContainer">
					<div className="left40">
						<YoutubeEmbed embedId="dQw4w9WgXcQ" />
					</div>
					<div className="right60">
						<p>
							Thanks to modern technology, families no longer need senior advisors to determine cost of care, search for homes, or find comparable options. You just use Carefinder.
						</p>
						<p>
							All options on Carefinder are pre-vetted, meet high standards for providing quiality care and are highly recommendable.
						</p>

					</div>
					<div className="clear"></div>
				</div>
			</div>

			<div className="homeRow3">
				<div className="contentContainer CFgrayBackground">
					<h2>Keep Your Senior Safe</h2>

					<style>
						{" "}
						{`.custom-checkmark-list li::before { content: '\\2713'; position: absolute; left: 0; color: #ff6699;}`}
					</style>
					<ul style={listStyle} className="custom-checkmark-list">
						<li style={listItemStyle}>
							<b>Transparent Pricing:</b> Receive clear pricing for current and
							future levels of care.
						</li>
						<li style={listItemStyle}>
							<b>Unbiased Guidance:</b> Our recommendations are based solely on
							what's best for you and your loved ones, not on commissions or
							incentives.
						</li>
						<li style={listItemStyle}>
							<b>Personalized Matches:</b> Our advanced matching algorithm
							connects you with care options tailored to your unique needs and
							preferences.
						</li>
						<li style={listItemStyle}>
							<b>Streamlined Experience:</b> We simplify the search process,
							making it easy to explore homes, schedule tours, and complete
							paperwork.
						</li>
					</ul>
				</div>
			</div>

			<div className="homeRow5 CFblackBackground">
				<div className="contentContainer">
					<h2 className="text-center">Frequently asked questions</h2>
					<Accordion>
						<Accordion.Item eventKey="0">
							<Accordion.Header>What is Carefinder?</Accordion.Header>
							<Accordion.Body>
								Carefinder is an online marketplace connecting families with
								pre-qualified care providers, such as senior living facilities
								and adult family homes. We're not a referral agency but a
								listing service facilitating personalized matches, quotes, tours
								scheduling, and unbiased guidance.
							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="1">
							<Accordion.Header>How does it work?</Accordion.Header>
							<Accordion.Body>
								CareFinder connects care providers with families seeking care in
								Adult Family Home settings. Simply create an account, list your
								AFH, and receive messages, quote requests, and tour scheduling
								from interested families.
							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="2">
							<Accordion.Header>How does Carefinder charge?</Accordion.Header>
							<Accordion.Body>xxx xxx xxx xxx xxx</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="3">
							<Accordion.Header>How is Carefinder unbiased?</Accordion.Header>
							<Accordion.Body>
								Matches are based on a proprietary algorithm, and our advisors
								are not paid on commission, ensuring 100% unbiased guidance.
							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="4">
							<Accordion.Header>
								Why is Carefinder better for the industry?
							</Accordion.Header>
							<Accordion.Body>
								We prioritize seniors' well-being by providing unbiased
								guidance. For care providers, it's a low-cost, annual flat fee
								to access a lead generation powerhouse.
							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="5">
							<Accordion.Header>What if I change my mind?</Accordion.Header>
							<Accordion.Body>xxx xxx xxx xxx xxx</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				</div>
			</div>
			<div style={{ height: 60 }}></div>
			<Footer />
		</>
	);
}
