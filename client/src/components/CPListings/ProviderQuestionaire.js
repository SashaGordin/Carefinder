import React, { useState } from 'react';
import { Row, Col, Form, Button, Fade, Alert } from 'react-bootstrap';

export default function ProviderQuestionaire({
  listingInfo,
  setListingInfo,
  handleUpdate,
}) {
  const [justSaved, setJustSaved] = useState(false);
  const sectionId = 'providerQuestionaire';
  const licenseOptions = [
    'Dementia',
    'Developmentally disabled',
    'Mental health',
  ];

  const handleChange = (e) => {
    let val;
    let name = e.target.name;
    if (e.target.type == 'checkbox') {
      val = [];
      document
        .querySelectorAll(`#${sectionId} [name='${name}']:checked`)
        .forEach((t) => {
          val.push(parseInt(t.value)); //index into the array of options (i.e. licenseOptions)
        });
    } else val = e.target.value;

    setListingInfo({
      ...listingInfo,
      [name]: val,
    });
  };

  const handleSave = () => {
    handleUpdate(listingInfo).then(() => {
      setJustSaved(true);
      console.log('success');
    });
  };

  return (
    <>
      <div className="providerFormP1" id={sectionId}>
        <div>
          <label>How is this home operated:</label>
          <textarea
            className="providerQuestionBlock"
            required
            name="homeOperation"
            value={listingInfo.homeOperation ?? ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Provider credentials:</label>
          <textarea
            className="providerQuestionBlock"
            required
            name="credentials"
            value={listingInfo.credentials ?? ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Licensed for</label>
          <div className="formChecks">
            {licenseOptions.map((option, i) => (
              <Form.Check
                name="speciality"
                key={i}
                type="checkbox"
                value={i}
                label={option}
                checked={listingInfo.speciality?.includes(i) ?? false}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>
        <div>
          <label>Select contracts:</label>
          <textarea
            className="providerQuestionBlock"
            required
            name="contracts"
            value={listingInfo.contracts ?? ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Provider statement:</label>
          <textarea
            className="providerQuestionBlock"
            required
            name="statement"
            value={listingInfo.statement ?? ''}
            onChange={handleChange}
          />
        </div>
        <div className={'switchBtnGrp'}>
          <label>Do you want to receive text notifications?</label>
          <Form.Switch
            inline
            name="textNotifications"
            value="1"
            checked={listingInfo.textNotifications?.length > 0 ? true : false}
            onChange={handleChange}
          />
        </div>
        <div className={'switchBtnGrp'}>
          <label>
            Do you require prospective residents to be qualified to message you?
          </label>
          <Form.Switch
            inline
            name="qualifiedMessagesOnly"
            value="1"
            checked={
              listingInfo.qualifiedMessagesOnly?.length > 0 ? true : false
            }
            onChange={handleChange}
          />
        </div>
        <div className="margintop20">
          <label>Link to disclosure of services:</label>
          <input
            className="providerQuestionLine"
            type="text"
            required
            name="serviceDisclosureLink"
            value={listingInfo.serviceDisclosureLink ?? ''}
            onChange={handleChange}
          />
        </div>
        <div className="margintop20">
          <label>Link to latest inspection:</label>
          <input
            className="providerQuestionLine"
            type="text"
            required
            name="inspectionLink"
            value={listingInfo.inspectionLink ?? ''}
            onChange={handleChange}
          />
        </div>
        <Row>
          <Col>
            <label>Do you have any pets in the home?</label>
            <Form.Select
              className="providerQuestionLine"
              name="petsInHome"
              value={listingInfo.petsInHome ?? 'N'}
              onChange={handleChange}
            >
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </Form.Select>
          </Col>
          <Col>
            <label>Do you accept pets into the home?</label>
            <Form.Select
              className="providerQuestionLine"
              name="petsAccepted"
              value={listingInfo.petsAccepted ?? 'N'}
              onChange={handleChange}
            >
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </Form.Select>
          </Col>
        </Row>
        <div>
          <label>Do you or staff speak any languages other than english</label>
          <input
            className="providerQuestionLine"
            type="text"
            required
            name="languages"
            value={listingInfo.languages ?? ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>What is the current resident demographic?</label>
          <input
            className="providerQuestionLine"
            type="text"
            required
            name="demographics"
            value={listingInfo.demographics ?? ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>What is the staffing ratio?</label>
          <input
            className="providerQuestionLine"
            type="text"
            required
            name="staffingRatio"
            value={listingInfo.staffingRatio ?? ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Set boundaries for financial spend down</label>
          <textarea
            className="providerQuestionBlock"
            required
            name="financialBoundaries"
            value={listingInfo.financialBoundaries ?? ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Policy for depleted funds</label>
          <textarea
            className="providerQuestionBlock"
            required
            name="depletedFundsPolicy"
            value={listingInfo.depletedFundsPolicy ?? ''}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <Button className="formSave" onClick={handleSave}>
          ✨ Save This Section
        </Button>
        <Alert
          show={justSaved}
          onClose={() => setJustSaved(false)}
          dismissible
          variant={'success'}
          className="formAlert"
        >
          Saved
        </Alert>
      </div>
    </>
  );
}
