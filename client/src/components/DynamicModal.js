import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const DynamicModal = ({
  showModal,
  modalTitle,
  modalBody,
  handleCloseModal,
}) => {
  return (
    <Modal size="xl" centered show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{modalBody}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DynamicModal;
