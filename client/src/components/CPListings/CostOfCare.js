import React, { useState } from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap';
import {
  careDescriptions,
  arrBaseServices,
  careLevelNames,
  defaultCOCServiceList,
} from '../../constants';

export default function CostOfCare({
  listingInfo,
  setListingInfo,
  handleUpdate,
}) {
  const [justSaved, setJustSaved] = useState(false);
  const [careLevel, setCareLevel] = useState('L');

  const fullServiceList =
    listingInfo.costOfCare?.fullServiceList ?? defaultCOCServiceList;
  const toggleButton = (val, e) => {
    handleChange(e);
  };

  //if we ever allow services to be removed, we need to change to a guid based system for the values in the services ToggleButtonGroup. Right now it uses the array index for the values, which will be fine unless the array changes order or shrinks - johng
  const addService = () => {
    const newService = document.getElementById('NewService').value;
    if (!newService) return;

    let newServiceList = new Set(fullServiceList); //removes case-sensitive duplicates
    newServiceList.add(newService);
    setListingInfo({
      ...listingInfo,
      costOfCare: {
        ...listingInfo.costOfCare,
        fullServiceList: [...newServiceList],
      },
    });

    document.getElementById('NewService').value = '';
  };

  const handleChange = (e) => {
    let val;

    let name = e.target.name;
    if (e.target.type == 'checkbox') {
      val = [];
      document.querySelectorAll(`[name='${name}']:checked`).forEach((t) => {
        val.push(parseInt(t.value));
      });
    } else val = e.target.value;

    // listingInfo.costOfCare.[careLevel]
    setListingInfo({
      ...listingInfo,
      costOfCare: {
        ...listingInfo.costOfCare,
        [careLevel]: {
          ...listingInfo.costOfCare?.[careLevel],
          [name]: val,
        },
      },
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
      <Row>
        <Col xs={8}>
          <Card>
            <Card.Title>
              <Form.Select
                name="careLevel"
                value={careLevel}
                onChange={(e) => setCareLevel(e.target.value)}
              >
                <option value="L">Light care</option>
                <option value="M">Medium care</option>
                <option value="H">Heavy care</option>
                <option value="T">Total care</option>
              </Form.Select>
            </Card.Title>

            <div className="small">{careDescriptions[`${careLevel}`]}</div>
            <Row className="small flex-nowrap">
              <Col>Monthly price:</Col>
              <Col>
                <label>From</label>
                <input
                  className="w-100"
                  type="currency"
                  required
                  name="lowPrice"
                  value={listingInfo.costOfCare?.[careLevel]?.lowPrice ?? ''}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <label>To</label>
                <input
                  className="w-100"
                  type="currency"
                  required
                  name="highPrice"
                  value={listingInfo.costOfCare?.[careLevel]?.highPrice ?? ''}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <div className="small">
              <b>Base services: (Included in all levels)</b>
              <div style={{ height: '200px', overflowY: 'auto' }}>
                {arrBaseServices.map((option, i) => (
                  <div key={i}>{option}</div>
                ))}
              </div>
            </div>
            <br></br>
            <div className="small">
              <b>
                {careLevelNames[careLevel]}: (Add services to care level tier)
              </b>
              <div style={{ height: '200px', overflowY: 'auto' }}>
                {listingInfo.costOfCare?.[`${careLevel}`]?.services?.map(
                  (serviceId, i) => (
                    <div key={i}>{fullServiceList[serviceId]}</div>
                  )
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={4}>
          <h6>Select services that are included in this tier</h6>
          <Card>
            <Card.Body
              style={{
                height: '400px',
                overflowY: 'auto',
                padding: '10px',
                display: 'flex',
              }}
            >
              <ToggleButtonGroup
                className="m-auto"
                type="checkbox"
                name="services"
                vertical
                value={listingInfo.costOfCare?.[careLevel]?.services ?? []}
                onChange={toggleButton}
              >
                {fullServiceList.map((service, i) => (
                  <ToggleButton
                    className={'mb-3'}
                    id={`services-${i}`}
                    key={i}
                    value={i}
                  >
                    {service}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Card.Body>
          </Card>
          <div className="d-flex mt-3 flex-column">
            <input
              className="w-100"
              onKeyDown={(e) => {
                if (e.key === 'Enter') addService();
              }}
              type="text"
              id="NewService"
              placeholder="Add service"
            />
            <Button onClick={addService}>Add</Button>
          </div>
        </Col>
      </Row>
      <div className={'d-inline-block'}>
        <Button onClick={handleSave}>Save Changes</Button>
        <Alert
          show={justSaved}
          onClose={() => setJustSaved(false)}
          dismissible
          variant={'success'}
        >
          Saved
        </Alert>
      </div>
    </>
  );
}
