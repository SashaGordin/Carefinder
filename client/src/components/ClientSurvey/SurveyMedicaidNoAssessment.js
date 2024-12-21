import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const SurveyMedicaidNoAssessment = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/client-dashboard');
  };

  return (
    <>
      <div className="flex max-w-[50rem] flex-col items-center h-full mx-auto justify-center gap-4 text-center">
        <h2>Sorry for the inconvenience</h2>
        <p className="text-left">
          We apologize for any inconvenience. Due to state regulations,
          Medicaid-eligible seniors must undergo an assessment by a state social
          worker. Please contact one of the following agencies to schedule your
          assessment:
        </p>
        <div className="text-center">
          <div>Sarah Hamper - 425-485-3942</div>
          <div>Ben Stiller - 425-485-3942</div>
          <div>Lizzy Beth - 425-485-3942</div>
        </div>
        <p className="text-left">
          Once you have completed your assessment, please revisit our survey to
          proceed with the matching process.
        </p>
        <Button onClick={handleNext}>Exit</Button>
      </div>
    </>
  );
};

export default SurveyMedicaidNoAssessment;
