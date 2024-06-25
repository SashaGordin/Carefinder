import React, { useState } from "react";
import Step1 from "../../components/ReserveRoom/Step1";
import Step2 from "../../components/ReserveRoom/Step2";
import Step3 from "../../components/ReserveRoom/Step3";
import Step4 from "../../components/ReserveRoom/Step4";
import Step5 from "../../components/ReserveRoom/Step5";
import Step6 from "../../components/ReserveRoom/Step6";
import ReservationComplete from "../../components/ReserveRoom/ReservationComplete";
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import { useLocation } from "react-router-dom";

export default function ReserveRoom() {
	const location = useLocation();
	const { provider } = location.state;

	const [currentStep, setCurrentStep] = useState(1);

	const handleNext = () => {
		if (currentStep === 1) {
			if (provider.listingsData[0].roomData.length > 1) {
				setCurrentStep(currentStep + 1);
			} else {
				setCurrentStep(currentStep + 2);
			}
			console.log("provider", provider);
		} else {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleBack = () => {
		setCurrentStep(currentStep - 1);
	};

	return (
		<>
			<TopNav />
			<div className="contentContainer utilityPage reserveRoom">
				{currentStep === 1 && <Step1 onNext={handleNext} provider={provider} />}
				{currentStep === 2 && (
					<Step2 onNext={handleNext} onBack={handleBack} provider={provider} />
				)}
				{currentStep === 3 && (
					<Step3
						onNext={handleNext}
						onBack={handleBack}
						houseName={provider.FacilityName}
					/>
				)}
				{currentStep === 4 && (
					<Step4
						onNext={handleNext}
						onBack={handleBack}
						providerInfo={provider}
					/>
				)}
				{currentStep === 5 && (
					<Step5
						onNext={handleNext}
						onBack={handleBack}
						providerInfo={provider}
					/>
				)}
				{currentStep === 6 && (
					<Step6
						onNext={handleNext}
						onBack={handleBack}
						providerInfo={provider}
					/>
				)}
				{currentStep === 7 && <ReservationComplete />}
			</div>
			<Footer />
		</>
	);
}
