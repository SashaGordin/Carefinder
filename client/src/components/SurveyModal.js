import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from "react-router-dom";
const SurveyModal = ({showModal, handleCloseModal}) => {
  return (

    <Modal size="md" centered show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton className="pt-3 pb-2"></Modal.Header>

      <Modal.Body>
        <div className="flex flex-col text-center gap-3 pb-2 items-center justify-center">
          <div className="text-2xl font-bold">Complete the survey to find the most compatible matches.</div>
          <div className="text-lg">Save time, with real-time results.</div>
          <Link to="/survey" className="bg-[#FFA500] text-white px-4 py-2 rounded-md" onClick={handleCloseModal}>Survey</Link>

        </div>
      </Modal.Body>
    </Modal>);
}

export default SurveyModal;